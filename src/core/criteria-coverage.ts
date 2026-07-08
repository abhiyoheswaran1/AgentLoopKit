import { extractMarkdownSectionLines } from './task-contract.js';
import { escapeMarkdownProse } from './markdown-format.js';

const ACCEPTANCE_PLACEHOLDER = 'add acceptance criteria before implementation starts.';

export function parseVerificationCommandResults(
  reportMarkdown: string | undefined,
): Map<string, 'pass' | 'fail'> {
  const results = new Map<string, 'pass' | 'fail'>();
  if (!reportMarkdown) return results;
  const lines = reportMarkdown.split('\n');
  let currentKey: string | undefined;
  for (const line of lines) {
    const heading = line.match(/^###\s+([^:]+):/);
    if (heading) {
      currentKey = heading[1].trim().toLowerCase();
      continue;
    }
    const status = line.match(/^-\s*Status:\s*(pass|fail)\b/i);
    if (status && currentKey) {
      const value = status[1].toLowerCase() as 'pass' | 'fail';
      // Fail-closed: once a key has recorded a failure, later occurrences of
      // the same key (e.g. multiple post-verification gates rendered under
      // the shared "post-verification" key) must never overwrite it with a
      // pass — any fail for a key makes the whole key a fail.
      if (results.get(currentKey) !== 'fail') {
        results.set(currentKey, value);
      }
      currentKey = undefined;
    }
  }
  return results;
}

export type CriterionStatus = 'proven' | 'failing' | 'not-run' | 'unlinked';
export type CriterionCoverage = { text: string; linkedKeys: string[]; status: CriterionStatus };
export type CriteriaCoverage = {
  criteria: CriterionCoverage[];
  summary: { total: number; proven: number; failing: number; notRun: number; unlinked: number };
};

const VERIFIED_BY_TAG_RE = /\(verified by:\s*([^)]*)\)\s*$/i;

// Strip a trailing `(verified by: ...)` tag from a criterion line, leaving
// just the criterion text. Shared with harden.ts's acceptanceLines() so both
// modules agree on what counts as the criterion's testable content — the tag
// itself must never mask an untestable line or trigger a false contradiction.
export function stripVerifiedByTag(raw: string): string {
  const tag = raw.match(VERIFIED_BY_TAG_RE);
  if (!tag) return raw.trim();
  return raw.slice(0, tag.index).trim();
}

function parseCriterion(raw: string): { text: string; linkedKeys: string[] } {
  const stripped = raw.replace(/^-\s*/, '').trim();
  const tag = stripped.match(VERIFIED_BY_TAG_RE);
  if (!tag) return { text: stripped, linkedKeys: [] };
  const keys = tag[1]
    .split(',')
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);
  const text = stripped.slice(0, tag.index).trim();
  return { text, linkedKeys: keys };
}

export function reconcileCriteriaCoverage(
  taskMarkdown: string | undefined,
  verificationMarkdown: string | undefined,
): CriteriaCoverage {
  const results = parseVerificationCommandResults(verificationMarkdown);
  const lines = taskMarkdown ? extractMarkdownSectionLines(taskMarkdown, 'Acceptance Criteria') : [];
  const criteria: CriterionCoverage[] = [];
  for (const line of lines) {
    const { text, linkedKeys } = parseCriterion(line);
    if (!text || text.toLowerCase() === ACCEPTANCE_PLACEHOLDER) continue;
    let status: CriterionStatus;
    if (linkedKeys.length === 0) {
      status = 'unlinked';
    } else if (linkedKeys.some((k) => !results.has(k))) {
      status = 'not-run';
    } else if (linkedKeys.some((k) => results.get(k) === 'fail')) {
      status = 'failing';
    } else {
      status = 'proven';
    }
    criteria.push({ text, linkedKeys, status });
  }
  const summary = {
    total: criteria.length,
    proven: criteria.filter((c) => c.status === 'proven').length,
    failing: criteria.filter((c) => c.status === 'failing').length,
    notRun: criteria.filter((c) => c.status === 'not-run').length,
    unlinked: criteria.filter((c) => c.status === 'unlinked').length,
  };
  return { criteria, summary };
}

export function renderCriteriaCoverageMarkdown(coverage: CriteriaCoverage): string {
  const { summary, criteria } = coverage;
  if (criteria.length === 0) {
    return '## Criteria Coverage\n\n- No acceptance criteria to reconcile.';
  }
  const label: Record<CriterionStatus, string> = {
    proven: 'proven',
    failing: 'failing',
    'not-run': 'not run',
    unlinked: 'unlinked',
  };
  const bullets = criteria
    .map((c) => {
      const keys = c.linkedKeys.length
        ? ` (verified by: ${c.linkedKeys.map((k) => escapeMarkdownProse(k)).join(', ')})`
        : '';
      return `- [${label[c.status]}] ${escapeMarkdownProse(c.text)}${keys}`;
    })
    .join('\n');
  return `## Criteria Coverage

${summary.total} criteria — ${summary.proven} proven, ${summary.failing} failing, ${summary.notRun} not run, ${summary.unlinked} unlinked.

${bullets}`;
}
