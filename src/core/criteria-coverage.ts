import { extractMarkdownSectionLines } from './task-contract.js';

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
      results.set(currentKey, status[1].toLowerCase() as 'pass' | 'fail');
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

function parseCriterion(raw: string): { text: string; linkedKeys: string[] } {
  const stripped = raw.replace(/^-\s*/, '').trim();
  const tag = stripped.match(/\(verified by:\s*([^)]*)\)\s*$/i);
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
      const keys = c.linkedKeys.length ? ` (verified by: ${c.linkedKeys.join(', ')})` : '';
      return `- [${label[c.status]}] ${c.text}${keys}`;
    })
    .join('\n');
  return `## Criteria Coverage

${summary.total} criteria — ${summary.proven} proven, ${summary.failing} failing, ${summary.notRun} not run, ${summary.unlinked} unlinked.

${bullets}`;
}
