import path from 'node:path';
import { readFile, realpath } from 'node:fs/promises';
import { AgentLoopConfig } from './config.js';
import { isAgentLoopEvidenceFile } from './agentloop-evidence.js';
import { latestMarkdownFile, prSummaryPattern } from './artifacts.js';
import { resolveCurrentOrLatestRunTaskVerificationEvidence } from './evidence.js';
import { pathExists, resolvesInsidePath } from './file-system.js';
import {
  getGitBranch,
  getGitCommit,
  getGitRoot,
  getGitStatus,
  isInsideGitRepo,
  parseGitStatus,
} from './git.js';
import { dirtyCoveredByLatestHandoffRun } from './handoff-coverage.js';
import { inlineCode } from './markdown-format.js';
import { listRuns, RunSummary } from './runs.js';
import { getActiveTask, inspectTaskDirectory } from './task-state.js';
import type { ActiveTask } from './task-state.js';

export type GateStatus = 'pass' | 'warn' | 'fail';

export type GateCheck = {
  id: string;
  name: string;
  status: GateStatus;
  message: string;
  path?: string;
};

export type CheckGatesResult = {
  strict: boolean;
  overallStatus: GateStatus;
  gates: GateCheck[];
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
  nextAction: {
    command: string;
    reason: string;
  };
  markdown: string;
};

export type ProjectedReviewEvidenceRun = RunSummary & {
  changedFiles: Awaited<ReturnType<typeof parseGitStatus>>;
};

const requiredRootFiles = ['AGENTS.md', 'AGENTLOOP.md', 'agentloop.config.json'];
const requiredHarnessFiles = [
  '.agentloop/harness/commands.md',
  '.agentloop/harness/definition-of-done.md',
  '.agentloop/harness/review-checklist.md',
  '.agentloop/harness/autonomous-work-rules.md',
];
const requiredPolicyFiles = [
  '.agentloop/policies/no-destructive-actions.md',
  '.agentloop/policies/git-policy.md',
  '.agentloop/policies/secrets-policy.md',
];
const DIRTY_WORKTREE_EXAMPLE_LIMIT = 5;
const taskStateRecoveryDiagnosticIds = new Set([
  'active-task-agentflight-placeholder',
  'active-task-missing',
  'active-task-archived',
  'active-task-terminal',
  'active-task-deferred',
  'active-task-older-than-runs',
  'recent-evidence-without-active-task',
]);

function extractHeading(markdown: string, fallback: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;
}

function extractOverallStatus(markdown: string) {
  return markdown.match(/Overall status:\s*([a-z-]+)/i)?.[1]?.trim() || 'unknown';
}

function relativePath(cwd: string, filePath: string) {
  return path.relative(cwd, filePath) || '.';
}

async function missingFiles(cwd: string, files: string[]) {
  const missing: string[] = [];
  for (const file of files) {
    const filePath = path.join(cwd, file);
    if (!(await pathExists(filePath)) || !resolvesInsidePath(cwd, filePath)) missing.push(file);
  }
  return missing;
}

function gate(id: string, name: string, status: GateStatus, message: string, filePath?: string) {
  return { id, name, status, message, ...(filePath ? { path: filePath } : {}) };
}

async function resolveComparablePath(filePath: string) {
  try {
    return await realpath(filePath);
  } catch {
    return path.resolve(filePath);
  }
}

function overallStatus(gates: GateCheck[], strict: boolean): GateStatus {
  if (gates.some((item) => item.status === 'fail')) return 'fail';
  if (strict && gates.some((item) => item.status === 'warn')) return 'fail';
  if (gates.some((item) => item.status === 'warn')) return 'warn';
  return 'pass';
}

function chooseNextAction(
  gates: GateCheck[],
  input: {
    activeTask?: ActiveTask;
    dirty: boolean;
    dirtyCoveredByLatestHandoffRun: boolean;
    dirtyNonEvidenceFileCount: number;
    dirtyNonEvidenceFileExamples: string[];
  },
) {
  const withDirtyCreateTaskGuidance = (reason: string) => {
    if (input.dirtyNonEvidenceFileCount === 0) return reason;
    const noun = input.dirtyNonEvidenceFileCount === 1 ? 'file' : 'files';
    const pronoun = input.dirtyNonEvidenceFileCount === 1 ? 'it belongs' : 'they belong';
    const examples = input.dirtyNonEvidenceFileExamples.length
      ? ` Examples: ${input.dirtyNonEvidenceFileExamples.map(gateInlineCode).join(', ')}.`
      : '';
    return `${reason} ${input.dirtyNonEvidenceFileCount} existing dirty non-evidence ${noun} will be present when the new task starts; confirm ${pronoun} to that task before implementation.${examples}`;
  };
  const task = gates.find((item) => item.id === 'task-contract');
  const report = gates.find((item) => item.id === 'verification-report');
  const handoff = gates.find((item) => item.id === 'handoff-summary');
  const taskHygiene = gates.find((item) => item.id === 'task-hygiene');
  if (task?.status === 'fail') {
    return {
      command: 'agentloop create-task',
      reason: withDirtyCreateTaskGuidance(
        'Create a task contract before review gates can pass.',
      ),
    };
  }
  if (report?.status === 'fail') {
    return {
      command: task?.path ? `agentloop verify --task ${task.path}` : 'agentloop verify',
      reason: 'Run verification and fix failures before review.',
    };
  }
  if (handoff?.status !== 'pass') {
    return {
      command: 'agentloop handoff',
      reason: 'Write a reviewer handoff after verification.',
    };
  }
  if (taskHygiene?.status === 'warn') {
    return {
      command: 'agentloop task doctor',
      reason: 'Review task-folder hygiene diagnostics before refreshing handoff evidence.',
    };
  }
  if (!input.dirty) {
    return {
      command: 'none',
      reason: 'Gate evidence is complete and the repo is clean.',
    };
  }
  if (input.dirty && input.dirtyCoveredByLatestHandoffRun) {
    const activeStatus = input.activeTask?.status.trim().toLowerCase();
    const activeTaskCanBeClosed =
      input.activeTask &&
      !input.activeTask.source &&
      task?.path === input.activeTask.path &&
      activeStatus !== 'deferred' &&
      activeStatus !== 'done' &&
      activeStatus !== 'completed' &&
      activeStatus !== 'verified';
    if (activeTaskCanBeClosed) {
      return {
        command: 'agentloop task done',
        reason:
          'Task, verification, and handoff evidence cover the current dirty files. Mark the task done when the handoff is ready, or keep it open if work is still in progress.',
      };
    }
    return {
      command: 'agentloop create-task',
      reason: withDirtyCreateTaskGuidance(
        'Gate evidence covers the current dirty files. Start the next task, or review the existing handoff before committing.',
      ),
    };
  }
  return {
    command: 'agentloop handoff',
    reason: 'Gate evidence is present. Refresh the reviewer handoff if the diff changed.',
  };
}

function gateInlineCode(value: string) {
  return inlineCode(value.replace(/\r/g, '\\r').replace(/\n/g, '\\n'));
}

function changedFileSummary(input: {
  changedFileCount: number;
  nonEvidenceChangedFileCount: number;
  agentLoopEvidenceChangedFileCount: number;
}) {
  if (input.changedFileCount === 0) return '0';
  return `${input.changedFileCount}; ${input.nonEvidenceChangedFileCount} non-evidence, ${input.agentLoopEvidenceChangedFileCount} AgentLoop evidence`;
}

function changedFileGateMessage(input: {
  changedFileCount: number;
  nonEvidenceChangedFileCount: number;
  agentLoopEvidenceChangedFileCount: number;
}) {
  if (input.changedFileCount === 0) return 'No changed files detected.';
  return `${input.changedFileCount} changed file(s) detected (${input.nonEvidenceChangedFileCount} non-evidence, ${input.agentLoopEvidenceChangedFileCount} AgentLoop evidence).`;
}

function gateDisplayName(item: GateCheck) {
  if (
    item.id === 'task-contract' &&
    item.path &&
    /(^|[\\/])archive[\\/]/.test(item.path)
  ) {
    return 'Archived task evidence';
  }
  return item.name;
}

function renderMarkdown(result: Omit<CheckGatesResult, 'markdown'>) {
  const gateLines = result.gates
    .map((item) => {
      const suffix = item.path ? ` - ${gateInlineCode(item.path)}` : '';
      return `- [${gateInlineCode(item.status)}] ${gateInlineCode(
        gateDisplayName(item),
      )}: ${gateInlineCode(item.message)}${suffix}`;
    })
    .join('\n');
  const gitLine = result.git.isRepository
    ? `${gateInlineCode(result.git.branch || 'unknown branch')}${
        result.git.commit ? ` @ ${gateInlineCode(result.git.commit)}` : ''
      }`
    : gateInlineCode('not inside a git repository');
  const gitLines = [
    `- Git: ${gitLine}`,
    ...(result.git.isRepository
      ? [
          `- Git root: ${gateInlineCode(result.git.root)}`,
          `- Git target: ${gateInlineCode(result.git.targetIsRoot ? 'root directory' : 'subdirectory')}`,
        ]
      : []),
  ];

  const nextAction =
    result.nextAction.command === 'none'
      ? `No command required.\n\n${result.nextAction.reason}`
      : `Run ${gateInlineCode(result.nextAction.command)}.\n\n${result.nextAction.reason}`;

  return `# AgentLoopKit Gates

- Overall status: ${gateInlineCode(result.overallStatus)}
- Strict mode: ${gateInlineCode(result.strict ? 'enabled (warnings fail)' : 'disabled')}
${gitLines.join('\n')}
- Changed files: ${gateInlineCode(changedFileSummary(result.git))}

## Gates

${gateLines}

## Next Action

${nextAction}
`;
}

function redactGitRoot(root: string, redactPaths: boolean | undefined) {
  if (!redactPaths || !root) return root;
  return '[git-root]';
}

export async function checkGates(options: {
  cwd: string;
  config: AgentLoopConfig;
  strict?: boolean;
  redactPaths?: boolean;
  projectedReviewEvidenceRun?: ProjectedReviewEvidenceRun;
}): Promise<CheckGatesResult> {
  const strict = options.strict ?? false;
  const evidence = await resolveCurrentOrLatestRunTaskVerificationEvidence(options);
  const taskPath = evidence.taskPath;
  const currentReportPath = evidence.currentReportPath;
  const handoffPath = await latestMarkdownFile(
    path.join(options.cwd, options.config.paths.handoffsDir),
    {
      pattern: prSummaryPattern,
      rootDir: options.cwd,
    },
  );
  const gates: GateCheck[] = [];

  if (taskPath) {
    const taskMarkdown = await readFile(taskPath, 'utf8');
    gates.push(
      gate(
        'task-contract',
        'Task contract',
        'pass',
        extractHeading(taskMarkdown, path.basename(taskPath, '.md')),
        relativePath(options.cwd, taskPath),
      ),
    );
  } else {
    gates.push(gate('task-contract', 'Task contract', 'fail', 'No task contract found.'));
  }

  if (currentReportPath) {
    const reportMarkdown = await readFile(currentReportPath, 'utf8');
    const status = extractOverallStatus(reportMarkdown);
    gates.push(
      gate(
        'verification-report',
        'Verification report',
        status === 'pass' ? 'pass' : 'fail',
        `Overall status: ${status}`,
        relativePath(options.cwd, currentReportPath),
      ),
    );
  } else if (evidence.staleReport) {
    gates.push(
      gate(
        'verification-report',
        'Verification report',
        'fail',
        evidence.staleReport.message,
        evidence.staleReport.relativePath,
      ),
    );
  } else {
    gates.push(
      gate('verification-report', 'Verification report', 'fail', 'No verification report found.'),
    );
  }

  const inGit = await isInsideGitRepo(options.cwd);
  const changedFiles = inGit ? await parseGitStatus(await getGitStatus(options.cwd)) : [];
  const dirtyNonEvidenceFiles = changedFiles.filter((file) => !isAgentLoopEvidenceFile(file.path));
  const agentLoopEvidenceChangedFileCount = changedFiles.length - dirtyNonEvidenceFiles.length;
  const nonEvidenceChangedFileCount = changedFiles.length - agentLoopEvidenceChangedFileCount;
  const latestRun = options.projectedReviewEvidenceRun ?? (await listRuns(options.cwd))[0];
  const latestHandoffRunCoversDirtyFiles = await dirtyCoveredByLatestHandoffRun(
    options.cwd,
    changedFiles,
    latestRun,
    options.projectedReviewEvidenceRun?.changedFiles,
    handoffPath ?? undefined,
  );

  if (handoffPath) {
    const dirtyWithoutFreshHandoff = changedFiles.length > 0 && !latestHandoffRunCoversDirtyFiles;
    gates.push(
      gate(
        'handoff-summary',
        'Handoff summary',
        dirtyWithoutFreshHandoff ? 'warn' : 'pass',
        dirtyWithoutFreshHandoff
          ? 'Latest handoff does not cover the current dirty files.'
          : 'Reviewer handoff found.',
        relativePath(options.cwd, handoffPath),
      ),
    );
  } else {
    gates.push(gate('handoff-summary', 'Handoff summary', 'warn', 'No handoff summary found.'));
  }

  const taskDoctor = await inspectTaskDirectory(options);
  const taskHygieneDiagnostics = taskDoctor.diagnostics.filter(
    (diagnostic) => !taskStateRecoveryDiagnosticIds.has(diagnostic.id),
  );
  gates.push(
    gate(
      'task-hygiene',
      'Task hygiene',
      taskHygieneDiagnostics.length ? 'warn' : 'pass',
      taskHygieneDiagnostics.length
        ? `Task folder has ${taskHygieneDiagnostics.length} hygiene diagnostic${
            taskHygieneDiagnostics.length === 1 ? '' : 's'
          }. Run \`agentloop task doctor\` for cleanup details.`
        : 'Task folder hygiene checks passed.',
    ),
  );

  const missingHarness = await missingFiles(options.cwd, [
    ...requiredRootFiles,
    ...requiredHarnessFiles,
  ]);
  gates.push(
    gate(
      'repo-harness',
      'Repo harness',
      missingHarness.length ? 'warn' : 'pass',
      missingHarness.length
        ? `Missing harness files: ${missingHarness.join(', ')}.`
        : 'Required repo and harness files exist.',
    ),
  );

  const missingPolicies = await missingFiles(options.cwd, requiredPolicyFiles);
  gates.push(
    gate(
      'safety-policies',
      'Safety policies',
      missingPolicies.length ? 'warn' : 'pass',
      missingPolicies.length
        ? `Missing policy files: ${missingPolicies.join(', ')}.`
        : 'Core safety policy files exist.',
    ),
  );

  const gitRoot = inGit ? await getGitRoot(options.cwd) : '';
  const resolvedGitRoot = gitRoot ? await resolveComparablePath(gitRoot) : '';
  const gitTargetIsRoot = resolvedGitRoot
    ? resolvedGitRoot === (await resolveComparablePath(options.cwd))
    : false;
  gates.push(
    gate(
      'git-context',
      'Git context',
      !inGit ? 'warn' : 'pass',
      !inGit
        ? 'Not inside a git repository.'
        : changedFileGateMessage({
            changedFileCount: changedFiles.length,
            nonEvidenceChangedFileCount,
            agentLoopEvidenceChangedFileCount,
          }),
    ),
  );
  if (inGit) {
    gates.push(
      gate(
        'git-target',
        'Git target',
        gitTargetIsRoot ? 'pass' : 'warn',
        gitTargetIsRoot
          ? 'Current directory is the Git root.'
          : 'Current directory is a Git subdirectory. AgentLoopKit files live in the current directory, not the Git root.',
      ),
    );
  }

  const withoutMarkdown = {
    strict,
    overallStatus: overallStatus(gates, strict),
    gates,
    git: {
      isRepository: inGit,
      branch: inGit ? await getGitBranch(options.cwd) : '',
      commit: inGit ? await getGitCommit(options.cwd) : '',
      root: redactGitRoot(resolvedGitRoot, options.redactPaths),
      targetIsRoot: gitTargetIsRoot,
      changedFileCount: changedFiles.length,
      nonEvidenceChangedFileCount,
      agentLoopEvidenceChangedFileCount,
    },
    nextAction: chooseNextAction(gates, {
      activeTask: await getActiveTask(options),
      dirty: changedFiles.length > 0,
      dirtyCoveredByLatestHandoffRun: latestHandoffRunCoversDirtyFiles,
      dirtyNonEvidenceFileCount: dirtyNonEvidenceFiles.length,
      dirtyNonEvidenceFileExamples: dirtyNonEvidenceFiles
        .slice(0, DIRTY_WORKTREE_EXAMPLE_LIMIT)
        .map((file) => file.path),
    }),
  };
  return { ...withoutMarkdown, markdown: renderMarkdown(withoutMarkdown) };
}
