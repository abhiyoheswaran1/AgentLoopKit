import { lstat, readFile } from 'node:fs/promises';
import { AgentLoopError } from './errors.js';
import type { GitFileStatus } from './git.js';
import type { RunMetadata } from './run-types.js';

type RunTextFile = {
  text: string;
  mtimeMs: number;
};

export const RUN_ARTIFACT_MAX_BYTES = 1_048_576;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isRunTask(value: unknown): value is RunMetadata['task'] {
  if (value === null) return true;
  return (
    isRecord(value) &&
    typeof value.path === 'string' &&
    typeof value.title === 'string' &&
    typeof value.status === 'string'
  );
}

function isOptionalRunTask(value: unknown): value is RunMetadata['task'] | undefined {
  return value === undefined || isRunTask(value);
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === 'string';
}

function isOptionalNumber(value: unknown): value is number | undefined {
  return value === undefined || (typeof value === 'number' && Number.isFinite(value));
}

function parseRunMetadata(value: unknown, expectedId: string): RunMetadata {
  if (
    !isRecord(value) ||
    value.id !== expectedId ||
    typeof value.command !== 'string' ||
    typeof value.createdAt !== 'string' ||
    !isOptionalRunTask(value.task) ||
    !isOptionalNumber(value.createdAtEpochMs) ||
    !isOptionalString(value.verificationReportPath) ||
    !isOptionalString(value.shipReportPath) ||
    !isOptionalString(value.handoffPath) ||
    !isOptionalNumber(value.score) ||
    !isOptionalString(value.overallStatus) ||
    typeof value.changedFileCount !== 'number' ||
    !Number.isFinite(value.changedFileCount)
  ) {
    throw new AgentLoopError(`Invalid run metadata for ${expectedId}.`, 'RUN_METADATA_INVALID');
  }
  return { ...value, task: value.task ?? null } as RunMetadata;
}

function unsafeRunFile(fileName: string) {
  return new AgentLoopError(
    `Run artifact must be a regular file inside its run directory: ${fileName}`,
    'RUN_FILE_UNSAFE',
  );
}

function oversizedRunFile(fileName: string, maxBytes: number) {
  return new AgentLoopError(
    `Run artifact is too large to read safely: ${fileName} (${maxBytes} byte limit)`,
    'RUN_FILE_TOO_LARGE',
  );
}

export function parseChangedFiles(value: unknown): GitFileStatus[] {
  if (
    !Array.isArray(value) ||
    !value.every(
      (item) => isRecord(item) && typeof item.path === 'string' && typeof item.status === 'string',
    )
  ) {
    throw new AgentLoopError('Invalid run changed-files artifact.', 'RUN_FILE_INVALID');
  }
  return value as GitFileStatus[];
}

export async function readSafeRunTextFile(
  filePath: string,
  fileName: string,
  options: { required?: boolean; maxBytes?: number } = {},
): Promise<RunTextFile | undefined> {
  const fileStat = await lstat(filePath).catch((error: NodeJS.ErrnoException) => {
    if (error.code === 'ENOENT') return undefined;
    throw error;
  });
  if (!fileStat) {
    if (!options.required) return undefined;
    throw new AgentLoopError(`Run artifact not found: ${fileName}`, 'RUN_FILE_MISSING');
  }
  if (!fileStat.isFile() || fileStat.isSymbolicLink()) {
    throw unsafeRunFile(fileName);
  }
  const maxBytes = options.maxBytes ?? RUN_ARTIFACT_MAX_BYTES;
  if (maxBytes >= 0 && fileStat.size > maxBytes) {
    throw oversizedRunFile(fileName, maxBytes);
  }

  return {
    text: await readFile(filePath, 'utf8'),
    mtimeMs: fileStat.mtimeMs,
  };
}

export async function readRunJsonFileAtPath(
  filePath: string,
  fileName: string,
  options: { required?: boolean; maxBytes?: number } = {},
): Promise<{ value: unknown; mtimeMs: number } | undefined> {
  const file = await readSafeRunTextFile(filePath, fileName, options);
  if (!file) return undefined;
  try {
    return {
      value: JSON.parse(file.text) as unknown,
      mtimeMs: file.mtimeMs,
    };
  } catch {
    throw new AgentLoopError(`Invalid JSON in run artifact: ${fileName}`, 'RUN_FILE_INVALID');
  }
}

export async function readRunMetadataFileAtPath(
  filePath: string,
  id: string,
  options: { required?: boolean; maxBytes?: number } = {},
): Promise<{ metadata: RunMetadata; mtimeMs: number } | undefined> {
  const file = await readRunJsonFileAtPath(filePath, 'metadata.json', options);
  if (!file) return undefined;
  return {
    metadata: parseRunMetadata(file.value, id),
    mtimeMs: file.mtimeMs,
  };
}

export function isIgnorableRunListError(error: unknown) {
  return (
    error instanceof AgentLoopError &&
    [
      'RUN_FILE_INVALID',
      'RUN_FILE_MISSING',
      'RUN_FILE_TOO_LARGE',
      'RUN_FILE_UNSAFE',
      'RUN_ID_INVALID',
      'RUN_METADATA_INVALID',
    ].includes(error.code)
  );
}
