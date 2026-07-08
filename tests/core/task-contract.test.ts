import { describe, it, expect } from 'vitest';
import { extractMarkdownSectionLines } from '../../src/core/task-contract.js';

describe('extractMarkdownSectionLines', () => {
  it('returns trimmed non-empty lines under a heading', () => {
    const md = ['## Non-Goals', '- No SaaS', '', '- No telemetry', '## Assumptions', '- x'].join('\n');
    expect(extractMarkdownSectionLines(md, 'Non-Goals')).toEqual(['- No SaaS', '- No telemetry']);
  });

  it('treats a `###` subheading as a section boundary (FIX 1)', () => {
    // A `### Sub heading` inside `## Acceptance Criteria` must terminate the
    // section just like a `## ` heading does — it must not match /^##\s+/,
    // which would let the subheading and its prose leak into the body.
    const md = [
      '## Acceptance Criteria',
      '- `npm test` passes',
      '### Notes',
      'Some prose that belongs to the subheading, not the criteria list.',
      '## Verification Commands',
      '- npm test',
    ].join('\n');
    expect(extractMarkdownSectionLines(md, 'Acceptance Criteria')).toEqual(['- `npm test` passes']);
  });
});
