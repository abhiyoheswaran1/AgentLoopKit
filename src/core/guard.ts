import path from 'node:path';
import { readFile } from 'node:fs/promises';
import type { AgentLoopConfig } from './config.js';
import {
  buildEvidenceMap,
  compactEvidenceMap,
  type CompactEvidenceMap,
  type EvidenceMap,
} from './evidence-map.js';
import {
  buildContextBudget,
  renderContextBudgetMarkdown,
  type ContextBudgetSummary,
} from './context-budget.js';
import { formatTimestamp } from './dates.js';
import { resolveOutputArtifactPath } from './artifact-paths.js';
import { resolveUniqueOutputArtifactPath } from './artifacts.js';
import { AgentLoopError } from './errors.js';
import { writeTextFile } from './file-system.js';
import {
  escapeMarkdownProse,
  singleLineInlineCode as inlineCode,
} from './markdown-format.js';
import { toSafeDisplayPath } from './display-path.js';
import type { GitFileStatus } from './git.js';

export type GuardStatus = 'pass' | 'warn' | 'fail';
export type GuardFindingSeverity = 'info' | 'warn' | 'fail';

export type GuardFinding = {
  id: string;
  severity: GuardFindingSeverity;
  message: string;
  paths?: string[];
  nextAction?: string;
};

export type GuardContextBudget = {
  [K in keyof ContextBudgetSummary]: ContextBudgetSummary[K];
};

export type GuardBaselineFile = Pick<GitFileStatus, 'path' | 'status'>;

export type GuardBaseline = {
  createdAt: string;
  changedFiles: GuardBaselineFile[];
};

export type GuardBaselineSummary = {
  path: string;
  loaded?: true;
  written?: true;
  baselineChangedFileCount?: number;
  changedFileCount?: number;
  currentChangedFileCount?: number;
  newChangedFileCount?: number;
  newChangedFileExamples?: string[];
};

export type GuardReportSummary = {
  written: true;
  path: string;
};

export type GuardSnapshot = {
  mode: 'snapshot';
  iteration?: number;
  status: GuardStatus;
  strict: boolean;
  evidenceMap: EvidenceMap;
  findings: GuardFinding[];
  contextBudget: GuardContextBudget;
  baseline?: GuardBaselineSummary;
  report?: GuardReportSummary;
  nextActions: EvidenceMap['nextActions'];
  claims: string[];
  safety: {
    readOnlyByDefault: true;
    writesFiles: boolean;
    localEvidenceOnly: true;
    runsVerification: false;
    readsChangedFileContents: false;
    externalNetwork: false;
  };
};

export type GuardWatchResult = {
  mode: 'watch';
  snapshots: GuardSnapshot[];
};

export type CompactGuardFinding = GuardFinding & {
  pathCount?: number;
  pathsOmitted?: true;
  handle?: 'evidence-map:current';
  command?: 'agentloop context show evidence-map:current';
};

export type CompactGuardSnapshot = Omit<GuardSnapshot, 'evidenceMap' | 'findings'> & {
  evidenceMap: CompactEvidenceMap;
  findings: CompactGuardFinding[];
};

export type CompactGuardWatchResult = Omit<GuardWatchResult, 'snapshots'> & {
  snapshots: CompactGuardSnapshot[];
};

export class GuardBaselineError extends AgentLoopError {
  constructor(message: string, public readonly baselinePath: string) {
    super(message, 'GUARD_BASELINE_INVALID');
    this.name = 'GuardBaselineError';
  }
}

const BASELINE_EXAMPLE_LIMIT = 5;
const COMPACT_FINDING_PATH_LIMIT = 5;
const CONTEXT_BUDGET_WARN_FILE_COUNT = 20;
const CONTEXT_BUDGET_WARN_TOKEN_COUNT = 2000;
const DEFAULT_GUARD_REPORT_NAME = 'guard-report.md';

function statusFromFindings(findings: GuardFinding[]): GuardStatus {
  if (findings.some((finding) => finding.severity === 'fail')) return 'fail';
  if (findings.some((finding) => finding.severity === 'warn')) return 'warn';
  return 'pass';
}

function compactGuardFinding(finding: GuardFinding): CompactGuardFinding {
  if (!finding.paths || finding.paths.length <= COMPACT_FINDING_PATH_LIMIT) return finding;
  return {
    ...finding,
    paths: finding.paths.slice(0, COMPACT_FINDING_PATH_LIMIT),
    pathCount: finding.paths.length,
    pathsOmitted: true,
    handle: 'evidence-map:current',
    command: 'agentloop context show evidence-map:current',
  };
}

export function compactGuardSnapshot(snapshot: GuardSnapshot): CompactGuardSnapshot {
  return {
    ...snapshot,
    evidenceMap: compactEvidenceMap(snapshot.evidenceMap),
    findings: snapshot.findings.map(compactGuardFinding),
  };
}

export function compactGuardWatchResult(watch: GuardWatchResult): CompactGuardWatchResult {
  return {
    ...watch,
    snapshots: watch.snapshots.map(compactGuardSnapshot),
  };
}

function buildFindings(map: EvidenceMap, contextBudget: GuardContextBudget): GuardFinding[] {
  const findings: GuardFinding[] = [];

  if (!map.task) {
    findings.push({
      id: 'task-missing',
      severity: 'fail',
      message: 'No current task contract explains this work.',
      nextAction: 'agentloop create-task',
    });
  }

  if (map.verification.label === 'missing') {
    findings.push({
      id: 'verification-missing',
      severity: 'fail',
      message: 'No verification report was found for the current task.',
      nextAction: 'agentloop verify --task-commands --progress',
    });
  } else if (map.verification.label === 'failed') {
    findings.push({
      id: 'verification-failed',
      severity: 'fail',
      message: 'The latest verification report failed.',
      nextAction: 'agentloop verify --task-commands --progress',
    });
  } else if (map.verification.label === 'stale') {
    findings.push({
      id: 'verification-stale',
      severity: 'fail',
      message: map.verification.staleReason
        ? `Verification evidence is stale: ${map.verification.staleReason}`
        : 'Verification evidence is stale for the current task.',
      nextAction: 'agentloop verify --task-commands --progress',
    });
  }

  if (map.coverage.forbiddenFileCount > 0) {
    findings.push({
      id: 'forbidden-files',
      severity: 'warn',
      message: `${map.coverage.forbiddenFileCount} changed non-evidence file(s) match task forbidden scope.`,
      paths: map.files.filter((file) => file.forbiddenByTask).map((file) => file.path),
      nextAction: map.task ? `agentloop task show ${map.task.path}` : 'agentloop create-task',
    });
  }

  if (map.coverage.unexplainedFileCount > 0) {
    findings.push({
      id: 'unexplained-files',
      severity: 'warn',
      message: `${map.coverage.unexplainedFileCount} changed non-evidence file(s) are not covered by task or run evidence.`,
      paths: map.coverage.unexplainedExamples,
      nextAction: map.task ? `agentloop task show ${map.task.path}` : 'agentloop create-task',
    });
  }

  if (map.risk.riskSensitiveFileCount > 0) {
    findings.push({
      id: 'risk-sensitive-files',
      severity: 'info',
      message: `${map.risk.riskSensitiveFileCount} risk-sensitive changed file(s) need careful review even when covered by task evidence.`,
      paths: map.risk.riskSensitiveExamples,
    });
  }

  if (
    contextBudget.nonEvidenceChangedFileCount > CONTEXT_BUDGET_WARN_FILE_COUNT ||
    contextBudget.estimatedFileListTokens > CONTEXT_BUDGET_WARN_TOKEN_COUNT
  ) {
    findings.push({
      id: 'context-budget-pressure',
      severity: 'info',
      message: 'The changed-file set is large enough that continuation context should use a compact resume pack.',
      nextAction: contextBudget.savingsCommand,
    });
  } else {
    findings.push({
      id: 'context-budget-guidance',
      severity: 'info',
      message: 'Use a compact resume pack instead of broad chat history when continuing this work.',
      nextAction: contextBudget.savingsCommand,
    });
  }

  if (!findings.some((finding) => finding.severity === 'warn' || finding.severity === 'fail')) {
    findings.unshift({
      id: 'guard-pass',
      severity: 'info',
      message: 'Local task scope, verification, and changed-file evidence are reviewable.',
      nextAction: 'agentloop ship',
    });
  }

  return findings;
}

function resolveGuardBaselinePath(options: { cwd: string; requestedPath: string }) {
  return resolveOutputArtifactPath({
    cwd: options.cwd,
    artifactType: 'guard-baseline',
    requestedPath: options.requestedPath,
    expectedDir: '.agentloop/guard',
    expectedExtension: '.json',
  });
}

function toBaselineFile(file: GitFileStatus): GuardBaselineFile {
  return {
    path: file.path,
    status: file.status,
  };
}

function assertBaseline(value: unknown, baselinePath: string): asserts value is GuardBaseline {
  if (!value || typeof value !== 'object') {
    throw new GuardBaselineError('Guard baseline must be a JSON object.', baselinePath);
  }
  const candidate = value as Partial<GuardBaseline>;
  if (typeof candidate.createdAt !== 'string' || !Array.isArray(candidate.changedFiles)) {
    throw new GuardBaselineError(
      'Guard baseline must include createdAt and changedFiles.',
      baselinePath,
    );
  }
  for (const file of candidate.changedFiles) {
    if (
      !file ||
      typeof file !== 'object' ||
      typeof (file as GuardBaselineFile).path !== 'string' ||
      typeof (file as GuardBaselineFile).status !== 'string'
    ) {
      throw new GuardBaselineError(
        'Guard baseline changedFiles entries must include path and status strings.',
        baselinePath,
      );
    }
  }
}

export async function readGuardBaseline(options: {
  cwd: string;
  baselinePath: string;
}): Promise<{ baseline: GuardBaseline; absolutePath: string; displayPath: string }> {
  const absolutePath = resolveGuardBaselinePath({
    cwd: options.cwd,
    requestedPath: options.baselinePath,
  });
  const displayPath = toSafeDisplayPath(options.cwd, absolutePath);
  const raw = await readFile(absolutePath, 'utf8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    throw new GuardBaselineError('Guard baseline must be valid JSON.', displayPath);
  }
  assertBaseline(parsed, displayPath);
  return { baseline: parsed, absolutePath, displayPath };
}

export async function writeGuardBaseline(options: {
  cwd: string;
  baselinePath: string;
  map: EvidenceMap;
  timestamp?: string;
}): Promise<GuardBaselineSummary> {
  const absolutePath = resolveGuardBaselinePath({
    cwd: options.cwd,
    requestedPath: options.baselinePath,
  });
  const displayPath = toSafeDisplayPath(options.cwd, absolutePath);
  const baseline: GuardBaseline = {
    createdAt: options.timestamp ?? formatTimestamp(),
    changedFiles: options.map.files
      .filter((file) => !file.agentLoopEvidence)
      .map(toBaselineFile),
  };
  await writeTextFile(absolutePath, `${JSON.stringify(baseline, null, 2)}\n`);
  return {
    written: true,
    path: displayPath,
    changedFileCount: baseline.changedFiles.length,
  };
}

function compareBaseline(input: {
  displayPath: string;
  baseline: GuardBaseline;
  map: EvidenceMap;
}): GuardBaselineSummary {
  const baselinePaths = new Set(input.baseline.changedFiles.map((file) => file.path));
  const nonEvidenceFiles = input.map.files.filter((file) => !file.agentLoopEvidence);
  const newFiles = nonEvidenceFiles.filter((file) => !baselinePaths.has(file.path));
  return {
    loaded: true,
    path: input.displayPath,
    baselineChangedFileCount: input.baseline.changedFiles.length,
    currentChangedFileCount: nonEvidenceFiles.length,
    newChangedFileCount: newFiles.length,
    newChangedFileExamples: newFiles.slice(0, BASELINE_EXAMPLE_LIMIT).map((file) => file.path),
  };
}

export async function buildGuardSnapshot(options: {
  cwd: string;
  config: AgentLoopConfig;
  strict?: boolean;
  baselinePath?: string;
  iteration?: number;
  writesFiles?: boolean;
}): Promise<GuardSnapshot> {
  const evidenceMap = await buildEvidenceMap({
    cwd: options.cwd,
    config: options.config,
    taskEvidenceMode: 'current-work',
  });
  const contextBudget = buildContextBudget({ evidenceMap });
  const findings = buildFindings(evidenceMap, contextBudget);
  const baseline = options.baselinePath
    ? await readGuardBaseline({
        cwd: options.cwd,
        baselinePath: options.baselinePath,
      }).then((result) =>
        compareBaseline({
          displayPath: result.displayPath,
          baseline: result.baseline,
          map: evidenceMap,
        }),
      )
    : undefined;

  return {
    mode: 'snapshot',
    ...(options.iteration !== undefined ? { iteration: options.iteration } : {}),
    status: statusFromFindings(findings),
    strict: Boolean(options.strict),
    evidenceMap,
    findings,
    contextBudget,
    ...(baseline ? { baseline } : {}),
    nextActions: evidenceMap.nextActions,
    claims: [
      ...evidenceMap.claims,
      'Guard context-budget values are estimates for context planning, not provider billing measurements.',
    ],
    safety: {
      readOnlyByDefault: true,
      writesFiles: Boolean(options.writesFiles),
      localEvidenceOnly: true,
      runsVerification: false,
      readsChangedFileContents: false,
      externalNetwork: false,
    },
  };
}

function sentence(value: string) {
  const trimmed = value.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

export function renderGuardMarkdown(snapshot: GuardSnapshot) {
  const findings = snapshot.findings
    .map((finding) => {
      const paths = finding.paths?.length ? ` Paths: ${finding.paths.map(inlineCode).join(', ')}.` : '';
      const nextAction = finding.nextAction ? ` Next: ${inlineCode(finding.nextAction)}.` : '';
      return `- ${inlineCode(finding.id)} ${inlineCode(finding.severity)} - ${escapeMarkdownProse(
        sentence(finding.message),
      )}${paths}${nextAction}`;
    })
    .join('\n');
  const baseline = snapshot.baseline
    ? `
## Baseline

- Path: ${inlineCode(snapshot.baseline.path)}
- Existing changed files: ${inlineCode(
        String(snapshot.baseline.baselineChangedFileCount ?? snapshot.baseline.changedFileCount ?? 0),
      )}
- Current changed files: ${inlineCode(String(snapshot.baseline.currentChangedFileCount ?? 0))}
- New changed files: ${inlineCode(String(snapshot.baseline.newChangedFileCount ?? 0))}
- New examples: ${
        snapshot.baseline.newChangedFileExamples?.length
          ? snapshot.baseline.newChangedFileExamples.map(inlineCode).join(', ')
          : 'none'
      }
`
    : '';
  const nextActions = snapshot.nextActions
    .map((action) => `- ${inlineCode(action.command)} - ${escapeMarkdownProse(action.reason)}`)
    .join('\n');

  return `# AgentLoopKit Guard

- Status: ${inlineCode(snapshot.status)}
${snapshot.iteration === undefined ? '' : `- Iteration: ${inlineCode(String(snapshot.iteration))}\n`}- Strict: ${inlineCode(String(snapshot.strict))}
- Reviewability: ${inlineCode(snapshot.evidenceMap.summary.reviewability)}
- Changed files: ${inlineCode(String(snapshot.evidenceMap.summary.changedFileCount))} total; ${inlineCode(
    String(snapshot.evidenceMap.summary.nonEvidenceChangedFileCount),
  )} non-evidence.
- Verification: ${inlineCode(snapshot.evidenceMap.verification.label)}

## Findings

${findings}

${renderContextBudgetMarkdown(snapshot.contextBudget)}
${baseline}
## Next Actions

${nextActions}

## Safety

- Read-only by default: ${inlineCode(String(snapshot.safety.readOnlyByDefault))}
- Writes files in this run: ${inlineCode(String(snapshot.safety.writesFiles))}
- Runs verification: ${inlineCode(String(snapshot.safety.runsVerification))}
- Reads changed file contents: ${inlineCode(String(snapshot.safety.readsChangedFileContents))}
- External network: ${inlineCode(String(snapshot.safety.externalNetwork))}

## Claims

${snapshot.claims.map((claim) => `- ${escapeMarkdownProse(claim)}`).join('\n')}
`;
}

export async function writeGuardReport(options: {
  cwd: string;
  config: AgentLoopConfig;
  snapshot: GuardSnapshot;
  outPath?: string;
  timestamp?: string;
}): Promise<GuardReportSummary> {
  const timestamp = options.timestamp ?? formatTimestamp();
  const requestedPath =
    options.outPath ?? path.join(options.config.paths.reportsDir, `${timestamp}-${DEFAULT_GUARD_REPORT_NAME}`);
  const absolutePath = await resolveUniqueOutputArtifactPath({
    cwd: options.cwd,
    artifactType: 'report',
    requestedPath,
    expectedDir: options.config.paths.reportsDir,
    expectedExtension: '.md',
  });
  const report = renderGuardMarkdown({
    ...options.snapshot,
    safety: {
      ...options.snapshot.safety,
      writesFiles: true,
    },
  }).replace('# AgentLoopKit Guard', '# AgentLoopKit Guard Report');
  await writeTextFile(absolutePath, report);
  return {
    written: true,
    path: toSafeDisplayPath(options.cwd, absolutePath),
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function runGuardWatch(options: {
  cwd: string;
  config: AgentLoopConfig;
  strict?: boolean;
  intervalMs: number;
  maxIterations?: number;
  onSnapshot?: (snapshot: GuardSnapshot) => void;
}): Promise<GuardWatchResult> {
  const snapshots: GuardSnapshot[] = [];
  let iteration = 0;
  while (options.maxIterations === undefined || iteration < options.maxIterations) {
    iteration += 1;
    const snapshot = await buildGuardSnapshot({
      cwd: options.cwd,
      config: options.config,
      strict: options.strict,
      iteration,
    });
    snapshots.push(snapshot);
    options.onSnapshot?.(snapshot);
    if (options.maxIterations !== undefined && iteration >= options.maxIterations) break;
    await sleep(options.intervalMs);
  }
  return {
    mode: 'watch',
    snapshots,
  };
}
