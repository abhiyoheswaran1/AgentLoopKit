import path from 'node:path';
import { mkdir, readdir, readFile } from 'node:fs/promises';
import { AgentLoopError } from './errors.js';
import { GitFileStatus } from './git.js';
import { isInsidePath, normalizeExistingAncestor, pathExists, writeTextFile } from './file-system.js';
import { ReviewReadinessResult } from './readiness-score.js';

export type RunCommand = 'ship' | 'verify' | 'handoff';

export type RunMetadata = {
  id: string;
  command: RunCommand;
  createdAt: string;
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
    task: options.task,
    verificationReportPath: options.verificationReportPath,
    overallStatus: options.overallStatus,
    changedFileCount: options.changedFiles.length,
  };

  await writeTextFile(path.join(directory, 'metadata.json'), `${JSON.stringify(metadata, null, 2)}\n`);
  await writeTextFile(
    path.join(directory, 'changed-files.json'),
    `${JSON.stringify(options.changedFiles, null, 2)}\n`,
  );
  await writeTextFile(path.join(directory, 'verification-report.md'), options.markdown);

  return {
    id,
    path: directory,
    metadata,
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
    task: options.task,
    ...(options.verificationReportPath
      ? { verificationReportPath: options.verificationReportPath }
      : {}),
    ...(options.handoffPath ? { handoffPath: options.handoffPath } : {}),
    changedFileCount: options.changedFiles.length,
  };

  await writeTextFile(path.join(directory, 'metadata.json'), `${JSON.stringify(metadata, null, 2)}\n`);
  await writeTextFile(
    path.join(directory, 'changed-files.json'),
    `${JSON.stringify(options.changedFiles, null, 2)}\n`,
  );
  await writeTextFile(path.join(directory, 'diffstat.txt'), options.diffStat);
  await writeTextFile(path.join(directory, 'pr-summary.md'), options.markdown);

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
  const scorePath = path.join(directory, 'score.json');
  const changedFilesPath = path.join(directory, 'changed-files.json');
  return {
    metadata: await readJsonFile<RunMetadata>(path.join(directory, 'metadata.json')),
    score: (await pathExists(scorePath)) ? await readJsonFile<ReviewReadinessResult>(scorePath) : null,
    changedFiles: (await pathExists(changedFilesPath))
      ? await readJsonFile<GitFileStatus[]>(changedFilesPath)
      : [],
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
