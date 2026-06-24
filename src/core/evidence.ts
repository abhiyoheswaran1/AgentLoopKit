import path from 'node:path';
import { readFile, stat } from 'node:fs/promises';
import { AgentLoopConfig } from './config.js';
import { latestMarkdownFile, verificationReportPattern } from './artifacts.js';
import { getActiveTaskPath, getFallbackTaskPath, readTaskMetadata } from './task-state.js';
import { pathExists, resolvesInsidePath } from './file-system.js';
import { listRuns } from './runs.js';

export type CurrentVerificationEvidence = {
  currentReportPath?: string;
  latestReportPath?: string;
  staleReport?: {
    path: string;
    relativePath: string;
    message: string;
  };
};

export type CurrentTaskVerificationEvidence = CurrentVerificationEvidence & {
  taskPath?: string;
};

const STALE_VERIFICATION_MESSAGE =
  'Latest verification report predates the current task. Rerun verification.';
const PREVIOUS_VERIFICATION_MESSAGE =
  'Latest verification report has no current task. Treat it as previous evidence until a task is created or pinned.';
const CURRENT_WORK_TASK_STATUSES = new Set(['proposed', 'in-progress', 'blocked', 'review']);

function relativePath(cwd: string, filePath: string) {
  return path.relative(cwd, filePath).split(path.sep).join('/') || '.';
}

function extractTaskStatus(markdown: string) {
  return markdown.match(/^- Status:\s*(.+)$/im)?.[1]?.trim() || 'unknown';
}

function isPostVerificationTaskStatus(status: string) {
  const normalized = status.trim().toLowerCase();
  return normalized === 'review' || normalized === 'done';
}

function isArchivedTaskPath(options: { cwd: string; config: AgentLoopConfig; taskPath: string }) {
  return resolvesInsidePath(
    path.resolve(options.cwd, options.config.paths.tasksDir, 'archive'),
    options.taskPath,
  );
}

export async function getCurrentTaskPath(options: { cwd: string; config: AgentLoopConfig }) {
  const activeTaskPath = await getActiveTaskPath(options);
  if (activeTaskPath) {
    const activeTask = await readTaskMetadata(options.cwd, activeTaskPath);
    if (activeTask.source !== 'agentflight-placeholder') return activeTaskPath;
  }
  return getFallbackTaskPath(options);
}

export async function getCurrentWorkTaskPath(options: { cwd: string; config: AgentLoopConfig }) {
  const activeTaskPath = await getActiveTaskPath(options);
  if (activeTaskPath) {
    const activeTask = await readTaskMetadata(options.cwd, activeTaskPath);
    const status = activeTask.status.trim().toLowerCase();
    if (
      !activeTask.source &&
      CURRENT_WORK_TASK_STATUSES.has(status) &&
      !isArchivedTaskPath({ ...options, taskPath: activeTaskPath })
    ) {
      return activeTaskPath;
    }
  }
  return getFallbackTaskPath(options);
}

async function resolveLatestRunTaskPath(options: { cwd: string; config: AgentLoopConfig }) {
  const latestRunWithTask = (await listRuns(options.cwd)).find((run) => run.task?.path);
  const runTaskPath = latestRunWithTask?.task?.path;
  if (!runTaskPath || !runTaskPath.endsWith('.md')) return undefined;

  const tasksRoot = path.resolve(options.cwd, options.config.paths.tasksDir);
  const archiveRoot = path.join(tasksRoot, 'archive');
  const candidates = [
    path.resolve(options.cwd, runTaskPath),
    path.join(archiveRoot, path.basename(runTaskPath)),
  ];

  for (const candidate of candidates) {
    if (
      candidate.endsWith('.md') &&
      resolvesInsidePath(tasksRoot, candidate) &&
      resolvesInsidePath(options.cwd, candidate) &&
      (await pathExists(candidate))
    ) {
      return candidate;
    }
  }
  return undefined;
}

export async function getCurrentOrLatestRunTaskPath(options: {
  cwd: string;
  config: AgentLoopConfig;
}) {
  return (await getCurrentTaskPath(options)) ?? (await resolveLatestRunTaskPath(options));
}

export async function getLatestVerificationReportPath(options: {
  cwd: string;
  config: AgentLoopConfig;
}) {
  return latestMarkdownFile(path.join(options.cwd, options.config.paths.reportsDir), {
    pattern: verificationReportPattern,
    rootDir: options.cwd,
  });
}

export async function resolveCurrentVerificationEvidence(options: {
  cwd: string;
  taskPath?: string;
  reportPath?: string;
  previousWhenNoTask?: boolean;
}): Promise<CurrentVerificationEvidence> {
  if (!options.reportPath) return {};
  if (!options.taskPath) {
    if (options.previousWhenNoTask) {
      return {
        latestReportPath: options.reportPath,
        staleReport: {
          path: options.reportPath,
          relativePath: relativePath(options.cwd, options.reportPath),
          message: PREVIOUS_VERIFICATION_MESSAGE,
        },
      };
    }
    return {
      currentReportPath: options.reportPath,
      latestReportPath: options.reportPath,
    };
  }

  const [taskStat, reportStat, taskMarkdown] = await Promise.all([
    stat(options.taskPath),
    stat(options.reportPath),
    readFile(options.taskPath, 'utf8'),
  ]);

  if (
    reportStat.mtimeMs < taskStat.mtimeMs &&
    !isPostVerificationTaskStatus(extractTaskStatus(taskMarkdown))
  ) {
    return {
      latestReportPath: options.reportPath,
      staleReport: {
        path: options.reportPath,
        relativePath: relativePath(options.cwd, options.reportPath),
        message: STALE_VERIFICATION_MESSAGE,
      },
    };
  }

  return {
    currentReportPath: options.reportPath,
    latestReportPath: options.reportPath,
  };
}

export async function resolveCurrentTaskVerificationEvidence(options: {
  cwd: string;
  config: AgentLoopConfig;
}): Promise<CurrentTaskVerificationEvidence> {
  const taskPath = await getCurrentTaskPath(options);
  const reportPath = await getLatestVerificationReportPath(options);
  return {
    taskPath,
    ...(await resolveCurrentVerificationEvidence({
      cwd: options.cwd,
      taskPath,
      reportPath,
    })),
  };
}

export async function resolveCurrentWorkTaskVerificationEvidence(options: {
  cwd: string;
  config: AgentLoopConfig;
}): Promise<CurrentTaskVerificationEvidence> {
  const taskPath = await getCurrentWorkTaskPath(options);
  const reportPath = await getLatestVerificationReportPath(options);
  return {
    taskPath,
    ...(await resolveCurrentVerificationEvidence({
      cwd: options.cwd,
      taskPath,
      reportPath,
      previousWhenNoTask: true,
    })),
  };
}

export async function resolveCurrentOrLatestRunTaskVerificationEvidence(options: {
  cwd: string;
  config: AgentLoopConfig;
}): Promise<CurrentTaskVerificationEvidence> {
  const taskPath = await getCurrentOrLatestRunTaskPath(options);
  const reportPath = await getLatestVerificationReportPath(options);
  return {
    taskPath,
    ...(await resolveCurrentVerificationEvidence({
      cwd: options.cwd,
      taskPath,
      reportPath,
    })),
  };
}
