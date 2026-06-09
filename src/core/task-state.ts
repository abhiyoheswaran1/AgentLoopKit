import path from 'node:path';
import { readdir, readFile, rm, stat } from 'node:fs/promises';
import { AgentLoopConfig } from './config.js';
import { AgentLoopError } from './errors.js';
import { pathExists, writeTextFile } from './file-system.js';

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

export const TASK_STATUSES = ['proposed', 'in-progress', 'blocked', 'review', 'done'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

function statePath(cwd: string, config: AgentLoopConfig) {
  return path.join(cwd, config.paths.agentloopDir, 'state.json');
}

function toStoredPath(cwd: string, absolutePath: string) {
  return path.relative(cwd, absolutePath).split(path.sep).join('/');
}

function isInside(parent: string, child: string) {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

async function readState(cwd: string, config: AgentLoopConfig): Promise<TaskState> {
  const filePath = statePath(cwd, config);
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
  await writeTextFile(statePath(cwd, config), `${JSON.stringify(state, null, 2)}\n`);
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
  const tasksRoot = path.resolve(options.cwd, options.config.paths.tasksDir);
  const displayRoot = options.config.paths.tasksDir;

  if (!isInside(tasksRoot, absolutePath)) {
    if (!options.strict) return undefined;
    throw new AgentLoopError(`Active task must be inside ${displayRoot}.`);
  }
  if (!absolutePath.endsWith('.md')) {
    if (!options.strict) return undefined;
    throw new AgentLoopError('Active task must be a Markdown file.');
  }
  const fileStat = await stat(absolutePath).catch(() => undefined);
  if (!fileStat?.isFile()) {
    if (!options.strict) return undefined;
    throw new AgentLoopError(`Task contract not found: ${options.taskPath}`);
  }
  return absolutePath;
}

function extractHeading(markdown: string, fallback: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;
}

function extractTaskStatus(markdown: string) {
  return markdown.match(/^- Status:\s*(.+)$/im)?.[1]?.trim() || 'unknown';
}

function parseTaskStatus(status: string): TaskStatus {
  const clean = status.trim().toLowerCase();
  if ((TASK_STATUSES as readonly string[]).includes(clean)) return clean as TaskStatus;
  throw new AgentLoopError(
    `Unsupported task status "${status}". Use one of: ${TASK_STATUSES.join(', ')}.`,
  );
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

export async function clearActiveTask(options: { cwd: string; config: AgentLoopConfig }) {
  await rm(statePath(options.cwd, options.config), { force: true });
}

export async function listTasks(options: {
  cwd: string;
  config: AgentLoopConfig;
}): Promise<ListedTask[]> {
  const tasksRoot = path.resolve(options.cwd, options.config.paths.tasksDir);
  const entries = await readdir(tasksRoot, { withFileTypes: true }).catch(() => []);
  const activeTaskPath = await getActiveTaskPath(options);

  const tasks = await Promise.all(
    entries
      .filter((entry) => entry.isFile())
      .filter((entry) => entry.name.endsWith('.md') && entry.name !== 'README.md')
      .map(async (entry) => {
        const filePath = path.join(tasksRoot, entry.name);
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
