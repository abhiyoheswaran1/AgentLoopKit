import path from 'node:path';
import { AgentLoopError } from './errors.js';
import { isInsidePath, normalizeExistingAncestor } from './file-system.js';

export const verificationReportPattern =
  /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-verification-report(?:-\d+)?\.md$/;
export const shipReportPattern = /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-ship-report(?:-\d+)?\.md$/;
export const prSummaryPattern = /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-pr-summary(?:-\d+)?\.md$/;
export const ciSummaryPattern = /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-ci-summary(?:-\d+)?\.md$/;
export const releaseNotesPattern = /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-release-notes(?:-\d+)?\.md$/;
export const generatedMarkdownPattern = /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-.+\.md$/;

export type OutputArtifactType =
  | 'report'
  | 'handoff'
  | 'badge'
  | 'ci-summary'
  | 'release-notes'
  | 'guard-baseline'
  | 'agent-instructions'
  | 'agents-md'
  | 'init-file'
  | 'task-state'
  | 'task-archive';
export type OutputPathErrorReason = 'outside-directory' | 'wrong-extension';

const outputArtifactLabels: Record<OutputArtifactType, string> = {
  report: 'Report',
  handoff: 'Handoff',
  badge: 'Badge',
  'ci-summary': 'CI summary',
  'release-notes': 'Release notes',
  'guard-baseline': 'Guard baseline',
  'agent-instructions': 'Agent instructions',
  'agents-md': 'AGENTS.md',
  'init-file': 'Init file',
  'task-state': 'Task state',
  'task-archive': 'Task archive',
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
