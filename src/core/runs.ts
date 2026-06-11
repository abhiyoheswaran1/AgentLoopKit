import path from 'node:path';
import { mkdir, readdir, readFile } from 'node:fs/promises';
import { AgentLoopError } from './errors.js';
import { GitFileStatus } from './git.js';
import { isInsidePath, normalizeExistingAncestor, pathExists, writeTextFile } from './file-system.js';
import { ReviewReadinessResult } from './readiness-score.js';

export type RunMetadata = {
  id: string;
  command: 'ship';
  createdAt: string;
  task: {
    path: string;
    title: string;
    status: string;
  } | null;
  verificationReportPath?: string;
  shipReportPath: string;
  handoffPath?: string;
  score: number;
  changedFileCount: number;
};

export type RunSummary = Pick<
  RunMetadata,
  'id' | 'command' | 'createdAt' | 'task' | 'score' | 'changedFileCount' | 'shipReportPath'
>;

export type RunRecord = {
  metadata: RunMetadata;
  score: ReviewReadinessResult;
  changedFiles: GitFileStatus[];
  diffStat: string;
};

export type IntentMatch = RunSummary & {
  file: string;
  why: string;
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
  return path.join(runsRoot(cwd), id);
}

function toSummary(metadata: RunMetadata): RunSummary {
  return {
    id: metadata.id,
    command: metadata.command,
    createdAt: metadata.createdAt,
    task: metadata.task,
    score: metadata.score,
    changedFileCount: metadata.changedFileCount,
    shipReportPath: metadata.shipReportPath,
  };
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, 'utf8')) as T;
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
  const id = `${options.timestamp}-ship`;
  const directory = runDir(options.cwd, id);
  await mkdir(directory, { recursive: true });

  const metadata: RunMetadata = {
    id,
    command: 'ship',
    createdAt: options.timestamp,
    task: options.task,
    ...(options.verificationReportPath
      ? { verificationReportPath: options.verificationReportPath }
      : {}),
    shipReportPath: options.shipReportPath,
    ...(options.handoffPath ? { handoffPath: options.handoffPath } : {}),
    score: options.score.totalScore,
    changedFileCount: options.changedFiles.length,
  };

  await writeTextFile(path.join(directory, 'metadata.json'), `${JSON.stringify(metadata, null, 2)}\n`);
  await writeTextFile(path.join(directory, 'score.json'), `${JSON.stringify(options.score, null, 2)}\n`);
  await writeTextFile(
    path.join(directory, 'changed-files.json'),
    `${JSON.stringify(options.changedFiles, null, 2)}\n`,
  );
  await writeTextFile(path.join(directory, 'diffstat.txt'), options.diffStat);
  await writeTextFile(path.join(directory, 'ship-report.md'), options.shipMarkdown);

  if (options.handoffPath && (await pathExists(options.handoffPath))) {
    await writeTextFile(path.join(directory, 'pr-summary.md'), await readFile(options.handoffPath, 'utf8'));
  }

  return {
    id,
    path: directory,
    metadata,
  };
}

export async function listRuns(cwd: string): Promise<RunSummary[]> {
  const root = runsRoot(cwd);
  if (!(await pathExists(root))) return [];
  const entries = await readdir(root, { withFileTypes: true });
  const runs: RunSummary[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const metadataPath = path.join(root, entry.name, 'metadata.json');
    if (!(await pathExists(metadataPath))) continue;
    runs.push(toSummary(await readJsonFile<RunMetadata>(metadataPath)));
  }

  return runs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function readRun(cwd: string, id: string): Promise<RunRecord> {
  const directory = runDir(cwd, id);
  if (!(await pathExists(directory))) throw new AgentLoopError(`Run not found: ${id}`, 'RUN_NOT_FOUND');
  return {
    metadata: await readJsonFile<RunMetadata>(path.join(directory, 'metadata.json')),
    score: await readJsonFile<ReviewReadinessResult>(path.join(directory, 'score.json')),
    changedFiles: await readJsonFile<GitFileStatus[]>(path.join(directory, 'changed-files.json')),
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
      why: `Changed in ship run for task "${run.task?.title ?? 'unknown task'}".`,
    });
  }

  return matches;
}
