import path from 'node:path';
import { readFile, stat } from 'node:fs/promises';
import { AgentLoopConfig } from './config.js';
import { latestMarkdownFile, verificationReportPattern } from './artifacts.js';
import { getActiveTaskPath, getFallbackTaskPath } from './task-state.js';
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

export async function getCurrentTaskPath(options: { cwd: string; config: AgentLoopConfig }) {
  return (await getActiveTaskPath(options)) ?? (await getFallbackTaskPath(options));
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
}): Promise<CurrentVerificationEvidence> {
  if (!options.reportPath) return {};
  if (!options.taskPath) {
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
