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

  it('resolves not-run when one linked key passed and another is absent from the report', () => {
    const c = reconcileCriteriaCoverage(
      '## Acceptance Criteria\n- Multi-key check (verified by: test, typecheck)',
      report,
    );
    expect(c.criteria[0].status).toBe('not-run');
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
