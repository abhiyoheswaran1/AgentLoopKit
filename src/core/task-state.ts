import path from 'node:path';
import { mkdir, readdir, readFile, rename, rm, stat } from 'node:fs/promises';
import {
  OutputPathError,
  resolveOutputArtifactPath,
  verificationReportPattern,
} from './artifact-paths.js';
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

export type TaskSource = 'agentflight-placeholder';

export type ActiveTask = {
  path: string;
  title: string;
  status: string;
  source?: TaskSource;
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
    | 'active-task-archived'
    | 'active-task-agentflight-placeholder'
    | 'active-task-deferred'
    | 'active-task-missing'
    | 'active-task-older-than-runs'
    | 'active-task-terminal'
    | 'legacy-task-status'
    | 'missing-task-status'
    | 'placeholder-task-section'
    | 'post-verification-gate-in-verification-commands'
    | 'recent-evidence-without-active-task'
    | 'terminal-task-in-active-folder'
    | 'unsupported-task-status';
  severity: 'warn';
  path: string;
  title: string;
  status: string;
  message: string;
  recommendation: string;
  commands?: string[];
  evidence?: string[];
  sections?: string[];
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
const OPEN_TASK_STATUSES = new Set(['proposed', 'in-progress', 'blocked', 'review']);
const TASK_DOCTOR_TASK_LIMIT = 25;
const TASK_DOCTOR_RECENT_RUN_LIMIT = 10;
const TASK_DOCTOR_RECENT_REPORT_LIMIT = 10;
const TASK_DOCTOR_MAX_EVIDENCE_FILE_BYTES = 64 * 1024;
const REVIEW_CRITICAL_PLACEHOLDERS = [
  {
    heading: 'Problem Statement',
    placeholder: 'Describe the problem this task should solve.',
  },
  {
    heading: 'Desired Outcome',
    placeholder: 'Describe the concrete result expected from this task.',
  },
  {
    heading: 'Likely Files or Areas',
    placeholder: 'None recorded yet.',
  },
  {
    heading: 'Acceptance Criteria',
    placeholder: 'Add acceptance criteria before implementation starts.',
  },
  {
    heading: 'Verification Commands',
    placeholder: 'No verification command recorded.',
  },
  {
    heading: 'Rollback Notes',
    placeholder: 'Document how to revert or disable this change.',
  },
] as const;

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

function taskArchiveRoot(cwd: string, config: AgentLoopConfig) {
  return path.join(tasksRoot(cwd, config), 'archive');
}

type RecentTaskEvidence = {
  path: string;
  source: 'run' | 'report';
  modifiedMs: number;
  taskPath?: string | null;
};

async function listRecentRunEvidence(cwd: string): Promise<RecentTaskEvidence[]> {
  const root = path.resolve(cwd, '.agentloop/runs');
  if (!resolvesInsidePath(cwd, root)) return [];
  const entries = await readdir(root, { withFileTypes: true }).catch(() => []);
  const evidence: RecentTaskEvidence[] = [];

  for (const entry of entries
    .filter((candidate) => candidate.isDirectory())
    .sort((left, right) => right.name.localeCompare(left.name))
    .slice(0, TASK_DOCTOR_RECENT_RUN_LIMIT)) {
    const metadataPath = path.join(root, entry.name, 'metadata.json');
    const metadataStat = await stat(metadataPath).catch(() => undefined);
    if (!metadataStat?.isFile()) continue;
    let taskPath: string | null | undefined;
    let createdAtEpochMs: number | undefined;
    if (metadataStat.size <= TASK_DOCTOR_MAX_EVIDENCE_FILE_BYTES) {
      try {
        const parsed = JSON.parse(await readFile(metadataPath, 'utf8')) as {
          createdAtEpochMs?: unknown;
          task?: { path?: unknown } | null;
        };
        createdAtEpochMs =
          typeof parsed.createdAtEpochMs === 'number' && Number.isFinite(parsed.createdAtEpochMs)
            ? parsed.createdAtEpochMs
            : undefined;
        taskPath =
          parsed.task && typeof parsed.task.path === 'string'
            ? parsed.task.path
            : parsed.task === null
              ? null
              : undefined;
      } catch {
        taskPath = undefined;
      }
    }
    evidence.push({
      path: toStoredPath(cwd, metadataPath),
      source: 'run',
      modifiedMs: createdAtEpochMs ?? metadataStat.mtimeMs,
      taskPath,
    });
  }

  return evidence;
}

async function listRecentReportEvidence(
  cwd: string,
  config: AgentLoopConfig,
): Promise<RecentTaskEvidence[]> {
  const root = path.resolve(cwd, config.paths.reportsDir);
  if (!resolvesInsidePath(cwd, root)) return [];
  const entries = await readdir(root, { withFileTypes: true }).catch(() => []);
  const evidence: RecentTaskEvidence[] = [];

  for (const entry of entries
    .filter((candidate) => candidate.isFile())
    .filter((candidate) => verificationReportPattern.test(candidate.name))
    .sort((left, right) => right.name.localeCompare(left.name))
    .slice(0, TASK_DOCTOR_RECENT_REPORT_LIMIT)) {
    const reportPath = path.join(root, entry.name);
    const reportStat = await stat(reportPath).catch(() => undefined);
    if (!reportStat?.isFile()) continue;
    evidence.push({
      path: toStoredPath(cwd, reportPath),
      source: 'report',
      modifiedMs: reportStat.mtimeMs,
    });
  }

  return evidence;
}

async function listRecentTaskEvidence(options: {
  cwd: string;
  config: AgentLoopConfig;
}): Promise<RecentTaskEvidence[]> {
  const [runs, reports] = await Promise.all([
    listRecentRunEvidence(options.cwd),
    listRecentReportEvidence(options.cwd, options.config),
  ]);
  return [...runs, ...reports].sort((left, right) => {
    if (left.modifiedMs !== right.modifiedMs) return right.modifiedMs - left.modifiedMs;
    return right.path.localeCompare(left.path);
  });
}

function hasOpenRealTask(tasks: ListedTask[]) {
  return tasks.some(
    (task) => !task.source && OPEN_TASK_STATUSES.has(task.status.trim().toLowerCase()),
  );
}

function taskPathBasename(taskPath: string) {
  return path.basename(taskPath.replace(/\\/g, '/'));
}

async function resolveArchivedTaskPathForEvidence(options: {
  cwd: string;
  config: AgentLoopConfig;
  taskPath: string;
}) {
  const absoluteTaskPath = path.isAbsolute(options.taskPath)
    ? path.resolve(options.taskPath)
    : path.resolve(options.cwd, options.taskPath);
  const root = tasksRoot(options.cwd, options.config);
  const archiveRoot = taskArchiveRoot(options.cwd, options.config);

  if (
    !absoluteTaskPath.endsWith('.md') ||
    !isInsidePath(normalizeExistingAncestor(root), normalizeExistingAncestor(absoluteTaskPath)) ||
    isInsidePath(
      normalizeExistingAncestor(archiveRoot),
      normalizeExistingAncestor(absoluteTaskPath),
    )
  ) {
    return undefined;
  }

  return resolveTaskPath({
    cwd: options.cwd,
    config: options.config,
    taskPath: path.join(archiveRoot, taskPathBasename(options.taskPath)),
    strict: false,
  });
}

async function latestEvidenceResolvesToArchivedTerminalTask(
  options: { cwd: string; config: AgentLoopConfig },
  evidence: RecentTaskEvidence | undefined,
) {
  if (evidence?.source !== 'run' || !evidence.taskPath) return false;
  const directTaskPath = await resolveTaskPath({
    cwd: options.cwd,
    config: options.config,
    taskPath: evidence.taskPath,
    strict: false,
  });
  const taskPath =
    directTaskPath ??
    (await resolveArchivedTaskPathForEvidence({
      cwd: options.cwd,
      config: options.config,
      taskPath: evidence.taskPath,
    }));
  if (!taskPath || !isInsidePath(taskArchiveRoot(options.cwd, options.config), taskPath)) {
    return false;
  }
  const task = await readTaskMetadata(options.cwd, taskPath);
  return !task.source && TERMINAL_TASK_STATUSES.has(task.status.trim().toLowerCase());
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

  return sectionLines.map((line) => line.match(/^\s*-\s+(.+)$/)?.[1]?.trim() ?? '').filter(Boolean);
}

function extractMarkdownSectionLines(markdown: string, heading: string) {
  const lines = markdown.split('\n');
  const headingIndex = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (headingIndex === -1) return [];

  const sectionLines: string[] = [];
  for (const line of lines.slice(headingIndex + 1)) {
    if (/^##\s+/.test(line)) break;
    sectionLines.push(line);
  }

  return sectionLines.map((line) => line.trim()).filter(Boolean);
}

function normalizeTaskSectionLine(line: string) {
  return line
    .replace(/^\s*-\s+/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function findPlaceholderTaskSections(markdown: string) {
  const sections: string[] = [];

  for (const { heading, placeholder } of REVIEW_CRITICAL_PLACEHOLDERS) {
    const sectionLines = extractMarkdownSectionLines(markdown, heading);
    if (sectionLines.some((line) => normalizeTaskSectionLine(line) === placeholder)) {
      sections.push(heading);
    }
  }

  return sections;
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

function detectTaskSource(markdown: string, title: string): TaskSource | undefined {
  const normalized = markdown.replace(/\r\n/g, '\n');
  if (
    normalized.startsWith(`# ${title}\n`) &&
    normalized.includes(`\n## Problem Statement\nAgentFlight session task: ${title}\n`) &&
    normalized.includes(
      '\n## Desired Outcome\nTask is implemented with local verification evidence.\n',
    )
  ) {
    return 'agentflight-placeholder';
  }
  return undefined;
}

function isFallbackTaskCandidate(task: Pick<ActiveTask, 'status' | 'source'>) {
  if (task.source === 'agentflight-placeholder') return false;
  const clean = task.status.trim().toLowerCase();
  return clean !== 'unknown' && !NON_FALLBACK_TASK_STATUSES.has(clean);
}

export async function readTaskMetadata(cwd: string, filePath: string): Promise<ActiveTask> {
  const markdown = await readFile(filePath, 'utf8');
  const title = extractHeading(markdown, path.basename(filePath, '.md'));
  const source = detectTaskSource(markdown, title);
  return {
    path: toStoredPath(cwd, filePath),
    title,
    status: extractTaskStatus(markdown),
    ...(source ? { source } : {}),
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
  const task = (await listTasks(options)).find((candidate) => isFallbackTaskCandidate(candidate));
  return task ? path.resolve(options.cwd, task.path) : undefined;
}

export async function clearActiveTask(options: { cwd: string; config: AgentLoopConfig }) {
  await rm(resolveStatePath(options.cwd, options.config), { force: true });
}

export async function listTasks(options: {
  cwd: string;
  config: AgentLoopConfig;
  status?: string;
}): Promise<ListedTask[]> {
  const root = tasksRoot(options.cwd, options.config);
  if (!resolvesInsidePath(options.cwd, root)) return [];
  const entries = await readdir(root, { withFileTypes: true }).catch(() => []);
  const activeTaskPath = await getActiveTaskPath(options);
  const requestedStatus = options.status ? parseTaskStatus(options.status) : undefined;

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
    .filter(
      (task) =>
        requestedStatus === undefined || task.status.trim().toLowerCase() === requestedStatus,
    )
    .sort((left, right) => {
      const leftPlaceholder = left.source === 'agentflight-placeholder';
      const rightPlaceholder = right.source === 'agentflight-placeholder';
      if (leftPlaceholder !== rightPlaceholder) return leftPlaceholder ? 1 : -1;
      if (left.active !== right.active) return left.active ? -1 : 1;
      if (left.modifiedMs !== right.modifiedMs) return right.modifiedMs - left.modifiedMs;
      return left.path.localeCompare(right.path);
    })
    .map((task) => ({
      path: task.path,
      title: task.title,
      status: task.status,
      ...(task.source ? { source: task.source } : {}),
      active: task.active,
      modifiedAt: task.modifiedAt,
    }));
}

export async function inspectTaskDirectory(options: {
  cwd: string;
  config: AgentLoopConfig;
}): Promise<TaskDoctorResult> {
  const tasks = (await listTasks(options)).slice(0, TASK_DOCTOR_TASK_LIMIT);
  const recentEvidence = await listRecentTaskEvidence(options);
  const diagnostics: TaskDoctorDiagnostic[] = [];
  const state = await readState(options.cwd, options.config);
  const stateStat = await stat(resolveStatePath(options.cwd, options.config)).catch(
    () => undefined,
  );
  if (state.activeTaskPath) {
    const activeTaskPath = await resolveTaskPath({
      cwd: options.cwd,
      config: options.config,
      taskPath: state.activeTaskPath,
      strict: false,
    });
    if (!activeTaskPath) {
      diagnostics.push({
        id: 'active-task-missing',
        severity: 'warn',
        path: state.activeTaskPath,
        title: path.basename(state.activeTaskPath, '.md'),
        status: 'unknown',
        message: 'Active task pointer points to a missing task contract.',
        recommendation: 'Run `agentloop task clear`, then set or create the current task contract.',
        commands: ['agentloop task clear', 'agentloop task set <path>', 'agentloop create-task'],
      });
    } else {
      const activeTask = await readTaskMetadata(options.cwd, activeTaskPath);
      const activeStatus = activeTask.status.trim().toLowerCase();
      const archiveRoot = taskArchiveRoot(options.cwd, options.config);
      if (activeTask.source === 'agentflight-placeholder') {
        diagnostics.push({
          id: 'active-task-agentflight-placeholder',
          severity: 'warn',
          path: activeTask.path,
          title: activeTask.title,
          status: activeTask.status,
          message:
            'Active task pointer points to an AgentFlight placeholder task preserved as session evidence.',
          recommendation:
            'Run `agentloop task clear`, then set an existing real task or create a current task contract before continuing. Do not edit or delete the AgentFlight placeholder as the default recovery.',
          commands: ['agentloop task clear', 'agentloop task set <path>', 'agentloop create-task'],
        });
      } else if (isInsidePath(archiveRoot, activeTaskPath)) {
        diagnostics.push({
          id: 'active-task-archived',
          severity: 'warn',
          path: activeTask.path,
          title: activeTask.title,
          status: activeTask.status,
          message: 'Active task pointer points to an archived task contract.',
          recommendation:
            'Run `agentloop task clear`; archived tasks are kept as evidence, not active work.',
          commands: ['agentloop task clear'],
        });
      } else if (TERMINAL_TASK_STATUSES.has(activeStatus)) {
        diagnostics.push({
          id: 'active-task-terminal',
          severity: 'warn',
          path: activeTask.path,
          title: activeTask.title,
          status: activeTask.status,
          message: 'Active task pointer points to a terminal task contract.',
          recommendation:
            'Run `agentloop task archive <path>` after verification and handoff, or `agentloop task clear` if it is already archived elsewhere.',
          commands: [`agentloop task archive ${activeTask.path}`, 'agentloop task clear'],
        });
      } else if (activeStatus === 'deferred') {
        diagnostics.push({
          id: 'active-task-deferred',
          severity: 'warn',
          path: activeTask.path,
          title: activeTask.title,
          status: activeTask.status,
          message: 'Active task pointer points to a deferred task contract.',
          recommendation:
            'Run `agentloop task clear` or `agentloop task set <path>` for the current open task.',
          commands: ['agentloop task clear', 'agentloop task set <path>'],
        });
      }
      if (activeTask.source !== 'agentflight-placeholder') {
        const activeTaskStat = await stat(activeTaskPath).catch(() => undefined);
        const activePointerModifiedMs = stateStat?.mtimeMs ?? activeTaskStat?.mtimeMs;
        const newerEvidence = activeTaskStat
          ? recentEvidence.filter(
              (evidence) =>
                evidence.source === 'run' &&
                activePointerModifiedMs !== undefined &&
                evidence.modifiedMs > activePointerModifiedMs &&
                evidence.taskPath !== activeTask.path,
            )
          : [];
        const hasNewerOpenTask =
          activeTaskStat &&
          tasks.some(
            (task) =>
              task.path !== activeTask.path &&
              OPEN_TASK_STATUSES.has(task.status.trim().toLowerCase()) &&
              Date.parse(task.modifiedAt) > activeTaskStat.mtimeMs,
          );
        if (OPEN_TASK_STATUSES.has(activeStatus) && newerEvidence.length > 0 && !hasNewerOpenTask) {
          diagnostics.push({
            id: 'active-task-older-than-runs',
            severity: 'warn',
            path: activeTask.path,
            title: activeTask.title,
            status: activeTask.status,
            message: 'Active task pointer is older than recent AgentLoop evidence.',
            recommendation:
              'Run `agentloop task doctor`, then clear, set, or create the current task contract before continuing.',
            commands: ['agentloop task doctor', 'agentloop task clear', 'agentloop create-task'],
            evidence: newerEvidence.map((evidence) => evidence.path).slice(0, 10),
          });
        }
      }
    }
  } else if (
    recentEvidence.length > 0 &&
    (hasOpenRealTask(tasks) ||
      !(await latestEvidenceResolvesToArchivedTerminalTask(options, recentEvidence[0])))
  ) {
    diagnostics.push({
      id: 'recent-evidence-without-active-task',
      severity: 'warn',
      path: repoPath(options.config.paths.agentloopDir, 'state.json'),
      title: 'Active task state',
      status: 'missing',
      message: 'Recent AgentLoop evidence exists, but no active task is pinned.',
      recommendation:
        'Run `agentloop task doctor`, then set an existing task or create a current task contract.',
      commands: ['agentloop task doctor', 'agentloop task set <path>', 'agentloop create-task'],
      evidence: recentEvidence.map((evidence) => evidence.path).slice(0, 10),
    });
  }

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

    if (OPEN_TASK_STATUSES.has(status) && task.source !== 'agentflight-placeholder') {
      const placeholderSections = findPlaceholderTaskSections(taskContent);
      if (placeholderSections.length > 0) {
        diagnostics.push({
          id: 'placeholder-task-section',
          severity: 'warn',
          path: task.path,
          title: task.title,
          status,
          message:
            'Task contract still contains placeholder guidance in review-critical section(s).',
          recommendation:
            'Replace placeholder section(s) with task-specific scope, acceptance, verification, and rollback evidence before implementation continues.',
          sections: placeholderSections,
        });
      }
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
