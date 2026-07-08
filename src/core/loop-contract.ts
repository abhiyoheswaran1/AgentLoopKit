import path from 'node:path';
import { mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import type { AgentLoopConfig } from './config.js';
import { buildContextPack } from './context-contract.js';
import { buildContextBudget } from './context-budget.js';
import { formatDate, formatTimestamp } from './dates.js';
import { AgentLoopError } from './errors.js';
import { buildEvidenceMap } from './evidence-map.js';
import { resolvesInsidePath } from './file-system.js';
import {
  BLOCKED_LOOP_RUNNER_COMMANDS,
  DEFAULT_LOOP_RUNNER_OUTPUT_CHARS,
  createRunnerConfig,
  executeLoopRunner,
  type LoopRunnerConfig,
  type LoopRunnerExecution,
} from './loop-runner.js';
import {
  escapeMarkdownProse,
  singleLineInlineCode as inlineCode,
} from './markdown-format.js';
import { evaluateReady, type ReadyStatus } from './ready.js';
import { slugify } from './slug.js';
import { createTaskContractFile } from './task-contract.js';
import { setActiveTask } from './task-state.js';
import {
  buildTokenReceipt,
  renderTokenReceiptMarkdown,
  type AgentLoopTokenReceipt,
} from './token-receipt.js';

export type LoopCadence = 'manual';
export type LoopStatus = 'active' | 'blocked' | 'stopped' | 'complete';
export type LoopDecision = 'continue' | 'stop' | 'ready' | 'ask-human';
export type LoopPreset =
  | 'agentloopkit-maintenance'
  | 'docs-drift'
  | 'release-readiness'
  | 'baseframe-integration';

export type LoopSuggestedCommand = {
  command: string;
  reason: string;
  required: boolean;
};

export type LoopIteration = {
  index: number;
  createdAt: string;
  readinessStatus: ReadyStatus;
  decision: LoopDecision;
  stopReason?: string;
  nextAction: string;
  contextHandles: string[];
  tokenReceipt: AgentLoopTokenReceipt;
  runner?: LoopRunnerExecution;
};

export type AgentLoopLoopContractV1 = {
  schemaVersion: '1.0';
  kind: 'agentloop-loop';
  id: string;
  path: string;
  goal: string;
  cadence: LoopCadence;
  status: LoopStatus;
  stopReason?: string;
  createdAt: string;
  updatedAt: string;
  budget: {
    maxEstimatedTokens: number;
    maxIterations: number;
    usedEstimatedTokens: number;
  };
  controls: {
    agentNeutral: true;
    externalAgentExecution: false;
    externalRunnerExecution?: boolean;
    localEvidenceOnly: true;
  };
  runner?: LoopRunnerConfig;
  guardrails?: {
    requireExplicitRunner: true;
    shell: false;
    rejectShellMetacharacters: true;
    blockedCommands: string[];
    maxOutputChars: number;
  };
  task: {
    nativeTaskPath: string;
  };
  suggestedCommands: LoopSuggestedCommand[];
  stopConditions: string[];
  iterations: LoopIteration[];
  latestTokenReceipt: AgentLoopTokenReceipt;
  safety: {
    writesLoopContract: boolean;
    writesNativeTask: boolean;
    commandsExecuted: string[];
    externalNetwork: false;
    publishes: false;
  };
};

export type LoopCreateResult = {
  loop: AgentLoopLoopContractV1;
  markdown: string;
};

export type LoopTickResult = {
  loop: AgentLoopLoopContractV1;
  iteration: LoopIteration;
  markdown: string;
};

export type LoopRunResult = LoopTickResult;

export type LoopScorecardDecision = 'continue' | 'ask-human' | 'stop' | 'ready';

export type LoopScorecardReason = {
  code: string;
  severity: 'info' | 'warning' | 'blocking';
  message: string;
};

export type LoopScorecardResult = {
  decision: LoopScorecardDecision;
  reasons: LoopScorecardReason[];
  loop: {
    id: string;
    status: LoopStatus;
    iterations: number;
    maxIterations: number;
    runnerConfigured: boolean;
    nextAction: string;
  };
  readiness: {
    status: ReadyStatus;
    nextAction: string;
  };
  tokenBudget: {
    maxEstimatedTokens: number;
    usedEstimatedTokens: number;
    remainingEstimatedTokens: number;
    latestNetContextReductionTokens: number;
    latestAgentLoopOverheadTokens: number;
  };
  guardrails: {
    explicitRunnerRequired: boolean;
    shell: false;
    rejectShellMetacharacters: boolean;
    blockedCommands: string[];
    maxOutputChars: number;
    runnerCommand?: string;
  };
  context: {
    handles: string[];
    reviewability: string;
    changedFiles: number;
    nonEvidenceChangedFiles: number;
    unexplainedChangedFiles: number;
    forbiddenChangedFiles: number;
    verificationFreshness: string;
  };
  markdown: string;
  safety: {
    readOnly: true;
    localEvidenceOnly: true;
    localGitStatus: true;
    runnerExecuted: false;
    verificationCommandsRun: false;
    projectCommandsRun: false;
    externalNetwork: false;
    publishes: false;
  };
};

export type LoopStatusResult = {
  loop: AgentLoopLoopContractV1;
  summary: {
    status: LoopStatus;
    iterations: number;
    usedEstimatedTokens: number;
    maxEstimatedTokens: number;
  };
  markdown: string;
};

const LOOP_ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
const DEFAULT_MAX_TOKENS = 50_000;
const DEFAULT_MAX_ITERATIONS = 5;
const DEFAULT_LOOP_LIKELY_FILES = [
  '.agentloop',
  'src',
  'tests',
  'docs',
  'README.md',
  'CHANGELOG.md',
  'AGENTS.md',
  'AGENTLOOP.md',
  'DECISIONS.md',
];

const PRESETS: Record<
  LoopPreset,
  { goal: string; suggestedCommands: LoopSuggestedCommand[]; likelyFiles: string[] }
> = {
  'agentloopkit-maintenance': {
    goal: 'Keep AgentLoopKit tests, docs, release proof, and gates healthy',
    suggestedCommands: [
      { command: 'agentloop doctor --redact-paths', reason: 'Check local harness readiness.', required: true },
      { command: 'agentloop task doctor --redact-paths', reason: 'Check task queue hygiene.', required: true },
      { command: 'npm run maintenance:check', reason: 'Run the maintenance guard.', required: true },
      {
        command: 'npx --yes projscan doctor --format markdown',
        reason: 'Inspect repository health signals.',
        required: false,
      },
      { command: 'agentloop check-gates --strict', reason: 'Check review evidence gates.', required: true },
    ],
    likelyFiles: ['src', 'tests', 'docs', '.agentloop'],
  },
  'docs-drift': {
    goal: 'Find and fix docs that no longer match AgentLoopKit CLI behavior',
    suggestedCommands: [
      { command: 'npm run check:public-docs', reason: 'Check public documentation hygiene.', required: true },
      { command: 'npm run check:links', reason: 'Check markdown links.', required: true },
      { command: 'agentloop version', reason: 'Confirm CLI version copy.', required: false },
    ],
    likelyFiles: ['README.md', 'docs', 'src/cli'],
  },
  'release-readiness': {
    goal: 'Prepare release evidence before a maintainer-approved release',
    suggestedCommands: [
      { command: 'npm run release-flow', reason: 'Run the local release flow without publishing.', required: true },
      { command: 'agentloop release-check --strict', reason: 'Check release readiness.', required: true },
      { command: 'agentloop npm-status', reason: 'Check npm package status.', required: false },
    ],
    likelyFiles: ['CHANGELOG.md', 'docs/release-status.md', 'package.json'],
  },
  'baseframe-integration': {
    goal: 'Keep ProjScan, AgentLoopKit, and AgentFlight local JSON artifacts compatible',
    suggestedCommands: [
      { command: 'npm run test -- tests/baseframe.test.ts', reason: 'Run Baseframe contract tests.', required: true },
      { command: 'npx --yes projscan doctor --format markdown', reason: 'Check ProjScan health.', required: false },
      { command: 'agentloop check-gates --strict', reason: 'Check AgentLoopKit gates.', required: true },
    ],
    likelyFiles: ['src/core/baseframe.ts', 'tests/baseframe.test.ts', 'docs/integrations/baseframe-suite-v1.md'],
  },
};

function assertLoopId(id: string) {
  if (!LOOP_ID_PATTERN.test(id)) {
    throw new AgentLoopError(
      `Loop id must be lowercase letters, numbers, and dashes: ${id}`,
      'LOOP_PATH_INVALID',
    );
  }
}

function loopsRoot(cwd: string, config: AgentLoopConfig) {
  return path.resolve(cwd, config.paths.agentloopDir, 'loops');
}

function loopPathForId(options: { cwd: string; config: AgentLoopConfig; id: string }) {
  assertLoopId(options.id);
  const root = loopsRoot(options.cwd, options.config);
  const loopDir = path.join(root, options.id);
  const loopPath = path.join(loopDir, 'loop.json');
  if (!resolvesInsidePath(options.cwd, loopPath) || !resolvesInsidePath(root, loopPath)) {
    throw new AgentLoopError(
      `Loop path must stay inside ${options.config.paths.agentloopDir}/loops.`,
      'LOOP_PATH_INVALID',
    );
  }
  return loopPath;
}

function relativePath(cwd: string, filePath: string) {
  return path.relative(cwd, filePath).split(path.sep).join('/');
}

async function writeJsonAtomic(filePath: string, value: unknown) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const tmpPath = path.join(
    path.dirname(filePath),
    `.${path.basename(filePath)}.${process.pid}.${Date.now()}.tmp`,
  );
  try {
    await writeFile(tmpPath, `${JSON.stringify(value, null, 2)}\n`);
    await rename(tmpPath, filePath);
  } catch (error) {
    await rm(tmpPath, { force: true }).catch(() => undefined);
    throw error;
  }
}

async function readLoop(options: {
  cwd: string;
  config: AgentLoopConfig;
  id: string;
}): Promise<AgentLoopLoopContractV1> {
  const loopPath = loopPathForId(options);
  let parsed: unknown;
  try {
    parsed = JSON.parse(await readFile(loopPath, 'utf8'));
  } catch {
    throw new AgentLoopError(
      `Loop contract not found or invalid for id ${options.id}.`,
      'LOOP_NOT_FOUND',
    );
  }
  if (!parsed || typeof parsed !== 'object') {
    throw new AgentLoopError(`Loop contract is invalid for id ${options.id}.`, 'LOOP_INVALID');
  }
  return parsed as AgentLoopLoopContractV1;
}

async function latestLoopId(options: { cwd: string; config: AgentLoopConfig }) {
  const root = loopsRoot(options.cwd, options.config);
  const entries = await readdir(root, { withFileTypes: true }).catch(() => []);
  const dirs = entries
    .filter((entry) => entry.isDirectory() && LOOP_ID_PATTERN.test(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) => right.localeCompare(left));
  return dirs[0];
}

async function resolveLoopId(options: { cwd: string; config: AgentLoopConfig; id?: string }) {
  if (options.id) {
    assertLoopId(options.id);
    return options.id;
  }
  const latest = await latestLoopId(options);
  if (!latest) throw new AgentLoopError('No loop contract found.', 'LOOP_NOT_FOUND');
  return latest;
}

async function buildInitialTokenReceipt(options: { cwd: string; config: AgentLoopConfig; output: string }) {
  const evidenceMap = await buildEvidenceMap({
    cwd: options.cwd,
    config: options.config,
    taskEvidenceMode: 'current-work',
  });
  return buildTokenReceipt({
    contextBudget: buildContextBudget({
      evidenceMap,
      savingsCommand: 'agentloop context pack --for codex --goal continue --redact-paths',
    }),
    agentLoopOutput: options.output,
  });
}

function presetFromInput(preset: string | undefined): LoopPreset | undefined {
  if (!preset) return undefined;
  if (preset in PRESETS) return preset as LoopPreset;
  throw new AgentLoopError(`Unsupported loop preset: ${preset}`, 'LOOP_PRESET_INVALID');
}

function renderSuggestedCommands(commands: LoopSuggestedCommand[]) {
  if (!commands.length) return '- No suggested commands recorded.';
  return commands
    .map(
      (command) =>
        `- ${inlineCode(command.command)} - ${escapeMarkdownProse(command.reason)} Required: ${inlineCode(
          String(command.required),
        )}.`,
    )
    .join('\n');
}

function renderIterations(iterations: LoopIteration[]) {
  if (!iterations.length) return '- No iterations recorded.';
  return iterations
    .map(
      (iteration) =>
        `- ${inlineCode(`#${iteration.index}`)} ${inlineCode(iteration.decision)} - readiness ${inlineCode(
          iteration.readinessStatus,
        )}; runner ${inlineCode(iteration.runner?.status ?? 'not-run')}; net context ${inlineCode(
          String(iteration.tokenReceipt.estimatedNetContextReductionTokens),
        )}; next ${inlineCode(iteration.nextAction)}.`,
    )
    .join('\n');
}

export function renderLoopMarkdown(loop: AgentLoopLoopContractV1) {
  return `# AgentLoopKit Loop

- Goal: ${inlineCode(loop.goal)}
- Status: ${inlineCode(loop.status)}
- Cadence: ${inlineCode(loop.cadence)}
- Loop path: ${inlineCode(loop.path)}
- Native task: ${inlineCode(loop.task.nativeTaskPath)}
- Runner: ${inlineCode(loop.runner?.command ?? 'not configured')}

${loop.runner ? 'AgentLoopKit will execute only the configured runner command for this loop.' : 'AgentLoopKit will not execute a coding agent for this loop.'}

## Suggested Commands

${renderSuggestedCommands(loop.suggestedCommands)}

${renderTokenReceiptMarkdown(loop.latestTokenReceipt)}
## Stop Conditions

${loop.stopConditions.map((condition) => `- ${escapeMarkdownProse(condition)}`).join('\n')}

## Guardrails

- Explicit runner required: ${inlineCode(String(loop.guardrails?.requireExplicitRunner ?? true))}
- Shell execution: ${inlineCode(String(loop.guardrails?.shell ?? false))}
- Shell metacharacters rejected: ${inlineCode(String(loop.guardrails?.rejectShellMetacharacters ?? true))}
- Blocked command families: ${(loop.guardrails?.blockedCommands ?? BLOCKED_LOOP_RUNNER_COMMANDS)
    .map((command) => inlineCode(command))
    .join(', ')}
`;
}

export function renderLoopStatusMarkdown(result: Omit<LoopStatusResult, 'markdown'>) {
  return `# AgentLoopKit Loop Status

- Goal: ${inlineCode(result.loop.goal)}
- Status: ${inlineCode(result.loop.status)}
- Iterations: ${inlineCode(String(result.summary.iterations))}
- Used estimated tokens: ${inlineCode(String(result.summary.usedEstimatedTokens))}
- Max estimated tokens: ${inlineCode(String(result.summary.maxEstimatedTokens))}
- Next action: ${inlineCode(nextActionForLoop(result.loop))}
- Runner: ${inlineCode(result.loop.runner?.command ?? 'not configured')}

${renderTokenReceiptMarkdown(result.loop.latestTokenReceipt)}
`;
}

export function renderLoopReportMarkdown(result: Omit<LoopStatusResult, 'markdown'>) {
  return `# AgentLoopKit Loop Report

- Goal: ${inlineCode(result.loop.goal)}
- Status: ${inlineCode(result.loop.status)}
- Native task: ${inlineCode(result.loop.task.nativeTaskPath)}
- Runner: ${inlineCode(result.loop.runner?.command ?? 'not configured')}

## Token Ledger

- Used estimated tokens: ${inlineCode(String(result.loop.budget.usedEstimatedTokens))}
- Max estimated tokens: ${inlineCode(String(result.loop.budget.maxEstimatedTokens))}
- AgentLoopKit overhead: ${inlineCode(String(result.loop.latestTokenReceipt.estimatedAgentLoopOverheadTokens))}
- Net context reduction: ${inlineCode(String(result.loop.latestTokenReceipt.estimatedNetContextReductionTokens))}

## Iterations

${renderIterations(result.loop.iterations)}

## Suggested Commands

${renderSuggestedCommands(result.loop.suggestedCommands)}

## Next Action

- ${inlineCode(nextActionForLoop(result.loop))}
`;
}

function renderScorecardReasons(reasons: LoopScorecardReason[]) {
  if (!reasons.length) return '- No scorecard reasons recorded.';
  return reasons
    .map(
      (reason) =>
        `- ${inlineCode(reason.severity)} ${inlineCode(reason.code)} - ${escapeMarkdownProse(
          reason.message,
        )}`,
    )
    .join('\n');
}

export function renderLoopScorecardMarkdown(result: Omit<LoopScorecardResult, 'markdown'>) {
  return `# AgentLoopKit Loop Scorecard

- Decision: ${inlineCode(result.decision)}
- Loop: ${inlineCode(result.loop.id)}
- Status: ${inlineCode(result.loop.status)}
- Iterations: ${inlineCode(String(result.loop.iterations))}/${inlineCode(
    String(result.loop.maxIterations),
  )}
- Runner configured: ${inlineCode(String(result.loop.runnerConfigured))}
- Readiness: ${inlineCode(result.readiness.status)}
- Next action: ${inlineCode(result.loop.nextAction)}

## Reasons

${renderScorecardReasons(result.reasons)}

## Token Budget

- Used estimated tokens: ${inlineCode(String(result.tokenBudget.usedEstimatedTokens))}
- Remaining estimated tokens: ${inlineCode(String(result.tokenBudget.remainingEstimatedTokens))}
- Max estimated tokens: ${inlineCode(String(result.tokenBudget.maxEstimatedTokens))}
- Latest net context reduction: ${inlineCode(
    String(result.tokenBudget.latestNetContextReductionTokens),
  )}
- Latest AgentLoopKit overhead: ${inlineCode(String(result.tokenBudget.latestAgentLoopOverheadTokens))}

## Context

- Handles: ${result.context.handles.length ? result.context.handles.map(inlineCode).join(', ') : 'none'}
- Reviewability: ${inlineCode(result.context.reviewability)}
- Changed files: ${inlineCode(String(result.context.changedFiles))}
- Non-evidence changed files: ${inlineCode(String(result.context.nonEvidenceChangedFiles))}
- Unexplained changed files: ${inlineCode(String(result.context.unexplainedChangedFiles))}
- Forbidden changed files: ${inlineCode(String(result.context.forbiddenChangedFiles))}
- Verification freshness: ${inlineCode(result.context.verificationFreshness)}

## Guardrails

- Explicit runner required: ${inlineCode(String(result.guardrails.explicitRunnerRequired))}
- Shell execution: ${inlineCode(String(result.guardrails.shell))}
- Shell metacharacters rejected: ${inlineCode(String(result.guardrails.rejectShellMetacharacters))}
- Runner command: ${inlineCode(result.guardrails.runnerCommand ?? 'not configured')}

## Safety

- Read-only: ${inlineCode(String(result.safety.readOnly))}
- Runner executed: ${inlineCode(String(result.safety.runnerExecuted))}
- Verification commands run: ${inlineCode(String(result.safety.verificationCommandsRun))}
- Project commands run: ${inlineCode(String(result.safety.projectCommandsRun))}
`;
}

function nextActionForLoop(loop: AgentLoopLoopContractV1) {
  if (loop.status === 'complete') return 'agentloop ship';
  if (loop.status === 'stopped') return 'review loop report';
  if (loop.status === 'blocked') return 'agentloop ready';
  if (loop.runner) return `agentloop loop run --id ${loop.id}`;
  return `agentloop loop tick --id ${loop.id}`;
}

function stopConditions(maxIterations: number, maxEstimatedTokens: number) {
  return [
    'Stop when readiness gates pass.',
    `Stop after ${maxIterations} iteration(s).`,
    `Stop when estimated loop token usage reaches ${maxEstimatedTokens}.`,
    'Ask a human when task scope or acceptance criteria need product judgment.',
  ];
}

function scorecardReasons(input: {
  loop: AgentLoopLoopContractV1;
  ready: Awaited<ReturnType<typeof evaluateReady>>;
  remainingEstimatedTokens: number;
}) {
  const reasons: LoopScorecardReason[] = [];
  const remainingIterations = input.loop.budget.maxIterations - input.loop.iterations.length;
  const blockingReadyGates = input.ready.gates.filter((gate) => gate.status === 'fail');

  if (input.loop.status === 'complete') {
    reasons.push({
      code: 'loop-complete',
      severity: 'info',
      message: 'The loop is already complete.',
    });
  }
  if (input.loop.status === 'stopped') {
    reasons.push({
      code: 'loop-stopped',
      severity: 'blocking',
      message: input.loop.stopReason ?? 'The loop is stopped.',
    });
  }
  if (input.loop.status === 'blocked') {
    reasons.push({
      code: 'loop-blocked',
      severity: 'blocking',
      message: input.loop.stopReason ?? 'The loop is blocked and needs inspection.',
    });
  }
  if (remainingIterations <= 0) {
    reasons.push({
      code: 'iteration-budget-exhausted',
      severity: 'blocking',
      message: 'The loop has no iterations remaining.',
    });
  } else {
    reasons.push({
      code: 'iteration-budget-available',
      severity: 'info',
      message: `${remainingIterations} loop iteration(s) remain.`,
    });
  }
  if (input.remainingEstimatedTokens <= 0) {
    reasons.push({
      code: 'token-budget-exhausted',
      severity: 'blocking',
      message: 'The estimated loop token budget is exhausted.',
    });
  } else {
    reasons.push({
      code: 'token-budget-available',
      severity: 'info',
      message: `${input.remainingEstimatedTokens} estimated token(s) remain.`,
    });
  }
  for (const gate of blockingReadyGates) {
    const severity =
      gate.id === 'verification' && /No verification report was found|stale/i.test(gate.message)
        ? 'warning'
        : 'blocking';
    reasons.push({
      code: `ready-${gate.id}`,
      severity,
      message: gate.message,
    });
  }
  if (input.ready.status === 'ready') {
    reasons.push({
      code: 'ready-gates-passed',
      severity: 'info',
      message: 'Readiness gates passed.',
    });
  }
  if (input.loop.runner) {
    reasons.push({
      code: 'runner-configured',
      severity: 'info',
      message: 'A guarded runner is configured for this loop.',
    });
  } else {
    reasons.push({
      code: 'manual-loop',
      severity: 'info',
      message: 'No runner is configured; the loop can record manual ticks only.',
    });
  }

  return reasons.sort((left, right) => {
    const rank = { blocking: 0, warning: 1, info: 2 };
    return rank[left.severity] - rank[right.severity];
  });
}

function scorecardDecision(input: {
  loop: AgentLoopLoopContractV1;
  ready: Awaited<ReturnType<typeof evaluateReady>>;
  reasons: LoopScorecardReason[];
}) {
  if (input.loop.status === 'complete') return 'ready' satisfies LoopScorecardDecision;
  if (input.loop.status === 'stopped') return 'stop' satisfies LoopScorecardDecision;
  if (input.loop.status === 'blocked') return 'ask-human' satisfies LoopScorecardDecision;
  if (input.ready.status === 'ready') return 'ready' satisfies LoopScorecardDecision;
  if (input.reasons.some((reason) => reason.code === 'iteration-budget-exhausted')) {
    return 'stop' satisfies LoopScorecardDecision;
  }
  if (input.reasons.some((reason) => reason.code === 'token-budget-exhausted')) {
    return 'stop' satisfies LoopScorecardDecision;
  }
  if (
    input.reasons.some(
      (reason) => reason.severity === 'blocking' && reason.code !== 'ready-verification',
    )
  ) {
    return 'ask-human' satisfies LoopScorecardDecision;
  }
  return 'continue' satisfies LoopScorecardDecision;
}

export async function scoreLoop(options: {
  cwd: string;
  config: AgentLoopConfig;
  id?: string;
}): Promise<LoopScorecardResult> {
  const id = await resolveLoopId(options);
  const loop = await readLoop({ cwd: options.cwd, config: options.config, id });
  const [ready, contextPack] = await Promise.all([
    evaluateReady({ cwd: options.cwd, config: options.config }),
    buildContextPack({
      cwd: options.cwd,
      config: options.config,
      target: 'codex',
      goal: 'continue',
    }),
  ]);
  const remainingEstimatedTokens = Math.max(
    0,
    loop.budget.maxEstimatedTokens - loop.budget.usedEstimatedTokens,
  );
  const reasons = scorecardReasons({ loop, ready, remainingEstimatedTokens });
  const decision = scorecardDecision({ loop, ready, reasons });
  const withoutMarkdown = {
    decision,
    reasons,
    loop: {
      id: loop.id,
      status: loop.status,
      iterations: loop.iterations.length,
      maxIterations: loop.budget.maxIterations,
      runnerConfigured: Boolean(loop.runner),
      nextAction: nextActionForLoop(loop),
    },
    readiness: {
      status: ready.status,
      nextAction: ready.nextAction.command,
    },
    tokenBudget: {
      maxEstimatedTokens: loop.budget.maxEstimatedTokens,
      usedEstimatedTokens: loop.budget.usedEstimatedTokens,
      remainingEstimatedTokens,
      latestNetContextReductionTokens: loop.latestTokenReceipt.estimatedNetContextReductionTokens,
      latestAgentLoopOverheadTokens: loop.latestTokenReceipt.estimatedAgentLoopOverheadTokens,
    },
    guardrails: {
      explicitRunnerRequired: loop.guardrails?.requireExplicitRunner ?? true,
      shell: false as const,
      rejectShellMetacharacters: loop.guardrails?.rejectShellMetacharacters ?? true,
      blockedCommands: loop.guardrails?.blockedCommands ?? BLOCKED_LOOP_RUNNER_COMMANDS,
      maxOutputChars: loop.guardrails?.maxOutputChars ?? DEFAULT_LOOP_RUNNER_OUTPUT_CHARS,
      ...(loop.runner ? { runnerCommand: loop.runner.command } : {}),
    },
    context: {
      handles: contextPack.handles.map((handle) => handle.id),
      reviewability: contextPack.evidenceMap.summary.reviewability,
      changedFiles: contextPack.evidenceMap.summary.changedFileCount,
      nonEvidenceChangedFiles: contextPack.evidenceMap.summary.nonEvidenceChangedFileCount,
      unexplainedChangedFiles: contextPack.evidenceMap.coverage.unexplainedFileCount,
      forbiddenChangedFiles: contextPack.evidenceMap.coverage.forbiddenFileCount,
      verificationFreshness: contextPack.evidenceMap.verification.label,
    },
    safety: {
      readOnly: true,
      localEvidenceOnly: true,
      localGitStatus: true,
      runnerExecuted: false,
      verificationCommandsRun: false,
      projectCommandsRun: false,
      externalNetwork: false,
      publishes: false,
    },
  } satisfies Omit<LoopScorecardResult, 'markdown'>;

  return {
    ...withoutMarkdown,
    markdown: renderLoopScorecardMarkdown(withoutMarkdown),
  };
}

export async function createLoop(options: {
  cwd: string;
  config: AgentLoopConfig;
  goal?: string;
  preset?: string;
  cadence?: string;
  budgetTokens?: number;
  maxIterations?: number;
  runnerCommand?: string;
  runnerName?: string;
  runnerTimeoutMs?: number;
}): Promise<LoopCreateResult> {
  const preset = presetFromInput(options.preset);
  const presetConfig = preset ? PRESETS[preset] : undefined;
  const goal = (options.goal ?? presetConfig?.goal ?? '').trim();
  if (!goal) throw new AgentLoopError('Loop goal is required.', 'LOOP_GOAL_REQUIRED');
  const cadence = (options.cadence ?? 'manual').trim();
  if (cadence !== 'manual') {
    throw new AgentLoopError(`Unsupported loop cadence: ${cadence}`, 'LOOP_CADENCE_INVALID');
  }
  const maxEstimatedTokens = options.budgetTokens ?? DEFAULT_MAX_TOKENS;
  const maxIterations = options.maxIterations ?? DEFAULT_MAX_ITERATIONS;
  if (!Number.isFinite(maxEstimatedTokens) || maxEstimatedTokens <= 0) {
    throw new AgentLoopError('Loop budget tokens must be a positive number.', 'LOOP_BUDGET_INVALID');
  }
  if (!Number.isInteger(maxIterations) || maxIterations <= 0) {
    throw new AgentLoopError('Loop max iterations must be a positive integer.', 'LOOP_ITERATIONS_INVALID');
  }
  const runner = createRunnerConfig({
    command: options.runnerCommand,
    name: options.runnerName,
    timeoutMs: options.runnerTimeoutMs,
  });

  const id = `${formatTimestamp()}-${slugify(goal)}`;
  const loopPath = loopPathForId({ cwd: options.cwd, config: options.config, id });
  const loopRelativePath = relativePath(options.cwd, loopPath);
  const task = await createTaskContractFile({
    cwd: options.cwd,
    config: options.config,
    input: {
      title: `Loop: ${goal}`,
      type: 'feature',
      status: 'in-progress',
      problemStatement: `The repo needs a controlled local loop for this goal: ${goal}`,
      desiredOutcome:
        runner
          ? 'AgentLoopKit records runner execution, loop iterations, readiness gates, and context-budget evidence while keeping the external runner bounded by local guardrails.'
          : 'AgentLoopKit records loop iterations, readiness gates, and context-budget evidence without executing a coding agent.',
      constraints: [
        'Use compact context handles before broad reads.',
        runner
          ? `Run only the configured loop runner: ${runner.command}`
          : 'Keep external agent execution outside AgentLoopKit.',
        'Record token receipts for each loop iteration.',
        'Do not publish packages, create tags, push commits, or run destructive git operations from the loop runner.',
      ],
      nonGoals: [
        runner
          ? 'Do not auto-merge, auto-publish, or execute any runner command other than the configured command.'
          : 'Do not auto-merge, auto-publish, or execute coding-agent commands.',
      ],
      likelyFiles: [
        loopRelativePath,
        ...(presetConfig?.likelyFiles ?? DEFAULT_LOOP_LIKELY_FILES),
      ],
      forbiddenFiles: [
        '.github/workflows/ (CI credentials and release pipelines)',
        'package.json (publish and version fields)',
      ],
      acceptanceCriteria: [
        `\`${loopRelativePath}\`'s \`iterations\` array records a readiness status and token receipt after every tick.`,
        `\`${loopRelativePath}\`'s \`stopConditions\` list matches its \`budget.maxIterations\` and \`budget.maxEstimatedTokens\`.`,
        ...(runner
          ? [
              `The guarded local process recorded in \`${loopRelativePath}\` writes its exit code and changed-file count into the next iteration entry.`,
            ]
          : []),
      ],
      verificationCommands: ['agentloop ready --strict'],
      riskNotes: [
        runner
          ? 'Loop runner execution is opt-in, exact-command matched, non-shell, timeout bounded, and protected command families are blocked.'
          : 'Loop suggested commands are guidance only; AgentLoopKit does not run them.',
      ],
      rollbackNotes: `Delete ${loopRelativePath} and close this loop task if the loop is abandoned.`,
      createdDate: formatDate(),
    },
  });
  await setActiveTask({
    cwd: options.cwd,
    config: options.config,
    taskPath: task.path,
  });

  const relativeLoopPath = relativePath(options.cwd, loopPath);
  const now = new Date().toISOString();
  const suggestedCommands = presetConfig?.suggestedCommands ?? [
    {
      command: 'agentloop start --for codex --goal implement --redact-paths',
      reason: 'Brief the next coding agent with compact source handles.',
      required: true,
    },
    {
      command: 'agentloop ready --strict',
      reason: 'Check readiness before review or handoff.',
      required: true,
    },
  ];
  const initialOutput = JSON.stringify({ id, goal, suggestedCommands });
  const latestTokenReceipt = await buildInitialTokenReceipt({
    cwd: options.cwd,
    config: options.config,
    output: initialOutput,
  });
  const loop: AgentLoopLoopContractV1 = {
    schemaVersion: '1.0',
    kind: 'agentloop-loop',
    id,
    path: relativeLoopPath,
    goal,
    cadence: 'manual',
    status: 'active',
    createdAt: now,
    updatedAt: now,
    budget: {
      maxEstimatedTokens,
      maxIterations,
      usedEstimatedTokens: 0,
    },
    controls: {
      agentNeutral: true,
      externalAgentExecution: false,
      externalRunnerExecution: Boolean(runner),
      localEvidenceOnly: true,
    },
    ...(runner ? { runner } : {}),
    guardrails: {
      requireExplicitRunner: true,
      shell: false,
      rejectShellMetacharacters: true,
      blockedCommands: BLOCKED_LOOP_RUNNER_COMMANDS,
      maxOutputChars: DEFAULT_LOOP_RUNNER_OUTPUT_CHARS,
    },
    task: {
      nativeTaskPath: relativePath(options.cwd, task.path),
    },
    suggestedCommands,
    stopConditions: stopConditions(maxIterations, maxEstimatedTokens),
    iterations: [],
    latestTokenReceipt,
    safety: {
      writesLoopContract: true,
      writesNativeTask: true,
      commandsExecuted: [],
      externalNetwork: false,
      publishes: false,
    },
  };
  await writeJsonAtomic(loopPath, loop);
  return {
    loop,
    markdown: renderLoopMarkdown(loop),
  };
}

function readinessNeedsHumanReview(ready: Awaited<ReturnType<typeof evaluateReady>>) {
  const humanGateIds = new Set(['task-contract', 'acceptance-criteria', 'scope-drift', 'forbidden-files']);
  if (ready.gates.some((gate) => gate.status === 'fail' && humanGateIds.has(gate.id))) {
    return true;
  }
  return ready.evidenceMap.verification.label === 'failed' || ready.evidenceMap.verification.label === 'unknown';
}

function decideIteration(input: {
  ready: Awaited<ReturnType<typeof evaluateReady>>;
  nextIndex: number;
  usedTokensAfterTick: number;
  loop: AgentLoopLoopContractV1;
}): { decision: LoopDecision; status: LoopStatus; stopReason?: string } {
  if (input.ready.status === 'ready') {
    return {
      decision: 'ready',
      status: 'complete',
      stopReason: 'readiness gates passed',
    };
  }
  if (readinessNeedsHumanReview(input.ready)) {
    return {
      decision: 'ask-human',
      status: 'blocked',
      stopReason: 'readiness gates need human review',
    };
  }
  if (input.nextIndex >= input.loop.budget.maxIterations) {
    return {
      decision: 'stop',
      status: 'stopped',
      stopReason: 'maximum iteration count reached',
    };
  }
  if (input.usedTokensAfterTick >= input.loop.budget.maxEstimatedTokens) {
    return {
      decision: 'stop',
      status: 'stopped',
      stopReason: 'estimated token budget reached',
    };
  }
  return {
    decision: 'continue',
    status: 'active',
  };
}

function nextActionForIterationDecision(input: {
  ready: Awaited<ReturnType<typeof evaluateReady>>;
  decision: LoopDecision;
}) {
  if (input.decision !== 'ask-human') return input.ready.nextAction.command;
  const failedGateIds = new Set(
    input.ready.gates.filter((gate) => gate.status === 'fail').map((gate) => gate.id),
  );
  if (failedGateIds.has('task-contract')) return 'agentloop create-task';
  if (failedGateIds.has('acceptance-criteria')) return 'agentloop task doctor';
  if (failedGateIds.has('scope-drift') || failedGateIds.has('forbidden-files')) {
    return 'agentloop guard --redact-paths';
  }
  return input.ready.nextAction.command;
}

export async function tickLoop(options: {
  cwd: string;
  config: AgentLoopConfig;
  id?: string;
}): Promise<LoopTickResult> {
  const id = await resolveLoopId(options);
  const loop = await readLoop({ cwd: options.cwd, config: options.config, id });
  if (loop.status === 'complete' || loop.status === 'stopped') {
    throw new AgentLoopError(
      `Loop ${loop.id} is ${loop.status}; create a new loop or inspect the report.`,
      'LOOP_TERMINAL',
    );
  }
  if (loop.status === 'blocked') {
    throw new AgentLoopError(
      `Loop ${loop.id} is blocked; inspect the loop report before recording another iteration.`,
      'LOOP_BLOCKED',
    );
  }
  const [ready, contextPack] = await Promise.all([
    evaluateReady({ cwd: options.cwd, config: options.config }),
    buildContextPack({
      cwd: options.cwd,
      config: options.config,
      target: 'codex',
      goal: 'continue',
    }),
  ]);
  const nextIndex = loop.iterations.length + 1;
  const tokenReceipt = buildTokenReceipt({
    contextBudget: {
      ...contextPack.contextBudget,
      savingsCommand: 'agentloop context pack --for codex --goal continue --redact-paths',
    },
    agentLoopOutput: JSON.stringify({
      loop: { id: loop.id, goal: loop.goal, iteration: nextIndex },
      ready: { status: ready.status, nextAction: ready.nextAction },
    }),
  });
  const usedTokensAfterTick =
    loop.budget.usedEstimatedTokens +
    tokenReceipt.estimatedCompactContextTokens +
    tokenReceipt.estimatedAgentLoopOverheadTokens;
  const decision = decideIteration({
    ready,
    nextIndex,
    usedTokensAfterTick,
    loop,
  });
  const iteration: LoopIteration = {
    index: nextIndex,
    createdAt: new Date().toISOString(),
    readinessStatus: ready.status,
    decision: decision.decision,
    ...(decision.stopReason ? { stopReason: decision.stopReason } : {}),
    nextAction: nextActionForIterationDecision({ ready, decision: decision.decision }),
    contextHandles: contextPack.handles.map((handle) => handle.id),
    tokenReceipt,
  };
  const updatedLoop: AgentLoopLoopContractV1 = {
    ...loop,
    status: decision.status,
    ...(decision.stopReason ? { stopReason: decision.stopReason } : {}),
    updatedAt: iteration.createdAt,
    budget: {
      ...loop.budget,
      usedEstimatedTokens: usedTokensAfterTick,
    },
    latestTokenReceipt: tokenReceipt,
    iterations: [...loop.iterations, iteration],
  };
  await writeJsonAtomic(loopPathForId({ cwd: options.cwd, config: options.config, id }), updatedLoop);
  return {
    loop: updatedLoop,
    iteration,
    markdown: `# AgentLoopKit Loop Tick

- Loop: ${inlineCode(updatedLoop.id)}
- Iteration: ${inlineCode(String(iteration.index))}
- Decision: ${inlineCode(iteration.decision)}
- Readiness: ${inlineCode(iteration.readinessStatus)}
- Next action: ${inlineCode(iteration.nextAction)}
`,
  };
}

export async function runLoop(options: {
  cwd: string;
  config: AgentLoopConfig;
  id?: string;
  command?: string;
}): Promise<LoopRunResult> {
  const id = await resolveLoopId(options);
  const loop = await readLoop({ cwd: options.cwd, config: options.config, id });
  if (loop.status === 'complete' || loop.status === 'stopped') {
    throw new AgentLoopError(
      `Loop ${loop.id} is ${loop.status}; create a new loop or inspect the report.`,
      'LOOP_TERMINAL',
    );
  }
  if (loop.status === 'blocked') {
    throw new AgentLoopError(
      `Loop ${loop.id} is blocked; inspect the loop report before running another iteration.`,
      'LOOP_BLOCKED',
    );
  }
  if (!loop.runner) {
    throw new AgentLoopError(
      'Loop run requires a runner configured during loop create.',
      'LOOP_RUNNER_REQUIRED',
    );
  }
  if (options.command?.trim() && options.command.trim() !== loop.runner.command) {
    throw new AgentLoopError(
      'Loop run command override must exactly match the configured runner command.',
      'LOOP_RUNNER_NOT_ALLOWED',
    );
  }

  const runner = await executeLoopRunner({ cwd: options.cwd, runner: loop.runner });
  const [ready, contextPack] = await Promise.all([
    evaluateReady({ cwd: options.cwd, config: options.config }),
    buildContextPack({
      cwd: options.cwd,
      config: options.config,
      target: 'codex',
      goal: 'continue',
    }),
  ]);
  const nextIndex = loop.iterations.length + 1;
  const tokenReceipt = buildTokenReceipt({
    contextBudget: {
      ...contextPack.contextBudget,
      savingsCommand: 'agentloop context pack --for codex --goal continue --redact-paths',
    },
    agentLoopOutput: JSON.stringify({
      loop: { id: loop.id, goal: loop.goal, iteration: nextIndex },
      runner: {
        command: runner.command,
        status: runner.status,
        exitCode: runner.exitCode,
        changedFilesAfter: runner.changedFilesAfter,
      },
      ready: { status: ready.status, nextAction: ready.nextAction },
    }),
  });
  const usedTokensAfterTick =
    loop.budget.usedEstimatedTokens +
    tokenReceipt.estimatedCompactContextTokens +
    tokenReceipt.estimatedAgentLoopOverheadTokens;
  const decision =
    runner.status === 'passed'
      ? decideIteration({
          ready,
          nextIndex,
          usedTokensAfterTick,
          loop,
        })
      : {
          decision: 'ask-human' as const,
          status: 'blocked' as const,
          stopReason: `runner ${runner.status}`,
        };
  const iteration: LoopIteration = {
    index: nextIndex,
    createdAt: new Date().toISOString(),
    readinessStatus: ready.status,
    decision: decision.decision,
    ...(decision.stopReason ? { stopReason: decision.stopReason } : {}),
    nextAction:
      runner.status === 'passed'
        ? nextActionForIterationDecision({ ready, decision: decision.decision })
        : 'inspect runner output before continuing the loop',
    contextHandles: contextPack.handles.map((handle) => handle.id),
    tokenReceipt,
    runner,
  };
  const updatedLoop: AgentLoopLoopContractV1 = {
    ...loop,
    status: decision.status,
    ...(decision.stopReason ? { stopReason: decision.stopReason } : {}),
    updatedAt: iteration.createdAt,
    budget: {
      ...loop.budget,
      usedEstimatedTokens: usedTokensAfterTick,
    },
    latestTokenReceipt: tokenReceipt,
    iterations: [...loop.iterations, iteration],
    safety: {
      ...loop.safety,
      commandsExecuted: [...loop.safety.commandsExecuted, runner.command],
    },
  };
  await writeJsonAtomic(loopPathForId({ cwd: options.cwd, config: options.config, id }), updatedLoop);
  return {
    loop: updatedLoop,
    iteration,
    markdown: `# AgentLoopKit Loop Run

- Loop: ${inlineCode(updatedLoop.id)}
- Iteration: ${inlineCode(String(iteration.index))}
- Runner: ${inlineCode(runner.status)}
- Command: ${inlineCode(runner.command)}
- Exit code: ${inlineCode(String(runner.exitCode))}
- Decision: ${inlineCode(iteration.decision)}
- Readiness: ${inlineCode(iteration.readinessStatus)}
- Next action: ${inlineCode(iteration.nextAction)}
`,
  };
}

export async function getLoopStatus(options: {
  cwd: string;
  config: AgentLoopConfig;
  id?: string;
}): Promise<LoopStatusResult> {
  const id = await resolveLoopId(options);
  const loop = await readLoop({ cwd: options.cwd, config: options.config, id });
  const summary = {
    status: loop.status,
    iterations: loop.iterations.length,
    usedEstimatedTokens: loop.budget.usedEstimatedTokens,
    maxEstimatedTokens: loop.budget.maxEstimatedTokens,
  };
  const withoutMarkdown = { loop, summary };
  return {
    ...withoutMarkdown,
    markdown: renderLoopStatusMarkdown(withoutMarkdown),
  };
}

export async function getLoopReport(options: {
  cwd: string;
  config: AgentLoopConfig;
  id?: string;
}): Promise<LoopStatusResult> {
  const status = await getLoopStatus(options);
  return {
    ...status,
    markdown: renderLoopReportMarkdown(status),
  };
}
