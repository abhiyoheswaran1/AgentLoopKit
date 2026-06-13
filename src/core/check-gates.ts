import path from 'node:path';
import { readFile, realpath } from 'node:fs/promises';
import { AgentLoopConfig } from './config.js';
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
import { listRuns } from './runs.js';
import { inspectTaskDirectory } from './task-state.js';

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
  };
  nextAction: {
    command: string;
    reason: string;
  };
  markdown: string;
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
  input: { dirty: boolean; dirtyCoveredByLatestHandoffRun: boolean },
) {
  const task = gates.find((item) => item.id === 'task-contract');
  const report = gates.find((item) => item.id === 'verification-report');
  const handoff = gates.find((item) => item.id === 'handoff-summary');
  const taskHygiene = gates.find((item) => item.id === 'task-hygiene');
  if (task?.status === 'fail') {
    return {
      command: 'agentloop create-task',
      reason: 'Create a task contract before review gates can pass.',
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
    return {
      command: 'agentloop create-task',
      reason:
        'Gate evidence covers the current dirty files. Start the next task, or review the existing handoff before committing.',
    };
  }
  return {
    command: 'agentloop handoff',
    reason: 'Gate evidence is present. Refresh the reviewer handoff if the diff changed.',
  };
}

function renderMarkdown(result: Omit<CheckGatesResult, 'markdown'>) {
  const gateLines = result.gates
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
  const gitLines = [
    `- Git: ${gitLine}`,
    ...(result.git.isRepository
      ? [
          `- Git root: ${inlineCode(result.git.root)}`,
          `- Git target: ${inlineCode(result.git.targetIsRoot ? 'root directory' : 'subdirectory')}`,
        ]
      : []),
  ];

  const nextAction =
    result.nextAction.command === 'none'
      ? `No command required.\n\n${result.nextAction.reason}`
      : `Run ${inlineCode(result.nextAction.command)}.\n\n${result.nextAction.reason}`;

  return `# AgentLoopKit Gates

- Overall status: ${inlineCode(result.overallStatus)}
- Strict mode: ${inlineCode(result.strict ? 'enabled (warnings fail)' : 'disabled')}
${gitLines.join('\n')}
- Changed files: ${inlineCode(String(result.git.changedFileCount))}

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

  if (handoffPath) {
    gates.push(
      gate(
        'handoff-summary',
        'Handoff summary',
        'pass',
        'Reviewer handoff found.',
        relativePath(options.cwd, handoffPath),
      ),
    );
  } else {
    gates.push(gate('handoff-summary', 'Handoff summary', 'warn', 'No handoff summary found.'));
  }

  const taskDoctor = await inspectTaskDirectory(options);
  gates.push(
    gate(
      'task-hygiene',
      'Task hygiene',
      taskDoctor.overallStatus,
      taskDoctor.counts.diagnostics
        ? `Task folder has ${taskDoctor.counts.diagnostics} hygiene diagnostic${
            taskDoctor.counts.diagnostics === 1 ? '' : 's'
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

  const inGit = await isInsideGitRepo(options.cwd);
  const changedFiles = inGit ? await parseGitStatus(await getGitStatus(options.cwd)) : [];
  const latestRun = (await listRuns(options.cwd))[0];
  const latestHandoffRunCoversDirtyFiles = await dirtyCoveredByLatestHandoffRun(
    options.cwd,
    changedFiles,
    latestRun,
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
        : changedFiles.length === 0
          ? 'No changed files detected.'
          : `${changedFiles.length} changed file(s) detected.`,
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
    },
    nextAction: chooseNextAction(gates, {
      dirty: changedFiles.length > 0,
      dirtyCoveredByLatestHandoffRun: latestHandoffRunCoversDirtyFiles,
    }),
  };
  return { ...withoutMarkdown, markdown: renderMarkdown(withoutMarkdown) };
}
