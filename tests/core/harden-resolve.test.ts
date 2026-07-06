import { describe, it, expect } from 'vitest';
import { applyResolution, HardenResolutionError } from '../../src/core/harden-resolve.js';
import { analyzeContract, hasBlockingSoftSpots, type SoftSpotType } from '../../src/core/harden.js';

const base = ['- Task type: feature',
  '## Files or Areas Not to Touch', '- None recorded yet.',
  '## Acceptance Criteria', '- `npm test` passes'].join('\n');

describe('applyResolution', () => {
  it('writes the answer into the section and logs it', () => {
    const id = analyzeContract(base).find((s) => s.type === 'unbounded-scope')!.id;
    const out = applyResolution(base, id, 'Published release tarballs');
    expect(out).toContain('- Published release tarballs');
    expect(out).not.toContain('None recorded yet.');
    expect(out).toContain('## Hardening Log');
    expect(out).toContain(`- [${id}] Published release tarballs`);
  });

  it('throws on an unknown spot id', () => {
    expect(() => applyResolution(base, 'placeholder:nope:0', 'x')).toThrow(HardenResolutionError);
  });

  it('exposes the HARDEN_UNKNOWN_SPOT code on the error', () => {
    expect(new HardenResolutionError('x').code).toBe('HARDEN_UNKNOWN_SPOT');
    let caught: unknown;
    try {
      applyResolution(base, 'placeholder:nope:0', 'x');
    } catch (error) {
      caught = error;
    }
    expect((caught as HardenResolutionError).code).toBe('HARDEN_UNKNOWN_SPOT');
  });
});

// A verifiable answer that satisfies PROOF_HINTS (backtick command) so that a
// resolved acceptance line does not itself re-trigger an untestable spot.
const PROOF_ANSWER = '`npm test` passes';

interface Case {
  name: string;
  type: SoftSpotType;
  markdown: string;
  answer: string;
  blocking: boolean;
}

const cases: Case[] = [
  {
    name: 'placeholder on a paragraph section (Problem Statement)',
    type: 'placeholder',
    markdown: [
      '## Problem Statement',
      'Describe the problem this task should solve.',
      '## Files or Areas Not to Touch',
      '- src/legacy',
    ].join('\n'),
    answer: 'The release CLI drops evidence when the report is missing.',
    blocking: true,
  },
  {
    name: 'placeholder on a list section (Verification Commands)',
    type: 'placeholder',
    markdown: [
      '## Verification Commands',
      '- No verification command recorded.',
      '## Files or Areas Not to Touch',
      '- src/legacy',
    ].join('\n'),
    answer: 'npm test',
    blocking: true,
  },
  {
    name: 'unbounded-scope on an empty Files-Not-To-Touch',
    type: 'unbounded-scope',
    markdown: ['## Files or Areas Not to Touch', '- None recorded yet.'].join('\n'),
    answer: 'Published release tarballs',
    blocking: true,
  },
  {
    name: 'unstated-assumption on empty Assumptions for a feature task',
    type: 'unstated-assumption',
    markdown: [
      '- Task type: feature',
      '## Assumptions',
      '- None recorded yet.',
      '## Files or Areas Not to Touch',
      '- src/legacy',
    ].join('\n'),
    answer: 'The snapshot primitive stays Vitest.',
    blocking: false,
  },
  {
    name: 'untestable-acceptance on a vague criterion',
    type: 'untestable-acceptance',
    markdown: [
      '## Acceptance Criteria',
      '- The feature works well',
      '## Files or Areas Not to Touch',
      '- src/legacy',
    ].join('\n'),
    answer: PROOF_ANSWER,
    blocking: true,
  },
  {
    name: 'contradiction between acceptance and non-goals',
    type: 'contradiction',
    markdown: [
      '## Non-Goals',
      '- No caching layer',
      '## Acceptance Criteria',
      '- Caching returns 200 within 50ms',
      '## Files or Areas Not to Touch',
      '- src/legacy',
    ].join('\n'),
    // Deliberately shares no significant token with the Non-Goals line and
    // carries a proof hint, so it re-triggers neither contradiction nor
    // untestable-acceptance.
    answer: '`npm test` returns exit 0',
    blocking: true,
  },
];

describe('applyResolution convergence matrix', () => {
  for (const testCase of cases) {
    it(`converges the ${testCase.name}`, () => {
      const before = analyzeContract(testCase.markdown);
      const spot = before.find((s) => s.type === testCase.type);
      expect(spot, `expected a ${testCase.type} spot in fixture`).toBeDefined();

      const result = applyResolution(testCase.markdown, spot!.id, testCase.answer);
      const after = analyzeContract(result);

      // The exact spot we resolved must be gone.
      expect(after.some((s) => s.id === spot!.id)).toBe(false);
      // The Hardening Log entry is recorded.
      expect(result).toContain(`- [${spot!.id}] ${testCase.answer}`);

      if (testCase.blocking) {
        // This was the only blocking spot in the fixture, so no blocking
        // spots should remain.
        const blockingBefore = before.filter((s) => s.severity === 'blocking');
        expect(blockingBefore).toHaveLength(1);
        expect(hasBlockingSoftSpots(after)).toBe(false);
      }
    });
  }
});

describe('batched sequential placeholder resolution (FIX 2 — stable ids)', () => {
  it('resolves two placeholder spots in sequence without throwing', () => {
    const markdown = [
      '## Problem Statement',
      'Describe the problem this task should solve.',
      '## Desired Outcome',
      'Describe the concrete result expected from this task.',
      '## Files or Areas Not to Touch',
      '- src/legacy',
    ].join('\n');

    const spots = analyzeContract(markdown).filter((s) => s.type === 'placeholder');
    expect(spots).toHaveLength(2);
    const [first, second] = spots;

    const afterFirst = applyResolution(markdown, first.id, 'A concrete problem statement.');
    // The second id (captured up front) must still resolve on the updated
    // contract; with unstable ordinals this would throw.
    const afterSecond = applyResolution(afterFirst, second.id, 'A concrete desired outcome.');

    expect(analyzeContract(afterSecond).some((s) => s.type === 'placeholder')).toBe(false);
  });
});
