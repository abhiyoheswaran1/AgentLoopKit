import path from 'node:path';
import { readFile } from 'node:fs/promises';
import type { AgentLoopConfig } from './config.js';
import { isAgentLoopEvidenceFile } from './agentloop-evidence.js';
import { classifyChangedFiles } from './change-areas.js';
import {
  resolveCurrentOrLatestRunTaskVerificationEvidence,
  resolveCurrentWorkTaskVerificationEvidence,
} from './evidence.js';
import { getGitStatus, parseGitStatus, type GitFileStatus } from './git.js';
import {
  escapeMarkdownProse,
  singleLineInlineCode as inlineCode,
} from './markdown-format.js';
import { listItems, sectionContent } from './markdown-sections.js';
import { listRuns, readRunChangedFiles, type RunSummary } from './runs.js';
import { readTaskContract, type TaskContract } from './task-state.js';
import { toSafeDisplayPath } from './display-path.js';

export type EvidenceMapReviewability =
  | 'reviewable'
  | 'needs-attention'
  | 'blocked'
  | 'evidence-only';

export type EvidenceMapVerification = {
  status: 'pass' | 'fail' | 'missing' | 'unknown';
  fresh: boolean;
  label: 'fresh' | 'stale' | 'missing' | 'failed' | 'unknown';
  path?: string;
  staleReason?: string;
};

export type EvidenceMapTask = {
  path: string;
  title: string;
  status: string;
};

export type EvidenceMapRunCoverage = {
  id: string;
  command: RunSummary['command'];
  taskTitle: string;
};

export type EvidenceMapFile = GitFileStatus & {
  area: string;
  agentLoopEvidence: boolean;
  coveredByTask: boolean;
  coveredByRun: boolean;
  forbiddenByTask: boolean;
  riskSensitive: boolean;
  unexplained: boolean;
  explanation: string;
  runCoverage?: EvidenceMapRunCoverage;
};

export type EvidenceMapNextAction = {
  command: string;
  reason: string;
};

export type EvidenceMap = {
  summary: {
    reviewability: EvidenceMapReviewability;
    changedFileCount: number;
    nonEvidenceChangedFileCount: number;
    agentLoopEvidenceChangedFileCount: number;
  };
  task: EvidenceMapTask | null;
  verification: EvidenceMapVerification;
  files: EvidenceMapFile[];
  coverage: {
    coveredFileCount: number;
    unexplainedFileCount: number;
    forbiddenFileCount: number;
    unexplainedExamples: string[];
  };
  risk: {
    riskSensitiveFileCount: number;
    riskSensitiveExamples: string[];
  };
  nextActions: EvidenceMapNextAction[];
  claims: string[];
};

export type CompactEvidenceMap = Omit<EvidenceMap, 'files'> & {
  fileList: {
    omitted: true;
    changedFileCount: number;
    handle: 'evidence-map:current';
    command: 'agentloop context show evidence-map:current';
    reason: string;
  };
};

export type EvidenceMapTaskEvidenceMode = 'current-or-latest-run' | 'current-work';

type PathPattern = {
  value: string;
  kind: 'file' | 'directory';
};

type RecentRunCoverage = {
  run: RunSummary;
  paths: Set<string>;
};

const DEFAULT_RECENT_RUN_LIMIT = 10;
const EXAMPLE_LIMIT = 5;
const CLAIMS = [
  'Evidence coverage is path-based local AgentLoopKit evidence, not proof of code correctness.',
  'The evidence map does not read changed file contents, call external APIs, publish, tag, or upload artifacts.',
];

export function compactEvidenceMap(evidenceMap: EvidenceMap): CompactEvidenceMap {
  const { files, ...compact } = evidenceMap;
  return {
    ...compact,
    fileList: {
      omitted: true,
      changedFileCount: files.length,
      handle: 'evidence-map:current',
      command: 'agentloop context show evidence-map:current',
      reason:
        'Full changed-file detail is omitted from compact JSON/MCP context packs; expand the local evidence-map handle only when needed.',
    },
  };
}

function normalizePath(value: string) {
  return value.trim().replace(/\\/g, '/').replace(/^\.\/+/, '');
}

function comparableTaskPath(value: string) {
  const normalized = normalizePath(value);
  const archivePrefix = '.agentloop/tasks/archive/';
  if (normalized.startsWith(archivePrefix)) {
    return `.agentloop/tasks/${path.posix.basename(normalized)}`;
  }
  return normalized;
}

function sameTaskPath(left: string | undefined, right: string | undefined) {
  if (!left || !right) return false;
  return comparableTaskPath(left) === comparableTaskPath(right);
}

function unwrapInlineCode(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/^`([^`].*?)`$/);
  return match ? match[1].trim() : trimmed;
}

function meaningfulSectionItems(markdown: string, heading: string) {
  return listItems(sectionContent(markdown, heading))
    .map((item) => normalizePath(unwrapInlineCode(item)))
    .filter((item) => item && !/^none recorded yet\.?$/i.test(item));
}

function toPathPatterns(values: string[]): PathPattern[] {
  return values.map((value) => {
    const normalized = normalizePath(value).replace(/\/+$/, '');
    return {
      value: normalized,
      kind: value.endsWith('/') || !/\.[^/]+$/.test(path.posix.basename(normalized))
        ? 'directory'
        : 'file',
    };
  });
}

function pathMatchesPattern(filePath: string, pattern: PathPattern) {
  const normalizedFile = normalizePath(filePath);
  if (pattern.kind === 'file') return normalizedFile === pattern.value;
  return normalizedFile === pattern.value || normalizedFile.startsWith(`${pattern.value}/`);
}

function pathMatchesAny(filePath: string, patterns: PathPattern[]) {
  return patterns.some((pattern) => pathMatchesPattern(filePath, pattern));
}

function areaByPath(changedFiles: GitFileStatus[]) {
  const areas = new Map<string, string>();
  for (const area of classifyChangedFiles(changedFiles)) {
    for (const file of area.files) areas.set(normalizePath(file.path), area.key);
  }
  return areas;
}

function isTestPath(filePath: string) {
  return /(^|\/)(tests?|__tests__)\//.test(filePath) || /\.(test|spec)\.[cm]?[jt]sx?$/.test(filePath);
}

function isRiskSensitivePath(filePath: string) {
  if (isTestPath(filePath)) return false;
  return (
    /(^|\/)(migrations?|migration|auth|security|billing|deploy|deployment)(\/|\.|-|_|$)/.test(
      filePath,
    ) ||
    /(^|\/)\.env(\.|$)/.test(filePath) ||
    /(^|\/)(package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?|Cargo\.lock|poetry\.lock)$/.test(
      filePath,
    )
  );
}

function evidenceArea(filePath: string, fallback: string) {
  if (isTestPath(filePath)) return 'tests';
  if (isRiskSensitivePath(filePath)) return 'risk';
  return fallback;
}

function verificationStatusFromMarkdown(markdown: string | undefined): EvidenceMapVerification['status'] {
  const status = markdown
    ?.match(/Overall status:\s*([a-z-]+)/i)?.[1]
    ?.trim()
    .toLowerCase();
  if (status === 'pass' || status === 'fail') return status;
  if (status) return 'unknown';
  return 'missing';
}

function verificationLabel(input: {
  status: EvidenceMapVerification['status'];
  fresh: boolean;
}): EvidenceMapVerification['label'] {
  if (input.status === 'missing') return 'missing';
  if (input.status === 'fail') return 'failed';
  if (!input.fresh) return 'stale';
  if (input.status === 'pass') return 'fresh';
  return 'unknown';
}

async function readVerification(options: {
  cwd: string;
  currentReportPath?: string;
  latestReportPath?: string;
  staleReport?: { message: string; relativePath: string };
}): Promise<EvidenceMapVerification> {
  const reportPath = options.currentReportPath ?? options.latestReportPath;
  const markdown = reportPath ? await readFile(reportPath, 'utf8') : undefined;
  const status = verificationStatusFromMarkdown(markdown);
  const fresh = Boolean(options.currentReportPath && !options.staleReport && status === 'pass');
  const label = verificationLabel({ status, fresh });
  return {
    status,
    fresh,
    label,
    ...(reportPath ? { path: toSafeDisplayPath(options.cwd, reportPath) } : {}),
    ...(options.staleReport ? { staleReason: options.staleReport.message } : {}),
  };
}

async function readRecentRunCoverage(options: {
  cwd: string;
  taskPath?: string;
  recentRunLimit: number;
  runSummaries?: RunSummary[] | Promise<RunSummary[]>;
}): Promise<RecentRunCoverage[]> {
  const taskPath = options.taskPath ? normalizePath(toSafeDisplayPath(options.cwd, options.taskPath)) : undefined;
  const availableRuns = options.runSummaries
    ? await options.runSummaries
    : await listRuns(options.cwd, {
        hydrateTask: false,
        limit: options.recentRunLimit,
        taskPath: options.taskPath,
      });
  const runs = availableRuns
    .filter((run) => !taskPath || sameTaskPath(run.task?.path, taskPath))
    .slice(0, options.recentRunLimit);

  const coverage: RecentRunCoverage[] = [];
  for (const run of runs) {
    const changedFiles = await readRunChangedFiles(options.cwd, run.id).catch(() => undefined);
    if (!changedFiles) continue;
    coverage.push({
      run,
      paths: new Set(changedFiles.map((file) => normalizePath(file.path))),
    });
  }
  return coverage;
}

function findRunCoverage(filePath: string, runs: RecentRunCoverage[], currentTaskTitle?: string) {
  const normalizedPath = normalizePath(filePath);
  for (const run of runs) {
    if (!run.paths.has(normalizedPath)) continue;
    return {
      id: run.run.id,
      command: run.run.command,
      taskTitle: currentTaskTitle ?? run.run.task?.title ?? 'unknown task',
    };
  }
  return undefined;
}

function explanationFor(input: {
  agentLoopEvidence: boolean;
  forbiddenByTask: boolean;
  coveredByTask: boolean;
  coveredByRun: boolean;
  riskSensitive: boolean;
}) {
  if (input.agentLoopEvidence) return 'Generated AgentLoopKit evidence; excluded from unexplained implementation scope.';
  if (input.forbiddenByTask) return 'Changed file matches the task forbidden-file scope.';
  if (input.coveredByTask) return 'Changed file matches the task likely-file scope.';
  if (input.coveredByRun) return 'Changed file appears in recent local run-ledger evidence for this task.';
  if (input.riskSensitive) return 'Risk-sensitive changed file lacks local path evidence tying it to the current task.';
  return 'No local task or recent run evidence explains this changed file path.';
}

function reviewability(input: {
  task: TaskContract | null;
  verification: EvidenceMapVerification;
  files: EvidenceMapFile[];
}) {
  const nonEvidenceFiles = input.files.filter((file) => !file.agentLoopEvidence);
  if (nonEvidenceFiles.length === 0 && input.files.length > 0) return 'evidence-only';
  if (!input.task) return 'blocked';
  if (input.verification.status === 'missing' || input.verification.status === 'fail') {
    return 'blocked';
  }
  if (!input.verification.fresh) return 'blocked';
  if (input.files.some((file) => file.unexplained || file.forbiddenByTask)) {
    return 'needs-attention';
  }
  return 'reviewable';
}

function nextActions(input: {
  task: TaskContract | null;
  verification: EvidenceMapVerification;
  unexplainedCount: number;
  forbiddenCount: number;
}) {
  const actions: EvidenceMapNextAction[] = [];
  if (!input.task) {
    actions.push({
      command: 'agentloop create-task',
      reason: 'No current task contract was found for the changed files.',
    });
  }
  if (input.verification.status === 'missing') {
    actions.push({
      command: 'agentloop verify --task-commands --progress',
      reason: 'No verification report was found for the current task.',
    });
  } else if (input.verification.status === 'fail') {
    actions.push({
      command: 'agentloop verify --task-commands --progress',
      reason: 'The latest verification report failed. Fix failures and rerun verification.',
    });
  } else if (!input.verification.fresh) {
    actions.push({
      command: 'agentloop verify --task-commands --progress',
      reason: 'Verification evidence is stale for the current task. Rerun verification.',
    });
  }
  if (input.task && (input.unexplainedCount > 0 || input.forbiddenCount > 0)) {
    const parts = [
      input.unexplainedCount > 0
        ? `${input.unexplainedCount} unexplained non-evidence file(s)`
        : '',
      input.forbiddenCount > 0 ? `${input.forbiddenCount} forbidden file(s)` : '',
    ].filter(Boolean);
    actions.push({
      command: `agentloop task show ${input.task.path}`,
      reason: `Review task scope before handoff: ${parts.join('; ')}.`,
    });
  }
  if (!actions.length) {
    actions.push({
      command: 'agentloop ship',
      reason: 'Local task, verification, and changed-file evidence look reviewable.',
    });
  }
  return actions;
}

export async function buildEvidenceMap(options: {
  cwd: string;
  config: AgentLoopConfig;
  changedFiles?: GitFileStatus[];
  recentRunLimit?: number;
  runSummaries?: RunSummary[] | Promise<RunSummary[]>;
  taskEvidenceMode?: EvidenceMapTaskEvidenceMode;
}): Promise<EvidenceMap> {
  const evidence =
    options.taskEvidenceMode === 'current-work'
      ? await resolveCurrentWorkTaskVerificationEvidence(options)
      : await resolveCurrentOrLatestRunTaskVerificationEvidence(options);
  const task = evidence.taskPath
    ? await readTaskContract({
        cwd: options.cwd,
        config: options.config,
        taskPath: evidence.taskPath,
      })
    : null;
  const verification = await readVerification({
    cwd: options.cwd,
    currentReportPath: evidence.currentReportPath,
    latestReportPath: evidence.latestReportPath,
    staleReport: evidence.staleReport,
  });
  const changedFiles = options.changedFiles ?? (await parseGitStatus(await getGitStatus(options.cwd)));
  const areas = areaByPath(changedFiles);
  const likelyPatterns = task
    ? toPathPatterns(meaningfulSectionItems(task.content, 'Likely Files or Areas'))
    : [];
  const forbiddenPatterns = task
    ? toPathPatterns(meaningfulSectionItems(task.content, 'Files or Areas Not to Touch'))
    : [];
  const runs = await readRecentRunCoverage({
    cwd: options.cwd,
    taskPath: evidence.taskPath,
    recentRunLimit: options.recentRunLimit ?? DEFAULT_RECENT_RUN_LIMIT,
    runSummaries: options.runSummaries,
  });

  const files = changedFiles.map((file): EvidenceMapFile => {
    const normalizedPath = normalizePath(file.path);
    const area = evidenceArea(normalizedPath, areas.get(normalizedPath) ?? 'other');
    const agentLoopEvidence = isAgentLoopEvidenceFile(file.path);
    const coveredByTask = !agentLoopEvidence && pathMatchesAny(file.path, likelyPatterns);
    const runCoverage = agentLoopEvidence ? undefined : findRunCoverage(file.path, runs, task?.title);
    const coveredByRun = Boolean(runCoverage);
    const forbiddenByTask = !agentLoopEvidence && pathMatchesAny(file.path, forbiddenPatterns);
    const riskSensitive = !agentLoopEvidence && isRiskSensitivePath(normalizedPath);
    const unexplained = !agentLoopEvidence && (!coveredByTask && !coveredByRun || forbiddenByTask);
    return {
      ...file,
      path: normalizePath(file.path),
      area,
      agentLoopEvidence,
      coveredByTask,
      coveredByRun,
      forbiddenByTask,
      riskSensitive,
      unexplained,
      explanation: explanationFor({
        agentLoopEvidence,
        coveredByTask,
        coveredByRun,
        forbiddenByTask,
        riskSensitive,
      }),
      ...(runCoverage ? { runCoverage } : {}),
    };
  });

  const nonEvidenceFiles = files.filter((file) => !file.agentLoopEvidence);
  const agentLoopEvidenceChangedFileCount = files.length - nonEvidenceFiles.length;
  const coveredFileCount = nonEvidenceFiles.filter(
    (file) => !file.unexplained && (file.coveredByTask || file.coveredByRun),
  ).length;
  const unexplainedFiles = nonEvidenceFiles.filter((file) => file.unexplained);
  const forbiddenFiles = nonEvidenceFiles.filter((file) => file.forbiddenByTask);
  const riskSensitiveFiles = nonEvidenceFiles.filter((file) => file.riskSensitive);
  const taskSummary = task
    ? {
        path: task.path,
        title: task.title,
        status: task.status,
      }
    : null;

  return {
    summary: {
      reviewability: reviewability({ task, verification, files }),
      changedFileCount: files.length,
      nonEvidenceChangedFileCount: nonEvidenceFiles.length,
      agentLoopEvidenceChangedFileCount,
    },
    task: taskSummary,
    verification,
    files,
    coverage: {
      coveredFileCount,
      unexplainedFileCount: unexplainedFiles.length,
      forbiddenFileCount: forbiddenFiles.length,
      unexplainedExamples: unexplainedFiles.slice(0, EXAMPLE_LIMIT).map((file) => file.path),
    },
    risk: {
      riskSensitiveFileCount: riskSensitiveFiles.length,
      riskSensitiveExamples: riskSensitiveFiles.slice(0, EXAMPLE_LIMIT).map((file) => file.path),
    },
    nextActions: nextActions({
      task,
      verification,
      unexplainedCount: unexplainedFiles.length,
      forbiddenCount: forbiddenFiles.length,
    }),
    claims: CLAIMS,
  };
}

function escapedInlinePath(filePath: string) {
  return inlineCode(escapeMarkdownProse(filePath));
}

function renderExamples(values: string[]) {
  return values.length ? values.map(escapedInlinePath).join(', ') : 'none';
}

export function renderEvidenceMapCompactMarkdown(
  map: Pick<EvidenceMap, 'summary' | 'coverage' | 'verification' | 'risk'>,
) {
  return `- Evidence map: ${inlineCode(String(map.summary.changedFileCount))} changed file(s); ${inlineCode(
    String(map.coverage.coveredFileCount),
  )} covered, ${inlineCode(String(map.coverage.unexplainedFileCount))} unexplained; verification ${inlineCode(
    map.verification.label,
  )}; ${inlineCode(String(map.risk.riskSensitiveFileCount))} risk-sensitive.`;
}

function renderChangedFileDetails(files: EvidenceMapFile[]) {
  if (!files.length) return '- None.';
  return files
    .map((file) => {
      const flags = [
        `area:${file.area}`,
        file.agentLoopEvidence ? 'agentloop-evidence' : undefined,
        file.coveredByTask ? 'covered-by-task' : undefined,
        file.coveredByRun
          ? `covered-by-run:${file.runCoverage?.id ?? 'unknown'}`
          : undefined,
        file.forbiddenByTask ? 'forbidden-by-task' : undefined,
        file.riskSensitive ? 'risk-sensitive' : undefined,
        file.unexplained ? 'unexplained' : undefined,
      ].filter((flag): flag is string => Boolean(flag));
      const flagText = flags.map((flag) => inlineCode(flag)).join(', ');
      return `- ${inlineCode(file.path)} (${inlineCode(file.status)}): ${flagText} - ${escapeMarkdownProse(
        file.explanation,
      )}`;
    })
    .join('\n');
}

export function renderEvidenceMapMarkdown(map: EvidenceMap) {
  const nextActions = map.nextActions
    .map((action) => `- ${inlineCode(action.command)} - ${escapeMarkdownProse(action.reason)}`)
    .join('\n');
  const unexplained = renderExamples(map.coverage.unexplainedExamples);
  const risky = renderExamples(map.risk.riskSensitiveExamples);
  const task = map.task
    ? `${inlineCode(map.task.title)} (${inlineCode(map.task.status)}) - ${inlineCode(map.task.path)}`
    : 'No current task evidence.';

  return `# AgentLoopKit Evidence Map

- Reviewability: ${inlineCode(map.summary.reviewability)}
- Task: ${task}
- Changed files: ${inlineCode(String(map.summary.changedFileCount))} total; ${inlineCode(
    String(map.summary.nonEvidenceChangedFileCount),
  )} non-evidence, ${inlineCode(String(map.summary.agentLoopEvidenceChangedFileCount))} AgentLoop evidence.
- Coverage: ${inlineCode(String(map.coverage.coveredFileCount))} covered, ${inlineCode(
    String(map.coverage.unexplainedFileCount),
  )} unexplained.
- Verification: ${inlineCode(map.verification.label)}${
    map.verification.path ? ` - ${inlineCode(map.verification.path)}` : ''
  }
- Risk-sensitive files: ${inlineCode(String(map.risk.riskSensitiveFileCount))}
- Unexplained examples: ${unexplained}
- Risk examples: ${risky}

## Changed Files

${renderChangedFileDetails(map.files)}

## Claims

${map.claims.map((claim) => `- ${escapeMarkdownProse(claim)}`).join('\n')}

## Next Actions

${nextActions}
`;
}
