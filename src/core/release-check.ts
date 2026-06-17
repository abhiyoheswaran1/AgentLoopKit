import path from 'node:path';
import { readFile, realpath } from 'node:fs/promises';
import { execa } from 'execa';
import type { AgentLoopConfig } from './config.js';
import { isAgentLoopEvidenceFile } from './agentloop-evidence.js';
import { latestMarkdownFile, prSummaryPattern, releaseNotesPattern } from './artifacts.js';
import { resolveCurrentTaskVerificationEvidence } from './evidence.js';
import { pathExists } from './file-system.js';
import {
  getGitBranch,
  getGitCommit,
  getGitRoot,
  getGitStatus,
  isInsideGitRepo,
  parseGitStatus,
} from './git.js';
import { singleLineInlineCode as inlineCode } from './markdown-format.js';

export type ReleaseCheckStatus = 'pass' | 'warn' | 'fail';

export type ReleaseReadinessCheck = {
  id: string;
  name: string;
  status: ReleaseCheckStatus;
  message: string;
  path?: string;
};

export type ReleaseCheckResult = {
  strict: boolean;
  overallStatus: ReleaseCheckStatus;
  package: {
    name: string;
    version: string;
  };
  git: {
    isRepository: boolean;
    branch: string;
    commit: string;
    root: string;
    targetIsRoot: boolean;
    changedFileCount: number;
    nonEvidenceChangedFileCount: number;
    agentLoopEvidenceChangedFileCount: number;
  };
  releaseDelta: ReleaseDelta;
  checks: ReleaseReadinessCheck[];
  nextAction: {
    command: string;
    reason: string;
  };
  safety: {
    does: string[];
    doesNot: string[];
  };
  markdown: string;
};

type PackageMetadata = {
  name: string;
  version: string;
  scripts: Record<string, string>;
  files: string[];
};

type ReleaseDeltaRecommendation =
  | 'ready-to-release'
  | 'no-release-needed'
  | 'choose-next-version'
  | 'unknown';

export type ReleaseDelta = {
  tag: string;
  tagExists: boolean;
  commitCount: number;
  changedFiles: string[];
  changedFileCount: number;
  packageImpactingChangedFiles: string[];
  packageImpactingChangedFileCount: number;
  recommendation: ReleaseDeltaRecommendation;
};

const requiredScripts = ['test', 'typecheck', 'build'] as const;
const recommendedScripts = ['lint', 'smoke:release'] as const;
const installLifecycleScripts = ['preinstall', 'install', 'postinstall'] as const;

function releaseCheck(
  id: string,
  name: string,
  status: ReleaseCheckStatus,
  message: string,
  filePath?: string,
): ReleaseReadinessCheck {
  return { id, name, status, message, ...(filePath ? { path: filePath } : {}) };
}

function relativePath(cwd: string, filePath: string) {
  return path.relative(cwd, filePath).split(path.sep).join('/') || '.';
}

function redactLocalRoot(
  value: string | undefined,
  root: string,
  redactPaths: boolean | undefined,
) {
  if (!value || !redactPaths || !root || root === path.parse(root).root) return value;
  return value.split(root).join('[git-root]').split(root.replace(/\\/g, '/')).join('[git-root]');
}

function redactReleaseCheck(
  check: ReleaseReadinessCheck,
  root: string,
  redactPaths: boolean | undefined,
) {
  return {
    ...check,
    message: redactLocalRoot(check.message, root, redactPaths) ?? check.message,
    ...(check.path ? { path: redactLocalRoot(check.path, root, redactPaths) ?? check.path } : {}),
  };
}

async function resolveComparablePath(filePath: string) {
  try {
    return await realpath(filePath);
  } catch {
    return path.resolve(filePath);
  }
}

async function readPackageMetadata(cwd: string): Promise<PackageMetadata> {
  const packagePath = path.join(cwd, 'package.json');
  if (!(await pathExists(packagePath))) {
    return { name: path.basename(cwd), version: '0.0.0', scripts: {}, files: [] };
  }
  const parsed = JSON.parse(await readFile(packagePath, 'utf8')) as {
    name?: unknown;
    version?: unknown;
    scripts?: unknown;
    files?: unknown;
  };
  const scripts =
    parsed.scripts && typeof parsed.scripts === 'object' && !Array.isArray(parsed.scripts)
      ? Object.fromEntries(
          Object.entries(parsed.scripts as Record<string, unknown>).filter(
            (entry): entry is [string, string] => typeof entry[1] === 'string',
          ),
        )
      : {};

  return {
    name:
      typeof parsed.name === 'string' && parsed.name.trim()
        ? parsed.name.trim()
        : path.basename(cwd),
    version:
      typeof parsed.version === 'string' && parsed.version.trim() ? parsed.version.trim() : '0.0.0',
    scripts,
    files: Array.isArray(parsed.files)
      ? parsed.files.filter((entry): entry is string => typeof entry === 'string' && !!entry.trim())
      : [],
  };
}

function extractOverallStatus(markdown: string) {
  return markdown.match(/Overall status:\s*([a-z-]+)/i)?.[1]?.trim() || 'unknown';
}

async function readLatestVerification(options: { cwd: string; config: AgentLoopConfig }) {
  const evidence = await resolveCurrentTaskVerificationEvidence(options);
  const reportPath = evidence.currentReportPath;
  if (evidence.staleReport) {
    return {
      path: evidence.staleReport.relativePath,
      overallStatus: 'stale',
      stale: true,
      message: evidence.staleReport.message,
    };
  }
  if (!reportPath) return undefined;
  const markdown = await readFile(reportPath, 'utf8');
  return {
    path: relativePath(options.cwd, reportPath),
    overallStatus: extractOverallStatus(markdown),
    stale: false,
  };
}

async function latestEvidencePath(options: { cwd: string; dir: string; pattern: RegExp }) {
  const filePath = await latestMarkdownFile(path.join(options.cwd, options.dir), {
    pattern: options.pattern,
    rootDir: options.cwd,
  });
  return filePath ? relativePath(options.cwd, filePath) : undefined;
}

async function releaseNotesMentionVersion(
  cwd: string,
  filePath: string | undefined,
  version: string,
) {
  if (!filePath) return false;
  try {
    const markdown = await readFile(path.join(cwd, filePath), 'utf8');
    return markdown.includes(version);
  } catch {
    return false;
  }
}

async function readChangelogSection(cwd: string, version: string) {
  const changelogPath = path.join(cwd, 'CHANGELOG.md');
  if (!(await pathExists(changelogPath))) return undefined;
  const changelog = await readFile(changelogPath, 'utf8');
  const escapedVersion = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const heading = new RegExp(`^##\\s+\\[?${escapedVersion}\\]?\\s*$`, 'im');
  const match = heading.exec(changelog);
  if (!match || match.index === undefined) return '';
  const sectionStart = match.index + match[0].length;
  const rest = changelog.slice(sectionStart);
  const nextHeading = rest.search(/^##\s+/m);
  return (nextHeading === -1 ? rest : rest.slice(0, nextHeading)).trim();
}

async function readUnreleasedChangelogSection(cwd: string) {
  const changelogPath = path.join(cwd, 'CHANGELOG.md');
  if (!(await pathExists(changelogPath))) return undefined;
  const changelog = await readFile(changelogPath, 'utf8');
  const match = changelog.match(/^##\s+Unreleased\s*\n([\s\S]*?)(?=^##\s+|\s*$)/m);
  return match?.[1]?.trim() ?? '';
}

function hasUnreleasedChangelogEntries(section: string | undefined) {
  if (!section) return false;
  const lines = section
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith('<!--') && !line.endsWith('-->'));

  if (lines.length === 0) return false;
  if (lines.length === 1 && /^-\s+No unreleased changes yet\.$/i.test(lines[0])) return false;
  return true;
}

async function gitTagExists(cwd: string, version: string) {
  const tag = `v${version}`;
  const result = await execa('git', ['rev-parse', '--verify', '--quiet', `${tag}^{commit}`], {
    cwd,
    reject: false,
  });
  return result.exitCode === 0;
}

async function gitCommitCountSinceTag(cwd: string, tag: string) {
  const result = await execa('git', ['rev-list', '--count', `${tag}..HEAD`], {
    cwd,
    reject: false,
  });
  if (result.exitCode !== 0) return 0;
  const parsed = Number.parseInt(result.stdout.trim(), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function gitChangedFilesSinceTag(cwd: string, tag: string) {
  const result = await execa('git', ['diff', '--name-only', `${tag}..HEAD`, '--'], {
    cwd,
    reject: false,
  });
  if (result.exitCode !== 0) return [];
  return result.stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function normalizePackageFileEntry(entry: string) {
  return entry
    .trim()
    .replace(/^\.\/+/, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
}

function packageFileEntryMatches(filePath: string, entry: string) {
  const normalizedEntry = normalizePackageFileEntry(entry);
  if (!normalizedEntry) return false;
  if (!normalizedEntry.includes('*')) {
    return filePath === normalizedEntry || filePath.startsWith(`${normalizedEntry}/`);
  }

  let pattern = '';
  for (let index = 0; index < normalizedEntry.length; index += 1) {
    const char = normalizedEntry[index];
    const nextChar = normalizedEntry[index + 1];
    if (char === '*' && nextChar === '*') {
      pattern += '.*';
      index += 1;
      continue;
    }
    if (char === '*') {
      pattern += '[^/]*';
      continue;
    }
    pattern += char.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^${pattern}$`).test(filePath);
}

function isPackageImpactingFile(filePath: string, packageMetadata: PackageMetadata) {
  const normalized = filePath.split(path.sep).join('/').replace(/^\/+/, '');
  const packageFileEntries = packageMetadata.files.map(normalizePackageFileEntry).filter(Boolean);
  if (packageFileEntries.some((entry) => packageFileEntryMatches(normalized, entry))) return true;

  const releaseImpactEntries = [
    'package.json',
    'package-lock.json',
    'npm-shrinkwrap.json',
    'pnpm-lock.yaml',
    'yarn.lock',
    'bun.lockb',
    'README.md',
    'LICENSE',
    'LICENSE.md',
    'LICENCE',
    'LICENCE.md',
    'CHANGELOG.md',
    'server.json',
    'src',
    'dist',
    'schema',
    'templates',
    'scripts/copy-assets.mjs',
    'tsup.config.ts',
    'tsconfig.json',
  ];

  return releaseImpactEntries.some((entry) => packageFileEntryMatches(normalized, entry));
}

async function buildReleaseDelta(options: {
  cwd: string;
  packageMetadata: PackageMetadata;
  tagExists: boolean;
}): Promise<ReleaseDelta> {
  const tag = `v${options.packageMetadata.version}`;
  if (!options.tagExists) {
    return {
      tag,
      tagExists: false,
      commitCount: 0,
      changedFiles: [],
      changedFileCount: 0,
      packageImpactingChangedFiles: [],
      packageImpactingChangedFileCount: 0,
      recommendation: 'ready-to-release',
    };
  }

  const [commitCount, changedFiles] = await Promise.all([
    gitCommitCountSinceTag(options.cwd, tag),
    gitChangedFilesSinceTag(options.cwd, tag),
  ]);
  const packageImpactingChangedFiles = changedFiles.filter((changedFile) =>
    isPackageImpactingFile(changedFile, options.packageMetadata),
  );

  return {
    tag,
    tagExists: true,
    commitCount,
    changedFiles,
    changedFileCount: changedFiles.length,
    packageImpactingChangedFiles,
    packageImpactingChangedFileCount: packageImpactingChangedFiles.length,
    recommendation: packageImpactingChangedFiles.length
      ? 'choose-next-version'
      : 'no-release-needed',
  };
}

function releaseDeltaMessage(delta: ReleaseDelta) {
  if (!delta.tagExists) {
    return `Local tag ${delta.tag} is not present yet; release delta starts after version preparation.`;
  }
  if (delta.packageImpactingChangedFileCount === 0) {
    if (delta.commitCount === 0) return `No commits since ${delta.tag}.`;
    return `${delta.commitCount} commit${delta.commitCount === 1 ? '' : 's'} since ${
      delta.tag
    }, but no package-impacting files changed.`;
  }
  return `${delta.packageImpactingChangedFileCount} package-impacting file${
    delta.packageImpactingChangedFileCount === 1 ? '' : 's'
  } changed since ${delta.tag}; choose the next package version before release.`;
}

function changedFileMessage(totalCount: number, nonEvidenceCount: number, evidenceCount: number) {
  if (evidenceCount === 0) return `${totalCount} changed file(s) detected.`;
  return `${totalCount} changed file(s) detected (${nonEvidenceCount} non-evidence file(s), ${evidenceCount} AgentLoop evidence file(s)).`;
}

function renderChangedFileCount(
  result: Pick<
    ReleaseCheckResult['git'],
    'changedFileCount' | 'nonEvidenceChangedFileCount' | 'agentLoopEvidenceChangedFileCount'
  >,
) {
  if (result.agentLoopEvidenceChangedFileCount === 0) {
    return inlineCode(String(result.changedFileCount));
  }
  return [
    inlineCode(String(result.changedFileCount)),
    `(${inlineCode(String(result.nonEvidenceChangedFileCount))} non-evidence, ${inlineCode(
      String(result.agentLoopEvidenceChangedFileCount),
    )} AgentLoop evidence)`,
  ].join(' ');
}

function overallStatus(checks: ReleaseReadinessCheck[], strict: boolean): ReleaseCheckStatus {
  if (checks.some((item) => item.status === 'fail')) return 'fail';
  if (strict && checks.some((item) => item.status === 'warn')) return 'fail';
  if (checks.some((item) => item.status === 'warn')) return 'warn';
  return 'pass';
}

function chooseNextAction(checks: ReleaseReadinessCheck[], releaseDelta: ReleaseDelta) {
  const byId = new Map(checks.map((item) => [item.id, item]));
  if (byId.get('package-metadata')?.status === 'fail') {
    return {
      command: 'update package.json',
      reason: 'Package name and version are required before release.',
    };
  }
  if (byId.get('package-safety')?.status === 'fail') {
    return {
      command: 'remove install lifecycle scripts',
      reason: 'Install lifecycle scripts weaken npm supply-chain trust.',
    };
  }
  if (byId.get('changelog-unreleased')?.status !== 'pass') {
    return {
      command: 'prepare release notes from CHANGELOG.md Unreleased',
      reason:
        'Move pending Unreleased entries into the intended version section before publishing.',
    };
  }
  if (byId.get('changelog-section')?.status !== 'pass') {
    return {
      command: 'update CHANGELOG.md',
      reason: 'Add release notes for the package version before publishing.',
    };
  }
  if (byId.get('verification-report')?.status !== 'pass') {
    return { command: 'agentloop verify', reason: 'A passing verification report is required.' };
  }
  if (byId.get('handoff-summary')?.status !== 'pass') {
    return {
      command: 'agentloop handoff',
      reason: 'Create a reviewer handoff for the release diff.',
    };
  }
  if (byId.get('release-notes')?.status !== 'pass') {
    return {
      command: 'agentloop release-notes --write',
      reason: 'Write deterministic release notes before cutting the release.',
    };
  }
  if (byId.get('working-tree')?.status !== 'pass') {
    return { command: 'git status --short', reason: 'Review or commit dirty working tree files.' };
  }
  if (byId.get('release-scripts')?.status !== 'pass') {
    return {
      command: 'update package.json scripts',
      reason: 'Add the missing release verification scripts.',
    };
  }
  if (byId.get('release-tag')?.status !== 'pass') {
    if (releaseDelta.recommendation === 'no-release-needed') {
      return {
        command: 'do not cut a release yet',
        reason:
          'The current version is already tagged and commits since that tag do not affect package release contents.',
      };
    }
    if (releaseDelta.recommendation === 'choose-next-version') {
      return {
        command: 'choose the intended release version',
        reason: 'Package-impacting changes exist after the current version tag.',
      };
    }
    return {
      command: 'choose the intended release version',
      reason: 'The local release tag already exists.',
    };
  }
  return {
    command: 'agentloop npm-status',
    reason:
      'Check npm registry state before publishing. If the local version is not published, use the approved release workflow.',
  };
}

function renderMarkdown(result: Omit<ReleaseCheckResult, 'markdown'>) {
  const checks = result.checks
    .map((item) => {
      const suffix = item.path ? ` - ${inlineCode(item.path)}` : '';
      return `- [${inlineCode(item.status)}] ${inlineCode(item.name)}: ${inlineCode(
        item.message,
      )}${suffix}`;
    })
    .join('\n');
  const gitLine = result.git.isRepository
    ? `${inlineCode(result.git.branch || 'unknown branch')}${
        result.git.commit ? ` @ ${inlineCode(result.git.commit)}` : ''
      }`
    : inlineCode('not inside a git repository');

  return `# AgentLoopKit Release Check

- Overall status: ${inlineCode(result.overallStatus)}
- Strict mode: ${inlineCode(result.strict ? 'enabled (warnings fail)' : 'disabled')}
- Package: ${inlineCode(`${result.package.name}@${result.package.version}`)}
- Git: ${gitLine}
- Changed files: ${renderChangedFileCount(result.git)}

## Checks

${checks}

## Next Action

Run ${inlineCode(result.nextAction.command)}.

${result.nextAction.reason}

## Safety

This command reads local release metadata, local AgentLoop evidence, and local git state only. It does not publish packages, create tags, create GitHub releases, call external APIs, read npm tokens, read .env contents, upload files, or change package metadata.
`;
}

export async function checkReleaseReadiness(options: {
  cwd: string;
  config: AgentLoopConfig;
  strict?: boolean;
  redactPaths?: boolean;
}): Promise<ReleaseCheckResult> {
  const strict = options.strict ?? false;
  const packageMetadata = await readPackageMetadata(options.cwd);
  const checks: ReleaseReadinessCheck[] = [];

  checks.push(
    releaseCheck(
      'package-metadata',
      'Package metadata',
      packageMetadata.name && packageMetadata.version !== '0.0.0' ? 'pass' : 'fail',
      `package.json declares ${packageMetadata.name}@${packageMetadata.version}`,
      'package.json',
    ),
  );

  const changelogSection = await readChangelogSection(options.cwd, packageMetadata.version);
  checks.push(
    releaseCheck(
      'changelog-section',
      'Changelog section',
      changelogSection ? 'pass' : 'warn',
      changelogSection === undefined
        ? 'CHANGELOG.md not found.'
        : changelogSection
          ? `CHANGELOG.md includes ${packageMetadata.version}.`
          : `CHANGELOG.md has no section for ${packageMetadata.version}.`,
      changelogSection ? 'CHANGELOG.md' : undefined,
    ),
  );

  const unreleasedSection = await readUnreleasedChangelogSection(options.cwd);
  const hasUnreleasedEntries = hasUnreleasedChangelogEntries(unreleasedSection);
  checks.push(
    releaseCheck(
      'changelog-unreleased',
      'Changelog Unreleased',
      hasUnreleasedEntries ? 'warn' : 'pass',
      unreleasedSection === undefined
        ? 'CHANGELOG.md not found.'
        : hasUnreleasedEntries
          ? 'CHANGELOG.md has pending Unreleased entries.'
          : 'No pending Unreleased entries detected.',
      'CHANGELOG.md',
    ),
  );

  const verification = await readLatestVerification({ cwd: options.cwd, config: options.config });
  checks.push(
    releaseCheck(
      'verification-report',
      'Verification report',
      verification
        ? verification.stale
          ? 'warn'
          : verification.overallStatus === 'pass'
            ? 'pass'
            : 'fail'
        : 'warn',
      verification
        ? verification.stale
          ? (verification.message ?? 'Latest verification report predates the current task.')
          : `Latest verification overall status: ${verification.overallStatus}.`
        : 'No verification report found.',
      verification?.path,
    ),
  );

  const handoffPath = await latestEvidencePath({
    cwd: options.cwd,
    dir: options.config.paths.handoffsDir,
    pattern: prSummaryPattern,
  });
  checks.push(
    releaseCheck(
      'handoff-summary',
      'Handoff summary',
      handoffPath ? 'pass' : 'warn',
      handoffPath ? 'Reviewer handoff found.' : 'No reviewer handoff found.',
      handoffPath,
    ),
  );

  const releaseNotesPath = await latestEvidencePath({
    cwd: options.cwd,
    dir: options.config.paths.handoffsDir,
    pattern: releaseNotesPattern,
  });
  const releaseNotesCurrent = await releaseNotesMentionVersion(
    options.cwd,
    releaseNotesPath,
    packageMetadata.version,
  );
  checks.push(
    releaseCheck(
      'release-notes',
      'Release notes',
      releaseNotesPath && releaseNotesCurrent ? 'pass' : 'warn',
      releaseNotesPath
        ? releaseNotesCurrent
          ? `Deterministic release notes found for package version ${packageMetadata.version}.`
          : `Latest generated release notes do not mention package version ${packageMetadata.version}. Regenerate release notes for this release.`
        : 'No generated release notes found.',
      releaseNotesPath,
    ),
  );

  const missingRequiredScripts = requiredScripts.filter(
    (script) => !packageMetadata.scripts[script],
  );
  const missingRecommendedScripts = recommendedScripts.filter(
    (script) => !packageMetadata.scripts[script],
  );
  const missingScripts = [...missingRequiredScripts, ...missingRecommendedScripts];
  checks.push(
    releaseCheck(
      'release-scripts',
      'Release scripts',
      missingRequiredScripts.length ? 'fail' : missingRecommendedScripts.length ? 'warn' : 'pass',
      missingScripts.length
        ? `Missing package scripts: ${missingScripts.join(', ')}.`
        : 'Required and recommended release scripts exist.',
      'package.json',
    ),
  );

  const blockedInstallScripts = installLifecycleScripts.filter(
    (script) => packageMetadata.scripts[script],
  );
  checks.push(
    releaseCheck(
      'package-safety',
      'Package safety',
      blockedInstallScripts.length ? 'fail' : 'pass',
      blockedInstallScripts.length
        ? `Install lifecycle scripts are present: ${blockedInstallScripts.join(', ')}.`
        : 'No preinstall/install/postinstall scripts detected.',
      'package.json',
    ),
  );

  const inGit = await isInsideGitRepo(options.cwd);
  const status = inGit ? await getGitStatus(options.cwd) : '';
  const changedFiles = inGit ? await parseGitStatus(status) : [];
  const agentLoopEvidenceChangedFileCount = changedFiles.filter((file) =>
    isAgentLoopEvidenceFile(file.path),
  ).length;
  const nonEvidenceChangedFileCount = changedFiles.length - agentLoopEvidenceChangedFileCount;
  const gitRoot = inGit ? await getGitRoot(options.cwd) : '';
  const resolvedGitRoot = gitRoot ? await resolveComparablePath(gitRoot) : '';
  const targetIsRoot = resolvedGitRoot
    ? resolvedGitRoot === (await resolveComparablePath(options.cwd))
    : false;

  checks.push(
    releaseCheck(
      'git-repository',
      'Git repository',
      inGit ? 'pass' : 'warn',
      inGit ? 'Inside a git repository.' : 'Not inside a git repository.',
    ),
  );
  if (inGit) {
    checks.push(
      releaseCheck(
        'git-target',
        'Git target',
        targetIsRoot ? 'pass' : 'warn',
        targetIsRoot
          ? 'Current directory is the Git root.'
          : 'Current directory is a Git subdirectory.',
      ),
    );
  }
  checks.push(
    releaseCheck(
      'working-tree',
      'Working tree',
      changedFiles.length ? 'warn' : 'pass',
      changedFiles.length
        ? changedFileMessage(
            changedFiles.length,
            nonEvidenceChangedFileCount,
            agentLoopEvidenceChangedFileCount,
          )
        : 'No uncommitted changes detected.',
    ),
  );

  const existingTag = inGit ? await gitTagExists(options.cwd, packageMetadata.version) : false;
  const releaseDelta = inGit
    ? await buildReleaseDelta({ cwd: options.cwd, packageMetadata, tagExists: existingTag })
    : {
        tag: `v${packageMetadata.version}`,
        tagExists: false,
        commitCount: 0,
        changedFiles: [],
        changedFileCount: 0,
        packageImpactingChangedFiles: [],
        packageImpactingChangedFileCount: 0,
        recommendation: 'unknown' as const,
      };
  checks.push(
    releaseCheck(
      'release-delta',
      'Release delta',
      releaseDelta.tagExists && releaseDelta.packageImpactingChangedFileCount > 0 ? 'warn' : 'pass',
      releaseDeltaMessage(releaseDelta),
    ),
  );
  checks.push(
    releaseCheck(
      'release-tag',
      'Release tag',
      existingTag ? 'warn' : 'pass',
      existingTag
        ? `Local tag v${packageMetadata.version} already exists.`
        : `Local tag v${packageMetadata.version} is not present yet.`,
    ),
  );

  const outputChecks = checks.map((item) =>
    redactReleaseCheck(item, resolvedGitRoot, options.redactPaths),
  );
  const rawNextAction = chooseNextAction(checks, releaseDelta);
  const withoutMarkdown = {
    strict,
    overallStatus: overallStatus(outputChecks, strict),
    package: {
      name: packageMetadata.name,
      version: packageMetadata.version,
    },
    git: {
      isRepository: inGit,
      branch: inGit ? await getGitBranch(options.cwd) : '',
      commit: inGit ? await getGitCommit(options.cwd) : '',
      root:
        redactLocalRoot(resolvedGitRoot, resolvedGitRoot, options.redactPaths) ?? resolvedGitRoot,
      targetIsRoot,
      changedFileCount: changedFiles.length,
      nonEvidenceChangedFileCount,
      agentLoopEvidenceChangedFileCount,
    },
    releaseDelta,
    checks: outputChecks,
    nextAction: {
      command:
        redactLocalRoot(rawNextAction.command, resolvedGitRoot, options.redactPaths) ??
        rawNextAction.command,
      reason:
        redactLocalRoot(rawNextAction.reason, resolvedGitRoot, options.redactPaths) ??
        rawNextAction.reason,
    },
    safety: {
      does: [
        'read package.json',
        'read CHANGELOG.md',
        'read local AgentLoop evidence',
        'run local git inspection commands',
      ],
      doesNot: [
        'publish packages',
        'create tags',
        'create GitHub releases',
        'call external APIs',
        'read npm tokens',
        'read .env contents',
        'upload files',
        'change package metadata',
      ],
    },
  };

  return { ...withoutMarkdown, markdown: renderMarkdown(withoutMarkdown) };
}
