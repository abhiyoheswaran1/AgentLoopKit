import { describe, it, expect } from 'vitest';
import { analyzeContract, makeSoftSpotId, hasBlockingSoftSpots, toHardenJson, renderSoftSpotsText } from '../../src/core/harden.js';

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

  it('flags a vague acceptance line that only substring-matches a proof verb', () => {
    const md = ['## Acceptance Criteria', '- The design surpasses expectations'].join('\n');
    expect(analyzeContract(md).some((s) => s.type === 'untestable-acceptance')).toBe(true);
  });
});

describe('section boundary at `###` subheadings (FIX 1)', () => {
  it('does not treat a `### Notes` subheading + prose inside Acceptance Criteria as soft spots', () => {
    const md = [
      '## Problem Statement', 'Real problem.',
      '## Non-Goals', '- No SaaS',
      '## Assumptions', '- Vitest is the snapshot primitive',
      '## Files or Areas Not to Touch', '- Published tarballs',
      '## Acceptance Criteria',
      '- `npm test` passes',
      '### Notes',
      'This is just explanatory prose that happens to follow the criteria list.',
    ].join('\n');
    const spots = analyzeContract(md);
    expect(spots.some((s) => s.type === 'untestable-acceptance')).toBe(false);
    expect(spots).toEqual([]);
  });
});

describe('section boundary is fence-aware (FIX F2)', () => {
  it('does not truncate at a `###` line inside a fenced code block, flags the real trailing criterion, and never flags the fence delimiter itself', () => {
    const md = [
      '## Acceptance Criteria',
      '- `npm test` passes',
      '- Example response for `GET /status` is shown below:',
      '```',
      '### Example heading',
      'GET /status returns 200',
      '```',
      '- The feature works well',
      '## Files or Areas Not to Touch',
      '- src/legacy',
    ].join('\n');

    const spots = analyzeContract(md);
    const untestable = spots.filter((s) => s.type === 'untestable-acceptance');

    // A regression that truncates the section at the fenced `###` line
    // would drop this trailing criterion entirely — it must be flagged.
    expect(untestable.some((s) => s.question.includes('The feature works well'))).toBe(true);
    // The fence delimiter itself (```) must never be treated as a criterion
    // and questioned — it is markdown syntax scaffolding, not content.
    expect(untestable.some((s) => s.question.includes('```'))).toBe(false);
  });

  it('still bounds a section at a real, non-fenced `### Notes` subheading (earlier fix intent preserved)', () => {
    const md = [
      '## Acceptance Criteria',
      '- `npm test` passes',
      '### Notes',
      'Prose that must not leak into the criteria list.',
    ].join('\n');
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

describe('acceptanceLines strips the (verified by: ...) tag before rule evaluation (FIX 3)', () => {
  it('still flags a line as untestable when its only proof hint lived in the tag', () => {
    // "perf2" contains a digit, which would satisfy PROOF_HINTS if the raw,
    // tagged line were evaluated. After stripping the tag, "The app feels
    // fast" has no checkable predicate and must be flagged.
    const md = ['## Acceptance Criteria', '- The app feels fast (verified by: perf2)'].join('\n');
    const spots = analyzeContract(md);
    expect(spots.some((s) => s.type === 'untestable-acceptance')).toBe(true);
  });

  it('does not flag untestable-acceptance when the criterion text itself has a proof hint, even though a tag is present', () => {
    const md = ['## Acceptance Criteria', '- `npm test` passes (verified by: test)'].join('\n');
    expect(analyzeContract(md).some((s) => s.type === 'untestable-acceptance')).toBe(false);
  });

  it('does not raise a contradiction purely from tokens inside the (verified by: ...) tag', () => {
    // The Non-Goals line shares "export"/"pipeline" only with the tag key
    // ("export-pipeline-check"), not with the criterion's own text ("New CSV
    // download completes"). Once the tag is stripped, there is no overlap.
    const md = [
      '## Non-Goals', '- Skip legacy export pipeline',
      '## Acceptance Criteria', '- New CSV download completes (verified by: export-pipeline-check)',
    ].join('\n');
    expect(analyzeContract(md).some((s) => s.type === 'contradiction')).toBe(false);
  });
});

describe('rendering and blocking summary', () => {
  it('summarises blocking vs advisory counts', () => {
    const md = ['- Task type: feature', '## Assumptions', '- None recorded yet.',
      '## Files or Areas Not to Touch', '- None recorded yet.'].join('\n');
    const spots = analyzeContract(md);
    expect(hasBlockingSoftSpots(spots)).toBe(true);
    const json = toHardenJson(spots);
    expect(json.blocking).toBeGreaterThanOrEqual(1);
    expect(json.advisory).toBeGreaterThanOrEqual(1);
    expect(renderSoftSpotsText(spots)).toContain('blocking');
  });

  it('renders a clean report when there are no soft spots', () => {
    expect(renderSoftSpotsText([])).toContain('No soft spots');
    expect(hasBlockingSoftSpots([])).toBe(false);
  });
});
