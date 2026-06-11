import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { execa } from 'execa';
import { AgentLoopConfig } from './config.js';
import {
  ciSummaryPattern,
  latestMarkdownFile,
  resolveOutputArtifactPath,
  verificationReportPattern,
} from './artifacts.js';
import { formatTimestamp } from './dates.js';
import { pathExists, writeTextFile } from './file-system.js';
import { getGitBranch, getGitCommit } from './git.js';
import { getActiveTaskPath, getFallbackTaskPath } from './task-state.js';

export type ReleaseNotesResult = {
  timestamp: string;
  packageName: string;
  version: string;
  gitRange: {
    from?: string;
    to: string;
    label: string;
    fallbackReason?: string;
  };
  branch: string;
  commit: string;
  commits: string[];
  changedFiles: Array<{ status: string; path: string }>;
  workingTree: {
    clean: boolean;
    files: string[];
  };
  changelogSection: string;
  evidence: {
    task?: { path: string; title: string; status: string };
    verification?: { path: string; overallStatus: string };
    ciSummary?: { path: string; title: string };
  };
  markdown: string;
  writtenPath?: string;
};

type PackageMetadata = {
  name: string;
  version: string;
};

function displayPath(cwd: string, filePath: string | undefined) {
  if (!filePath) return undefined;
  return path.relative(cwd, filePath).split(path.sep).join('/') || '.';
}

async function gitLines(cwd: string, args: string[]) {
  const result = await execa('git', args, { cwd, reject: false });
  if (result.exitCode !== 0) return [];
  return result.stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

async function gitRefExists(cwd: string, ref: string) {
  const result = await execa('git', ['rev-parse', '--verify', '--quiet', `${ref}^{commit}`], {
    cwd,
    reject: false,
  });
  return result.exitCode === 0;
}

async function readPackageMetadata(cwd: string): Promise<PackageMetadata> {
  const packagePath = path.join(cwd, 'package.json');
  if (!(await pathExists(packagePath))) return { name: path.basename(cwd), version: '0.0.0' };
  const parsed = JSON.parse(await readFile(packagePath, 'utf8')) as Partial<PackageMetadata>;
  return {
    name: typeof parsed.name === 'string' && parsed.name ? parsed.name : path.basename(cwd),
    version: typeof parsed.version === 'string' && parsed.version ? parsed.version : '0.0.0',
  };
}

function extractHeading(markdown: string, fallback: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;
}

function extractTaskStatus(markdown: string) {
  return markdown.match(/^- Status:\s*(.+)$/im)?.[1]?.trim() || 'unknown';
}

function extractOverallStatus(markdown: string) {
  return markdown.match(/Overall status:\s*([a-z-]+)/i)?.[1]?.trim() || 'unknown';
}

async function readTask(cwd: string, filePath: string | undefined) {
  if (!filePath || !(await pathExists(filePath))) return undefined;
  const markdown = await readFile(filePath, 'utf8');
  return {
    path: displayPath(cwd, filePath) ?? filePath,
    title: extractHeading(markdown, path.basename(filePath, '.md')),
    status: extractTaskStatus(markdown),
  };
}

async function readVerification(cwd: string, filePath: string | undefined) {
  if (!filePath || !(await pathExists(filePath))) return undefined;
  const markdown = await readFile(filePath, 'utf8');
  return {
    path: displayPath(cwd, filePath) ?? filePath,
    overallStatus: extractOverallStatus(markdown),
  };
}

async function readCiSummary(cwd: string, filePath: string | undefined) {
  if (!filePath || !(await pathExists(filePath))) return undefined;
  const markdown = await readFile(filePath, 'utf8');
  return {
    path: displayPath(cwd, filePath) ?? filePath,
    title: extractHeading(markdown, path.basename(filePath, '.md')),
  };
}

async function readChangelogSection(cwd: string, version: string) {
  const changelogPath = path.join(cwd, 'CHANGELOG.md');
  if (!(await pathExists(changelogPath))) return '';
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

async function findPreviousTag(cwd: string, version: string) {
  const currentTags = new Set([`v${version}`, version]);
  const tags = await gitLines(cwd, ['tag', '--list', '--sort=-creatordate']);
  return tags.find((tag) => !currentTags.has(tag));
}

function parseNameStatus(lines: string[]) {
  return lines.map((line) => {
    const [status = '?', ...rest] = line.split(/\s+/);
    return { status, path: rest.join(' ') };
  });
}

function renderList(lines: string[], empty: string) {
  return lines.length ? lines.map((line) => `- ${line}`).join('\n') : `- ${empty}`;
}

function renderChangedFiles(files: Array<{ status: string; path: string }>) {
  return files.length
    ? files.map((file) => `- ${file.status} \`${file.path}\``).join('\n')
    : '- No changed files detected for the selected range.';
}

function renderWorkingTree(files: string[]) {
  return files.length
    ? [
        '- Uncommitted changes detected. Commit or stash them before publishing a release.',
        ...files.map((file) => `- \`${file}\``),
      ].join('\n')
    : '- No uncommitted changes detected.';
}

function renderEvidence(result: Omit<ReleaseNotesResult, 'markdown' | 'writtenPath'>) {
  const lines = [];
  lines.push(
    result.evidence.task
      ? `- Task: ${result.evidence.task.title} (${result.evidence.task.status}) - ${result.evidence.task.path}`
      : '- Task: not found',
  );
  lines.push(
    result.evidence.verification
      ? `- Verification: Overall status: ${result.evidence.verification.overallStatus} - ${result.evidence.verification.path}`
      : '- Verification: not found',
  );
  lines.push(
    result.evidence.ciSummary
      ? `- CI summary: ${result.evidence.ciSummary.title} - ${result.evidence.ciSummary.path}`
      : '- CI summary: not found',
  );
  return lines.join('\n');
}

function renderMarkdown(result: Omit<ReleaseNotesResult, 'markdown' | 'writtenPath'>) {
  const changelogLines = [
    ...(result.gitRange.fallbackReason ? [`- ${result.gitRange.fallbackReason}`] : []),
    result.changelogSection || '- No matching CHANGELOG.md section found.',
  ];

  return `# Release Notes

- Generated: ${result.timestamp}
- Package: ${result.packageName}
- Version: ${result.version}
- Range: ${result.gitRange.label}
- Branch: ${result.branch || 'unknown'}
- Commit: ${result.commit || 'unknown'}

## Changelog
${changelogLines.join('\n')}

## Commits
${renderList(result.commits, 'No commits found for the selected range.')}

## Changed Files
${renderChangedFiles(result.changedFiles)}

## Working Tree
${renderWorkingTree(result.workingTree.files)}

## AgentLoop Evidence
${renderEvidence(result)}

## Release Checklist
- Review these notes before publishing.
- Confirm npm and GitHub release status from the registry or release page.
- Attach verification evidence when creating a release.
- Keep npm catch-up notes honest if the registry still serves an older version.

## Safety
This command is local and deterministic. Does not create tags, publish packages, call external APIs, read tokens, upload files, or rewrite changelogs.
`;
}

export async function generateReleaseNotes(options: {
  cwd: string;
  config: AgentLoopConfig;
  version?: string;
  from?: string;
  to?: string;
  timestamp?: string;
  write?: boolean;
  outPath?: string;
}): Promise<ReleaseNotesResult> {
  const timestamp = options.timestamp ?? formatTimestamp();
  const packageMetadata = await readPackageMetadata(options.cwd);
  const version = options.version ?? packageMetadata.version;
  const to = options.to ?? 'HEAD';
  const requestedFrom = options.from ?? (await findPreviousTag(options.cwd, version));
  const from =
    requestedFrom && (await gitRefExists(options.cwd, requestedFrom)) ? requestedFrom : undefined;
  const fallbackReason = requestedFrom
    ? from
      ? undefined
      : `Git ref "${requestedFrom}" was not found; using available local context.`
    : 'No previous version tag was found; using available local context.';
  const gitRange = {
    from,
    to,
    label: from
      ? `${from}..${to}`
      : requestedFrom
        ? `${to} (missing from: ${requestedFrom})`
        : `${to} (no previous tag)`,
    fallbackReason,
  };
  const commitArgs = from
    ? ['log', '--pretty=format:%s', `${from}..${to}`]
    : ['log', '--pretty=format:%s', '-n', '10', to];
  const diffArgs = from ? ['diff', '--name-status', `${from}..${to}`] : [];
  const reportsDir = path.join(options.cwd, options.config.paths.reportsDir);
  const taskPath =
    (await getActiveTaskPath(options)) ?? (await getFallbackTaskPath(options));
  const verificationPath = await latestMarkdownFile(reportsDir, {
    pattern: verificationReportPattern,
  });
  const ciSummaryPath = await latestMarkdownFile(reportsDir, {
    pattern: ciSummaryPattern,
  });
  const [
    branch,
    commit,
    commits,
    diffLines,
    statusLines,
    changelogSection,
    task,
    verification,
    ciSummary,
  ] = await Promise.all([
    getGitBranch(options.cwd),
    getGitCommit(options.cwd),
    gitLines(options.cwd, commitArgs),
    diffArgs.length ? gitLines(options.cwd, diffArgs) : Promise.resolve([]),
    gitLines(options.cwd, ['status', '--short']),
    readChangelogSection(options.cwd, version),
    readTask(options.cwd, taskPath),
    readVerification(options.cwd, verificationPath),
    readCiSummary(options.cwd, ciSummaryPath),
  ]);
  const withoutMarkdown = {
    timestamp,
    packageName: packageMetadata.name,
    version,
    gitRange,
    branch,
    commit,
    commits,
    changedFiles: parseNameStatus(diffLines),
    workingTree: {
      clean: statusLines.length === 0,
      files: statusLines,
    },
    changelogSection,
    evidence: {
      task,
      verification,
      ciSummary,
    },
  };
  const markdown = renderMarkdown(withoutMarkdown);
  const writtenPath = options.write
    ? ((options.outPath
        ? resolveOutputArtifactPath({
            cwd: options.cwd,
            artifactType: 'release-notes',
            requestedPath: options.outPath,
            expectedDir: options.config.paths.handoffsDir,
            expectedExtension: '.md',
          })
        : undefined) ??
      path.join(options.cwd, options.config.paths.handoffsDir, `${timestamp}-release-notes.md`))
    : undefined;
  if (writtenPath) await writeTextFile(writtenPath, markdown);

  return {
    ...withoutMarkdown,
    markdown,
    writtenPath,
  };
}
