import path from 'node:path';
import { readdir, stat } from 'node:fs/promises';
import { AgentLoopError } from './errors.js';
import { isInsidePath, normalizeExistingAncestor, pathExists } from './file-system.js';

export const verificationReportPattern =
  /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-verification-report\.md$/;
export const prSummaryPattern = /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-pr-summary\.md$/;
export const ciSummaryPattern = /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-ci-summary\.md$/;
export const generatedMarkdownPattern = /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-.+\.md$/;

export type ArtifactType = 'task' | 'verification' | 'handoff';
export type ArtifactPathErrorReason = 'outside-directory' | 'not-markdown' | 'missing';
export type OutputArtifactType =
  | 'report'
  | 'handoff'
  | 'badge'
  | 'ci-summary'
  | 'release-notes'
  | 'agent-instructions'
  | 'agents-md'
  | 'init-file';
export type OutputPathErrorReason = 'outside-directory' | 'wrong-extension';

export class ArtifactPathError extends AgentLoopError {
  constructor(
    message: string,
    public readonly artifactType: ArtifactType,
    public readonly requestedPath: string,
    public readonly expectedDir: string,
    public readonly reason: ArtifactPathErrorReason,
  ) {
    super(message, 'ARTIFACT_PATH_INVALID');
    this.name = 'ArtifactPathError';
  }
}

const artifactLabels: Record<ArtifactType, string> = {
  task: 'Task',
  verification: 'Verification',
  handoff: 'Handoff',
};

const outputArtifactLabels: Record<OutputArtifactType, string> = {
  report: 'Report',
  handoff: 'Handoff',
  badge: 'Badge',
  'ci-summary': 'CI summary',
  'release-notes': 'Release notes',
  'agent-instructions': 'Agent instructions',
  'agents-md': 'AGENTS.md',
  'init-file': 'Init file',
};

export class OutputPathError extends AgentLoopError {
  constructor(
    message: string,
    public readonly artifactType: OutputArtifactType,
    public readonly requestedPath: string,
    public readonly expectedDir: string,
    public readonly expectedExtension: string,
    public readonly reason: OutputPathErrorReason,
  ) {
    super(message, 'OUTPUT_PATH_INVALID');
    this.name = 'OutputPathError';
  }
}

export async function resolveExplicitArtifactPath(options: {
  cwd: string;
  artifactType: ArtifactType;
  requestedPath: string;
  expectedDir: string;
}) {
  const absolutePath = path.isAbsolute(options.requestedPath)
    ? path.resolve(options.requestedPath)
    : path.resolve(options.cwd, options.requestedPath);
  const repoRoot = normalizeExistingAncestor(path.resolve(options.cwd));
  const expectedRoot = normalizeExistingAncestor(path.resolve(options.cwd, options.expectedDir));
  const label = artifactLabels[options.artifactType];

  if (
    !isInsidePath(repoRoot, expectedRoot) ||
    !isInsidePath(expectedRoot, normalizeExistingAncestor(absolutePath))
  ) {
    throw new ArtifactPathError(
      `${label} artifact path must stay inside ${options.expectedDir}: ${options.requestedPath}`,
      options.artifactType,
      options.requestedPath,
      options.expectedDir,
      'outside-directory',
    );
  }

  if (!absolutePath.endsWith('.md')) {
    throw new ArtifactPathError(
      `${label} artifact path must be a Markdown file: ${options.requestedPath}`,
      options.artifactType,
      options.requestedPath,
      options.expectedDir,
      'not-markdown',
    );
  }

  const fileStat = await stat(absolutePath).catch(() => undefined);
  if (!fileStat?.isFile()) {
    throw new ArtifactPathError(
      `${label} artifact not found: ${options.requestedPath}`,
      options.artifactType,
      options.requestedPath,
      options.expectedDir,
      'missing',
    );
  }

  return absolutePath;
}

export function resolveOutputArtifactPath(options: {
  cwd: string;
  artifactType: OutputArtifactType;
  requestedPath: string;
  expectedDir: string;
  expectedExtension: string;
}) {
  const absolutePath = path.isAbsolute(options.requestedPath)
    ? path.resolve(options.requestedPath)
    : path.resolve(options.cwd, options.requestedPath);
  const repoRoot = normalizeExistingAncestor(path.resolve(options.cwd));
  const expectedRoot = normalizeExistingAncestor(path.resolve(options.cwd, options.expectedDir));
  const label = outputArtifactLabels[options.artifactType];

  if (
    !isInsidePath(repoRoot, expectedRoot) ||
    !isInsidePath(expectedRoot, normalizeExistingAncestor(absolutePath))
  ) {
    throw new OutputPathError(
      `${label} output path must stay inside ${options.expectedDir}: ${options.requestedPath}`,
      options.artifactType,
      options.requestedPath,
      options.expectedDir,
      options.expectedExtension,
      'outside-directory',
    );
  }

  if (!absolutePath.endsWith(options.expectedExtension)) {
    throw new OutputPathError(
      `${label} output path must use ${options.expectedExtension}: ${options.requestedPath}`,
      options.artifactType,
      options.requestedPath,
      options.expectedDir,
      options.expectedExtension,
      'wrong-extension',
    );
  }

  return absolutePath;
}

export async function latestMarkdownFile(dir: string, options: { pattern?: RegExp } = {}) {
  if (!(await pathExists(dir))) return undefined;
  const entries = await Promise.all(
    (
      await readdir(dir, { withFileTypes: true })
    )
      .filter(
        (entry) =>
          entry.isFile() && entry.name.endsWith('.md') && entry.name.toLowerCase() !== 'readme.md',
      )
      .filter((entry) => !options.pattern || options.pattern.test(entry.name))
      .map(async (entry) => {
        const filePath = path.join(dir, entry.name);
        const fileStat = await stat(filePath);
        return { filePath, name: entry.name, mtimeMs: fileStat.mtimeMs };
      }),
  );
  entries.sort((left, right) => {
    if (left.mtimeMs !== right.mtimeMs) return left.mtimeMs - right.mtimeMs;
    return left.name.localeCompare(right.name);
  });
  return entries.at(-1)?.filePath;
}
