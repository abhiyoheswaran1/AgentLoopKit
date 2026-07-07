import path from 'node:path';
import { readFile, realpath, stat } from 'node:fs/promises';
import { AgentLoopConfig } from './config.js';
import { DEFAULT_COMMAND_KEYS } from './constants.js';
import {
  getGitBranch,
  getGitCommit,
  getGitRoot,
  getGitStatus,
  isInsideGitRepo,
  parseGitStatus,
  GitFileStatus,
} from './git.js';
import { isAgentLoopEvidenceFile } from './agentloop-evidence.js';
import { analyzeContract } from './harden.js';
import { latestMarkdownFile } from './artifacts.js';
import { prSummaryPattern, verificationReportPattern } from './artifacts.js';
import { dirtyCoveredByLatestHandoffRun } from './handoff-coverage.js';
import { singleLineInlineCode } from './markdown-format.js';
import { listRuns, RunSummary } from './runs.js';
import {
  getActiveTaskPath,
  getFallbackTaskPath,
  inspectTaskDirectory,
  listTasks,
  readTaskMetadata,
} from './task-state.js';
import type { TaskDoctorDiagnostic, TaskSource } from './task-state.js';

export type StatusArtifact = {
  path: string;
  title: string;
};

export type StatusTask = StatusArtifact & {
  status: string;
  source?: TaskSource;
};

export type StatusReport = StatusArtifact & {
  overallStatus: string;
};

export type StatusLoopGuidance = {
  taskType: string;
  path: string;
};

export type AgentLoopStatusResult = {
  project: AgentLoopConfig['project'];
  git: {
    isRepository: boolean;
    branch: string;
    commit: string;
    root: string;
    targetIsRoot: boolean;
  };
  workingTree: {
    dirty: boolean;
    changedFileCount: number;
    nonEvidenceChangedFileCount: number;
    agentLoopEvidenceChangedFileCount: number;
    changedFiles: GitFileStatus[];
  };
  activeTask: StatusTask | null;
  staleTaskState?: {
    id: string;
    path: string;
    message: string;
  };
  latestTask: StatusTask | null;
  loopGuidance?: StatusLoopGuidance;
  deferredTasks: StatusTask[];
  agentFlightPlaceholderTasks: StatusTask[];
  latestReport?: StatusReport;
  latestRun?: RunSummary;
  commands: {
    configured: string[];
    missing: string[];
  };
  nextAction: {
    command: string;
    reason: string;
  };
  brief: string;
  markdown: string;
};

type Timestamped<T> = T & {
  modifiedAtMs: number;
};

export type StatusTaskListSummary = {
  count: number;
  preview: StatusTask[];
  hiddenCount: number;
};

export type AgentLoopStatusBriefJson = {
  project: AgentLoopStatusResult['project'];
  git: AgentLoopStatusResult['git'];
  workingTree: Omit<AgentLoopStatusResult['workingTree'], 'changedFiles'>;
  activeTask: AgentLoopStatusResult['activeTask'];
  staleTaskState?: AgentLoopStatusResult['staleTaskState'];
  latestTask: AgentLoopStatusResult['latestTask'];
  loopGuidance?: AgentLoopStatusResult['loopGuidance'];
  deferredTasks: StatusTaskListSummary;
  agentFlightPlaceholderTasks: StatusTaskListSummary;
  latestReport?: AgentLoopStatusResult['latestReport'];
  latestRun?: AgentLoopStatusResult['latestRun'];
  commands: AgentLoopStatusResult['commands'] & {
    configuredCount: number;
    missingCount: number;
  };
  nextAction: AgentLoopStatusResult['nextAction'];
  brief: string;
};

const STALE_NEXT_ACTION_DIAGNOSTICS = new Set([
  'active-task-missing',
  'active-task-archived',
  'active-task-deferred',
  'active-task-older-than-runs',
]);
const DIRTY_WORKTREE_EXAMPLE_LIMIT = 5;

function pickStaleTaskStateDiagnostic(diagnostics: TaskDoctorDiagnostic[]) {
  const diagnostic = diagnostics.find((candidate) =>
    STALE_NEXT_ACTION_DIAGNOSTICS.has(candidate.id),
  );
  if (!diagnostic) return undefined;
  return {
    id: diagnostic.id,
    path: diagnostic.path,
    message: diagnostic.message,
  };
}

async function countActiveTaskBlockingSoftSpots(
  cwd: string,
  activeTask: StatusTask | null,
): Promise<number> {
  if (!activeTask) return 0;
  try {
    const markdown = await readFile(path.resolve(cwd, activeTask.path), 'utf8');
    return analyzeContract(markdown).filter((spot) => spot.severity === 'blocking').length;
  } catch {
    return 0;
  }
}

function extractHeading(markdown: string, fallback: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;
}

function extractOverallStatus(markdown: string) {
  return markdown.match(/Overall status:\s*([a-z-]+)/i)?.[1]?.trim() || 'unknown';
}

function extractTaskType(markdown: string) {
  return (
    markdown
      .match(/^- Task type:\s*(.+)$/im)?.[1]
      ?.trim()
      .toLowerCase() || 'unknown'
  );
}

async function readTask(
  cwd: string,
  filePath: string | undefined,
): Promise<Timestamped<StatusTask> | undefined> {
  if (!filePath) return undefined;
  const [task, fileStat] = await Promise.all([readTaskMetadata(cwd, filePath), stat(filePath)]);
  return {
    ...task,
    modifiedAtMs: fileStat.mtimeMs,
  };
}

async function readReport(
  cwd: string,
  filePath: string | undefined,
): Promise<Timestamped<StatusReport> | undefined> {
  if (!filePath) return undefined;
  const markdown = await readFile(filePath, 'utf8');
  const fileStat = await stat(filePath);
  return {
    path: path.relative(cwd, filePath).split(path.sep).join('/'),
    title: extractHeading(markdown, path.basename(filePath, '.md')),
    overallStatus: extractOverallStatus(markdown),
    modifiedAtMs: fileStat.mtimeMs,
  };
}

function stripTaskTimestamp(task: Timestamped<StatusTask> | undefined): StatusTask | undefined {
  if (!task) return undefined;
  return {
    path: task.path,
    title: task.title,
    status: task.status,
    ...(task.source ? { source: task.source } : {}),
  };
}

function stripReportTimestamp(
  report: Timestamped<StatusReport> | undefined,
): StatusReport | undefined {
  if (!report) return undefined;
  return {
    path: report.path,
    title: report.title,
    overallStatus: report.overallStatus,
  };
}

function isPostVerificationTaskState(task: Timestamped<StatusTask> | undefined) {
  const status = task?.status.trim().toLowerCase();
  return status === 'review' || status === 'done';
}

async function isReleaseChannelTask(cwd: string, task: StatusTask) {
  try {
    const markdown = await readFile(path.resolve(cwd, task.path), 'utf8');
    return extractTaskType(markdown) === 'release';
  } catch {
    return false;
  }
}

function isSafeTaskType(value: string) {
  return /^[a-z0-9-]+$/.test(value);
}

async function readLoopGuidanceForTask(options: {
  cwd: string;
  config: AgentLoopConfig;
  task: StatusTask | null;
}): Promise<StatusLoopGuidance | undefined> {
  if (!options.task) return undefined;

  let markdown: string;
  try {
    markdown = await readFile(path.resolve(options.cwd, options.task.path), 'utf8');
  } catch {
    return undefined;
  }
  const taskType = extractTaskType(markdown);
  if (taskType === 'unknown' || !isSafeTaskType(taskType)) return undefined;

  const agentloopDir = options.config.paths.agentloopDir.replace(/\\/g, '/');
  const loopPath = path.posix.join(agentloopDir, 'loops', `${taskType}.md`);
  const loopStat = await stat(path.resolve(options.cwd, loopPath)).catch(() => undefined);
  if (!loopStat?.isFile()) return undefined;

  return { taskType, path: loopPath };
}

async function allDeferredTasksAreReleaseChannel(cwd: string, tasks: StatusTask[]) {
  if (!tasks.length) return false;
  const taskTypes = await Promise.all(tasks.map((task) => isReleaseChannelTask(cwd, task)));
  return taskTypes.every(Boolean);
}

function chooseNextAction(input: {
  activeTask: StatusTask | null;
  staleTaskState?: AgentLoopStatusResult['staleTaskState'];
  latestTask: StatusTask | null;
  deferredTasks: StatusTask[];
  deferredTasksAreReleaseChannel: boolean;
  latestReport?: StatusReport;
  latestRun?: RunSummary;
  dirty: boolean;
  nonEvidenceChangedFileCount: number;
  dirtyNonEvidenceFileExamples: string[];
  dirtyCoveredByLatestHandoffRun: boolean;
  activeTaskBlockingSoftSpotCount: number;
}) {
  const withDirtyCreateTaskGuidance = (reason: string) => {
    if (input.nonEvidenceChangedFileCount === 0) return reason;
    const noun = `dirty non-evidence file${input.nonEvidenceChangedFileCount === 1 ? '' : 's'}`;
    const examples = input.dirtyNonEvidenceFileExamples.length
      ? ` Examples: ${input.dirtyNonEvidenceFileExamples.map(singleLineInlineCode).join(', ')}.`
      : '';
    return `${reason} ${input.nonEvidenceChangedFileCount} existing ${noun} will be present when the new task starts; confirm they belong to that task before implementation.${examples}`;
  };

  if (input.staleTaskState) {
    return {
      command: 'agentloop task doctor',
      reason: `The active task pointer is stale: ${input.staleTaskState.message}`,
    };
  }
  if (!input.activeTask) {
    if (input.latestTask) {
      return {
        command: `agentloop task set ${input.latestTask.path}`,
        reason:
          'No active task is pinned, but an open task contract exists. Pin it before continuing the loop, or create a new task if this is not the right work.',
      };
    }
    const latestRunTaskStatus = input.latestRun?.task?.status.trim().toLowerCase();
    if (
      input.dirty &&
      !input.dirtyCoveredByLatestHandoffRun &&
      (latestRunTaskStatus === 'done' || latestRunTaskStatus === 'review') &&
      input.latestRun?.task
    ) {
      return {
        command: 'agentloop handoff',
        reason:
          'The latest run references completed task evidence, but the working tree still has changes. Refresh the handoff or review the dirty evidence before starting a new task.',
      };
    }
    if (input.deferredTasks.length > 0) {
      const count = input.deferredTasks.length;
      if (input.deferredTasksAreReleaseChannel) {
        const noun = `deferred release-channel task contract${count === 1 ? '' : 's'}`;
        if (!input.dirty) {
          return {
            command: 'none',
            reason: `${count} ${noun} ${count === 1 ? 'is' : 'are'} parked for maintainer approval. No command is required until release work is approved, or create a non-release task only when there is current work.`,
          };
        }
        return {
          command: 'agentloop create-task',
          reason: withDirtyCreateTaskGuidance(
            `${count} ${noun} ${count === 1 ? 'is' : 'are'} parked for maintainer approval. Create a non-release task for current work, or move release work back to proposed only after maintainer approval.`,
          ),
        };
      }
      if (!input.dirty) {
        return {
          command: 'none',
          reason: `${count} deferred task contract${count === 1 ? ' is' : 's are'} parked, and the repo is clean. Start a new task only when there is current work, or move a deferred task back to proposed when it is ready.`,
        };
      }
      return {
        command: 'agentloop create-task',
        reason: withDirtyCreateTaskGuidance(
          `${count} deferred task contract${count === 1 ? ' is' : 's are'} parked. Create a new task for current work, or move a deferred task back to proposed when it is ready.`,
        ),
      };
    }
    return {
      command: 'agentloop create-task',
      reason: withDirtyCreateTaskGuidance('No task contract was found.'),
    };
  }
  if (input.activeTask.status.trim().toLowerCase() === 'done') {
    return {
      command: `agentloop task archive ${input.activeTask.path}`,
      reason:
        'The active task is done. Archive it to clear the active pointer before starting the next task.',
    };
  }
  if (input.activeTaskBlockingSoftSpotCount > 0) {
    return {
      command: 'agentloop harden',
      reason: `${input.activeTaskBlockingSoftSpotCount} blocking soft spot(s) in the task contract — harden it before implementing or verifying.`,
    };
  }
  if (!input.latestReport) {
    return {
      command: 'agentloop verify',
      reason: 'A task exists, but no verification report was found.',
    };
  }
  if (input.latestReport.overallStatus === 'fail') {
    return {
      command: 'agentloop verify',
      reason: 'The latest verification report failed. Fix the failures and rerun verification.',
    };
  }
  if (input.dirty) {
    if (input.dirtyCoveredByLatestHandoffRun) {
      return {
        command: 'agentloop task done',
        reason:
          'Task, verification, and handoff evidence cover the current dirty files. Mark the task done when the handoff is ready, or keep it open if work is still in progress.',
      };
    }
    return {
      command: 'agentloop handoff',
      reason: 'Task and verification evidence exist, and the working tree has changes.',
    };
  }
  if (input.activeTask.status.trim().toLowerCase() === 'review') {
    return {
      command: 'agentloop task done',
      reason:
        'The active task is in review, verification passed, and the repo is clean. Mark it done after the handoff is ready, or leave it in review if human review is still pending.',
    };
  }
  return {
    command: 'agentloop create-task',
    reason: 'The repo is clean. Start the next task contract when ready.',
  };
}

function formatMarkdownList(values: string[]) {
  return values.length ? values.map((value) => singleLineInlineCode(value)).join(', ') : 'none';
}

function formatTaskMarkdown(task: StatusTask | null | undefined) {
  if (!task) return 'No open task found.';
  return `${singleLineInlineCode(task.title)} (${singleLineInlineCode(task.status)}) - ${singleLineInlineCode(task.path)}`;
}

function formatActiveTaskMarkdown(
  task: StatusTask | null | undefined,
  staleTaskState: AgentLoopStatusResult['staleTaskState'],
) {
  if (staleTaskState) return `stale pointer - ${singleLineInlineCode(staleTaskState.path)}`;
  return formatTaskMarkdown(task);
}

function formatReportMarkdown(report: StatusReport | undefined) {
  if (!report) return 'No verification report found.';
  return `${singleLineInlineCode(report.overallStatus)} - ${singleLineInlineCode(report.path)}`;
}

function formatRunSummaryMarkdown(run: RunSummary | undefined) {
  if (!run) return 'No run ledger entries found.';
  const result =
    run.score === undefined
      ? run.overallStatus
        ? singleLineInlineCode(run.overallStatus)
        : `${singleLineInlineCode(String(run.changedFileCount))} changed file(s)`
      : `${singleLineInlineCode(String(run.score))}/100`;
  const artifactPath = run.shipReportPath ?? run.handoffPath ?? run.verificationReportPath;
  return `${singleLineInlineCode(run.command)} ${result} - ${singleLineInlineCode(run.id)}${
    artifactPath ? ` - ${singleLineInlineCode(artifactPath)}` : ''
  }`;
}

function formatDeferredTaskSummaryMarkdown(tasks: StatusTask[]) {
  if (!tasks.length) return 'none';
  const count = tasks.length;
  const titles = tasks
    .slice(0, 3)
    .map((task) => singleLineInlineCode(task.title))
    .join(', ');
  const remaining = count > 3 ? `, +${count - 3} more` : '';
  return `${count} parked - ${titles}${remaining}`;
}

function formatAgentFlightPlaceholderSummaryMarkdown(tasks: StatusTask[]) {
  if (!tasks.length) return 'none';
  const count = tasks.length;
  const titles = tasks
    .slice(0, 3)
    .map((task) => singleLineInlineCode(task.title))
    .join(', ');
  const remaining = count > 3 ? `, +${count - 3} more` : '';
  return `${count} preserved - ${titles}${remaining}`;
}

async function resolveComparablePath(filePath: string) {
  try {
    return await realpath(filePath);
  } catch {
    return path.resolve(filePath);
  }
}

type StatusRenderInput = Omit<AgentLoopStatusResult, 'brief' | 'markdown'>;

function redactGitRoot(root: string, redactPaths: boolean | undefined) {
  if (!redactPaths || !root) return root;
  return '[git-root]';
}

function formatBriefValue(value: string) {
  return `"${value.replace(/["\r\n]/g, ' ').trim()}"`;
}

function formatBriefWorkingTree(workingTree: StatusRenderInput['workingTree']) {
  if (!workingTree.dirty) return 'clean';
  return `dirty (${workingTree.changedFileCount}; ${workingTree.nonEvidenceChangedFileCount} non-evidence, ${workingTree.agentLoopEvidenceChangedFileCount} AgentLoop evidence)`;
}

function formatMarkdownWorkingTree(workingTree: StatusRenderInput['workingTree']) {
  if (!workingTree.dirty) return 'clean';
  return `dirty (${workingTree.changedFileCount} changed file(s); ${workingTree.nonEvidenceChangedFileCount} non-evidence, ${workingTree.agentLoopEvidenceChangedFileCount} AgentLoop evidence)`;
}

function renderBrief(result: StatusRenderInput) {
  const task = result.activeTask ?? result.latestTask;
  const taskTitle = task?.title ?? 'none';
  const taskStatus = task?.status ?? 'none';
  const verificationStatus = result.latestReport?.overallStatus ?? 'missing';
  const verification =
    result.latestReport && !task ? `previous:${verificationStatus}` : verificationStatus;
  const run = result.latestRun
    ? result.latestRun.score === undefined
      ? `${result.latestRun.command} ${result.latestRun.overallStatus ?? `${result.latestRun.changedFileCount} files`}`
      : `${result.latestRun.command} ${result.latestRun.score}/100`
    : 'none';
  const tree = formatBriefWorkingTree(result.workingTree);

  return `AgentLoopKit: task=${formatBriefValue(taskTitle)} status=${formatBriefValue(taskStatus)}; verification=${verification}; run=${formatBriefValue(run)}; tree=${tree}; next=${formatBriefValue(result.nextAction.command)}
Reason: ${result.nextAction.reason}`;
}

function renderMarkdown(result: StatusRenderInput) {
  const gitLine = result.git.isRepository
    ? `${singleLineInlineCode(result.git.branch || 'unknown branch')}${
        result.git.commit ? ` @ ${singleLineInlineCode(result.git.commit)}` : ''
      }`
    : singleLineInlineCode('not inside a git repository');
  const gitLines = [
    `- Git: ${gitLine}`,
    ...(result.git.isRepository
      ? [
          `- Git root: ${singleLineInlineCode(result.git.root)}`,
          `- Git target: ${singleLineInlineCode(result.git.targetIsRoot ? 'root directory' : 'subdirectory')}`,
          ...(result.git.targetIsRoot
            ? []
            : [
                '- Git target warning: AgentLoopKit files live in the current directory, not the Git root.',
              ]),
        ]
      : []),
  ];
  const workingTree = formatMarkdownWorkingTree(result.workingTree);
  const activeTask = result.staleTaskState
    ? formatActiveTaskMarkdown(result.activeTask, result.staleTaskState)
    : result.activeTask
      ? formatTaskMarkdown(result.activeTask)
      : result.latestTask
        ? 'none pinned.'
        : result.deferredTasks.length
          ? `none active; ${result.deferredTasks.length} deferred task${result.deferredTasks.length === 1 ? '' : 's'} parked.`
          : result.agentFlightPlaceholderTasks.length
            ? `none active; ${result.agentFlightPlaceholderTasks.length} AgentFlight placeholder task${result.agentFlightPlaceholderTasks.length === 1 ? '' : 's'} preserved.`
            : 'No task contract found.';
  const latestTask = formatTaskMarkdown(result.latestTask);
  const loopGuidance = result.loopGuidance
    ? `- Loop guidance: ${singleLineInlineCode(result.loopGuidance.path)}\n`
    : '';
  const latestReport = formatReportMarkdown(result.latestReport);
  const latestVerificationLabel =
    result.activeTask || result.latestTask ? 'Latest verification' : 'Latest previous verification';
  const latestRun = formatRunSummaryMarkdown(result.latestRun);

  const nextAction =
    result.nextAction.command === 'none'
      ? `No command required.\n\n${result.nextAction.reason}`
      : `Run ${singleLineInlineCode(result.nextAction.command)}.\n\n${result.nextAction.reason}`;

  return `# AgentLoopKit Status

- Project: ${singleLineInlineCode(result.project.name || 'unnamed')} (${singleLineInlineCode(result.project.type)})
- Package manager: ${singleLineInlineCode(result.project.packageManager)}
${gitLines.join('\n')}
- Working tree: ${singleLineInlineCode(workingTree)}
- Active task: ${activeTask}
- Latest open task: ${latestTask}
${loopGuidance}- Deferred tasks: ${formatDeferredTaskSummaryMarkdown(result.deferredTasks)}
- AgentFlight placeholders: ${formatAgentFlightPlaceholderSummaryMarkdown(result.agentFlightPlaceholderTasks)}
- ${latestVerificationLabel}: ${latestReport}
- Latest run: ${latestRun}
- Configured commands: ${formatMarkdownList(result.commands.configured)}
- Missing commands: ${formatMarkdownList(result.commands.missing)}

## Next Action

${nextAction}
`;
}

function summarizeStatusTasks(tasks: StatusTask[], limit = 3): StatusTaskListSummary {
  return {
    count: tasks.length,
    preview: tasks.slice(0, limit),
    hiddenCount: Math.max(0, tasks.length - limit),
  };
}

export function toBriefStatusJson(result: AgentLoopStatusResult): AgentLoopStatusBriefJson {
  return {
    project: result.project,
    git: result.git,
    workingTree: {
      dirty: result.workingTree.dirty,
      changedFileCount: result.workingTree.changedFileCount,
      nonEvidenceChangedFileCount: result.workingTree.nonEvidenceChangedFileCount,
      agentLoopEvidenceChangedFileCount: result.workingTree.agentLoopEvidenceChangedFileCount,
    },
    activeTask: result.activeTask,
    ...(result.staleTaskState ? { staleTaskState: result.staleTaskState } : {}),
    latestTask: result.latestTask,
    ...(result.loopGuidance ? { loopGuidance: result.loopGuidance } : {}),
    deferredTasks: summarizeStatusTasks(result.deferredTasks),
    agentFlightPlaceholderTasks: summarizeStatusTasks(result.agentFlightPlaceholderTasks),
    ...(result.latestReport ? { latestReport: result.latestReport } : {}),
    ...(result.latestRun ? { latestRun: result.latestRun } : {}),
    commands: {
      configured: result.commands.configured,
      missing: result.commands.missing,
      configuredCount: result.commands.configured.length,
      missingCount: result.commands.missing.length,
    },
    nextAction: result.nextAction,
    brief: result.brief,
  };
}

export async function getAgentLoopStatus(options: {
  cwd: string;
  config: AgentLoopConfig;
  redactPaths?: boolean;
}): Promise<AgentLoopStatusResult> {
  const inGit = await isInsideGitRepo(options.cwd);
  const gitRoot = inGit ? await getGitRoot(options.cwd) : '';
  const resolvedGitRoot = gitRoot ? await resolveComparablePath(gitRoot) : '';
  const gitTargetIsRoot = resolvedGitRoot
    ? resolvedGitRoot === (await resolveComparablePath(options.cwd))
    : false;
  const rawStatus = inGit ? await getGitStatus(options.cwd) : '';
  const changedFiles = await parseGitStatus(rawStatus);
  const agentLoopEvidenceChangedFileCount = changedFiles.filter((file) =>
    isAgentLoopEvidenceFile(file.path),
  ).length;
  const nonEvidenceChangedFileCount = changedFiles.length - agentLoopEvidenceChangedFileCount;
  const dirtyNonEvidenceFileExamples = changedFiles
    .filter((file) => !isAgentLoopEvidenceFile(file.path))
    .slice(0, DIRTY_WORKTREE_EXAMPLE_LIMIT)
    .map((file) => file.path);
  const taskDoctorDiagnostics = (await inspectTaskDirectory(options)).diagnostics;
  const staleTaskState = pickStaleTaskStateDiagnostic(taskDoctorDiagnostics);
  const activeTaskPath = await getActiveTaskPath(options);
  const timestampedPinnedActiveTask = await readTask(options.cwd, activeTaskPath);
  const timestampedActiveTask =
    timestampedPinnedActiveTask?.source === 'agentflight-placeholder'
      ? undefined
      : timestampedPinnedActiveTask;
  const fallbackTaskPath = timestampedActiveTask ? undefined : await getFallbackTaskPath(options);
  const timestampedLatestTask = await readTask(options.cwd, fallbackTaskPath);
  const listedTasks = await listTasks(options);
  const timestampedReport = await readReport(
    options.cwd,
    await latestMarkdownFile(path.join(options.cwd, options.config.paths.reportsDir), {
      pattern: verificationReportPattern,
      rootDir: options.cwd,
    }),
  );
  const taskForEvidence = timestampedActiveTask ?? timestampedLatestTask;
  const currentReport =
    taskForEvidence &&
    timestampedReport &&
    timestampedReport.modifiedAtMs < taskForEvidence.modifiedAtMs &&
    !isPostVerificationTaskState(taskForEvidence)
      ? undefined
      : timestampedReport;
  const activeTask = stripTaskTimestamp(timestampedActiveTask) ?? null;
  const latestTask = stripTaskTimestamp(timestampedLatestTask) ?? null;
  const loopGuidance = await readLoopGuidanceForTask({
    cwd: options.cwd,
    config: options.config,
    task: activeTask ?? latestTask,
  });
  const deferredTasks = listedTasks
    .filter((task) => task.status.trim().toLowerCase() === 'deferred')
    .filter((task) => task.source !== 'agentflight-placeholder')
    .filter((task) => task.path !== activeTask?.path)
    .map((task) => ({
      path: task.path,
      title: task.title,
      status: task.status,
    }));
  const deferredTasksAreReleaseChannel = await allDeferredTasksAreReleaseChannel(
    options.cwd,
    deferredTasks,
  );
  const agentFlightPlaceholderTasks = listedTasks
    .filter((task) => task.source === 'agentflight-placeholder')
    .filter((task) => task.path !== activeTask?.path)
    .map((task) => ({
      path: task.path,
      title: task.title,
      status: task.status,
      source: task.source,
    }));
  const latestReport = stripReportTimestamp(currentReport);
  const latestHandoffPath = await latestMarkdownFile(
    path.join(options.cwd, options.config.paths.handoffsDir),
    {
      pattern: prSummaryPattern,
      rootDir: options.cwd,
    },
  );
  const latestRun = (await listRuns(options.cwd))[0];
  const latestHandoffRunCoversDirtyFiles = await dirtyCoveredByLatestHandoffRun(
    options.cwd,
    changedFiles,
    latestRun,
    undefined,
    latestHandoffPath ?? undefined,
  );
  const configured = DEFAULT_COMMAND_KEYS.filter((key) => options.config.commands[key]);
  const missing = DEFAULT_COMMAND_KEYS.filter((key) => !options.config.commands[key]);
  const activeTaskBlockingSoftSpotCount = await countActiveTaskBlockingSoftSpots(
    options.cwd,
    activeTask,
  );
  const nextAction = chooseNextAction({
    activeTask,
    staleTaskState,
    latestTask,
    deferredTasks,
    deferredTasksAreReleaseChannel,
    latestReport,
    latestRun,
    dirty: changedFiles.length > 0,
    nonEvidenceChangedFileCount,
    dirtyNonEvidenceFileExamples,
    dirtyCoveredByLatestHandoffRun: latestHandoffRunCoversDirtyFiles,
    activeTaskBlockingSoftSpotCount,
  });
  const withoutMarkdown = {
    project: options.config.project,
    git: {
      isRepository: inGit,
      branch: inGit ? await getGitBranch(options.cwd) : '',
      commit: inGit ? await getGitCommit(options.cwd) : '',
      root: redactGitRoot(resolvedGitRoot, options.redactPaths),
      targetIsRoot: gitTargetIsRoot,
    },
    workingTree: {
      dirty: changedFiles.length > 0,
      changedFileCount: changedFiles.length,
      nonEvidenceChangedFileCount,
      agentLoopEvidenceChangedFileCount,
      changedFiles,
    },
    activeTask,
    ...(staleTaskState ? { staleTaskState } : {}),
    latestTask,
    ...(loopGuidance ? { loopGuidance } : {}),
    deferredTasks,
    agentFlightPlaceholderTasks,
    latestReport,
    latestRun,
    commands: {
      configured,
      missing,
    },
    nextAction,
  };

  return {
    ...withoutMarkdown,
    brief: renderBrief(withoutMarkdown),
    markdown: renderMarkdown(withoutMarkdown),
  };
}
