import { constants } from 'node:fs';
import { lstat, open } from 'node:fs/promises';
import { AgentLoopError } from './errors.js';

export type SafeMarkdownFile = {
  content: string;
  modifiedAt: string;
  modifiedMs: number;
};

export const SAFE_MARKDOWN_MAX_BYTES = 1_048_576;

function isMissingFileError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as NodeJS.ErrnoException).code === 'ENOENT'
  );
}

function isUnsafeOpenError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    ['ELOOP', 'EMLINK'].includes(String((error as NodeJS.ErrnoException).code))
  );
}

function unsafeMarkdownFile(filePath: string, codePrefix: string) {
  return new AgentLoopError(
    `Markdown artifact must be a regular file inside the AgentLoop evidence directory: ${filePath}`,
    `${codePrefix}_FILE_UNSAFE`,
  );
}

function oversizedMarkdownFile(filePath: string, codePrefix: string, maxBytes: number) {
  return new AgentLoopError(
    `Markdown artifact is too large to read safely: ${filePath} (${maxBytes} byte limit)`,
    `${codePrefix}_FILE_TOO_LARGE`,
  );
}

function missingMarkdownFile(filePath: string, codePrefix: string) {
  return new AgentLoopError(`Markdown artifact not found: ${filePath}`, `${codePrefix}_FILE_MISSING`);
}

export async function readSafeMarkdownFile(
  filePath: string,
  options: {
    required?: boolean;
    codePrefix?: string;
    maxBytes?: number;
  } = {},
): Promise<SafeMarkdownFile | undefined> {
  const codePrefix = options.codePrefix ?? 'MARKDOWN_ARTIFACT';
  const maxBytes = options.maxBytes ?? SAFE_MARKDOWN_MAX_BYTES;
  const fileStat = await lstat(filePath).catch((error: unknown) => {
    if (isMissingFileError(error)) return undefined;
    throw error;
  });
  if (!fileStat) {
    if (!options.required) return undefined;
    throw missingMarkdownFile(filePath, codePrefix);
  }
  if (!fileStat.isFile() || fileStat.isSymbolicLink()) {
    if (!options.required) return undefined;
    throw unsafeMarkdownFile(filePath, codePrefix);
  }
  if (fileStat.size > maxBytes) {
    if (!options.required) return undefined;
    throw oversizedMarkdownFile(filePath, codePrefix, maxBytes);
  }

  const flags = constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0);
  const fileHandle = await open(filePath, flags).catch((error: unknown) => {
    if (isMissingFileError(error)) {
      if (!options.required) return undefined;
      throw missingMarkdownFile(filePath, codePrefix);
    }
    if (isUnsafeOpenError(error)) {
      if (!options.required) return undefined;
      throw unsafeMarkdownFile(filePath, codePrefix);
    }
    throw error;
  });
  if (!fileHandle) return undefined;

  try {
    const openedStat = await fileHandle.stat();
    if (!openedStat.isFile() || openedStat.size > maxBytes) {
      if (!options.required) return undefined;
      if (!openedStat.isFile()) throw unsafeMarkdownFile(filePath, codePrefix);
      throw oversizedMarkdownFile(filePath, codePrefix, maxBytes);
    }
    return {
      content: await fileHandle.readFile('utf8'),
      modifiedAt: openedStat.mtime.toISOString(),
      modifiedMs: openedStat.mtimeMs,
    };
  } finally {
    await fileHandle.close();
  }
}
