import path from 'node:path';
import { createHash } from 'node:crypto';
import type { AgentLoopConfig } from './config.js';
import {
  latestMarkdownFile,
  verificationReportPattern,
} from './artifacts.js';
import {
  buildContextBudget,
  type ContextBudgetSummary,
} from './context-budget.js';
import { AgentLoopError } from './errors.js';
import {
  buildEvidenceMap,
  compactEvidenceMap,
  renderEvidenceMapCompactMarkdown,
  renderEvidenceMapMarkdown,
  type CompactEvidenceMap,
  type EvidenceMap,
} from './evidence-map.js';
import { getCurrentWorkTaskPath } from './evidence.js';
import {
  escapeMarkdownProse,
  singleLineInlineCode as inlineCode,
} from './markdown-format.js';
import { redactLocalRoots } from './redaction.js';
import { readSafeMarkdownFile } from './safe-markdown-file.js';
import {
  RESUME_PACK_TARGETS,
  type ResumePackTarget,
} from './resume-pack.js';
import { listRuns, readRun, toPublicChangedFiles, type RunSummary } from './runs.js';
import { readTaskContract } from './task-state.js';

export { RESUME_PACK_TARGETS };
export type { ResumePackTarget };

export const CONTEXT_PACK_GOALS = ['continue', 'review', 'debug', 'handoff', 'research'] as const;

export type ContextPackGoal = (typeof CONTEXT_PACK_GOALS)[number];

export type ContextHandleKind =
  | 'task'
  | 'verification'
  | 'run'
  | 'evidence-map'
  | 'context-budget';

export type ContextHandle = {
  id: string;
  kind: ContextHandleKind;
  label: string;
  command: string;
  reason: string;
  sourcePath?: string;
};

export type ContextHandleInventoryItem = ContextHandle & {
  available: boolean;
  unavailableReason?: string;
};

export type ContextReceiptItem = {
  section: string;
  reason: string;
  handles: string[];
};

export type ContextReceipt = {
  included: ContextReceiptItem[];
  omitted: ContextReceiptItem[];
};

export type ContextBudgetContractResult = {
  evidenceMap: CompactEvidenceMap;
  contextBudget: ContextBudgetSummary;
  markdown: string;
  safety: ContextSafety;
};

export type ContextHandleInventoryResult = {
  handles: ContextHandleInventoryItem[];
  markdown: string;
  safety: ContextSafety;
};

export type ContextPackResult = {
  target: ResumePackTarget;
  goal: ContextPackGoal;
  guidance: string;
  evidenceMap: CompactEvidenceMap;
  contextBudget: ContextBudgetSummary;
  receipt: ContextReceipt;
  handles: ContextHandle[];
  markdown: string;
  safety: ContextSafety;
};

export type ContextPackInternalResult = Omit<ContextPackResult, 'evidenceMap'> & {
  evidenceMap: EvidenceMap;
};

export type ContextShowResult = {
  handle: string;
  kind: ContextHandleKind;
  content?: string;
  contentDigest: string;
  unchanged: boolean;
  message?: string;
  safety: ContextSafety;
};

type ContextSafety = {
  readOnly: true;
  localEvidenceOnly: true;
  localGitStatus: true;
  verificationCommandsRun: false;
  projectCommandsRun: false;
};

const SAFETY: ContextSafety = {
  readOnly: true,
  localEvidenceOnly: true,
  localGitStatus: true,
  verificationCommandsRun: false,
  projectCommandsRun: false,
};

const DEFAULT_CONTEXT_PACK_COMMAND =
  'agentloop context pack --for codex --goal continue --redact-paths';

const GOAL_GUIDANCE: Record<ContextPackGoal, string> = {
  continue: 'Use this pack to continue a local software-agent session without broad repo reads.',
  review: 'Use this pack to review local work from task, diff, verification, and run evidence.',
  debug: 'Use this pack to debug local drift, stale evidence, or unexplained changed files.',
  handoff: 'Use this pack to hand off local work with receipts and source handles.',
  research:
    'Use this pack to continue local research with explicit evidence limits and source retrieval.',
};

function contextPackCommand(target: ResumePackTarget, goal: ContextPackGoal) {
  return `agentloop context pack --for ${target} --goal ${goal} --redact-paths`;
}

function renderTask(map: EvidenceMap) {
  if (!map.task) return 'none';
  return `${inlineCode(map.task.title)} (${inlineCode(map.task.status)}) - ${inlineCode(map.task.path)}`;
}

function renderNextActions(map: EvidenceMap) {
  return map.nextActions.length
    ? map.nextActions
        .map((action) => `- ${inlineCode(action.command)} - ${escapeMarkdownProse(action.reason)}`)
        .join('\n')
    : '- No next action recorded.';
}

function handleById(handles: ContextHandle[], id: string) {
  return handles.some((handle) => handle.id === id) ? [id] : [];
}

function baseContextHandles(input: { latestRun?: RunSummary }) {
  return [
    {
      id: 'task:active',
      kind: 'task',
      label: 'Active task contract',
      command: 'agentloop context show task:active',
      reason: 'Expands the active local task contract.',
    },
    {
      id: 'evidence-map:current',
      kind: 'evidence-map',
      label: 'Current evidence map',
      command: 'agentloop context show evidence-map:current',
      reason: 'Expands changed-file coverage, verification freshness, risk, and next actions.',
    },
    {
      id: 'context-budget:current',
      kind: 'context-budget',
      label: 'Current context budget',
      command: 'agentloop context show context-budget:current',
      reason: 'Expands the context-pressure estimate and compact-pack command.',
    },
    {
      id: 'verification:latest',
      kind: 'verification',
      label: 'Latest verification report',
      command: 'agentloop context show verification:latest',
      reason: 'Expands the latest local verification report.',
    },
    {
      id: 'run:latest',
      kind: 'run',
      label: 'Latest run ledger entry',
      command: 'agentloop context show run:latest',
      reason: 'Expands the newest local AgentLoopKit run ledger record.',
      sourcePath: input.latestRun ? `.agentloop/runs/${input.latestRun.id}` : undefined,
    },
  ] satisfies ContextHandle[];
}

function buildContextHandleInventoryItems(input: {
  taskPath?: string;
  verificationReportPath?: string;
  latestRun?: RunSummary;
}): ContextHandleInventoryItem[] {
  return baseContextHandles({ latestRun: input.latestRun }).map((handle) => {
    switch (handle.id) {
      case 'task:active':
        return input.taskPath
          ? {
              ...handle,
              available: true,
              sourcePath: input.taskPath,
            }
          : {
              ...handle,
              available: false,
              unavailableReason: 'No active task contract is available.',
            };
      case 'verification:latest':
        return input.verificationReportPath
          ? {
              ...handle,
              available: true,
              sourcePath: input.verificationReportPath,
            }
          : {
              ...handle,
              available: false,
              unavailableReason: 'No verification report is available.',
            };
      case 'run:latest':
        return input.latestRun
          ? {
              ...handle,
              available: true,
            }
          : {
              ...handle,
              available: false,
              unavailableReason: 'No run ledger entry is available.',
            };
      default:
        return {
          ...handle,
          available: true,
        };
    }
  });
}

function buildHandles(input: { evidenceMap: EvidenceMap; latestRun?: RunSummary }) {
  return buildContextHandleInventoryItems({
    taskPath: input.evidenceMap.task?.path,
    verificationReportPath: input.evidenceMap.verification.path,
    latestRun: input.latestRun,
  })
    .filter((handle) => handle.available)
    .map((handle) => ({
      id: handle.id,
      kind: handle.kind,
      label: handle.label,
      command: handle.command,
      reason: handle.reason,
      ...(handle.sourcePath ? { sourcePath: handle.sourcePath } : {}),
    }));
}

function buildReceipt(input: { evidenceMap: EvidenceMap; handles: ContextHandle[] }): ContextReceipt {
  return {
    included: [
      {
        section: 'active task',
        reason: input.evidenceMap.task
          ? 'Included because task scope is the first source of truth for agent work.'
          : 'No active task was found; the pack records that absence instead of guessing scope.',
        handles: handleById(input.handles, 'task:active'),
      },
      {
        section: 'changed-file evidence map',
        reason:
          'Included to explain changed-file coverage, unexplained paths, risk-sensitive paths, and reviewability.',
        handles: handleById(input.handles, 'evidence-map:current'),
      },
      {
        section: 'verification freshness',
        reason:
          'Included so agents know whether local verification is fresh, stale, missing, failed, or unknown.',
        handles: handleById(input.handles, 'verification:latest'),
      },
      {
        section: 'next actions',
        reason: 'Included to route the next local command without requiring transcript history.',
        handles: [],
      },
      {
        section: 'context budget',
        reason: 'Included to quantify context pressure with transparent heuristic estimates.',
        handles: handleById(input.handles, 'context-budget:current'),
      },
      {
        section: 'latest run',
        reason: 'Included when local run evidence exists so agents can retrieve recent proof.',
        handles: handleById(input.handles, 'run:latest'),
      },
    ],
    omitted: [
      {
        section: 'chat history',
        reason: 'Omitted because local task, diff, verification, and run evidence are more auditable.',
        handles: [],
      },
      {
        section: 'broad file contents',
        reason:
          'Omitted by default. Agents should expand specific source handles or inspect targeted files only when needed.',
        handles: [],
      },
      {
        section: 'full logs',
        reason:
          'Omitted unless the latest verification report is explicitly expanded through a local handle.',
        handles: handleById(input.handles, 'verification:latest'),
      },
      {
        section: 'old runs',
        reason: 'Omitted from the compact pack; use `agentloop runs` when older run history matters.',
        handles: [],
      },
      {
        section: 'provider traffic',
        reason:
          'Omitted because AgentLoopKit does not intercept prompts, proxy provider traffic, or rewrite requests.',
        handles: [],
      },
    ],
  };
}

function renderReceiptItems(items: ContextReceiptItem[]) {
  return items
    .map((item) => {
      const handles = item.handles.length
        ? ` Handles: ${item.handles.map(inlineCode).join(', ')}.`
        : '';
      return `- ${escapeMarkdownProse(item.section)}: ${escapeMarkdownProse(item.reason)}${handles}`;
    })
    .join('\n');
}

function renderHandles(handles: ContextHandle[]) {
  if (!handles.length) return '- No source handles available.';
  return handles
    .map((handle) => {
      const source = handle.sourcePath ? ` Source: ${inlineCode(handle.sourcePath)}.` : '';
      return `- ${inlineCode(handle.id)} - ${escapeMarkdownProse(handle.reason)} Command: ${inlineCode(
        handle.command,
      )}.${source}`;
    })
    .join('\n');
}

function renderInventoryHandles(handles: ContextHandleInventoryItem[]) {
  if (!handles.length) return '- None.';
  return handles
    .map((handle) => {
      const source = handle.sourcePath ? ` Source: ${inlineCode(handle.sourcePath)}.` : '';
      const unavailable = handle.unavailableReason
        ? ` Reason: ${escapeMarkdownProse(handle.unavailableReason)}`
        : '';
      return `- ${inlineCode(handle.id)} - ${escapeMarkdownProse(handle.reason)} Command: ${inlineCode(
        handle.command,
      )}.${source}${unavailable}`;
    })
    .join('\n');
}

export function renderContextHandleInventoryMarkdown(input: {
  handles: ContextHandleInventoryItem[];
}) {
  const availableHandles = input.handles.filter((handle) => handle.available);
  const unavailableHandles = input.handles.filter((handle) => !handle.available);

  return `# AgentLoopKit Context Handles

Use ${inlineCode('agentloop context show <handle>')} only when needed.

## Available

${renderInventoryHandles(availableHandles)}

## Unavailable

${renderInventoryHandles(unavailableHandles)}

## Safety Boundary

- Read-only local evidence command.
- Does not run verification, read changed file contents, read ${inlineCode(
    '.env',
  )} contents, call an LLM, intercept prompts, proxy provider traffic, publish packages, create tags, upload files, or mutate task state.
- Unavailable handles are normal empty states; create task, verification, or run evidence before expanding them.
`;
}

export function renderContextBudgetContractMarkdown(input: {
  contextBudget: ContextBudgetSummary;
}) {
  return `# AgentLoopKit Context Budget

${renderContextBudgetForContextMarkdown(input.contextBudget)}
`;
}

function renderContextBudgetForContextMarkdown(contextBudget: ContextBudgetSummary) {
  return `## Context Budget

- Heuristic: ${inlineCode(contextBudget.heuristic)}
- Changed files: ${inlineCode(String(contextBudget.changedFileCount))} total; ${inlineCode(
    String(contextBudget.nonEvidenceChangedFileCount),
  )} non-evidence.
- Estimated changed-file list tokens: ${inlineCode(
    String(contextBudget.estimatedFileListTokens),
  )}
- Estimated compact context-pack tokens: ${inlineCode(
    String(contextBudget.estimatedResumePackTokens),
  )}
- Compact context pack: ${inlineCode(contextBudget.savingsCommand)}
- Note: ${escapeMarkdownProse(contextBudget.note)}
`;
}

export function renderContextPackMarkdown(input: {
  target: ResumePackTarget;
  goal: ContextPackGoal;
  guidance: string;
  evidenceMap: EvidenceMap;
  contextBudget: ContextBudgetSummary;
  receipt: ContextReceipt;
  handles: ContextHandle[];
}) {
  return `# AgentLoopKit Context Pack

- Target: ${inlineCode(input.target)}
- Goal: ${inlineCode(input.goal)}
- ${escapeMarkdownProse(input.guidance)}
- Active task: ${renderTask(input.evidenceMap)}
- Reviewability: ${inlineCode(input.evidenceMap.summary.reviewability)}
${renderEvidenceMapCompactMarkdown(input.evidenceMap)}

## Receipt

Included:

${renderReceiptItems(input.receipt.included)}

Omitted:

${renderReceiptItems(input.receipt.omitted)}

## Source Handles

${renderHandles(input.handles)}

## Next Actions

${renderNextActions(input.evidenceMap)}

${renderContextBudgetForContextMarkdown(input.contextBudget)}
## Evidence Boundary

${input.evidenceMap.claims.map((claim) => `- ${escapeMarkdownProse(claim)}`).join('\n')}
- Generated from local AgentLoopKit evidence only.
- May inspect local Git status. No verification, build, test, install, provider, or network commands were run while generating this context pack.
- Token estimates use a transparent character-count heuristic, not a provider tokenizer or billing meter.
`;
}

export async function buildContextBudgetContract(options: {
  cwd: string;
  config: AgentLoopConfig;
}): Promise<ContextBudgetContractResult> {
  const evidenceMap = await buildEvidenceMap({
    cwd: options.cwd,
    config: options.config,
    taskEvidenceMode: 'current-work',
  });
  const contextBudget = buildContextBudget({
    evidenceMap,
    savingsCommand: DEFAULT_CONTEXT_PACK_COMMAND,
  });
  return {
    evidenceMap: compactEvidenceMap(evidenceMap),
    contextBudget,
    markdown: renderContextBudgetContractMarkdown({ contextBudget }),
    safety: SAFETY,
  };
}

export async function buildContextHandleInventory(options: {
  cwd: string;
  config: AgentLoopConfig;
}): Promise<ContextHandleInventoryResult> {
  const latestRunsPromise = listRuns(options.cwd, { limit: 1, hydrateTask: false });
  const [taskPath, verificationReportPath, runs] = await Promise.all([
    getCurrentWorkTaskPath({
      cwd: options.cwd,
      config: options.config,
    }),
    latestVerificationReportPath(options.cwd, options.config),
    latestRunsPromise,
  ]);
  const handles = buildContextHandleInventoryItems({
    taskPath: taskPath ? path.relative(options.cwd, taskPath).split(path.sep).join('/') : undefined,
    verificationReportPath: verificationReportPath
      ? path.relative(options.cwd, verificationReportPath).split(path.sep).join('/')
      : undefined,
    latestRun: runs[0],
  });

  return {
    handles,
    markdown: renderContextHandleInventoryMarkdown({ handles }),
    safety: SAFETY,
  };
}

async function buildContextPackInternal(options: {
  cwd: string;
  config: AgentLoopConfig;
  target: ResumePackTarget;
  goal: ContextPackGoal;
}): Promise<ContextPackInternalResult> {
  const latestRunsPromise = listRuns(options.cwd, { limit: 1, hydrateTask: false });
  const [evidenceMap, runs] = await Promise.all([
    buildEvidenceMap({
      cwd: options.cwd,
      config: options.config,
      taskEvidenceMode: 'current-work',
    }),
    latestRunsPromise,
  ]);
  const contextBudget = buildContextBudget({
    evidenceMap,
    savingsCommand: contextPackCommand(options.target, options.goal),
  });
  const handles = buildHandles({ evidenceMap, latestRun: runs[0] });
  const receipt = buildReceipt({ evidenceMap, handles });
  const guidance = GOAL_GUIDANCE[options.goal];

  return {
    target: options.target,
    goal: options.goal,
    guidance,
    evidenceMap,
    contextBudget,
    receipt,
    handles,
    markdown: renderContextPackMarkdown({
      target: options.target,
      goal: options.goal,
      guidance,
      evidenceMap,
      contextBudget,
      receipt,
      handles,
    }),
    safety: SAFETY,
  };
}

export async function buildContextPackWithFullEvidence(options: {
  cwd: string;
  config: AgentLoopConfig;
  target: ResumePackTarget;
  goal: ContextPackGoal;
}): Promise<ContextPackInternalResult> {
  return buildContextPackInternal(options);
}

export async function buildContextPack(options: {
  cwd: string;
  config: AgentLoopConfig;
  target: ResumePackTarget;
  goal: ContextPackGoal;
}): Promise<ContextPackResult> {
  const contextPack = await buildContextPackInternal(options);
  return {
    ...contextPack,
    evidenceMap: compactEvidenceMap(contextPack.evidenceMap),
  };
}

async function latestVerificationReportPath(cwd: string, config: AgentLoopConfig) {
  return latestMarkdownFile(path.join(cwd, config.paths.reportsDir), {
    pattern: verificationReportPattern,
    rootDir: cwd,
  });
}

function redactContextContent(content: string, options: { cwd: string; redactPaths?: boolean }) {
  return options.redactPaths ? redactLocalRoots(content, [options.cwd]) : content;
}

export async function showContextHandle(options: {
  cwd: string;
  config: AgentLoopConfig;
  handle: string;
  redactPaths?: boolean;
  since?: string;
  full?: boolean;
}): Promise<ContextShowResult> {
  const finalize = (result: { handle: string; kind: ContextHandleKind; content: string }) => {
    const contentDigest = `sha256:${createHash('sha256').update(result.content).digest('hex')}`;
    const unchanged = options.since === contentDigest;
    if (unchanged && !options.full) {
      return {
        handle: result.handle,
        kind: result.kind,
        contentDigest,
        unchanged,
        message: `${result.handle} unchanged since ${contentDigest}. Use --full to print it anyway.`,
        safety: SAFETY,
      };
    }
    return {
      ...result,
      contentDigest,
      unchanged,
      safety: SAFETY,
    };
  };

  switch (options.handle) {
    case 'task:active': {
      const activeTaskPath = await getCurrentWorkTaskPath({
        cwd: options.cwd,
        config: options.config,
      });
      if (!activeTaskPath) {
        throw new AgentLoopError('No active task is available for handle task:active.', 'CONTEXT_HANDLE_EMPTY');
      }
      const task = await readTaskContract({
        cwd: options.cwd,
        config: options.config,
        taskPath: activeTaskPath,
      });
      return finalize({
        handle: options.handle,
        kind: 'task',
        content: redactContextContent(task.content, options),
      });
    }
    case 'verification:latest': {
      const reportPath = await latestVerificationReportPath(options.cwd, options.config);
      if (!reportPath) {
        throw new AgentLoopError(
          'No verification report is available for handle verification:latest.',
          'CONTEXT_HANDLE_EMPTY',
        );
      }
      const report = await readSafeMarkdownFile(reportPath, {
        required: true,
        codePrefix: 'CONTEXT_HANDLE',
      });
      if (!report) {
        throw new AgentLoopError(
          'No verification report is available for handle verification:latest.',
          'CONTEXT_HANDLE_EMPTY',
        );
      }
      return finalize({
        handle: options.handle,
        kind: 'verification',
        content: redactContextContent(report.content, options),
      });
    }
    case 'run:latest': {
      const [latestRun] = await listRuns(options.cwd, { limit: 1, hydrateTask: false });
      if (!latestRun) {
        throw new AgentLoopError('No run is available for handle run:latest.', 'CONTEXT_HANDLE_EMPTY');
      }
      const latestRunRecord = await readRun(options.cwd, latestRun.id);
      return finalize({
        handle: options.handle,
        kind: 'run',
        content: redactContextContent(
          // Strip the internal content-addressing `hash` before this run
          // record reaches user-facing context-handle output.
          `${JSON.stringify(
            { ...latestRunRecord, changedFiles: toPublicChangedFiles(latestRunRecord.changedFiles) },
            null,
            2,
          )}\n`,
          options,
        ),
      });
    }
    case 'evidence-map:current': {
      const evidenceMap = await buildEvidenceMap({
        cwd: options.cwd,
        config: options.config,
        taskEvidenceMode: 'current-work',
      });
      return finalize({
        handle: options.handle,
        kind: 'evidence-map',
        content: redactContextContent(renderEvidenceMapMarkdown(evidenceMap), options),
      });
    }
    case 'context-budget:current': {
      const context = await buildContextBudgetContract({
        cwd: options.cwd,
        config: options.config,
      });
      return finalize({
        handle: options.handle,
        kind: 'context-budget',
        content: redactContextContent(context.markdown, options),
      });
    }
    default:
      throw new AgentLoopError(
        `Unsupported context handle: ${options.handle}. Supported handles: task:active, verification:latest, run:latest, evidence-map:current, context-budget:current.`,
        'CONTEXT_HANDLE_UNSUPPORTED',
      );
  }
}
