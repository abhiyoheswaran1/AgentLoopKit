import type { ContextBudgetSummary } from './context-budget.js';
import {
  escapeMarkdownProse,
  singleLineInlineCode as inlineCode,
} from './markdown-format.js';

export type AgentLoopTokenReceipt = {
  heuristic: 'chars-divided-by-four';
  estimatedBroadContextTokens: number;
  estimatedCompactContextTokens: number;
  estimatedAgentLoopOverheadTokens: number;
  estimatedGrossContextReductionTokens: number;
  estimatedNetContextReductionTokens: number;
  warning: string;
  savingsCommand: string;
  note: string;
};

export function estimateHeuristicTokens(value: string) {
  if (!value) return 0;
  return Math.ceil(value.length / 4);
}

export function buildTokenReceipt(input: {
  contextBudget: ContextBudgetSummary;
  agentLoopOutput: string;
}): AgentLoopTokenReceipt {
  const broad = input.contextBudget.estimatedFileListTokens;
  const compact = input.contextBudget.estimatedResumePackTokens;
  const overhead = estimateHeuristicTokens(input.agentLoopOutput);
  const grossReduction = broad - compact;
  const netReduction = grossReduction - overhead;
  return {
    heuristic: 'chars-divided-by-four',
    estimatedBroadContextTokens: broad,
    estimatedCompactContextTokens: compact,
    estimatedAgentLoopOverheadTokens: overhead,
    estimatedGrossContextReductionTokens: grossReduction,
    estimatedNetContextReductionTokens: netReduction,
    warning:
      netReduction > 0
        ? 'AgentLoopKit estimates this compact evidence path saves context for this repo state.'
        : 'AgentLoopKit may cost more context than it avoids for this repo state. Use compact output or narrow scope.',
    savingsCommand: input.contextBudget.savingsCommand,
    note: 'Token estimates use a transparent character-count heuristic, not a provider tokenizer or billing meter.',
  };
}

export function renderTokenReceiptMarkdown(receipt: AgentLoopTokenReceipt) {
  return `## Token Receipt

- Heuristic: ${inlineCode(receipt.heuristic)}
- Broad context estimate: ${inlineCode(String(receipt.estimatedBroadContextTokens))}
- Compact context estimate: ${inlineCode(String(receipt.estimatedCompactContextTokens))}
- AgentLoopKit overhead: ${inlineCode(String(receipt.estimatedAgentLoopOverheadTokens))}
- Gross context reduction: ${inlineCode(String(receipt.estimatedGrossContextReductionTokens))}
- Net context reduction: ${inlineCode(String(receipt.estimatedNetContextReductionTokens))}
- Compact command: ${inlineCode(receipt.savingsCommand)}
- Warning: ${escapeMarkdownProse(receipt.warning)}
- Note: ${escapeMarkdownProse(receipt.note)}
`;
}
