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
import { latestMarkdownFile } from './artifacts.js';
import { verificationReportPattern } from './artifacts.js';
import { dirtyCoveredByLatestHandoffRun } from './handoff-coverage.js';
import { inlineCode } from './markdown-format.js';
import { listRuns, RunSummary } from './runs.js';
import { getActiveTaskPath, getFallbackTaskPath, listTasks } from './task-state.js';

export type StatusArtifact = {
  path: string;
  title: string;
};

export type StatusTask = StatusArtifact & {
  status: string;
};

export type StatusReport = StatusArtifact & {
  overallStatus: string;
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
    changedFiles: GitFileStatus[];
  };
  activeTask: StatusTask | null;
  latestTask: StatusTask | null;
  deferredTasks: StatusTask[];
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

function extractHeading(markdown: string, fallback: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;
}

function extractTaskStatus(markdown: string) {
  return markdown.match(/^- Status:\s*(.+)$/im)?.[1]?.trim() || 'unknown';
}

function extractOverallStatus(markdown: string) {
  return markdown.match(/Overall status:\s*([a-z-]+)/i)?.[1]?.trim() || 'unknown';
}

async function readTask(
  cwd: string,
  filePath: string | undefined,
): Promise<Timestamped<StatusTask> | undefined> {
  if (!filePath) return undefined;
  const markdown = await readFile(filePath, 'utf8');
  const fileStat = await stat(filePath);
  return {
    path: path.relative(cwd, filePath),
    title: extractHeading(markdown, path.basename(filePath, '.md')),
    status: extractTaskStatus(markdown),
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
    path: path.relative(cwd, filePath),
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

function chooseNextAction(input: {
  activeTask: StatusTask | null;
  latestTask: StatusTask | null;
  deferredTasks: StatusTask[];
  latestReport?: StatusReport;
  latestRun?: RunSummary;
  dirty: boolean;
  dirtyCoveredByLatestHandoffRun: boolean;
}) {
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
      if (!input.dirty) {
        return {
          command: 'none',
          reason: `${count} deferred task contract${count === 1 ? ' is' : 's are'} parked, and the repo is clean. Start a new task only when there is current work, or move a deferred task back to proposed when it is ready.`,
        };
      }
      return {
        command: 'agentloop create-task',
        reason: `${count} deferred task contract${count === 1 ? ' is' : 's are'} parked. Create a new task for current work, or move a deferred task back to proposed when it is ready.`,
      };
    }
    return {
      command: 'agentloop create-task',
      reason: 'No task contract was found.',
    };
  }
  if (input.activeTask.status.trim().toLowerCase() === 'done') {
    return {
      command: `agentloop task archive ${input.activeTask.path}`,
      reason:
        'The active task is done. Archive it to clear the active pointer before starting the next task.',
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
  return values.length ? values.map((value) => inlineCode(value)).join(', ') : 'none';
}

function formatTaskMarkdown(task: StatusTask | null | undefined) {
  if (!task) return 'No open task found.';
  return `${inlineCode(task.title)} (${inlineCode(task.status)}) - ${inlineCode(task.path)}`;
}

function formatReportMarkdown(report: StatusReport | undefined) {
  if (!report) return 'No verification report found.';
  return `${inlineCode(report.overallStatus)} - ${inlineCode(report.path)}`;
}

function formatRunSummaryMarkdown(run: RunSummary | undefined) {
  if (!run) return 'No run ledger entries found.';
  const result =
    run.score === undefined
      ? run.overallStatus
        ? inlineCode(run.overallStatus)
        : `${inlineCode(String(run.changedFileCount))} changed file(s)`
      : `${inlineCode(String(run.score))}/100`;
  const artifactPath = run.shipReportPath ?? run.handoffPath ?? run.verificationReportPath;
  return `${inlineCode(run.command)} ${result} - ${inlineCode(run.id)}${
    artifactPath ? ` - ${inlineCode(artifactPath)}` : ''
  }`;
}

function formatDeferredTaskSummaryMarkdown(tasks: StatusTask[]) {
  if (!tasks.length) return 'none';
  const count = tasks.length;
  const titles = tasks
    .slice(0, 3)
    .map((task) => inlineCode(task.title))
    .join(', ');
  const remaining = count > 3 ? `, +${count - 3} more` : '';
  return `${count} parked - ${titles}${remaining}`;
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

function renderBrief(result: StatusRenderInput) {
  const task = result.activeTask ?? result.latestTask;
  const taskTitle = task?.title ?? 'none';
  const taskStatus = task?.status ?? 'none';
  const verification = result.latestReport?.overallStatus ?? 'missing';
  const run = result.latestRun
    ? result.latestRun.score === undefined
      ? `${result.latestRun.command} ${result.latestRun.overallStatus ?? `${result.latestRun.changedFileCount} files`}`
      : `${result.latestRun.command} ${result.latestRun.score}/100`
    : 'none';
  const tree = result.workingTree.dirty
    ? `dirty (${result.workingTree.changedFileCount})`
    : 'clean';

  return `AgentLoopKit: task=${formatBriefValue(taskTitle)} status=${formatBriefValue(taskStatus)}; verification=${verification}; run=${formatBriefValue(run)}; tree=${tree}; next=${formatBriefValue(result.nextAction.command)}
Reason: ${result.nextAction.reason}`;
}

function renderMarkdown(result: StatusRenderInput) {
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
          ...(result.git.targetIsRoot
            ? []
            : [
                '- Git target warning: AgentLoopKit files live in the current directory, not the Git root.',
              ]),
        ]
      : []),
  ];
  const workingTree = result.workingTree.dirty
    ? `dirty (${result.workingTree.changedFileCount} changed file(s))`
    : 'clean';
  const activeTask = result.activeTask
    ? formatTaskMarkdown(result.activeTask)
    : result.latestTask
      ? 'none pinned.'
      : result.deferredTasks.length
        ? `none active; ${result.deferredTasks.length} deferred task${result.deferredTasks.length === 1 ? '' : 's'} parked.`
        : 'No task contract found.';
  const latestTask = formatTaskMarkdown(result.latestTask);
  const latestReport = formatReportMarkdown(result.latestReport);
  const latestRun = formatRunSummaryMarkdown(result.latestRun);

  const nextAction =
    result.nextAction.command === 'none'
      ? `No command required.\n\n${result.nextAction.reason}`
      : `Run ${inlineCode(result.nextAction.command)}.\n\n${result.nextAction.reason}`;

  return `# AgentLoopKit Status

- Project: ${inlineCode(result.project.name || 'unnamed')} (${inlineCode(result.project.type)})
- Package manager: ${inlineCode(result.project.packageManager)}
${gitLines.join('\n')}
- Working tree: ${inlineCode(workingTree)}
- Active task: ${activeTask}
- Latest open task: ${latestTask}
- Deferred tasks: ${formatDeferredTaskSummaryMarkdown(result.deferredTasks)}
- Latest verification: ${latestReport}
- Latest run: ${latestRun}
- Configured commands: ${formatMarkdownList(result.commands.configured)}
- Missing commands: ${formatMarkdownList(result.commands.missing)}

## Next Action

${nextAction}
`;
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
  const activeTaskPath = await getActiveTaskPath(options);
  const timestampedActiveTask = await readTask(options.cwd, activeTaskPath);
  const fallbackTaskPath = activeTaskPath ? undefined : await getFallbackTaskPath(options);
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
  const deferredTasks = listedTasks
    .filter((task) => task.status.trim().toLowerCase() === 'deferred')
    .filter((task) => task.path !== activeTask?.path)
    .map((task) => ({
      path: task.path,
      title: task.title,
      status: task.status,
    }));
  const latestReport = stripReportTimestamp(currentReport);
  const latestRun = (await listRuns(options.cwd))[0];
  const latestHandoffRunCoversDirtyFiles = await dirtyCoveredByLatestHandoffRun(
    options.cwd,
    changedFiles,
    latestRun,
  );
  const configured = DEFAULT_COMMAND_KEYS.filter((key) => options.config.commands[key]);
  const missing = DEFAULT_COMMAND_KEYS.filter((key) => !options.config.commands[key]);
  const nextAction = chooseNextAction({
    activeTask,
    latestTask,
    deferredTasks,
    latestReport,
    latestRun,
    dirty: changedFiles.length > 0,
    dirtyCoveredByLatestHandoffRun: latestHandoffRunCoversDirtyFiles,
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
      changedFiles,
    },
    activeTask,
    latestTask,
    deferredTasks,
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
