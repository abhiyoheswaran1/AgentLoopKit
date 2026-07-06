import { describe, it, expect } from 'vitest';
import { analyzeContract, makeSoftSpotId } from '../../src/core/harden.js';

describe('harden engine skeleton', () => {
  it('builds deterministic ids', () => {
    expect(makeSoftSpotId('placeholder', 'Non-Goals', 0)).toBe('placeholder:non-goals:0');
  });
  it('returns an empty array for an already-hardened contract', () => {
    const md = [
      '## Problem Statement', 'Real problem.',
      '## Non-Goals', '- No SaaS',
      '## Assumptions', '- Vitest is the snapshot primitive',
      '## Files or Areas Not to Touch', '- Published tarballs',
      '## Acceptance Criteria', '- `npm test` passes',
    ].join('\n');
    expect(analyzeContract(md)).toEqual([]);
  });
});

describe('placeholder rule', () => {
  it('emits a placeholder spot per unresolved review-critical section', () => {
    const md = ['## Acceptance Criteria', '- Add acceptance criteria before implementation starts.'].join('\n');
    expect(analyzeContract(md).some((s) => s.type === 'placeholder')).toBe(true);
  });
});

describe('unbounded-scope rule', () => {
  it('flags empty Files-Not-To-Touch as blocking unbounded-scope', () => {
    const md = ['## Files or Areas Not to Touch', '- None recorded yet.'].join('\n');
    const spots = analyzeContract(md);
    expect(spots.some((s) => s.type === 'unbounded-scope' && s.severity === 'blocking')).toBe(true);
  });
});

describe('unstated-assumption rule', () => {
  it('flags empty Assumptions as advisory for a feature task', () => {
    const md = ['- Task type: feature', '## Assumptions', '- None recorded yet.'].join('\n');
    const spots = analyzeContract(md);
    expect(spots.some((s) => s.type === 'unstated-assumption' && s.severity === 'advisory')).toBe(true);
  });
});

describe('untestable-acceptance rule', () => {
  it('flags an acceptance line with no verifiable predicate', () => {
    const md = ['## Acceptance Criteria', '- The feature works well'].join('\n');
    expect(analyzeContract(md).some((s) => s.type === 'untestable-acceptance')).toBe(true);
  });

  it('does not flag an acceptance line that names a command', () => {
    const md = ['## Acceptance Criteria', '- `npm test` passes'].join('\n');
    expect(analyzeContract(md).some((s) => s.type === 'untestable-acceptance')).toBe(false);
  });
});

describe('contradiction rule', () => {
  it('flags a contradiction between acceptance and non-goals', () => {
    const md = [
      '## Non-Goals', '- No authentication changes',
      '## Acceptance Criteria', '- New authentication flow works',
    ].join('\n');
    expect(analyzeContract(md).some((s) => s.type === 'contradiction' && s.severity === 'blocking')).toBe(true);
  });
});
