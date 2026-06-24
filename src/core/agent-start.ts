import type { AgentLoopConfig } from './config.js';
import {
  buildContextPack,
  type ContextHandle,
  type ContextPackGoal,
  type ContextPackResult,
} from './context-contract.js';
import type { EvidenceMap } from './evidence-map.js';
import {
  escapeMarkdownProse,
  singleLineInlineCode as inlineCode,
} from './markdown-format.js';
import {
  RESUME_PACK_TARGETS,
  type ResumePackTarget,
} from './resume-pack.js';

export { RESUME_PACK_TARGETS };
export type { ResumePackTarget };

export const AGENT_START_GOALS = [
  'implement',
  'continue',
  'review',
  'debug',
  'handoff',
  'research',
] as const;

export type AgentStartGoal = (typeof AGENT_START_GOALS)[number];

export type AgentStartRoute = {
  handle: string;
  reason: string;
  command: string;
  priority: number;
};

export type AgentStartRisk = {
  code:
    | 'task-missing'
    | 'verification-missing'
    | 'verification-failed'
    | 'verification-stale'
    | 'verification-unknown'
    | 'scope-drift'
    | 'forbidden-files'
    | 'risk-sensitive-files';
  severity: 'info' | 'warn' | 'blocker';
  message: string;
  handles: string[];
  examples: string[];
};

export type AgentStartImpact = {
  summary: string;
  estimatedBroadContextTokens: number;
  estimatedCompactBriefTokens: number;
  estimatedContextAvoidedTokens: number;
  estimatedContextReductionPercent: number | null;
  broadChangedFileCount: number;
  broadNonEvidenceFileCount: number;
  staleEvidenceCaught: boolean;
  scopeDriftFileCount: number;
  verificationFreshness: EvidenceMap['verification']['label'];
  reviewability: EvidenceMap['summary']['reviewability'];
  reviewReadinessDelta:
    | 'ready-to-ship'
    | 'task-contract-required'
    | 'verification-required'
    | 'scope-review-required'
    | 'evidence-only'
    | 'attention-required';
};

export type AgentStartBroadScanGuidance = {
  changedFileCount: number;
  nonEvidenceChangedFileCount: number;
  estimatedBroadContextTokens: number;
  estimatedCompactBriefTokens: number;
  estimatedContextAvoidedTokens: number;
  estimatedContextReductionPercent: number | null;
  message: string;
};

export type AgentStartNextCommand = {
  command: string;
  reason: string;
};

export type AgentStartPreflightState =
  | 'ready-to-continue'
  | 'needs-task'
  | 'needs-verification'
  | 'scope-drift'
  | 'review-ready'
  | 'blocked-by-risk'
  | 'evidence-only';

export type AgentStartPreflight = {
  state: AgentStartPreflightState;
  headline: string;
  reason: string;
  task: EvidenceMap['task'];
};

export type AgentStartRiskSummary = {
  blockers: number;
  warnings: number;
  topRisks: AgentStartRisk['code'][];
};

export type AgentStartResult = {
  target: ResumePackTarget;
  goal: AgentStartGoal;
  status: AgentStartPreflightState;
  summary: string;
  preflight: AgentStartPreflight;
  readFirst: AgentStartRoute[];
  doNotBroadScan: AgentStartBroadScanGuidance;
  risk: AgentStartRisk[];
  riskSummary: AgentStartRiskSummary;
  impact: AgentStartImpact;
  nextCommand: AgentStartNextCommand;
  sourceHandles: ContextHandle[];
  markdown: string;
  safety: ContextPackResult['safety'];
};

const GOAL_CONTEXT_MAP: Record<AgentStartGoal, ContextPackGoal> = {
  implement: 'continue',
  continue: 'continue',
  review: 'review',
  debug: 'debug',
  handoff: 'handoff',
  research: 'research',
};

const ROUTE_ORDER: Record<AgentStartGoal, string[]> = {
  implement: [
    'task:active',
    'evidence-map:current',
    'verification:latest',
    'context-budget:current',
    'run:latest',
  ],
  continue: [
    'task:active',
    'evidence-map:current',
    'verification:latest',
    'context-budget:current',
    'run:latest',
  ],
  review: [
    'evidence-map:current',
    'verification:latest',
    'task:active',
    'context-budget:current',
    'run:latest',
  ],
  debug: [
    'evidence-map:current',
    'verification:latest',
    'task:active',
    'run:latest',
    'context-budget:current',
  ],
  handoff: [
    'task:active',
    'verification:latest',
    'run:latest',
    'evidence-map:current',
    'context-budget:current',
  ],
  research: [
    'task:active',
    'evidence-map:current',
    'context-budget:current',
    'run:latest',
    'verification:latest',
  ],
};

const ROUTE_REASONS: Record<string, string> = {
  'task:active': 'Read the task contract before touching files or widening scope.',
  'evidence-map:current': 'Read changed-file coverage, scope drift, risk, and reviewability.',
  'verification:latest': 'Check whether verification evidence is fresh, stale, missing, or failed.',
  'context-budget:current': 'Check context pressure before pasting broad file lists or history.',
  'run:latest': 'Check the latest local run ledger when recent proof matters.',
};

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return count === 1 ? singular : plural;
}

function summaryForStatus(status: AgentStartPreflightState) {
  switch (status) {
    case 'ready-to-continue':
      return 'ready to continue';
    case 'needs-task':
      return 'task contract needed';
    case 'needs-verification':
      return 'verification needed';
    case 'scope-drift':
      return 'scope drift needs review';
    case 'review-ready':
      return 'ready for review';
    case 'blocked-by-risk':
      return 'blocked by risk';
    case 'evidence-only':
      return 'evidence-only local changes detected';
  }
}

function handleMap(handles: ContextHandle[]) {
  return new Map(handles.map((handle) => [handle.id, handle]));
}

function buildReadFirst(goal: AgentStartGoal, handles: ContextHandle[]): AgentStartRoute[] {
  const handlesById = handleMap(handles);
  return ROUTE_ORDER[goal]
    .map((id, index) => {
      const handle = handlesById.get(id);
      if (!handle) return undefined;
      return {
        handle: id,
        reason: ROUTE_REASONS[id] ?? handle.reason,
        command: handle.command,
        priority: index + 1,
      };
    })
    .filter((route): route is AgentStartRoute => Boolean(route));
}

function buildRisk(map: EvidenceMap): AgentStartRisk[] {
  const risks: AgentStartRisk[] = [];

  if (!map.task) {
    risks.push({
      code: 'task-missing',
      severity: 'blocker',
      message: 'No current task contract was found. Create or pin a task before implementation.',
      handles: [],
      examples: [],
    });
  }

  if (map.verification.label === 'missing') {
    risks.push({
      code: 'verification-missing',
      severity: 'blocker',
      message: 'No verification report was found for the current task.',
      handles: [],
      examples: [],
    });
  } else if (map.verification.label === 'failed') {
    risks.push({
      code: 'verification-failed',
      severity: 'blocker',
      message: 'The latest verification report failed. Fix failures before handoff.',
      handles: ['verification:latest'],
      examples: map.verification.path ? [map.verification.path] : [],
    });
  } else if (map.verification.label === 'stale') {
    risks.push({
      code: 'verification-stale',
      severity: 'warn',
      message: map.verification.staleReason
        ? `Verification evidence is stale: ${map.verification.staleReason}`
        : 'Verification evidence is stale for the current task.',
      handles: map.verification.path ? ['verification:latest'] : [],
      examples: map.verification.path ? [map.verification.path] : [],
    });
  } else if (map.verification.label === 'unknown') {
    risks.push({
      code: 'verification-unknown',
      severity: 'warn',
      message: 'Verification evidence exists, but its status could not be classified.',
      handles: map.verification.path ? ['verification:latest'] : [],
      examples: map.verification.path ? [map.verification.path] : [],
    });
  }

  if (map.coverage.unexplainedFileCount > 0) {
    risks.push({
      code: 'scope-drift',
      severity: 'warn',
      message: `${map.coverage.unexplainedFileCount} changed non-evidence ${pluralize(
        map.coverage.unexplainedFileCount,
        'file',
      )} ${map.coverage.unexplainedFileCount === 1 ? 'is' : 'are'} outside local task or run evidence.`,
      handles: ['evidence-map:current'],
      examples: map.coverage.unexplainedExamples,
    });
  }

  if (map.coverage.forbiddenFileCount > 0) {
    risks.push({
      code: 'forbidden-files',
      severity: 'blocker',
      message: `${map.coverage.forbiddenFileCount} changed ${pluralize(
        map.coverage.forbiddenFileCount,
        'file',
      )} ${map.coverage.forbiddenFileCount === 1 ? 'matches' : 'match'} the task's files-not-to-touch scope.`,
      handles: ['task:active', 'evidence-map:current'],
      examples: map.files
        .filter((file) => file.forbiddenByTask)
        .slice(0, 5)
        .map((file) => file.path),
    });
  }

  if (map.risk.riskSensitiveFileCount > 0) {
    risks.push({
      code: 'risk-sensitive-files',
      severity: 'warn',
      message: `${map.risk.riskSensitiveFileCount} risk-sensitive changed ${pluralize(
        map.risk.riskSensitiveFileCount,
        'file',
      )} ${map.risk.riskSensitiveFileCount === 1 ? 'needs' : 'need'} focused review.`,
      handles: ['evidence-map:current'],
      examples: map.risk.riskSensitiveExamples,
    });
  }

  return risks;
}

function buildRiskSummary(risks: AgentStartRisk[]): AgentStartRiskSummary {
  const blockers = risks.filter((risk) => risk.severity === 'blocker').length;
  const warnings = risks.filter((risk) => risk.severity === 'warn').length;
  return {
    blockers,
    warnings,
    topRisks: risks
      .slice()
      .sort((left, right) => {
        const weight = { blocker: 0, warn: 1, info: 2 };
        return weight[left.severity] - weight[right.severity];
      })
      .slice(0, 3)
      .map((risk) => risk.code),
  };
}

function reviewReadinessDelta(map: EvidenceMap): AgentStartImpact['reviewReadinessDelta'] {
  if (!map.task) return 'task-contract-required';
  if (map.verification.label !== 'fresh') return 'verification-required';
  if (map.coverage.unexplainedFileCount > 0 || map.coverage.forbiddenFileCount > 0) {
    return 'scope-review-required';
  }
  if (map.summary.reviewability === 'evidence-only') return 'evidence-only';
  if (map.summary.reviewability === 'reviewable') return 'ready-to-ship';
  return 'attention-required';
}

function buildImpact(pack: ContextPackResult): AgentStartImpact {
  const broad = pack.contextBudget.estimatedFileListTokens;
  const compact = pack.contextBudget.estimatedResumePackTokens;
  const avoided = Math.max(0, broad - compact);
  const percent = broad > 0 ? Math.max(0, Math.round((avoided / broad) * 100)) : null;
  return {
    summary:
      percent === null
        ? 'No broad changed-file context was detected; use source handles to expand local evidence only when needed.'
        : `Avoided about ${avoided} estimated context ${pluralize(
            avoided,
            'token',
          )} (${percent}%) by using source handles instead of broad changed-file context.`,
    estimatedBroadContextTokens: broad,
    estimatedCompactBriefTokens: compact,
    estimatedContextAvoidedTokens: avoided,
    estimatedContextReductionPercent: percent,
    broadChangedFileCount: pack.evidenceMap.summary.changedFileCount,
    broadNonEvidenceFileCount: pack.evidenceMap.summary.nonEvidenceChangedFileCount,
    staleEvidenceCaught: pack.evidenceMap.verification.label === 'stale',
    scopeDriftFileCount: pack.evidenceMap.coverage.unexplainedFileCount,
    verificationFreshness: pack.evidenceMap.verification.label,
    reviewability: pack.evidenceMap.summary.reviewability,
    reviewReadinessDelta: reviewReadinessDelta(pack.evidenceMap),
  };
}

function hasRisk(risks: AgentStartRisk[], code: AgentStartRisk['code']) {
  return risks.some((risk) => risk.code === code);
}

function buildPreflight(input: {
  goal: AgentStartGoal;
  map: EvidenceMap;
  risks: AgentStartRisk[];
}): AgentStartPreflight {
  const { goal, map, risks } = input;
  let state: AgentStartPreflightState;
  let reason: string;

  if (risks.some((risk) => risk.severity === 'blocker' && risk.code === 'forbidden-files')) {
    state = 'blocked-by-risk';
    reason = 'Changed files match the task files-not-to-touch scope.';
  } else if (!map.task) {
    state = 'needs-task';
    reason = 'No active task contract is available for this agent session.';
  } else if (
    hasRisk(risks, 'verification-missing') ||
    hasRisk(risks, 'verification-failed') ||
    hasRisk(risks, 'verification-stale') ||
    hasRisk(risks, 'verification-unknown')
  ) {
    state = 'needs-verification';
    reason = 'Verification evidence is missing, stale, failed, or unknown for the current task.';
  } else if (hasRisk(risks, 'scope-drift')) {
    state = 'scope-drift';
    reason = 'Some changed files are outside local task or run evidence.';
  } else if (map.summary.reviewability === 'evidence-only') {
    state = 'evidence-only';
    reason = 'Only local AgentLoop evidence changes are currently detected.';
  } else if (map.summary.reviewability === 'reviewable' && (goal === 'review' || goal === 'handoff')) {
    state = 'review-ready';
    reason = 'task, changed-file, and verification evidence are ready for review.';
  } else {
    state = 'ready-to-continue';
    reason = 'task, changed-file, and verification evidence are available for this agent session.';
  }

  return {
    state,
    headline: summaryForStatus(state),
    reason,
    task: map.task,
  };
}

function buildBroadScanGuidance(impact: AgentStartImpact): AgentStartBroadScanGuidance {
  const percent =
    impact.estimatedContextReductionPercent === null
      ? 'no broad changed-file context detected'
      : `${impact.estimatedContextReductionPercent}% smaller than broad changed-file context`;
  return {
    changedFileCount: impact.broadChangedFileCount,
    nonEvidenceChangedFileCount: impact.broadNonEvidenceFileCount,
    estimatedBroadContextTokens: impact.estimatedBroadContextTokens,
    estimatedCompactBriefTokens: impact.estimatedCompactBriefTokens,
    estimatedContextAvoidedTokens: impact.estimatedContextAvoidedTokens,
    estimatedContextReductionPercent: impact.estimatedContextReductionPercent,
    message: `${impact.broadChangedFileCount} changed ${pluralize(
      impact.broadChangedFileCount,
      'file',
    )} detected; compact briefing is estimated ${percent}. Expand source handles instead of pasting broad history or file lists.`,
  };
}

function nextCommand(map: EvidenceMap): AgentStartNextCommand {
  const [action] = map.nextActions;
  return action ?? {
    command: 'agentloop status',
    reason: 'No specific next action was recorded.',
  };
}

function renderReadFirst(routes: AgentStartRoute[]) {
  if (!routes.length) return '- No source handles are available yet. Run `agentloop create-task` first.';
  return routes
    .map(
      (route) =>
        `- ${inlineCode(route.handle)} - ${escapeMarkdownProse(route.reason)} Command: ${inlineCode(
          route.command,
        )}.`,
    )
    .join('\n');
}

function renderRisk(risks: AgentStartRisk[]) {
  if (!risks.length) return '- No start risks detected from local evidence.';
  return risks
    .map((risk) => {
      const message = risk.message.trim();
      const punctuation = /[.!?]$/.test(message) ? '' : '.';
      const handles = risk.handles.length
        ? ` Handles: ${risk.handles.map(inlineCode).join(', ')}.`
        : '';
      const examples = risk.examples.length
        ? ` Examples: ${risk.examples.map(inlineCode).join(', ')}.`
        : '';
      return `- ${inlineCode(risk.severity)} ${inlineCode(risk.code)} - ${escapeMarkdownProse(
        message,
      )}${punctuation}${handles}${examples}`;
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

function renderReduction(value: number | null) {
  return value === null ? 'n/a' : `${value}%`;
}

export function renderAgentStartMarkdown(input: Omit<AgentStartResult, 'markdown'>) {
  const taskLine = input.preflight.task
    ? `${inlineCode(input.preflight.task.title)} (${inlineCode(
        input.preflight.task.status,
      )}) - ${inlineCode(input.preflight.task.path)}`
    : 'No active task contract found.';

  return `# AgentLoop Start

Agent briefing: ${escapeMarkdownProse(input.summary)}

- Target: ${inlineCode(input.target)}
- Goal: ${inlineCode(input.goal)}
- Status: ${inlineCode(input.status)}
- Preflight: ${inlineCode(input.preflight.state)} - ${escapeMarkdownProse(input.preflight.reason)}

## Active Task

- ${taskLine}

## Next Safe Command

- ${inlineCode(input.nextCommand.command)} - ${escapeMarkdownProse(input.nextCommand.reason)}

## Read First

${renderReadFirst(input.readFirst)}

## Do Not Broad-Scan

- ${escapeMarkdownProse(input.doNotBroadScan.message)}
- Changed files: ${inlineCode(String(input.doNotBroadScan.changedFileCount))} total; ${inlineCode(
    String(input.doNotBroadScan.nonEvidenceChangedFileCount),
  )} non-evidence.
- Estimated broad context tokens: ${inlineCode(
    String(input.doNotBroadScan.estimatedBroadContextTokens),
  )}
- Estimated compact briefing tokens: ${inlineCode(
    String(input.doNotBroadScan.estimatedCompactBriefTokens),
  )}
- Estimated context avoided: ${inlineCode(
    String(input.doNotBroadScan.estimatedContextAvoidedTokens),
  )} token(s) (${inlineCode(renderReduction(input.doNotBroadScan.estimatedContextReductionPercent))})

## Risk

- Summary: ${inlineCode(String(input.riskSummary.blockers))} blocker(s), ${inlineCode(
    String(input.riskSummary.warnings),
  )} warning(s), top risks ${inlineCode(
    input.riskSummary.topRisks.length ? input.riskSummary.topRisks.join(', ') : 'none',
  )}.
${renderRisk(input.risk)}

## Impact Ledger

- ${escapeMarkdownProse(input.impact.summary)}
- Estimated broad context tokens: ${inlineCode(String(input.impact.estimatedBroadContextTokens))}
- Estimated compact briefing tokens: ${inlineCode(
    String(input.impact.estimatedCompactBriefTokens),
  )}
- Estimated context avoided: ${inlineCode(String(input.impact.estimatedContextAvoidedTokens))} token(s)
- Estimated context reduction: ${inlineCode(renderReduction(input.impact.estimatedContextReductionPercent))}
- Broad changed files avoided: ${inlineCode(String(input.impact.broadChangedFileCount))}
- Stale evidence caught: ${inlineCode(String(input.impact.staleEvidenceCaught))}
- Scope drift files: ${inlineCode(String(input.impact.scopeDriftFileCount))}
- Verification freshness: ${inlineCode(input.impact.verificationFreshness)}
- Reviewability: ${inlineCode(input.impact.reviewability)}
- Review-readiness delta: ${inlineCode(input.impact.reviewReadinessDelta)}

## Source Handles

${renderHandles(input.sourceHandles)}

## Safety Boundary

- Read-only local evidence command.
- Does not run verification, read changed file contents, read \`.env\` contents, call an LLM, intercept prompts, proxy provider traffic, post comments, publish packages, create tags, upload files, or mutate task state.
- Token estimates use a transparent character-count heuristic, not a provider tokenizer or billing meter.
`;
}

export async function buildAgentStart(options: {
  cwd: string;
  config: AgentLoopConfig;
  target: ResumePackTarget;
  goal: AgentStartGoal;
}): Promise<AgentStartResult> {
  const contextPack = await buildContextPack({
    cwd: options.cwd,
    config: options.config,
    target: options.target,
    goal: GOAL_CONTEXT_MAP[options.goal],
  });
  const risks = buildRisk(contextPack.evidenceMap);
  const preflight = buildPreflight({
    goal: options.goal,
    map: contextPack.evidenceMap,
    risks,
  });
  const impact = buildImpact(contextPack);
  const withoutMarkdown = {
    target: options.target,
    goal: options.goal,
    status: preflight.state,
    summary: preflight.headline,
    preflight,
    readFirst: buildReadFirst(options.goal, contextPack.handles),
    doNotBroadScan: buildBroadScanGuidance(impact),
    risk: risks,
    riskSummary: buildRiskSummary(risks),
    impact,
    nextCommand: nextCommand(contextPack.evidenceMap),
    sourceHandles: contextPack.handles,
    safety: contextPack.safety,
  };

  return {
    ...withoutMarkdown,
    markdown: renderAgentStartMarkdown(withoutMarkdown),
  };
}
