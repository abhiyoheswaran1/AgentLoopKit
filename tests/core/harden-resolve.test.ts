import { describe, it, expect } from 'vitest';
import { applyResolution, HardenResolutionError } from '../../src/core/harden-resolve.js';
import { analyzeContract } from '../../src/core/harden.js';

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
});
