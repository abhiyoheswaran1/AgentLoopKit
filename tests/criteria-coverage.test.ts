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

  it('fails closed on key collision: a fail is never overwritten by a later pass (FIX 2)', () => {
    // Multiple post-verification gates render under the shared
    // `post-verification` key. If the first gate fails and a later one
    // passes, the key must stay `fail` — never last-wins.
    const collidingReport = [
      '### post-verification: `node gate-one.mjs`',
      '- Exit code: 1',
      '- Status: fail',
      '',
      '### post-verification: `node gate-two.mjs`',
      '- Exit code: 0',
      '- Status: pass',
    ].join('\n');
    const m = parseVerificationCommandResults(collidingReport);
    expect(m.get('post-verification')).toBe('fail');
  });

  it('fails closed regardless of pass/fail order for a colliding key', () => {
    const passThenFail = [
      '### post-verification: `node gate-one.mjs`',
      '- Exit code: 0',
      '- Status: pass',
      '',
      '### post-verification: `node gate-two.mjs`',
      '- Exit code: 1',
      '- Status: fail',
    ].join('\n');
    expect(parseVerificationCommandResults(passThenFail).get('post-verification')).toBe('fail');
  });
});

describe('reconcileCriteriaCoverage — fail-closed collision (FIX 2)', () => {
  it('does not mark a criterion "proven" when its verification key collided fail-then-pass', () => {
    const collidingReport = [
      '### post-verification: `node gate-one.mjs`',
      '- Exit code: 1',
      '- Status: fail',
      '',
      '### post-verification: `node gate-two.mjs`',
      '- Exit code: 0',
      '- Status: pass',
    ].join('\n');
    const task = '## Acceptance Criteria\n- Release is safe to ship (verified by: post-verification)';
    const c = reconcileCriteriaCoverage(task, collidingReport);
    expect(c.criteria[0].status).toBe('failing');
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

  it('escapes markdown-breaking characters in criterion text (FIX 4)', () => {
    // A criterion text containing brackets/asterisks that could break the
    // rendered markdown (and anything downstream that parses it, e.g. PR
    // bodies) must come out escaped, matching every sibling field.
    const task = '## Acceptance Criteria\n- Renders [malicious](javascript:alert(1)) *bold* text (verified by: test)';
    const c = reconcileCriteriaCoverage(task, report);
    const md = renderCriteriaCoverageMarkdown(c);
    // Raw markdown-breaking sequence must not appear unescaped.
    expect(md).not.toContain('[malicious](javascript:alert(1))');
    expect(md).toContain('\\[malicious\\]\\(javascript:alert\\(1\\)\\)');
    expect(md).toContain('\\*bold\\*');
  });
});
