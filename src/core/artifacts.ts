import path from 'node:path';
import { readdir, readFile, stat } from 'node:fs/promises';
import { AgentLoopError } from './errors.js';
import { AgentLoopConfig } from './config.js';
import {
  isInsidePath,
  normalizeExistingAncestor,
  pathExists,
  resolvesInsidePath,
} from './file-system.js';

export const verificationReportPattern = /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-verification-report\.md$/;
export const prSummaryPattern = /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-pr-summary\.md$/;
export const ciSummaryPattern = /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-ci-summary\.md$/;
export const releaseNotesPattern = /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-release-notes\.md$/;
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
  | 'init-file'
  | 'task-state'
  | 'task-archive';
export type OutputPathErrorReason = 'outside-directory' | 'wrong-extension';

export type ArtifactInventoryTask = {
  path: string;
  title: string;
  status: string;
};

export type ArtifactInventoryVerification = {
  path: string;
  title: string;
  overallStatus: string;
};

export type ArtifactInventoryNamedArtifact = {
  path: string;
  title: string;
};

export type ArtifactInventoryPathArtifact = {
  path: string;
};

export type ArtifactInventory = {
  tasks: {
    count: number;
    byStatus: Record<string, number>;
    latest: ArtifactInventoryTask | null;
  };
  verificationReports: {
    count: number;
    latest: ArtifactInventoryVerification | null;
  };
  handoffs: {
    count: number;
    latest: ArtifactInventoryNamedArtifact | null;
  };
  htmlReports: {
    count: number;
    latest: ArtifactInventoryPathArtifact | null;
  };
  badges: {
    count: number;
    latest: ArtifactInventoryPathArtifact | null;
  };
  ciSummaries: {
    count: number;
    latest: ArtifactInventoryNamedArtifact | null;
  };
  releaseNotes: {
    count: number;
    latest: ArtifactInventoryNamedArtifact | null;
  };
};

type InventoryFile = {
  filePath: string;
  name: string;
  mtimeMs: number;
};

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

export async function latestMarkdownFile(
  dir: string,
  options: { pattern?: RegExp; rootDir?: string } = {},
) {
  if (options.rootDir && !resolvesInsidePath(options.rootDir, dir)) return undefined;
  if (!(await pathExists(dir))) return undefined;
  const entries = await Promise.all(
    (await readdir(dir, { withFileTypes: true }))
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

function displayPath(cwd: string, filePath: string) {
  return path.relative(cwd, filePath).split(path.sep).join('/') || '.';
}

function extractHeading(markdown: string, fallback: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;
}

function extractTaskStatus(markdown: string) {
  return markdown.match(/^- Status:\s*(.+)$/im)?.[1]?.trim() || 'unknown';
}

function extractOverallStatus(markdown: string) {
  return markdown.match(/Overall status:\s*([a-z-]+)/i)?.[1]?.trim() || 'unknown';
}

function sortInventoryFiles(files: InventoryFile[]) {
  return files.sort((left, right) => {
    if (left.mtimeMs !== right.mtimeMs) return left.mtimeMs - right.mtimeMs;
    return left.name.localeCompare(right.name);
  });
}

async function listInventoryFiles(options: {
  cwd: string;
  dir: string;
  extension: string;
  pattern?: RegExp;
  ignoreReadme?: boolean;
}) {
  const root = path.resolve(options.cwd, options.dir);
  if (!resolvesInsidePath(options.cwd, root)) return [];
  if (!(await pathExists(root))) return [];
  const entries = await readdir(root, { withFileTypes: true }).catch(() => []);
  const files = await Promise.all(
    entries
      .filter((entry) => entry.isFile())
      .filter((entry) => entry.name.endsWith(options.extension))
      .filter((entry) => !options.ignoreReadme || entry.name.toLowerCase() !== 'readme.md')
      .filter((entry) => !options.pattern || options.pattern.test(entry.name))
      .map(async (entry) => {
        const filePath = path.join(root, entry.name);
        const fileStat = await stat(filePath).catch(() => undefined);
        if (!fileStat?.isFile()) return undefined;
        return { filePath, name: entry.name, mtimeMs: fileStat.mtimeMs };
      }),
  );
  return sortInventoryFiles(files.filter((file): file is InventoryFile => file !== undefined));
}

async function readTaskInventory(cwd: string, file: InventoryFile): Promise<ArtifactInventoryTask> {
  const markdown = await readFile(file.filePath, 'utf8');
  return {
    path: displayPath(cwd, file.filePath),
    title: extractHeading(markdown, path.basename(file.name, '.md')),
    status: extractTaskStatus(markdown),
  };
}

async function readVerificationInventory(
  cwd: string,
  file: InventoryFile,
): Promise<ArtifactInventoryVerification> {
  const markdown = await readFile(file.filePath, 'utf8');
  return {
    path: displayPath(cwd, file.filePath),
    title: extractHeading(markdown, path.basename(file.name, '.md')),
    overallStatus: extractOverallStatus(markdown),
  };
}

async function readNamedInventory(
  cwd: string,
  file: InventoryFile,
): Promise<ArtifactInventoryNamedArtifact> {
  const markdown = await readFile(file.filePath, 'utf8');
  return {
    path: displayPath(cwd, file.filePath),
    title: extractHeading(markdown, path.basename(file.name, '.md')),
  };
}

function pathInventory(cwd: string, file: InventoryFile): ArtifactInventoryPathArtifact {
  return {
    path: displayPath(cwd, file.filePath),
  };
}

function countTaskStatuses(tasks: ArtifactInventoryTask[]) {
  const counts = tasks.reduce<Record<string, number>>((statusCounts, task) => {
    statusCounts[task.status] = (statusCounts[task.status] ?? 0) + 1;
    return statusCounts;
  }, {});
  return Object.fromEntries(
    Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)),
  );
}

export async function getArtifactInventory(options: {
  cwd: string;
  config: AgentLoopConfig;
}): Promise<ArtifactInventory> {
  const reportsDir = options.config.paths.reportsDir;
  const handoffsDir = options.config.paths.handoffsDir;
  const [
    taskFiles,
    verificationFiles,
    handoffFiles,
    htmlReportFiles,
    badgeFiles,
    ciSummaryFiles,
    releaseNoteFiles,
  ] = await Promise.all([
    listInventoryFiles({
      cwd: options.cwd,
      dir: options.config.paths.tasksDir,
      extension: '.md',
      ignoreReadme: true,
    }),
    listInventoryFiles({
      cwd: options.cwd,
      dir: reportsDir,
      extension: '.md',
      pattern: verificationReportPattern,
    }),
    listInventoryFiles({
      cwd: options.cwd,
      dir: handoffsDir,
      extension: '.md',
      pattern: prSummaryPattern,
    }),
    listInventoryFiles({
      cwd: options.cwd,
      dir: reportsDir,
      extension: '.html',
    }),
    listInventoryFiles({
      cwd: options.cwd,
      dir: reportsDir,
      extension: '.svg',
    }),
    listInventoryFiles({
      cwd: options.cwd,
      dir: reportsDir,
      extension: '.md',
      pattern: ciSummaryPattern,
    }),
    listInventoryFiles({
      cwd: options.cwd,
      dir: handoffsDir,
      extension: '.md',
      pattern: releaseNotesPattern,
    }),
  ]);
  const tasks = await Promise.all(taskFiles.map((file) => readTaskInventory(options.cwd, file)));
  const latestVerification = verificationFiles.at(-1)
    ? await readVerificationInventory(options.cwd, verificationFiles.at(-1) as InventoryFile)
    : null;
  const latestHandoff = handoffFiles.at(-1)
    ? await readNamedInventory(options.cwd, handoffFiles.at(-1) as InventoryFile)
    : null;
  const latestCiSummary = ciSummaryFiles.at(-1)
    ? await readNamedInventory(options.cwd, ciSummaryFiles.at(-1) as InventoryFile)
    : null;
  const latestReleaseNotes = releaseNoteFiles.at(-1)
    ? await readNamedInventory(options.cwd, releaseNoteFiles.at(-1) as InventoryFile)
    : null;

  return {
    tasks: {
      count: tasks.length,
      byStatus: countTaskStatuses(tasks),
      latest: tasks.at(-1) ?? null,
    },
    verificationReports: {
      count: verificationFiles.length,
      latest: latestVerification,
    },
    handoffs: {
      count: handoffFiles.length,
      latest: latestHandoff,
    },
    htmlReports: {
      count: htmlReportFiles.length,
      latest: htmlReportFiles.at(-1)
        ? pathInventory(options.cwd, htmlReportFiles.at(-1) as InventoryFile)
        : null,
    },
    badges: {
      count: badgeFiles.length,
      latest: badgeFiles.at(-1)
        ? pathInventory(options.cwd, badgeFiles.at(-1) as InventoryFile)
        : null,
    },
    ciSummaries: {
      count: ciSummaryFiles.length,
      latest: latestCiSummary,
    },
    releaseNotes: {
      count: releaseNoteFiles.length,
      latest: latestReleaseNotes,
    },
  };
}

function formatTaskCounts(byStatus: Record<string, number>) {
  const entries = Object.entries(byStatus).sort(([left], [right]) => left.localeCompare(right));
  if (!entries.length) return '';
  return ` (${entries.map(([status, count]) => `${status}: ${count}`).join(', ')})`;
}

function formatNamedArtifact(label: string, artifact: ArtifactInventoryNamedArtifact | null) {
  return artifact ? `- ${label}: ${artifact.title} - ${artifact.path}` : `- ${label}: not found`;
}

function formatPathArtifact(label: string, artifact: ArtifactInventoryPathArtifact | null) {
  return artifact ? `- ${label}: ${artifact.path}` : `- ${label}: not found`;
}

export function renderArtifactInventoryMarkdown(inventory: ArtifactInventory) {
  return `# AgentLoopKit Artifacts

- Tasks: ${inventory.tasks.count} total${formatTaskCounts(inventory.tasks.byStatus)}
${
  inventory.tasks.latest
    ? `- Latest task: ${inventory.tasks.latest.title} (${inventory.tasks.latest.status}) - ${inventory.tasks.latest.path}`
    : '- Latest task: not found'
}
- Verification reports: ${inventory.verificationReports.count}
${
  inventory.verificationReports.latest
    ? `- Latest verification: ${inventory.verificationReports.latest.overallStatus} - ${inventory.verificationReports.latest.path}`
    : '- Latest verification: not found'
}
- Handoffs: ${inventory.handoffs.count}
${formatNamedArtifact('Latest handoff', inventory.handoffs.latest)}
- HTML reports: ${inventory.htmlReports.count}
${formatPathArtifact('Latest HTML report', inventory.htmlReports.latest)}
- Badges: ${inventory.badges.count}
${formatPathArtifact('Latest badge', inventory.badges.latest)}
- CI summaries: ${inventory.ciSummaries.count}
${formatNamedArtifact('Latest CI summary', inventory.ciSummaries.latest)}
- Release notes: ${inventory.releaseNotes.count}
${formatNamedArtifact('Latest release notes', inventory.releaseNotes.latest)}
`;
}
