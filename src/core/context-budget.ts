import type { EvidenceMap } from './evidence-map.js';
import { renderEvidenceMapCompactMarkdown } from './evidence-map.js';
import {
  escapeMarkdownProse,
  singleLineInlineCode as inlineCode,
} from './markdown-format.js';

export type ContextBudgetSummary = {
  heuristic: 'chars-divided-by-four';
  changedFileCount: number;
  nonEvidenceChangedFileCount: number;
  estimatedFileListTokens: number;
  estimatedResumePackTokens: number;
  savingsCommand: string;
  note: string;
};

export const DEFAULT_CONTEXT_SAVINGS_COMMAND = 'agentloop resume-pack --for codex --redact-paths';

function estimateTokens(value: string) {
  if (!value) return 0;
  return Math.ceil(value.length / 4);
}

export function buildContextBudget(input: {
  evidenceMap: EvidenceMap;
  savingsCommand?: string;
}): ContextBudgetSummary {
  const map = input.evidenceMap;
  const changedPathList = map.files.map((file) => file.path).join('\n');
  const compactSummary = `${renderEvidenceMapCompactMarkdown(map)}\n${map.nextActions
    .map((action) => `${action.command}: ${action.reason}`)
    .join('\n')}`;

  return {
    heuristic: 'chars-divided-by-four',
    changedFileCount: map.summary.changedFileCount,
    nonEvidenceChangedFileCount: map.summary.nonEvidenceChangedFileCount,
    estimatedFileListTokens: estimateTokens(changedPathList),
    estimatedResumePackTokens: estimateTokens(compactSummary),
    savingsCommand: input.savingsCommand ?? DEFAULT_CONTEXT_SAVINGS_COMMAND,
    note: 'Token estimates use a transparent character-count heuristic, not a provider tokenizer or billing meter.',
  };
}

export function renderContextBudgetCompactMarkdown(contextBudget: ContextBudgetSummary) {
  return `- Context budget: ${inlineCode(
    String(contextBudget.changedFileCount),
  )} changed file(s), approx ${inlineCode(
    String(contextBudget.estimatedFileListTokens),
  )} file-list token(s), approx ${inlineCode(
    String(contextBudget.estimatedResumePackTokens),
  )} resume-pack token(s); compact continuation: ${inlineCode(contextBudget.savingsCommand)}.`;
}

export function renderContextBudgetMarkdown(contextBudget: ContextBudgetSummary) {
  return `## Context Budget

- Heuristic: ${inlineCode(contextBudget.heuristic)}
- Changed files: ${inlineCode(String(contextBudget.changedFileCount))} total; ${inlineCode(
    String(contextBudget.nonEvidenceChangedFileCount),
  )} non-evidence.
- Estimated changed-file list tokens: ${inlineCode(
    String(contextBudget.estimatedFileListTokens),
  )}
- Estimated resume-pack tokens: ${inlineCode(String(contextBudget.estimatedResumePackTokens))}
- Compact continuation: ${inlineCode(contextBudget.savingsCommand)}
- Note: ${escapeMarkdownProse(contextBudget.note)}
`;
}
