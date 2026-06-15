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
import { inlineCode } from './markdown-format.js';
import { listRuns, RunSummary } from './runs.js';

export const verificationReportPattern =
  /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-verification-report(?:-\d+)?\.md$/;
export const shipReportPattern =
  /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-ship-report(?:-\d+)?\.md$/;
export const prSummaryPattern =
  /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-pr-summary(?:-\d+)?\.md$/;
export const ciSummaryPattern =
  /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-ci-summary(?:-\d+)?\.md$/;
export const releaseNotesPattern =
  /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-release-notes(?:-\d+)?\.md$/;
export const generatedMarkdownPattern = /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-.+\.md$/;

export const artifactInventoryTypes = [
  'task',
  'verification',
  'handoff',
  'html-report',
  'badge',
  'ci-summary',
  'release-notes',
  'run',
] as const;

export type ArtifactType = 'task' | 'verification' | 'handoff';
export type ArtifactInventoryFilterType = (typeof artifactInventoryTypes)[number];
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
  runs: {
    count: number;
    latest: RunSummary | null;
  };
};

export type ArtifactInventoryRenderOptions = {
  type?: ArtifactInventoryFilterType;
  latest?: boolean;
};

export type LatestArtifactInventoryItem =
  | ({ type: 'task' } & ArtifactInventoryTask)
  | ({ type: 'verification' } & ArtifactInventoryVerification)
  | ({ type: 'handoff' } & ArtifactInventoryNamedArtifact)
  | ({ type: 'html-report' } & ArtifactInventoryPathArtifact)
  | ({ type: 'badge' } & ArtifactInventoryPathArtifact)
  | ({ type: 'ci-summary' } & ArtifactInventoryNamedArtifact)
  | ({ type: 'release-notes' } & ArtifactInventoryNamedArtifact)
  | ({ type: 'run' } & RunSummary);

export type StaleArtifactPreviewType = 'verification' | 'handoff' | 'ship-report' | 'run';

export type StaleArtifactPreviewItem = {
  type: StaleArtifactPreviewType;
  path: string;
  reason: string;
};

export type StaleArtifactPreview = {
  mode: 'preview';
  writesFiles: false;
  deletesFiles: false;
  candidateCount: number;
  keptCount: number;
  shownCandidateCount: number;
  hiddenCandidateCount: number;
  limit: number | null;
  candidates: StaleArtifactPreviewItem[];
  kept: StaleArtifactPreviewItem[];
  safety: {
    readOnly: true;
    deletesFiles: false;
    writesFiles: false;
    readsEnvFiles: false;
    followsSymlinkedArtifactRoots: false;
  };
  nextSteps: string[];
};

type InventoryFile = {
  filePath: string;
  name: string;
  mtimeMs: number;
};

type ArtifactInventoryJsonKey = keyof ArtifactInventory;

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

const artifactInventoryJsonKeys: Record<ArtifactInventoryFilterType, ArtifactInventoryJsonKey> = {
  task: 'tasks',
  verification: 'verificationReports',
  handoff: 'handoffs',
  'html-report': 'htmlReports',
  badge: 'badges',
  'ci-summary': 'ciSummaries',
  'release-notes': 'releaseNotes',
  run: 'runs',
};

const artifactInventoryDisplayLabels: Record<ArtifactInventoryFilterType, string> = {
  task: 'task',
  verification: 'verification report',
  handoff: 'handoff',
  'html-report': 'HTML report',
  badge: 'badge',
  'ci-summary': 'CI summary',
  'release-notes': 'release notes',
  run: 'run ledger',
};

const artifactInventoryNextSteps: Record<ArtifactInventoryFilterType, string> = {
  task: 'run `agentloop create-task` to create a task contract.',
  verification: 'run `agentloop verify` to create a verification report.',
  handoff: 'run `agentloop handoff` to create a handoff summary.',
  'html-report': 'run `agentloop report` to create a local HTML report.',
  badge: 'run `agentloop badge` to create a local SVG evidence badge.',
  'ci-summary': 'run `agentloop ci-summary --write` to create a local CI summary.',
  'release-notes': 'run `agentloop release-notes --write` to draft local release notes.',
  run: 'run `agentloop ship` or `agentloop verify --write-run` to create a local run record.',
};

export function isArtifactInventoryType(value: string): value is ArtifactInventoryFilterType {
  return artifactInventoryTypes.some((type) => type === value);
}

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

export async function resolveUniqueOutputArtifactPath(options: {
  cwd: string;
  artifactType: OutputArtifactType;
  requestedPath: string;
  expectedDir: string;
  expectedExtension: string;
}) {
  const firstPath = resolveOutputArtifactPath(options);
  if (!(await pathExists(firstPath))) return firstPath;

  const parsed = path.parse(firstPath);
  for (let index = 2; index <= 1000; index += 1) {
    const requestedPath = path.join(parsed.dir, `${parsed.name}-${index}${parsed.ext}`);
    const candidate = resolveOutputArtifactPath({
      ...options,
      requestedPath,
    });
    if (!(await pathExists(candidate))) return candidate;
  }

  throw new AgentLoopError(
    `Unable to allocate a unique ${options.artifactType} output path for ${options.requestedPath}.`,
    'OUTPUT_PATH_COLLISION',
  );
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

async function listRunInventory(cwd: string) {
  try {
    return await listRuns(cwd);
  } catch (error) {
    if (error instanceof AgentLoopError && error.code === 'RUN_PATH_INVALID') return [];
    throw error;
  }
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
    runs,
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
    listRunInventory(options.cwd),
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
    runs: {
      count: runs.length,
      latest: runs[0] ?? null,
    },
  };
}

function staleCandidateReason(type: StaleArtifactPreviewType) {
  switch (type) {
    case 'verification':
      return 'Older verification report; latest verification evidence is kept.';
    case 'handoff':
      return 'Older handoff summary; latest handoff evidence is kept.';
    case 'ship-report':
      return 'Older ship report; latest ship evidence is kept.';
    case 'run':
      return 'Older run ledger entry; latest run evidence is kept.';
  }
}

function staleKeptReason(type: StaleArtifactPreviewType) {
  switch (type) {
    case 'verification':
      return 'Latest verification report.';
    case 'handoff':
      return 'Latest handoff summary.';
    case 'ship-report':
      return 'Latest ship report.';
    case 'run':
      return 'Latest run ledger entry.';
  }
}

function previewItem(
  type: StaleArtifactPreviewType,
  pathValue: string,
  reason: string,
): StaleArtifactPreviewItem {
  return { type, path: pathValue, reason };
}

function runPath(run: RunSummary) {
  return `.agentloop/runs/${run.id}`;
}

function keepLatestFile(
  kept: StaleArtifactPreviewItem[],
  protectedPaths: Set<string>,
  cwd: string,
  type: StaleArtifactPreviewType,
  file?: InventoryFile,
) {
  if (!file) return;
  const relativePath = displayPath(cwd, file.filePath);
  protectedPaths.add(relativePath);
  kept.push(previewItem(type, relativePath, staleKeptReason(type)));
}

function collectStaleFiles(
  candidates: StaleArtifactPreviewItem[],
  protectedPaths: Set<string>,
  cwd: string,
  type: StaleArtifactPreviewType,
  files: InventoryFile[],
) {
  for (const file of files) {
    const relativePath = displayPath(cwd, file.filePath);
    if (protectedPaths.has(relativePath)) continue;
    candidates.push(previewItem(type, relativePath, staleCandidateReason(type)));
  }
}

function includeStaleType(
  filter: ArtifactInventoryFilterType | undefined,
  type: StaleArtifactPreviewType,
) {
  if (!filter) return true;
  return filter === type;
}

export async function getStaleArtifactPreview(options: {
  cwd: string;
  config: AgentLoopConfig;
  type?: ArtifactInventoryFilterType;
  limit?: number;
}): Promise<StaleArtifactPreview> {
  const reportsDir = options.config.paths.reportsDir;
  const handoffsDir = options.config.paths.handoffsDir;
  const [verificationFiles, handoffFiles, shipReportFiles, runs] = await Promise.all([
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
      extension: '.md',
      pattern: shipReportPattern,
    }),
    listRunInventory(options.cwd),
  ]);

  const candidates: StaleArtifactPreviewItem[] = [];
  const kept: StaleArtifactPreviewItem[] = [];
  const protectedPaths = new Set<string>();

  const latestVerification = verificationFiles.at(-1);
  const latestHandoff = handoffFiles.at(-1);
  const latestShipReport = shipReportFiles.at(-1);
  const latestRun = runs[0];

  if (includeStaleType(options.type, 'verification')) {
    keepLatestFile(kept, protectedPaths, options.cwd, 'verification', latestVerification);
  }
  if (includeStaleType(options.type, 'handoff')) {
    keepLatestFile(kept, protectedPaths, options.cwd, 'handoff', latestHandoff);
  }
  if (!options.type) {
    keepLatestFile(kept, protectedPaths, options.cwd, 'ship-report', latestShipReport);
  }
  if (includeStaleType(options.type, 'run') && latestRun) {
    const latestRunPath = runPath(latestRun);
    protectedPaths.add(latestRunPath);
    kept.push(previewItem('run', latestRunPath, staleKeptReason('run')));
  }

  if (latestRun) {
    for (const artifactPath of [
      latestRun.verificationReportPath,
      latestRun.handoffPath,
      latestRun.shipReportPath,
    ]) {
      if (artifactPath) protectedPaths.add(artifactPath);
    }
  }

  if (includeStaleType(options.type, 'verification')) {
    collectStaleFiles(candidates, protectedPaths, options.cwd, 'verification', verificationFiles);
  }
  if (includeStaleType(options.type, 'handoff')) {
    collectStaleFiles(candidates, protectedPaths, options.cwd, 'handoff', handoffFiles);
  }
  if (!options.type) {
    collectStaleFiles(candidates, protectedPaths, options.cwd, 'ship-report', shipReportFiles);
  }
  if (includeStaleType(options.type, 'run')) {
    for (const run of runs) {
      const relativePath = runPath(run);
      if (protectedPaths.has(relativePath)) continue;
      candidates.push(previewItem('run', relativePath, staleCandidateReason('run')));
    }
  }

  const candidateCount = candidates.length;
  const shownCandidates =
    typeof options.limit === 'number' ? candidates.slice(0, options.limit) : candidates;

  return {
    mode: 'preview',
    writesFiles: false,
    deletesFiles: false,
    candidateCount,
    keptCount: kept.length,
    shownCandidateCount: shownCandidates.length,
    hiddenCandidateCount: candidateCount - shownCandidates.length,
    limit: options.limit ?? null,
    candidates: shownCandidates,
    kept,
    safety: {
      readOnly: true,
      deletesFiles: false,
      writesFiles: false,
      readsEnvFiles: false,
      followsSymlinkedArtifactRoots: false,
    },
    nextSteps: [
      'Review candidates before deleting anything manually.',
      'Keep evidence referenced by the latest verification, handoff, ship, and run records.',
    ],
  };
}

function formatTaskCounts(byStatus: Record<string, number>) {
  const entries = Object.entries(byStatus).sort(([left], [right]) => left.localeCompare(right));
  if (!entries.length) return '';
  return ` (${entries.map(([status, count]) => `${inlineCode(status)}: ${count}`).join(', ')})`;
}

function formatNamedArtifact(label: string, artifact: ArtifactInventoryNamedArtifact | null) {
  return artifact
    ? `- ${label}: ${inlineCode(artifact.title)} - ${inlineCode(artifact.path)}`
    : `- ${label}: not found`;
}

function formatPathArtifact(label: string, artifact: ArtifactInventoryPathArtifact | null) {
  return artifact ? `- ${label}: ${inlineCode(artifact.path)}` : `- ${label}: not found`;
}

function runPrimaryArtifact(run: RunSummary) {
  return run.shipReportPath ?? run.handoffPath ?? run.verificationReportPath;
}

function formatRunResult(run: RunSummary) {
  if (typeof run.score === 'number') return `score ${inlineCode(String(run.score))}/100`;
  if (run.overallStatus) return `status ${inlineCode(run.overallStatus)}`;
  return `${inlineCode(String(run.changedFileCount))} changed file(s)`;
}

function formatRunArtifact(label: string, run: RunSummary | null) {
  if (!run) return `- ${label}: not found`;
  const artifactPath = runPrimaryArtifact(run);
  return `- ${label}: ${inlineCode(run.id)} ${inlineCode(run.command)} ${formatRunResult(run)}${
    artifactPath ? ` - ${inlineCode(artifactPath)}` : ''
  }`;
}

function selectedArtifactTypes(options: ArtifactInventoryRenderOptions) {
  return options.type ? [options.type] : [...artifactInventoryTypes];
}

function latestArtifactForType(
  inventory: ArtifactInventory,
  type: ArtifactInventoryFilterType,
): LatestArtifactInventoryItem | null {
  switch (type) {
    case 'task':
      return inventory.tasks.latest ? { type, ...inventory.tasks.latest } : null;
    case 'verification':
      return inventory.verificationReports.latest
        ? { type, ...inventory.verificationReports.latest }
        : null;
    case 'handoff':
      return inventory.handoffs.latest ? { type, ...inventory.handoffs.latest } : null;
    case 'html-report':
      return inventory.htmlReports.latest ? { type, ...inventory.htmlReports.latest } : null;
    case 'badge':
      return inventory.badges.latest ? { type, ...inventory.badges.latest } : null;
    case 'ci-summary':
      return inventory.ciSummaries.latest ? { type, ...inventory.ciSummaries.latest } : null;
    case 'release-notes':
      return inventory.releaseNotes.latest ? { type, ...inventory.releaseNotes.latest } : null;
    case 'run':
      return inventory.runs.latest ? { type, ...inventory.runs.latest } : null;
  }
}

function latestArtifacts(
  inventory: ArtifactInventory,
  options: ArtifactInventoryRenderOptions,
): LatestArtifactInventoryItem[] {
  return selectedArtifactTypes(options)
    .map((type) => latestArtifactForType(inventory, type))
    .filter((artifact): artifact is LatestArtifactInventoryItem => artifact !== null);
}

export function renderArtifactInventoryJson(
  inventory: ArtifactInventory,
  options: ArtifactInventoryRenderOptions = {},
) {
  if (options.latest) {
    return { latest: latestArtifacts(inventory, options) };
  }

  if (options.type) {
    return {
      [artifactInventoryJsonKeys[options.type]]: inventory[artifactInventoryJsonKeys[options.type]],
    };
  }

  return inventory;
}

export function renderStaleArtifactPreviewJson(preview: StaleArtifactPreview) {
  return { stale: preview };
}

export function renderStaleArtifactPreviewMarkdown(preview: StaleArtifactPreview) {
  const candidateLines = preview.candidates.length
    ? preview.candidates
        .map(
          (candidate) =>
            `- ${inlineCode(candidate.type)} ${inlineCode(candidate.path)} - ${candidate.reason}`,
        )
        .join('\n')
    : '- No stale evidence candidates found.';
  const hiddenLines = preview.hiddenCandidateCount
    ? [
        `- Hidden candidates: ${inlineCode(String(preview.hiddenCandidateCount))}.`,
        '- Run `agentloop artifacts --stale --json` for full candidate data.',
      ].join('\n')
    : '';
  const keptLines = preview.kept.length
    ? preview.kept
        .map((item) => `- ${inlineCode(item.type)} ${inlineCode(item.path)} - ${item.reason}`)
        .join('\n')
    : '- No latest evidence found to protect.';

  return `# AgentLoopKit Stale Evidence Preview

This is a read-only preview. No files were deleted.

## Candidates
${candidateLines}
- Showing ${inlineCode(String(preview.shownCandidateCount))} of ${inlineCode(String(preview.candidateCount))} candidate(s).
${hiddenLines}

## Kept
${keptLines}

## Safety
- Writes files: no
- Deletes files: no
- Reads env files: no
- Follows symlinked artifact roots: no

## Next Steps
${preview.nextSteps.map((step) => `- ${step}`).join('\n')}
`;
}

function countForType(inventory: ArtifactInventory, type: ArtifactInventoryFilterType) {
  return inventory[artifactInventoryJsonKeys[type]].count;
}

function formatTypeCountLine(inventory: ArtifactInventory, type: ArtifactInventoryFilterType) {
  switch (type) {
    case 'task':
      return `- Tasks: ${inventory.tasks.count} total${formatTaskCounts(inventory.tasks.byStatus)}`;
    case 'verification':
      return `- Verification reports: ${inventory.verificationReports.count}`;
    case 'handoff':
      return `- Handoffs: ${inventory.handoffs.count}`;
    case 'html-report':
      return `- HTML reports: ${inventory.htmlReports.count}`;
    case 'badge':
      return `- Badges: ${inventory.badges.count}`;
    case 'ci-summary':
      return `- CI summaries: ${inventory.ciSummaries.count}`;
    case 'release-notes':
      return `- Release notes: ${inventory.releaseNotes.count}`;
    case 'run':
      return `- Runs: ${inventory.runs.count}`;
  }
}

function formatTypeLatestLine(inventory: ArtifactInventory, type: ArtifactInventoryFilterType) {
  switch (type) {
    case 'task':
      return inventory.tasks.latest
        ? `- Latest task: ${inlineCode(inventory.tasks.latest.title)} (${inlineCode(
            inventory.tasks.latest.status,
          )}) - ${inlineCode(inventory.tasks.latest.path)}`
        : '- Latest task: not found';
    case 'verification':
      return inventory.verificationReports.latest
        ? `- Latest verification: ${inlineCode(
            inventory.verificationReports.latest.overallStatus,
          )} - ${inlineCode(inventory.verificationReports.latest.path)}`
        : '- Latest verification: not found';
    case 'handoff':
      return formatNamedArtifact('Latest handoff', inventory.handoffs.latest);
    case 'html-report':
      return formatPathArtifact('Latest HTML report', inventory.htmlReports.latest);
    case 'badge':
      return formatPathArtifact('Latest badge', inventory.badges.latest);
    case 'ci-summary':
      return formatNamedArtifact('Latest CI summary', inventory.ciSummaries.latest);
    case 'release-notes':
      return formatNamedArtifact('Latest release notes', inventory.releaseNotes.latest);
    case 'run':
      return formatRunArtifact('Latest run', inventory.runs.latest);
  }
}

function renderNoArtifactMatch(type?: ArtifactInventoryFilterType) {
  const message = type
    ? `No ${artifactInventoryDisplayLabels[type]} artifacts found.`
    : 'No AgentLoopKit artifacts found.';
  const nextStep = type
    ? artifactInventoryNextSteps[type]
    : 'run `agentloop create-task` to create a task contract, then `agentloop verify` when verification is ready.';

  return `# AgentLoopKit Artifacts

${message}

Next step: ${nextStep}
`;
}

function renderLatestArtifactInventoryMarkdown(
  inventory: ArtifactInventory,
  options: ArtifactInventoryRenderOptions,
) {
  const lines = selectedArtifactTypes(options)
    .filter((type) => latestArtifactForType(inventory, type))
    .map((type) => formatTypeLatestLine(inventory, type));

  if (!lines.length) return renderNoArtifactMatch(options.type);

  return `# AgentLoopKit Artifacts

${lines.join('\n')}
`;
}

function renderFilteredArtifactInventoryMarkdown(
  inventory: ArtifactInventory,
  type: ArtifactInventoryFilterType,
) {
  if (countForType(inventory, type) === 0) return renderNoArtifactMatch(type);

  return `# AgentLoopKit Artifacts

${formatTypeCountLine(inventory, type)}
${formatTypeLatestLine(inventory, type)}
`;
}

export function renderArtifactInventoryMarkdown(
  inventory: ArtifactInventory,
  options: ArtifactInventoryRenderOptions = {},
) {
  if (options.latest) return renderLatestArtifactInventoryMarkdown(inventory, options);
  if (options.type) return renderFilteredArtifactInventoryMarkdown(inventory, options.type);

  return `# AgentLoopKit Artifacts

- Tasks: ${inventory.tasks.count} total${formatTaskCounts(inventory.tasks.byStatus)}
${
  inventory.tasks.latest
    ? `- Latest task: ${inlineCode(inventory.tasks.latest.title)} (${inlineCode(
        inventory.tasks.latest.status,
      )}) - ${inlineCode(inventory.tasks.latest.path)}`
    : '- Latest task: not found'
}
- Verification reports: ${inventory.verificationReports.count}
${
  inventory.verificationReports.latest
    ? `- Latest verification: ${inlineCode(
        inventory.verificationReports.latest.overallStatus,
      )} - ${inlineCode(inventory.verificationReports.latest.path)}`
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
- Runs: ${inventory.runs.count}
${formatRunArtifact('Latest run', inventory.runs.latest)}
`;
}
