# Criteria-Proof Reconciliation (B1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Checkbox steps.

**Goal:** Cross-reference each acceptance criterion against the verification report — labeling it proven / failing / not-run / unlinked — and surface that evidence in the `prepare-pr` packet, replacing the manual "criteria match" checkbox.

**Architecture:** New `src/core/criteria-coverage.ts` (parse report command results; reconcile criteria via an optional `(verified by: <keys>)` tag; render markdown). Integrated into `pr-summary.ts` `generatePrSummary`, which already has both the task and verification markdown. `criteriaCoverage` is added to `prepare-pr --json` as a deliberate additive contract change.

**Tech Stack:** TypeScript (ESM `.js`), vitest.

## Global Constraints
- No LLM/network/telemetry; pure deterministic string parsing. No timestamps/randomness. ESM `.js`.
- No overclaiming: a criterion is only `proven` if a linked verification command actually passed; no tag → `unlinked` (honest).
- Adding `criteriaCoverage` to `prepare-pr --json` is a DELIBERATE additive change — update the locked snapshot intentionally; the ONLY snapshot delta may be the added `criteriaCoverage` shape.
- Vitest focused/sequential (parallel OOM-kills this machine); read `contract:check` output IN FULL.

---

### Task 1: `criteria-coverage.ts` reconciliation module

**Files:**
- Create: `src/core/criteria-coverage.ts`
- Test: `tests/criteria-coverage.test.ts`

**Interfaces:**
- Consumes: `extractMarkdownSectionLines` from `./task-contract.js`.
- Produces: `parseVerificationCommandResults(reportMarkdown): Map<string, 'pass'|'fail'>`; `type CriterionCoverage`; `type CriteriaCoverage`; `reconcileCriteriaCoverage(taskMarkdown?, verificationMarkdown?): CriteriaCoverage`; `renderCriteriaCoverageMarkdown(coverage): string`.

- [ ] **Step 1: Write failing tests**

```ts
import { describe, it, expect } from 'vitest';
import {
  parseVerificationCommandResults,
  reconcileCriteriaCoverage,
  renderCriteriaCoverageMarkdown,
} from '../src/core/criteria-coverage.js';

const report = [
  '# Verification Report',
  '## Commands Run',
  '### test: `npm test`',
  '- Exit code: 0',
  '- Status: pass',
  '',
  '### lint: `npm run lint`',
  '- Exit code: 1',
  '- Status: fail',
].join('\n');

describe('parseVerificationCommandResults', () => {
  it('parses per-command status by key', () => {
    const m = parseVerificationCommandResults(report);
    expect(m.get('test')).toBe('pass');
    expect(m.get('lint')).toBe('fail');
    expect(parseVerificationCommandResults('').size).toBe(0);
  });
});

describe('reconcileCriteriaCoverage', () => {
  const task = [
    '## Acceptance Criteria',
    '- Auth works (verified by: test)',
    '- Clean lint (verified by: lint)',
    '- Types clean (verified by: typecheck)',
    '- Copy reads clearly',
  ].join('\n');

  it('labels criteria proven/failing/not-run/unlinked', () => {
    const c = reconcileCriteriaCoverage(task, report);
    const byText = Object.fromEntries(c.criteria.map((x) => [x.text, x.status]));
    expect(byText['Auth works']).toBe('proven');       // test passed
    expect(byText['Clean lint']).toBe('failing');      // lint failed
    expect(byText['Types clean']).toBe('not-run');     // typecheck absent from report
    expect(byText['Copy reads clearly']).toBe('unlinked');
    expect(c.summary).toEqual({ total: 4, proven: 1, failing: 1, notRun: 1, unlinked: 1 });
  });

  it('strips the verified-by tag from displayed text and lowercases keys', () => {
    const c = reconcileCriteriaCoverage('## Acceptance Criteria\n- X (verified by: Test, Lint)', report);
    expect(c.criteria[0].text).toBe('X');
    expect(c.criteria[0].linkedKeys).toEqual(['test', 'lint']);
  });

  it('ignores the acceptance placeholder and degrades with no report', () => {
    const c = reconcileCriteriaCoverage('## Acceptance Criteria\n- Add acceptance criteria before implementation starts.', undefined);
    expect(c.criteria).toHaveLength(0);
    const d = reconcileCriteriaCoverage('## Acceptance Criteria\n- A (verified by: test)', undefined);
    expect(d.criteria[0].status).toBe('not-run');
  });
});

describe('renderCriteriaCoverageMarkdown', () => {
  it('renders a section with a summary line and a bullet per criterion', () => {
    const c = reconcileCriteriaCoverage('## Acceptance Criteria\n- A (verified by: test)', report);
    const md = renderCriteriaCoverageMarkdown(c);
    expect(md).toContain('## Criteria Coverage');
    expect(md).toMatch(/proven/);
    expect(md).toContain('A');
  });
});
```

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run tests/criteria-coverage.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

```ts
// src/core/criteria-coverage.ts
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
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run tests/criteria-coverage.test.ts`
Expected: PASS.

- [ ] **Step 5: typecheck + lint + commit**

Run `npm run typecheck`, `npm run lint` (green).

```bash
git add src/core/criteria-coverage.ts tests/criteria-coverage.test.ts
git commit -m "feat: add criteria-proof reconciliation module"
```

---

### Task 2: Surface criteria coverage in the prepare-pr packet

**Files:**
- Modify: `src/core/pr-summary.ts` (`generatePrSummary` — add coverage compute, render into markdown, add to result)
- Test: `tests/prepare-pr.test.ts` (or the pr-summary test file); update `tests/contract/__snapshots__/json-shape.contract.test.ts.snap` (deliberate)

**Interfaces:**
- Consumes: `reconcileCriteriaCoverage`, `renderCriteriaCoverageMarkdown` from `./criteria-coverage.js`.
- Produces: `generatePrSummary` result gains `criteriaCoverage: CriteriaCoverage`; the markdown gains the `## Criteria Coverage` section.

- [ ] **Step 1: Write failing test**

In the pr-summary/prepare-pr test file (reuse its fixture that builds a summary with a task + verification report), add:

```ts
it('includes criteria coverage reconciled against the verification report', async () => {
  // Arrange: task with "## Acceptance Criteria\n- Auth works (verified by: test)" and a verification
  // report where test passed. Build the summary (markdown) and read prepare-pr --json.
  expect(summaryMarkdown).toContain('## Criteria Coverage');
  expect(summaryMarkdown).toMatch(/\[proven\] Auth works/);
  // and the --json result exposes criteriaCoverage.summary
  expect(json.criteriaCoverage.summary.proven).toBe(1);
});
```

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run tests/prepare-pr.test.ts -t "criteria coverage"` (use the actual file)
Expected: FAIL — no such section/field.

- [ ] **Step 3: Implement**

In `src/core/pr-summary.ts` `generatePrSummary` (which receives `taskMarkdown`, `verificationMarkdown`): compute `const criteriaCoverage = reconcileCriteriaCoverage(input.taskMarkdown, input.verificationMarkdown);`, insert `renderCriteriaCoverageMarkdown(criteriaCoverage)` into the summary markdown template near the acceptance-criteria / reviewer-checklist area (replace the faith-based `- [ ] Acceptance criteria match the task contract.` checkbox at line ~132 with the evidence block, or place the block directly above the checklist), and add `criteriaCoverage` to the returned result object so `prepare-pr --json` includes it. Import from `./criteria-coverage.js`.

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run tests/prepare-pr.test.ts -t "criteria coverage"`
Expected: PASS.

- [ ] **Step 5: Deliberate snapshot update + full verification**

- Run `npm run contract:check` and READ THE FULL OUTPUT. The `prepare-pr` json-shape snapshot will mismatch (new `criteriaCoverage` field) — this is the DELIBERATE additive change. Update it: `npx vitest run tests/contract/json-shape.contract.test.ts -u`. Then `git diff` the snapshot and CONFIRM the ONLY change is the added `criteriaCoverage` shape (nothing else). Re-run `npm run contract:check` → green.
- Run consumers individually: `npx vitest run tests/prepare-pr.test.ts`, `tests/ship.test.ts` (ship embeds pr-summary? confirm unaffected), `tests/criteria-coverage.test.ts`.
- `npm run typecheck`, `npm run lint` green.

- [ ] **Step 6: Commit**

```bash
git add src/core/pr-summary.ts tests/ tests/contract/__snapshots__/json-shape.contract.test.ts.snap
git commit -m "feat: surface criteria-proof reconciliation in the prepare-pr packet"
```

---

## Self-Review

**Spec coverage:** report parser (Task 1), reconcile with 4 statuses + tag parsing + placeholder skip (Task 1), render (Task 1), pr-summary integration + --json + deliberate snapshot (Task 2). ✓

**Placeholder scan:** No TBD/TODO; test fixtures reuse real suites; code concrete.

**Type consistency:** `parseVerificationCommandResults`, `CriterionStatus`, `CriteriaCoverage`, `reconcileCriteriaCoverage(taskMarkdown?, verificationMarkdown?)`, `renderCriteriaCoverageMarkdown` used identically across tasks.

## Notes for the implementer
- Confirm the exact pr-summary test file (`tests/prepare-pr.test.ts` or `tests/pr-summary.test.ts`) and the `generatePrSummary` input field names for taskMarkdown/verificationMarkdown.
- The `## Criteria Coverage` section is markdown in the PR body; keep it above or replacing the reviewer-checklist "acceptance criteria match" line so the evidence supersedes the faith checkbox.
