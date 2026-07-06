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
