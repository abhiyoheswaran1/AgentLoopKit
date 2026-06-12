import path from 'node:path';
import { mkdir, readdir, readFile, stat } from 'node:fs/promises';
import { AgentLoopError } from './errors.js';
import { GitFileStatus } from './git.js';
import { isInsidePath, normalizeExistingAncestor, pathExists, writeTextFile } from './file-system.js';
import { ReviewReadinessResult } from './readiness-score.js';
import { toSafeDisplayPath } from './display-path.js';
import { readTaskMetadata } from './task-state.js';

export type RunCommand = 'ship' | 'verify' | 'handoff';

export type RunMetadata = {
  id: string;
  command: RunCommand;
  createdAt: string;
  createdAtEpochMs?: number;
  task: {
    path: string;
    title: string;
    status: string;
  } | null;
  verificationReportPath?: string;
  shipReportPath?: string;
  handoffPath?: string;
  score?: number;
  overallStatus?: string;
  changedFileCount: number;
};

export type RunSummary = Pick<
  RunMetadata,
  | 'id'
  | 'command'
  | 'createdAt'
  | 'task'
  | 'score'
  | 'overallStatus'
  | 'changedFileCount'
  | 'verificationReportPath'
  | 'shipReportPath'
  | 'handoffPath'
>;

export type RunRecord = {
  metadata: RunMetadata;
  score: ReviewReadinessResult | null;
  changedFiles: GitFileStatus[];
  diffStat: string;
};

export type IntentMatch = RunSummary & {
  file: string;
  why: string;
};

type SortableRunSummary = {
  summary: RunSummary;
  preciseTimestampMs: number;
};

function runsRoot(cwd: string) {
  const repoRoot = normalizeExistingAncestor(path.resolve(cwd));
  const root = path.resolve(cwd, '.agentloop/runs');
  const normalizedRoot = normalizeExistingAncestor(root);
  if (!isInsidePath(repoRoot, normalizedRoot)) {
    throw new AgentLoopError('Run ledger path must stay inside the current repository.', 'RUN_PATH_INVALID');
  }
  return root;
}

function validateRunId(id: string) {
  if (!/^[A-Za-z0-9._-]+$/.test(id) || id.includes('..')) {
    throw new AgentLoopError(`Invalid run id: ${id}`, 'RUN_ID_INVALID');
  }
}

function runDir(cwd: string, id: string) {
  validateRunId(id);
  const root = runsRoot(cwd);
  const directory = path.join(root, id);
  const normalizedRoot = normalizeExistingAncestor(root);
  const normalizedDirectory = normalizeExistingAncestor(directory);
  if (!isInsidePath(normalizedRoot, normalizedDirectory)) {
    throw new AgentLoopError(
      'Run directory must stay inside the run ledger root.',
      'RUN_PATH_INVALID',
    );
  }
  return directory;
}

async function allocateRunDirectory(cwd: string, timestamp: string, command: RunCommand) {
  const baseId = `${timestamp}-${command}`;
  for (let index = 1; index <= 1000; index += 1) {
    const id = index === 1 ? baseId : `${baseId}-${index}`;
    const directory = runDir(cwd, id);
    if (!(await pathExists(directory))) return { id, directory };
  }
  throw new AgentLoopError(`Unable to allocate a run id for ${baseId}.`, 'RUN_ID_COLLISION');
}

function sanitizeRunMetadata(cwd: string, metadata: RunMetadata): RunMetadata {
  return {
    ...metadata,
    task: metadata.task
      ? {
          ...metadata.task,
          path: toSafeDisplayPath(cwd, metadata.task.path),
        }
      : metadata.task,
    ...(metadata.verificationReportPath
      ? { verificationReportPath: toSafeDisplayPath(cwd, metadata.verificationReportPath) }
      : {}),
    ...(metadata.shipReportPath
      ? { shipReportPath: toSafeDisplayPath(cwd, metadata.shipReportPath) }
      : {}),
    ...(metadata.handoffPath ? { handoffPath: toSafeDisplayPath(cwd, metadata.handoffPath) } : {}),
  };
}

function sanitizeChangedFiles(cwd: string, changedFiles: GitFileStatus[]): GitFileStatus[] {
  return changedFiles.map((changedFile) => ({
    ...changedFile,
    path: toSafeDisplayPath(cwd, changedFile.path),
  }));
}

function toSummary(metadata: RunMetadata): RunSummary {
  return {
    id: metadata.id,
    command: metadata.command,
    createdAt: metadata.createdAt,
    task: metadata.task,
    score: metadata.score,
    overallStatus: metadata.overallStatus,
    changedFileCount: metadata.changedFileCount,
    verificationReportPath: metadata.verificationReportPath,
    shipReportPath: metadata.shipReportPath,
    handoffPath: metadata.handoffPath,
  };
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, 'utf8')) as T;
}

async function readTaskIfPresent(cwd: string, taskPath: string) {
  const repoRoot = normalizeExistingAncestor(path.resolve(cwd));
  const absolutePath = path.isAbsolute(taskPath)
    ? path.resolve(taskPath)
    : path.resolve(cwd, taskPath);
  if (!absolutePath.endsWith('.md')) return undefined;
  if (!isInsidePath(repoRoot, normalizeExistingAncestor(absolutePath))) return undefined;

  const candidates = [
    absolutePath,
    path.join(path.dirname(absolutePath), 'archive', path.basename(absolutePath)),
  ];

  for (const candidate of candidates) {
    if (!candidate.endsWith('.md')) continue;
    if (!isInsidePath(repoRoot, normalizeExistingAncestor(candidate))) continue;
    const candidateStat = await stat(candidate).catch(() => undefined);
    if (!candidateStat?.isFile()) continue;
    return readTaskMetadata(cwd, candidate);
  }

  return undefined;
}

async function hydrateRunMetadata(cwd: string, metadata: RunMetadata): Promise<RunMetadata> {
  const safeMetadata = sanitizeRunMetadata(cwd, metadata);
  const currentTask = safeMetadata.task
    ? await readTaskIfPresent(cwd, safeMetadata.task.path)
    : undefined;
  return currentTask ? { ...safeMetadata, task: currentTask } : safeMetadata;
}

export async function writeShipRun(options: {
  cwd: string;
  timestamp: string;
  task: RunMetadata['task'];
  verificationReportPath?: string;
  shipReportPath: string;
  handoffPath?: string;
  score: ReviewReadinessResult;
  changedFiles: GitFileStatus[];
  diffStat: string;
  shipMarkdown: string;
}) {
  const { id, directory } = await allocateRunDirectory(options.cwd, options.timestamp, 'ship');
  await mkdir(directory, { recursive: true });

  const metadata: RunMetadata = {
    id,
    command: 'ship',
    createdAt: options.timestamp,
    createdAtEpochMs: Date.now(),
    task: options.task,
    ...(options.verificationReportPath
      ? { verificationReportPath: options.verificationReportPath }
      : {}),
    shipReportPath: options.shipReportPath,
    ...(options.handoffPath ? { handoffPath: options.handoffPath } : {}),
    score: options.score.totalScore,
    changedFileCount: options.changedFiles.length,
  };
  const safeMetadata = sanitizeRunMetadata(options.cwd, metadata);
  const safeChangedFiles = sanitizeChangedFiles(options.cwd, options.changedFiles);

  await writeTextFile(
    path.join(directory, 'metadata.json'),
    `${JSON.stringify(safeMetadata, null, 2)}\n`,
  );
  await writeTextFile(path.join(directory, 'score.json'), `${JSON.stringify(options.score, null, 2)}\n`);
  await writeTextFile(
    path.join(directory, 'changed-files.json'),
    `${JSON.stringify(safeChangedFiles, null, 2)}\n`,
  );
  await writeTextFile(path.join(directory, 'diffstat.txt'), options.diffStat);
  await writeTextFile(path.join(directory, 'ship-report.md'), options.shipMarkdown);

  if (options.handoffPath && (await pathExists(options.handoffPath))) {
    await writeTextFile(path.join(directory, 'pr-summary.md'), await readFile(options.handoffPath, 'utf8'));
  }

  return {
    id,
    path: directory,
    metadata: safeMetadata,
  };
}

export async function writeVerificationRun(options: {
  cwd: string;
  timestamp: string;
  task: RunMetadata['task'];
  verificationReportPath: string;
  overallStatus: string;
  changedFiles: GitFileStatus[];
  markdown: string;
}) {
  const { id, directory } = await allocateRunDirectory(options.cwd, options.timestamp, 'verify');
  await mkdir(directory, { recursive: true });

  const metadata: RunMetadata = {
    id,
    command: 'verify',
    createdAt: options.timestamp,
    createdAtEpochMs: Date.now(),
    task: options.task,
    verificationReportPath: options.verificationReportPath,
    overallStatus: options.overallStatus,
    changedFileCount: options.changedFiles.length,
  };
  const safeMetadata = sanitizeRunMetadata(options.cwd, metadata);
  const safeChangedFiles = sanitizeChangedFiles(options.cwd, options.changedFiles);

  await writeTextFile(
    path.join(directory, 'metadata.json'),
    `${JSON.stringify(safeMetadata, null, 2)}\n`,
  );
  await writeTextFile(
    path.join(directory, 'changed-files.json'),
    `${JSON.stringify(safeChangedFiles, null, 2)}\n`,
  );
  await writeTextFile(path.join(directory, 'verification-report.md'), options.markdown);

  return {
    id,
    path: directory,
    metadata: safeMetadata,
  };
}

export async function writeHandoffRun(options: {
  cwd: string;
  timestamp: string;
  task: RunMetadata['task'];
  verificationReportPath?: string;
  handoffPath?: string;
  changedFiles: GitFileStatus[];
  diffStat: string;
  markdown: string;
}) {
  const { id, directory } = await allocateRunDirectory(options.cwd, options.timestamp, 'handoff');
  await mkdir(directory, { recursive: true });

  const metadata: RunMetadata = {
    id,
    command: 'handoff',
    createdAt: options.timestamp,
    createdAtEpochMs: Date.now(),
    task: options.task,
    ...(options.verificationReportPath
      ? { verificationReportPath: options.verificationReportPath }
      : {}),
    ...(options.handoffPath ? { handoffPath: options.handoffPath } : {}),
    changedFileCount: options.changedFiles.length,
  };
  const safeMetadata = sanitizeRunMetadata(options.cwd, metadata);
  const safeChangedFiles = sanitizeChangedFiles(options.cwd, options.changedFiles);

  await writeTextFile(
    path.join(directory, 'metadata.json'),
    `${JSON.stringify(safeMetadata, null, 2)}\n`,
  );
  await writeTextFile(
    path.join(directory, 'changed-files.json'),
    `${JSON.stringify(safeChangedFiles, null, 2)}\n`,
  );
  await writeTextFile(path.join(directory, 'diffstat.txt'), options.diffStat);
  await writeTextFile(path.join(directory, 'pr-summary.md'), options.markdown);

  return {
    id,
    path: directory,
    metadata: safeMetadata,
  };
}

export async function listRuns(cwd: string): Promise<RunSummary[]> {
  const root = runsRoot(cwd);
  if (!(await pathExists(root))) return [];
  const entries = await readdir(root, { withFileTypes: true });
  const runs: SortableRunSummary[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const metadataPath = path.join(root, entry.name, 'metadata.json');
    if (!(await pathExists(metadataPath))) continue;
    const metadata = await readJsonFile<RunMetadata>(metadataPath);
    const hydratedMetadata = await hydrateRunMetadata(cwd, metadata);
    const metadataStat = await stat(metadataPath);
    runs.push({
      summary: toSummary(hydratedMetadata),
      preciseTimestampMs: metadata.createdAtEpochMs ?? metadataStat.mtimeMs,
    });
  }

  return runs
    .sort((a, b) => {
      const minuteCompare = b.summary.createdAt.localeCompare(a.summary.createdAt);
      if (minuteCompare !== 0) return minuteCompare;
      const preciseCompare = b.preciseTimestampMs - a.preciseTimestampMs;
      if (preciseCompare !== 0) return preciseCompare;
      return b.summary.id.localeCompare(a.summary.id);
    })
    .map((run) => run.summary);
}

export async function readRun(cwd: string, id: string): Promise<RunRecord> {
  const directory = runDir(cwd, id);
  if (!(await pathExists(directory))) throw new AgentLoopError(`Run not found: ${id}`, 'RUN_NOT_FOUND');
  const scorePath = path.join(directory, 'score.json');
  const changedFilesPath = path.join(directory, 'changed-files.json');
  const metadata = await hydrateRunMetadata(
    cwd,
    await readJsonFile<RunMetadata>(path.join(directory, 'metadata.json')),
  );
  const changedFiles = (await pathExists(changedFilesPath))
    ? await readJsonFile<GitFileStatus[]>(changedFilesPath)
    : [];
  return {
    metadata,
    score: (await pathExists(scorePath)) ? await readJsonFile<ReviewReadinessResult>(scorePath) : null,
    changedFiles: sanitizeChangedFiles(cwd, changedFiles),
    diffStat: (await pathExists(path.join(directory, 'diffstat.txt')))
      ? await readFile(path.join(directory, 'diffstat.txt'), 'utf8')
      : '',
  };
}

export async function findFileIntent(cwd: string, file: string): Promise<IntentMatch[]> {
  const normalizedFile = file.replace(/\\/g, '/');
  const runs = await listRuns(cwd);
  const matches: IntentMatch[] = [];

  for (const run of runs) {
    const record = await readRun(cwd, run.id);
    if (!record.changedFiles.some((changedFile) => changedFile.path.replace(/\\/g, '/') === normalizedFile)) {
      continue;
    }
    matches.push({
      ...run,
      file: normalizedFile,
      why: intentWhy(run.command, run.task?.title ?? 'unknown task'),
    });
  }

  return matches;
}

function intentWhy(command: RunCommand, title: string) {
  if (command === 'verify') return `Verification run for task "${title}".`;
  if (command === 'handoff') return `Reviewer handoff for task "${title}".`;
  return `Changed in ship run for task "${title}".`;
}
