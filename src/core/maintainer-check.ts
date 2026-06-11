import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { AgentLoopConfig } from './config.js';
import { latestMarkdownFile, prSummaryPattern } from './artifacts.js';
import { resolveCurrentTaskVerificationEvidence } from './evidence.js';
import { getGitStatus, parseGitStatus } from './git.js';
import { readTaskContract } from './task-state.js';

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
  return markdown?.match(/Overall status:\s*([a-z-]+)/i)?.[1]?.trim().toLowerCase() ?? 'missing';
}

function check(id: string, status: MaintainerCheckStatus, message: string, filePath?: string) {
  return { id, status, message, ...(filePath ? { path: filePath } : {}) };
}

function hasPath(changedFiles: string[], pattern: RegExp) {
  return changedFiles.some((filePath) => pattern.test(filePath));
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

export async function runMaintainerCheck(options: {
  cwd: string;
  config: AgentLoopConfig;
}): Promise<MaintainerCheckResult> {
  const evidence = await resolveCurrentTaskVerificationEvidence(options);
  const checks: MaintainerCheck[] = [];

  if (evidence.taskPath) {
    const task = await readTaskContract({
      cwd: options.cwd,
      config: options.config,
      taskPath: evidence.taskPath,
    });
    checks.push(
      check('task-contract', 'pass', `Task contract found: ${task.title}`, task.path),
    );
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

  const handoff = await latestMarkdownFile(path.join(options.cwd, options.config.paths.handoffsDir), {
    pattern: prSummaryPattern,
    rootDir: options.cwd,
  });
  checks.push(
    handoff
      ? check('handoff-summary', 'pass', 'Reviewer handoff found.', relativePath(options.cwd, handoff))
      : check('handoff-summary', 'warn', 'Reviewer handoff is missing.'),
  );

  const changedFiles = (await parseGitStatus(await getGitStatus(options.cwd))).map((file) =>
    file.path.replace(/\\/g, '/'),
  );
  checks.push(
    check(
      'changed-file-count',
      changedFiles.length > 25 ? 'warn' : 'pass',
      `${changedFiles.length} changed file(s) detected.`,
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

  const status = overallStatus(checks);
  const maintainerChecklist = [
    'Confirm the task contract matches the pull request scope.',
    'Confirm verification evidence is fresh and relevant.',
    'Review changed files for ownership and blast radius.',
    ...(checks.some((item) => item.id === 'auth-security-files' && item.status === 'warn')
      ? ['Review auth/security-sensitive files manually.']
      : []),
    ...(checks.some((item) => item.id === 'dependency-lockfiles' && item.status === 'warn')
      ? ['Review dependency and lockfile changes manually.']
      : []),
    'Confirm rollback notes are practical.',
  ];

  return {
    status,
    checks,
    maintainerChecklist,
    suggestedContributorRequest: contributorRequest(checks),
  };
}
