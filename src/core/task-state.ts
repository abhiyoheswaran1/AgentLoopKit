import path from 'node:path';
import { mkdir, readdir, readFile, rename, rm, stat } from 'node:fs/promises';
import { OutputPathError, resolveOutputArtifactPath } from './artifacts.js';
import { AgentLoopConfig } from './config.js';
import { AgentLoopError } from './errors.js';
import {
  isInsidePath,
  normalizeExistingAncestor,
  pathExists,
  resolvesInsidePath,
  writeTextFile,
} from './file-system.js';
import { findLikelyPostVerificationGates } from './post-verification-gates.js';

type TaskState = {
  version: 1;
  activeTaskPath?: string;
};

export type ActiveTask = {
  path: string;
  title: string;
  status: string;
};

export type ListedTask = ActiveTask & {
  active: boolean;
  modifiedAt: string;
};

export type TaskContract = ActiveTask & {
  content: string;
};

export type ArchivedTask = ActiveTask & {
  previousPath: string;
};

export type BulkTaskArchiveResult = {
  mode: 'bulk';
  status: TaskStatus;
  dryRun: boolean;
  count: number;
  tasks: ArchivedTask[];
};

export type TaskDoctorDiagnostic = {
  id:
    | 'legacy-task-status'
    | 'missing-task-status'
    | 'post-verification-gate-in-verification-commands'
    | 'terminal-task-in-active-folder'
    | 'unsupported-task-status';
  severity: 'warn';
  path: string;
  title: string;
  status: string;
  message: string;
  recommendation: string;
  commands?: string[];
};

export type TaskDoctorResult = {
  overallStatus: 'pass' | 'warn';
  counts: {
    checked: number;
    diagnostics: number;
    terminalTasks: number;
    missingStatuses: number;
    unsupportedStatuses: number;
  };
  diagnostics: TaskDoctorDiagnostic[];
};

export const TASK_STATUSES = [
  'proposed',
  'in-progress',
  'blocked',
  'deferred',
  'review',
  'done',
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export type TaskPathErrorReason = 'outside-tasks-dir' | 'not-markdown' | 'not-found';

export class TaskPathError extends AgentLoopError {
  constructor(
    message: string,
    code: string,
    public readonly requestedTask: string,
    public readonly tasksDir: string,
    public readonly reason: TaskPathErrorReason,
  ) {
    super(message, code);
    this.name = 'TaskPathError';
  }
}

const TERMINAL_TASK_STATUSES = new Set(['done', 'completed', 'verified']);
const NON_FALLBACK_TASK_STATUSES = new Set(['deferred', ...TERMINAL_TASK_STATUSES]);
const LEGACY_TASK_STATUSES = new Set(['completed', 'verified']);

function repoPath(...segments: string[]) {
  return segments.join('/');
}

function resolveStatePath(cwd: string, config: AgentLoopConfig) {
  return resolveOutputArtifactPath({
    cwd,
    artifactType: 'task-state',
    requestedPath: repoPath(config.paths.agentloopDir, 'state.json'),
    expectedDir: config.paths.agentloopDir,
    expectedExtension: '.json',
  });
}

function resolveArchiveDestinationPath(options: {
  cwd: string;
  config: AgentLoopConfig;
  taskFileName: string;
}) {
  return resolveOutputArtifactPath({
    cwd: options.cwd,
    artifactType: 'task-archive',
    requestedPath: repoPath(options.config.paths.tasksDir, 'archive', options.taskFileName),
    expectedDir: repoPath(options.config.paths.tasksDir, 'archive'),
    expectedExtension: '.md',
  });
}

function toStoredPath(cwd: string, absolutePath: string) {
  return path.relative(cwd, absolutePath).split(path.sep).join('/');
}

function tasksRoot(cwd: string, config: AgentLoopConfig) {
  return path.resolve(cwd, config.paths.tasksDir);
}

async function readState(cwd: string, config: AgentLoopConfig): Promise<TaskState> {
  let filePath: string;
  try {
    filePath = resolveStatePath(cwd, config);
  } catch (error) {
    if (error instanceof OutputPathError) return { version: 1 };
    throw error;
  }
  if (!(await pathExists(filePath))) return { version: 1 };
  const raw = await readFile(filePath, 'utf8');
  try {
    const parsed = JSON.parse(raw) as Partial<TaskState>;
    return {
      version: 1,
      activeTaskPath:
        typeof parsed.activeTaskPath === 'string' && parsed.activeTaskPath.trim()
          ? parsed.activeTaskPath
          : undefined,
    };
  } catch {
    return { version: 1 };
  }
}

async function writeState(cwd: string, config: AgentLoopConfig, state: TaskState) {
  await writeTextFile(resolveStatePath(cwd, config), `${JSON.stringify(state, null, 2)}\n`);
}

async function resolveTaskPath(options: {
  cwd: string;
  config: AgentLoopConfig;
  taskPath: string;
  strict: boolean;
}) {
  const absolutePath = path.isAbsolute(options.taskPath)
    ? path.resolve(options.taskPath)
    : path.resolve(options.cwd, options.taskPath);
  const root = tasksRoot(options.cwd, options.config);
  const repoRoot = normalizeExistingAncestor(path.resolve(options.cwd));
  const normalizedRoot = normalizeExistingAncestor(root);
  const displayRoot = options.config.paths.tasksDir;

  if (
    !isInsidePath(repoRoot, normalizedRoot) ||
    !isInsidePath(normalizedRoot, normalizeExistingAncestor(absolutePath))
  ) {
    if (!options.strict) return undefined;
    throw new TaskPathError(
      `Active task must be inside ${displayRoot}.`,
      'TASK_PATH_OUTSIDE_TASKS_DIR',
      options.taskPath,
      displayRoot,
      'outside-tasks-dir',
    );
  }
  if (!absolutePath.endsWith('.md')) {
    if (!options.strict) return undefined;
    throw new TaskPathError(
      'Active task must be a Markdown file.',
      'TASK_PATH_NOT_MARKDOWN',
      options.taskPath,
      displayRoot,
      'not-markdown',
    );
  }
  const fileStat = await stat(absolutePath).catch(() => undefined);
  if (!fileStat?.isFile()) {
    if (!options.strict) return undefined;
    throw new TaskPathError(
      `Task contract not found: ${options.taskPath}`,
      'TASK_CONTRACT_NOT_FOUND',
      options.taskPath,
      displayRoot,
      'not-found',
    );
  }
  return absolutePath;
}

function extractHeading(markdown: string, fallback: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;
}

function extractTaskStatus(markdown: string) {
  return markdown.match(/^- Status:\s*(.+)$/im)?.[1]?.trim() || 'unknown';
}

function extractMarkdownListSection(markdown: string, heading: string) {
  const lines = markdown.split('\n');
  const headingIndex = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (headingIndex === -1) return [];

  const sectionLines: string[] = [];
  for (const line of lines.slice(headingIndex + 1)) {
    if (/^##\s+/.test(line)) break;
    sectionLines.push(line);
  }

  return sectionLines
    .map((line) => line.match(/^\s*-\s+(.+)$/)?.[1]?.trim() ?? '')
    .filter(Boolean);
}

function parseTaskStatus(status: string): TaskStatus {
  const clean = status.trim().toLowerCase();
  if ((TASK_STATUSES as readonly string[]).includes(clean)) return clean as TaskStatus;
  throw new AgentLoopError(
    `Unsupported task status "${status}". Use one of: ${TASK_STATUSES.join(', ')}.`,
    'UNSUPPORTED_TASK_STATUS',
  );
}

function assertBulkArchiveStatus(status: TaskStatus) {
  if (status === 'done') return;
  throw new AgentLoopError(
    `Bulk archive only supports terminal task status "done". Archive "${status}" tasks one at a time.`,
    'TASK_ARCHIVE_STATUS_NOT_TERMINAL',
  );
}

function isFallbackTaskCandidate(status: string) {
  const clean = status.trim().toLowerCase();
  return clean !== 'unknown' && !NON_FALLBACK_TASK_STATUSES.has(clean);
}

export async function readTaskMetadata(cwd: string, filePath: string): Promise<ActiveTask> {
  const markdown = await readFile(filePath, 'utf8');
  return {
    path: toStoredPath(cwd, filePath),
    title: extractHeading(markdown, path.basename(filePath, '.md')),
    status: extractTaskStatus(markdown),
  };
}

export async function readTaskContract(options: {
  cwd: string;
  config: AgentLoopConfig;
  taskPath: string;
}): Promise<TaskContract> {
  const absolutePath = await resolveTaskPath({ ...options, strict: true });
  if (!absolutePath) throw new AgentLoopError(`Task contract not found: ${options.taskPath}`);
  const content = await readFile(absolutePath, 'utf8');
  return {
    ...(await readTaskMetadata(options.cwd, absolutePath)),
    content,
  };
}

export async function setActiveTask(options: {
  cwd: string;
  config: AgentLoopConfig;
  taskPath: string;
}) {
  const absolutePath = await resolveTaskPath({ ...options, strict: true });
  if (!absolutePath) throw new AgentLoopError(`Task contract not found: ${options.taskPath}`);
  const activeTaskPath = toStoredPath(options.cwd, absolutePath);
  await writeState(options.cwd, options.config, { version: 1, activeTaskPath });
  return readTaskMetadata(options.cwd, absolutePath);
}

export async function updateTaskStatus(options: {
  cwd: string;
  config: AgentLoopConfig;
  taskPath: string;
  status: string;
}) {
  const absolutePath = await resolveTaskPath({ ...options, strict: true });
  if (!absolutePath) throw new AgentLoopError(`Task contract not found: ${options.taskPath}`);
  const status = parseTaskStatus(options.status);
  const content = await readFile(absolutePath, 'utf8');

  if (!/^- Status:\s*.+$/im.test(content)) {
    throw new AgentLoopError(`Task contract does not contain a Status line: ${options.taskPath}`);
  }

  await writeTextFile(absolutePath, content.replace(/^(- Status:\s*).+$/im, `$1${status}`));
  return readTaskMetadata(options.cwd, absolutePath);
}

export async function archiveTask(options: {
  cwd: string;
  config: AgentLoopConfig;
  taskPath: string;
}): Promise<ArchivedTask> {
  const absolutePath = await resolveTaskPath({ ...options, strict: true });
  if (!absolutePath) throw new AgentLoopError(`Task contract not found: ${options.taskPath}`);

  const root = tasksRoot(options.cwd, options.config);
  const archiveRoot = path.join(root, 'archive');
  if (path.dirname(absolutePath) === archiveRoot) {
    throw new AgentLoopError(`Task contract is already archived: ${options.taskPath}`);
  }

  const destinationPath = resolveArchiveDestinationPath({
    cwd: options.cwd,
    config: options.config,
    taskFileName: path.basename(absolutePath),
  });
  if (await pathExists(destinationPath)) {
    throw new AgentLoopError(
      `Archived task already exists: ${toStoredPath(options.cwd, destinationPath)}`,
    );
  }

  const previousPath = toStoredPath(options.cwd, absolutePath);
  const activeTaskPath = await getActiveTaskPath(options);
  await mkdir(path.dirname(destinationPath), { recursive: true });
  await rename(absolutePath, destinationPath);
  if (activeTaskPath === absolutePath) {
    await clearActiveTask(options);
  }

  return {
    ...(await readTaskMetadata(options.cwd, destinationPath)),
    previousPath,
  };
}

export async function archiveTasksByStatus(options: {
  cwd: string;
  config: AgentLoopConfig;
  status: string;
  dryRun?: boolean;
}): Promise<BulkTaskArchiveResult> {
  const status = parseTaskStatus(options.status);
  assertBulkArchiveStatus(status);

  const tasks = (await listTasks(options))
    .filter((task) => task.status.trim().toLowerCase() === status)
    .sort((left, right) => left.path.localeCompare(right.path));

  const plannedTasks = await Promise.all(
    tasks.map(async (task) => {
      const destinationPath = resolveArchiveDestinationPath({
        cwd: options.cwd,
        config: options.config,
        taskFileName: path.basename(task.path),
      });
      if (await pathExists(destinationPath)) {
        throw new AgentLoopError(
          `Archived task already exists: ${toStoredPath(options.cwd, destinationPath)}`,
        );
      }
      return {
        previousPath: task.path,
        path: toStoredPath(options.cwd, destinationPath),
        title: task.title,
        status: task.status,
      };
    }),
  );

  if (options.dryRun) {
    return {
      mode: 'bulk',
      status,
      dryRun: true,
      count: plannedTasks.length,
      tasks: plannedTasks,
    };
  }

  const archivedTasks: ArchivedTask[] = [];
  for (const task of plannedTasks) {
    archivedTasks.push(
      await archiveTask({ cwd: options.cwd, config: options.config, taskPath: task.previousPath }),
    );
  }

  return {
    mode: 'bulk',
    status,
    dryRun: false,
    count: archivedTasks.length,
    tasks: archivedTasks,
  };
}

export async function getActiveTaskPath(options: { cwd: string; config: AgentLoopConfig }) {
  const state = await readState(options.cwd, options.config);
  if (!state.activeTaskPath) return undefined;
  return resolveTaskPath({
    cwd: options.cwd,
    config: options.config,
    taskPath: state.activeTaskPath,
    strict: false,
  });
}

export async function getActiveTask(options: { cwd: string; config: AgentLoopConfig }) {
  const activeTaskPath = await getActiveTaskPath(options);
  return activeTaskPath ? readTaskMetadata(options.cwd, activeTaskPath) : undefined;
}

export async function getFallbackTaskPath(options: { cwd: string; config: AgentLoopConfig }) {
  const task = (await listTasks(options)).find((candidate) =>
    isFallbackTaskCandidate(candidate.status),
  );
  return task ? path.resolve(options.cwd, task.path) : undefined;
}

export async function clearActiveTask(options: { cwd: string; config: AgentLoopConfig }) {
  await rm(resolveStatePath(options.cwd, options.config), { force: true });
}

export async function listTasks(options: {
  cwd: string;
  config: AgentLoopConfig;
}): Promise<ListedTask[]> {
  const root = tasksRoot(options.cwd, options.config);
  if (!resolvesInsidePath(options.cwd, root)) return [];
  const entries = await readdir(root, { withFileTypes: true }).catch(() => []);
  const activeTaskPath = await getActiveTaskPath(options);

  const tasks = await Promise.all(
    entries
      .filter((entry) => entry.isFile())
      .filter((entry) => entry.name.endsWith('.md') && entry.name !== 'README.md')
      .map(async (entry) => {
        const filePath = path.join(root, entry.name);
        const [metadata, fileStat] = await Promise.all([
          readTaskMetadata(options.cwd, filePath),
          stat(filePath),
        ]);
        return {
          ...metadata,
          active: activeTaskPath === filePath,
          modifiedAt: fileStat.mtime.toISOString(),
          modifiedMs: fileStat.mtimeMs,
        };
      }),
  );

  return tasks
    .sort((left, right) => {
      if (left.active !== right.active) return left.active ? -1 : 1;
      if (left.modifiedMs !== right.modifiedMs) return right.modifiedMs - left.modifiedMs;
      return left.path.localeCompare(right.path);
    })
    .map((task) => ({
      path: task.path,
      title: task.title,
      status: task.status,
      active: task.active,
      modifiedAt: task.modifiedAt,
    }));
}

export async function inspectTaskDirectory(options: {
  cwd: string;
  config: AgentLoopConfig;
}): Promise<TaskDoctorResult> {
  const tasks = await listTasks(options);
  const diagnostics: TaskDoctorDiagnostic[] = [];

  for (const task of tasks) {
    const status = task.status.trim().toLowerCase();
    const taskContent = await readFile(path.resolve(options.cwd, task.path), 'utf8');
    if (status === 'unknown') {
      diagnostics.push({
        id: 'missing-task-status',
        severity: 'warn',
        path: task.path,
        title: task.title,
        status,
        message: 'Task contract has no supported Status line.',
        recommendation:
          'Add a `- Status: proposed` line or recreate the contract with `agentloop create-task`.',
      });
      continue;
    }

    if (LEGACY_TASK_STATUSES.has(status)) {
      diagnostics.push({
        id: 'legacy-task-status',
        severity: 'warn',
        path: task.path,
        title: task.title,
        status,
        message: `Task contract uses legacy terminal status "${status}".`,
        recommendation: `Run \`agentloop task status ${task.path} done\`, then archive it after verification and handoff.`,
      });
      continue;
    }

    if (!(TASK_STATUSES as readonly string[]).includes(status)) {
      diagnostics.push({
        id: 'unsupported-task-status',
        severity: 'warn',
        path: task.path,
        title: task.title,
        status,
        message: `Task contract uses unsupported status "${task.status}".`,
        recommendation: `Run \`agentloop task status ${task.path} proposed\` or another supported status.`,
      });
      continue;
    }

    if (status === 'done') {
      diagnostics.push({
        id: 'terminal-task-in-active-folder',
        severity: 'warn',
        path: task.path,
        title: task.title,
        status,
        message: 'Terminal task contract is still in the active task folder.',
        recommendation: `Run \`agentloop task archive ${task.path}\` after verification and handoff.`,
      });
      continue;
    }

    const misplacedPostVerificationGates = findLikelyPostVerificationGates(
      extractMarkdownListSection(taskContent, 'Verification Commands'),
    );
    if (misplacedPostVerificationGates.length > 0) {
      diagnostics.push({
        id: 'post-verification-gate-in-verification-commands',
        severity: 'warn',
        path: task.path,
        title: task.title,
        status,
        message:
          'Task contract records likely post-verification gate command(s) under Verification Commands.',
        recommendation:
          'Move the listed command(s) from Verification Commands to Post-Verification Gates.',
        commands: misplacedPostVerificationGates,
      });
    }
  }

  diagnostics.sort((left, right) => {
    const byId = left.id.localeCompare(right.id);
    if (byId !== 0) return byId;
    return left.path.localeCompare(right.path);
  });

  return {
    overallStatus: diagnostics.length === 0 ? 'pass' : 'warn',
    counts: {
      checked: tasks.length,
      diagnostics: diagnostics.length,
      terminalTasks: tasks.filter((task) =>
        TERMINAL_TASK_STATUSES.has(task.status.trim().toLowerCase()),
      ).length,
      missingStatuses: tasks.filter((task) => task.status.trim().toLowerCase() === 'unknown')
        .length,
      unsupportedStatuses: tasks.filter((task) => {
        const status = task.status.trim().toLowerCase();
        return status !== 'unknown' && !(TASK_STATUSES as readonly string[]).includes(status);
      }).length,
    },
    diagnostics,
  };
}
