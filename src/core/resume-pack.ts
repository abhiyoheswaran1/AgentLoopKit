import type { AgentLoopConfig } from './config.js';
import {
  buildEvidenceMap,
  renderEvidenceMapCompactMarkdown,
  type EvidenceMap,
} from './evidence-map.js';
import {
  escapeMarkdownProse,
  singleLineInlineCode as inlineCode,
} from './markdown-format.js';
import {
  buildContextBudget,
  renderContextBudgetMarkdown,
  type ContextBudgetSummary,
} from './context-budget.js';

export const RESUME_PACK_TARGETS = ['codex', 'claude', 'cursor', 'generic', 'human'] as const;

export type ResumePackTarget = (typeof RESUME_PACK_TARGETS)[number];

export type ResumePackResult = {
  target: ResumePackTarget;
  evidenceMap: EvidenceMap;
  contextBudget: ContextBudgetSummary;
  markdown: string;
  safety: {
    readOnly: true;
    localEvidenceOnly: true;
    commandsRun: [];
  };
};

const TARGET_GUIDANCE: Record<ResumePackTarget, string> = {
  codex: 'Use this as compact continuation context for Codex.',
  claude: 'Use this as compact continuation context for Claude Code.',
  cursor: 'Use this as compact continuation context for Cursor.',
  generic: 'Use this as compact continuation context for a software agent.',
  human: 'Use this as compact continuation context for a human reviewer or maintainer.',
};

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

export function renderResumePackMarkdown(input: {
  target: ResumePackTarget;
  evidenceMap: EvidenceMap;
  contextBudget: ContextBudgetSummary;
}) {
  return `# AgentLoopKit Resume Pack

- Target: ${inlineCode(input.target)}
- ${escapeMarkdownProse(TARGET_GUIDANCE[input.target])}
- Active task: ${renderTask(input.evidenceMap)}
- Reviewability: ${inlineCode(input.evidenceMap.summary.reviewability)}
${renderEvidenceMapCompactMarkdown(input.evidenceMap)}

## Next Actions

${renderNextActions(input.evidenceMap)}

${renderContextBudgetMarkdown(input.contextBudget)}

## Evidence Boundary

${input.evidenceMap.claims.map((claim) => `- ${escapeMarkdownProse(claim)}`).join('\n')}
- Generated from local AgentLoopKit evidence only.
- No verification commands were run while generating this resume pack.
`;
}

export async function buildResumePack(options: {
  cwd: string;
  config: AgentLoopConfig;
  target: ResumePackTarget;
}): Promise<ResumePackResult> {
  const evidenceMap = await buildEvidenceMap({
    cwd: options.cwd,
    config: options.config,
  });
  const contextBudget = buildContextBudget({
    evidenceMap,
    savingsCommand: `agentloop resume-pack --for ${options.target} --redact-paths`,
  });
  return {
    target: options.target,
    evidenceMap,
    contextBudget,
    markdown: renderResumePackMarkdown({ target: options.target, evidenceMap, contextBudget }),
    safety: {
      readOnly: true,
      localEvidenceOnly: true,
      commandsRun: [],
    },
  };
}
