import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { AgentLoopConfig } from './config.js';
import { latestMarkdownFile, prSummaryPattern } from './artifacts.js';
import { resolveCurrentOrLatestRunTaskVerificationEvidence } from './evidence.js';
import { getGitStatus, GitFileStatus, parseGitStatus } from './git.js';
import { readGithubMetadataContext } from './github-metadata.js';
import { dirtyCoveredByLatestHandoffRun } from './handoff-coverage.js';
import { escapeMarkdownProse, singleLineInlineCode as inlineCode } from './markdown-format.js';
import { listRuns } from './runs.js';
import { readTaskContract } from './task-state.js';
import { isAgentLoopEvidenceFile } from './agentloop-evidence.js';
import { classifyChangedFiles } from './change-areas.js';

export type MaintainerCheckStatus = 'pass' | 'warn' | 'fail';

export type MaintainerCheck = {
  id: string;
  status: MaintainerCheckStatus;
  message: string;
  path?: string;
};

export type MaintainerCheckResult = {
  status: MaintainerCheckStatus;
  checks: MaintainerCheck[];
  maintainerChecklist: string[];
  suggestedContributorRequest: string;
};

function relativePath(cwd: string, filePath: string | undefined) {
  if (!filePath) return undefined;
  return path.relative(cwd, filePath).split(path.sep).join('/') || '.';
}

function extractOverallStatus(markdown: string | undefined) {
  return (
    markdown
      ?.match(/Overall status:\s*([a-z-]+)/i)?.[1]
      ?.trim()
      .toLowerCase() ?? 'missing'
  );
}

function check(id: string, status: MaintainerCheckStatus, message: string, filePath?: string) {
  return { id, status, message, ...(filePath ? { path: filePath } : {}) };
}

function redactLocalRoot(
  value: string | undefined,
  root: string,
  redactPaths: boolean | undefined,
) {
  if (!value || !redactPaths || !root || root === path.parse(root).root) return value;
  return value.split(root).join('[git-root]').split(root.replace(/\\/g, '/')).join('[git-root]');
}

function redactCheck(check: MaintainerCheck, root: string, redactPaths: boolean | undefined) {
  return {
    ...check,
    message: redactLocalRoot(check.message, root, redactPaths) ?? check.message,
    ...(check.path ? { path: redactLocalRoot(check.path, root, redactPaths) ?? check.path } : {}),
  };
}

function hasPath(changedFiles: string[], pattern: RegExp) {
  return changedFiles.some((filePath) => pattern.test(filePath));
}

function changedFileCountMessage(
  totalCount: number,
  nonEvidenceCount: number,
  evidenceCount: number,
  nonEvidenceFiles: GitFileStatus[] = [],
) {
  const areaCounts =
    nonEvidenceCount > 25 && nonEvidenceFiles.length
      ? classifyChangedFiles(nonEvidenceFiles)
          .sort(
            (left, right) =>
              right.files.length - left.files.length || left.title.localeCompare(right.title),
          )
          .map((area) => `${area.title} ${area.files.length}`)
          .join(', ')
      : '';
  const areaSuffix = areaCounts ? ` Non-evidence review areas: ${areaCounts}.` : '';
  if (evidenceCount === 0) return `${totalCount} changed file(s) detected.${areaSuffix}`;
  return [
    `${totalCount} changed file(s) detected`,
    `(${nonEvidenceCount} non-evidence file(s), ${evidenceCount} AgentLoop evidence file(s)).${areaSuffix}`,
  ].join(' ');
}

function overallStatus(checks: MaintainerCheck[]): MaintainerCheckStatus {
  if (checks.some((item) => item.status === 'fail')) return 'fail';
  if (checks.some((item) => item.status === 'warn')) return 'warn';
  return 'pass';
}

function contributorRequest(checks: MaintainerCheck[]) {
  const failures = checks.filter((item) => item.status === 'fail');
  if (failures.length > 0) {
    return `Please add the missing AgentLoopKit evidence before review: ${failures
      .map((item) => item.message)
      .join(' ')}`;
  }
  if (checks.some((item) => item.id === 'auth-security-files' && item.status === 'warn')) {
    return 'Please confirm the auth/security-sensitive changes were reviewed manually.';
  }
  if (checks.some((item) => item.status === 'warn')) {
    return 'Please address the AgentLoopKit maintainer warnings or explain why they are acceptable.';
  }
  return 'No extra contributor request needed from AgentLoopKit evidence.';
}

function escapeSingleLineMarkdownProse(value: string) {
  return escapeMarkdownProse(value).replace(/\r/g, '\\r').replace(/\n/g, '\\n');
}

export function renderMaintainerCheckMarkdown(result: MaintainerCheckResult) {
  const checkLines = result.checks
    .map((item) => {
      const pathSuffix = item.path ? ` (${inlineCode(item.path)})` : '';
      return `- [${inlineCode(item.status)}] ${inlineCode(item.id)}: ${inlineCode(item.message)}${pathSuffix}`;
    })
    .join('\n');
  const checklistLines = result.maintainerChecklist
    .map((item) => `- [ ] ${escapeSingleLineMarkdownProse(item)}`)
    .join('\n');

  return `# AgentLoopKit Maintainer Check

Status: ${inlineCode(result.status)}

${checkLines}

## Maintainer Checklist

${checklistLines}

## Suggested Contributor Request

${escapeSingleLineMarkdownProse(result.suggestedContributorRequest)}
`;
}

export async function runMaintainerCheck(options: {
  cwd: string;
  config: AgentLoopConfig;
  redactPaths?: boolean;
}): Promise<MaintainerCheckResult> {
  const evidence = await resolveCurrentOrLatestRunTaskVerificationEvidence(options);
  const checks: MaintainerCheck[] = [];

  if (evidence.taskPath) {
    const task = await readTaskContract({
      cwd: options.cwd,
      config: options.config,
      taskPath: evidence.taskPath,
    });
    checks.push(check('task-contract', 'pass', `Task contract found: ${task.title}`, task.path));
  } else {
    checks.push(check('task-contract', 'fail', 'Task contract is missing.'));
  }

  if (evidence.currentReportPath) {
    const reportMarkdown = await readFile(evidence.currentReportPath, 'utf8');
    const status = extractOverallStatus(reportMarkdown);
    checks.push(
      check(
        'verification-evidence',
        status === 'pass' ? 'pass' : 'fail',
        `Overall status: ${status}`,
        relativePath(options.cwd, evidence.currentReportPath),
      ),
    );
  } else if (evidence.staleReport) {
    checks.push(
      check(
        'verification-evidence',
        'fail',
        evidence.staleReport.message,
        evidence.staleReport.relativePath,
      ),
    );
  } else {
    checks.push(check('verification-evidence', 'fail', 'Verification evidence is missing.'));
  }

  const changedFileStatuses = await parseGitStatus(await getGitStatus(options.cwd));
  const githubMetadata = await readGithubMetadataContext({
    cwd: options.cwd,
    config: options.config,
  });
  const handoff = await latestMarkdownFile(
    path.join(options.cwd, options.config.paths.handoffsDir),
    {
      pattern: prSummaryPattern,
      rootDir: options.cwd,
    },
  );
  const latestRun = (await listRuns(options.cwd))[0];
  const latestHandoffRunCoversDirtyFiles = await dirtyCoveredByLatestHandoffRun(
    options.cwd,
    changedFileStatuses,
    latestRun,
    undefined,
    handoff ?? undefined,
  );
  if (handoff) {
    const staleHandoffForDirtyFiles =
      changedFileStatuses.length > 0 && !latestHandoffRunCoversDirtyFiles;
    checks.push(
      check(
        'handoff-summary',
        staleHandoffForDirtyFiles ? 'warn' : 'pass',
        staleHandoffForDirtyFiles
          ? 'Latest handoff does not cover the current dirty files.'
          : 'Reviewer handoff found.',
        relativePath(options.cwd, handoff),
      ),
    );
  } else {
    checks.push(check('handoff-summary', 'warn', 'Reviewer handoff is missing.'));
  }

  const changedFiles = changedFileStatuses.map((file) => file.path.replace(/\\/g, '/'));
  checks.push(
    check(
      'github-metadata',
      githubMetadata.status === 'invalid' ? 'warn' : 'pass',
      githubMetadata.status === 'present'
        ? [
            'Imported GitHub metadata found',
            githubMetadata.issue?.number !== null && githubMetadata.issue?.number !== undefined
              ? `issue #${githubMetadata.issue.number}`
              : undefined,
            githubMetadata.pullRequest?.number !== null &&
            githubMetadata.pullRequest?.number !== undefined
              ? `PR #${githubMetadata.pullRequest.number}`
              : undefined,
          ]
            .filter(Boolean)
            .join(': ')
        : githubMetadata.status === 'invalid'
          ? githubMetadata.message
          : 'No imported GitHub metadata found; optional context not provided.',
      githubMetadata.status === 'missing' ? undefined : githubMetadata.path,
    ),
  );
  const nonEvidenceChangedFiles = changedFileStatuses.filter(
    (file) => !isAgentLoopEvidenceFile(file.path),
  );
  const agentLoopEvidenceFileCount = changedFiles.length - nonEvidenceChangedFiles.length;
  const nonEvidenceChangedFileCount = nonEvidenceChangedFiles.length;
  checks.push(
    check(
      'changed-file-count',
      nonEvidenceChangedFileCount > 25 ? 'warn' : 'pass',
      changedFileCountMessage(
        changedFiles.length,
        nonEvidenceChangedFileCount,
        agentLoopEvidenceFileCount,
        nonEvidenceChangedFiles,
      ),
    ),
  );
  checks.push(
    check(
      'dependency-lockfiles',
      hasPath(
        changedFiles,
        /(^|\/)(package\.json|package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?)$/,
      )
        ? 'warn'
        : 'pass',
      hasPath(
        changedFiles,
        /(^|\/)(package\.json|package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?)$/,
      )
        ? 'Dependency or lockfile changes detected.'
        : 'No dependency or lockfile changes detected.',
    ),
  );
  checks.push(
    check(
      'migrations',
      hasPath(changedFiles, /(^|\/)(migrations?|migration)(\/|\.|-|_|$)/) ? 'warn' : 'pass',
      hasPath(changedFiles, /(^|\/)(migrations?|migration)(\/|\.|-|_|$)/)
        ? 'Migration files changed.'
        : 'No migration files changed.',
    ),
  );
  checks.push(
    check(
      'auth-security-files',
      hasPath(changedFiles, /(^|\/)(auth|security)(\/|\.|-|_|$)/) ? 'warn' : 'pass',
      hasPath(changedFiles, /(^|\/)(auth|security)(\/|\.|-|_|$)/)
        ? 'Auth/security-sensitive files changed.'
        : 'No auth/security-sensitive files changed.',
    ),
  );
  checks.push(
    check(
      'generated-files',
      hasPath(changedFiles, /(^|\/)(dist|build|coverage|generated)(\/|$)/) ? 'warn' : 'pass',
      hasPath(changedFiles, /(^|\/)(dist|build|coverage|generated)(\/|$)/)
        ? 'Generated output files changed.'
        : 'No generated output files changed.',
    ),
  );

  const outputChecks = checks.map((item) => redactCheck(item, options.cwd, options.redactPaths));
  const status = overallStatus(outputChecks);
  const maintainerChecklist = [
    'Confirm the task contract matches the pull request scope.',
    'Confirm verification evidence is fresh and relevant.',
    'Review changed files for ownership and blast radius.',
    ...(outputChecks.some((item) => item.id === 'auth-security-files' && item.status === 'warn')
      ? ['Review auth/security-sensitive files manually.']
      : []),
    ...(outputChecks.some((item) => item.id === 'dependency-lockfiles' && item.status === 'warn')
      ? ['Review dependency and lockfile changes manually.']
      : []),
    'Confirm rollback notes are practical.',
  ];

  return {
    status,
    checks: outputChecks,
    maintainerChecklist,
    suggestedContributorRequest:
      redactLocalRoot(contributorRequest(outputChecks), options.cwd, options.redactPaths) ?? '',
  };
}
