import path from 'node:path';
import { mkdir, readdir, readFile, stat } from 'node:fs/promises';
import { AgentLoopError } from './errors.js';
import { GitFileStatus } from './git.js';
import { isInsidePath, normalizeExistingAncestor, pathExists, writeTextFile } from './file-system.js';
import { ReviewReadinessResult } from './readiness-score.js';
import { toSafeDisplayPath } from './display-path.js';
import { readTaskMetadata } from './task-state.js';
import { computeFileContentHash } from './verified-state.js';
import type { RunCommand, RunMetadata, RunSummary } from './run-types.js';
import {
  isIgnorableRunListError,
  parseChangedFiles,
  readRunJsonFileAtPath,
  readRunMetadataFileAtPath,
  readSafeRunTextFile,
} from './run-artifacts.js';

export type { RunCommand, RunMetadata, RunSummary } from './run-types.js';

export type ListRunsOptions = {
  limit?: number;
  taskPath?: string;
  hydrateTask?: boolean;
};

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

export type FileIntentSearch = {
  totalRunCount: number;
  inspectedRunCount: number;
  scanLimit: number;
  matchLimit: number;
  truncated: boolean;
  stoppedAfterMatches: boolean;
};

export type FileIntentResult = {
  file: string;
  runs: IntentMatch[];
  search: FileIntentSearch;
};

export type FindFileIntentOptions = {
  scanLimit?: number;
  matchLimit?: number;
};

type SortableRunSummary = {
  summary: RunSummary;
  preciseTimestampMs: number;
};

type SortableRunMetadata = {
  metadata: RunMetadata;
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

const RUN_LIST_CONCURRENCY = 32;
export const FILE_INTENT_DEFAULT_SCAN_LIMIT = 50;
export const FILE_INTENT_DEFAULT_MATCH_LIMIT = 10;
export const FILE_INTENT_MAX_SCAN_LIMIT = 500;
export const FILE_INTENT_MAX_MATCH_LIMIT = 50;

function validateRunId(id: string) {
  if (!/^[A-Za-z0-9._-]+$/.test(id) || id === '.' || id.includes('..')) {
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

// A changed-file entry as recorded in a run's changed-files.json, widened
// with an optional content-addressed hash so coverage can later be checked
// against actual content rather than path-presence alone (Task 2 does the
// checking; this only records the hash).
export type RunChangedFile = { status: string; path: string; hash?: string };

function sanitizeChangedFiles(cwd: string, changedFiles: GitFileStatus[]): GitFileStatus[] {
  return changedFiles.map((changedFile) => ({
    ...changedFile,
    path: toSafeDisplayPath(cwd, changedFile.path),
  }));
}

// Computes each file's content hash against the REAL (pre-sanitized) path —
// hashing must happen before toSafeDisplayPath rewrites it to a repo-relative
// display path, otherwise `git hash-object` would resolve the wrong file (or
// nothing) relative to cwd. The recorded path is still the safe display path.
async function changedFilesWithHashes(
  cwd: string,
  changedFiles: GitFileStatus[],
): Promise<RunChangedFile[]> {
  return Promise.all(
    changedFiles.map(async (file) => {
      const hash = await computeFileContentHash({ cwd, filePath: file.path });
      const safe = toSafeDisplayPath(cwd, file.path);
      return hash ? { status: file.status, path: safe, hash } : { status: file.status, path: safe };
    }),
  );
}

function normalizeDisplayPath(value: string) {
  return value.trim().replace(/\\/g, '/').replace(/^\.\/+/, '');
}

export function normalizeFileIntentPath(cwd: string, file: string) {
  const platformPath = file.replace(/\\/g, path.sep);
  const absolutePath = path.isAbsolute(platformPath)
    ? path.resolve(platformPath)
    : path.resolve(cwd, platformPath);
  const relativePath = path.relative(path.resolve(cwd), absolutePath);
  if (!relativePath || relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    throw new AgentLoopError(
      'Intent file must be a repo-relative path inside the current repository.',
      'RUN_INTENT_FILE_INVALID',
    );
  }
  return relativePath.split(path.sep).join('/');
}

function comparableTaskPath(cwd: string, value: string) {
  const normalized = normalizeDisplayPath(toSafeDisplayPath(cwd, value));
  const archivePrefix = '.agentloop/tasks/archive/';
  if (normalized.startsWith(archivePrefix)) {
    return `.agentloop/tasks/${path.posix.basename(normalized)}`;
  }
  return normalized;
}

function matchesTaskPath(cwd: string, runTaskPath: string | undefined, requestedTaskPath: string | undefined) {
  if (!runTaskPath || !requestedTaskPath) return false;
  return comparableTaskPath(cwd, runTaskPath) === comparableTaskPath(cwd, requestedTaskPath);
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

async function readRunMetadataFile(
  cwd: string,
  id: string,
  options: { required?: boolean } = {},
): Promise<{ metadata: RunMetadata; mtimeMs: number } | undefined> {
  const directory = runDir(cwd, id);
  return readRunMetadataFileAtPath(path.join(directory, 'metadata.json'), id, options);
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
  const safeChangedFiles = await changedFilesWithHashes(options.cwd, options.changedFiles);

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
  const safeChangedFiles = await changedFilesWithHashes(options.cwd, options.changedFiles);

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
  const safeChangedFiles = await changedFilesWithHashes(options.cwd, options.changedFiles);

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

function normalizeRunLimit(limit: number | undefined) {
  if (limit === undefined) return undefined;
  if (!Number.isFinite(limit) || limit <= 0) return 0;
  return Math.floor(limit);
}

function normalizeFileIntentBound(value: number | undefined, defaults: { fallback: number; max: number }) {
  if (value === undefined) return defaults.fallback;
  if (!Number.isFinite(value) || value <= 0) return defaults.fallback;
  return Math.min(Math.floor(value), defaults.max);
}

function compareRuns(a: SortableRunMetadata, b: SortableRunMetadata) {
  const minuteCompare = b.metadata.createdAt.localeCompare(a.metadata.createdAt);
  if (minuteCompare !== 0) return minuteCompare;
  const preciseCompare = b.preciseTimestampMs - a.preciseTimestampMs;
  if (preciseCompare !== 0) return preciseCompare;
  return b.metadata.id.localeCompare(a.metadata.id);
}

function appendSortableRun(
  runs: SortableRunMetadata[],
  run: SortableRunMetadata,
  limit: number | undefined,
) {
  runs.push(run);
  if (limit === undefined) return;
  runs.sort(compareRuns);
  if (runs.length > limit) runs.pop();
}

function runMinutePrefix(id: string) {
  return id.match(/^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}/)?.[0] ?? id;
}

function selectRunDirectoryEntries(
  entries: Array<{ name: string; isDirectory(): boolean }>,
  options: { limit: number | undefined; taskPath?: string },
) {
  const directories = entries.filter((entry) => entry.isDirectory());
  if (options.limit === undefined || options.taskPath) return directories;

  const sorted = directories.slice().sort((left, right) => right.name.localeCompare(left.name));
  const initial = sorted.slice(0, options.limit);
  if (initial.length < options.limit) return initial;

  const boundaryPrefix = runMinutePrefix(initial[initial.length - 1].name);
  let selectedCount = initial.length;
  while (
    selectedCount < sorted.length &&
    runMinutePrefix(sorted[selectedCount].name) === boundaryPrefix
  ) {
    selectedCount += 1;
  }
  return sorted.slice(0, selectedCount);
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T) => Promise<R>,
) {
  const results = new Array<R>(items.length);
  let nextIndex = 0;
  const workerCount = Math.min(concurrency, items.length);
  await Promise.all(
    Array.from({ length: workerCount }, async () => {
      while (nextIndex < items.length) {
        const currentIndex = nextIndex;
        nextIndex += 1;
        results[currentIndex] = await mapper(items[currentIndex]);
      }
    }),
  );
  return results;
}

export async function listRuns(cwd: string, options: ListRunsOptions = {}): Promise<RunSummary[]> {
  const limit = normalizeRunLimit(options.limit);
  if (limit === 0) return [];
  const root = runsRoot(cwd);
  if (!(await pathExists(root))) return [];
  const entries = await readdir(root, { withFileTypes: true });
  const runs: SortableRunMetadata[] = [];
  const selectedEntries = selectRunDirectoryEntries(entries, {
    limit,
    taskPath: options.taskPath,
  });

  const candidates = await mapWithConcurrency(selectedEntries, RUN_LIST_CONCURRENCY, async (entry) => {
    const metadataFile = await readRunMetadataFileAtPath(
      path.join(root, entry.name, 'metadata.json'),
      entry.name,
    ).catch((error: unknown) => {
      if (isIgnorableRunListError(error)) return undefined;
      throw error;
    });
    if (!metadataFile) return undefined;
    const safeMetadata = sanitizeRunMetadata(cwd, metadataFile.metadata);
    if (
      options.taskPath &&
      !matchesTaskPath(cwd, safeMetadata.task?.path, options.taskPath)
    ) {
      return undefined;
    }
    return {
      metadata: safeMetadata,
      preciseTimestampMs: metadataFile.metadata.createdAtEpochMs ?? metadataFile.mtimeMs,
    };
  });

  for (const run of candidates) {
    if (!run) continue;
    appendSortableRun(runs, run, limit);
  }

  const selectedRuns = runs.sort(compareRuns);
  const boundedRuns = limit === undefined ? selectedRuns : selectedRuns.slice(0, limit);

  if (options.hydrateTask === false) {
    return boundedRuns.map((run) => toSummary(run.metadata));
  }

  const hydratedRuns: SortableRunSummary[] = [];
  for (const run of boundedRuns) {
    hydratedRuns.push({
      summary: toSummary(await hydrateRunMetadata(cwd, run.metadata)),
      preciseTimestampMs: run.preciseTimestampMs,
    });
  }
  return hydratedRuns.map((run) => run.summary);
}

export async function readRunChangedFiles(cwd: string, id: string): Promise<RunChangedFile[]> {
  const directory = runDir(cwd, id);
  if (!(await pathExists(directory))) throw new AgentLoopError(`Run not found: ${id}`, 'RUN_NOT_FOUND');
  const changedFilesArtifact = await readRunJsonFileAtPath(
    path.join(directory, 'changed-files.json'),
    'changed-files.json',
  );
  if (!changedFilesArtifact) return [];
  const changedFiles = parseChangedFiles(changedFilesArtifact.value);
  return sanitizeChangedFiles(cwd, changedFiles);
}

export async function readRun(cwd: string, id: string): Promise<RunRecord> {
  const directory = runDir(cwd, id);
  if (!(await pathExists(directory))) throw new AgentLoopError(`Run not found: ${id}`, 'RUN_NOT_FOUND');
  const metadataFile = await readRunMetadataFile(cwd, id, { required: true });
  if (!metadataFile) throw new AgentLoopError(`Run not found: ${id}`, 'RUN_NOT_FOUND');
  const metadata = await hydrateRunMetadata(cwd, metadataFile.metadata);
  const scoreArtifact = await readRunJsonFileAtPath(path.join(directory, 'score.json'), 'score.json');
  const diffStatArtifact = await readSafeRunTextFile(
    path.join(directory, 'diffstat.txt'),
    'diffstat.txt',
  );
  return {
    metadata,
    score: scoreArtifact ? (scoreArtifact.value as ReviewReadinessResult) : null,
    changedFiles: await readRunChangedFiles(cwd, id),
    diffStat: diffStatArtifact?.text ?? '',
  };
}

async function listRunIdsNewestFirst(cwd: string) {
  const root = runsRoot(cwd);
  if (!(await pathExists(root))) return [];
  const entries = await readdir(root, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => b.localeCompare(a));
}

async function hydrateRunSummaryTask(cwd: string, run: RunSummary): Promise<RunSummary> {
  const currentTask = run.task ? await readTaskIfPresent(cwd, run.task.path) : undefined;
  return currentTask ? { ...run, task: currentTask } : run;
}

function isIgnorableFileIntentError(error: unknown) {
  return (
    isIgnorableRunListError(error) ||
    (error instanceof AgentLoopError && error.code === 'RUN_NOT_FOUND')
  );
}

export async function findFileIntentWithSearch(
  cwd: string,
  file: string,
  options: FindFileIntentOptions = {},
): Promise<FileIntentResult> {
  const normalizedFile = normalizeFileIntentPath(cwd, file);
  const scanLimit = normalizeFileIntentBound(options.scanLimit, {
    fallback: FILE_INTENT_DEFAULT_SCAN_LIMIT,
    max: FILE_INTENT_MAX_SCAN_LIMIT,
  });
  const matchLimit = normalizeFileIntentBound(options.matchLimit, {
    fallback: FILE_INTENT_DEFAULT_MATCH_LIMIT,
    max: FILE_INTENT_MAX_MATCH_LIMIT,
  });
  const runIds = await listRunIdsNewestFirst(cwd);
  const runSummaries = await listRuns(cwd, { limit: scanLimit, hydrateTask: false });
  const matches: IntentMatch[] = [];
  let inspectedRunCount = 0;
  let stoppedAfterMatches = false;

  for (const run of runSummaries) {
    if (inspectedRunCount >= scanLimit) break;
    if (matches.length >= matchLimit) {
      stoppedAfterMatches = true;
      break;
    }
    inspectedRunCount += 1;

    const changedFiles = await readRunChangedFiles(cwd, run.id).catch((error: unknown) => {
      if (isIgnorableFileIntentError(error)) return undefined;
      throw error;
    });
    if (!changedFiles) continue;
    if (!changedFiles.some((changedFile) => changedFile.path.replace(/\\/g, '/') === normalizedFile)) {
      continue;
    }

    const hydratedRun = await hydrateRunSummaryTask(cwd, run);
    matches.push({
      ...hydratedRun,
      file: normalizedFile,
      why: intentWhy(hydratedRun.command, hydratedRun.task?.title ?? 'unknown task'),
    });
  }

  return {
    file: normalizedFile,
    runs: matches,
    search: {
      totalRunCount: runIds.length,
      inspectedRunCount,
      scanLimit,
      matchLimit,
      truncated: inspectedRunCount < runIds.length,
      stoppedAfterMatches,
    },
  };
}

export async function findFileIntent(
  cwd: string,
  file: string,
  options: FindFileIntentOptions = {},
): Promise<IntentMatch[]> {
  return (await findFileIntentWithSearch(cwd, file, options)).runs;
}

function intentWhy(command: RunCommand, title: string) {
  if (command === 'verify') return `Verification run for task "${title}".`;
  if (command === 'handoff') return `Reviewer handoff for task "${title}".`;
  return `Changed in ship run for task "${title}".`;
}
