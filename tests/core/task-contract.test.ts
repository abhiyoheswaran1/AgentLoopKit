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

  it('is fence-aware: a `###`/`##` line inside a fenced code block is not a section boundary (FIX F2)', () => {
    // The FIX 1 broadened terminator (/^#{2,}\s+/) must not fire on a
    // `### Example heading` line that is *inside* a fenced code block (e.g.
    // an acceptance criterion quoting a pasted markdown/API-doc snippet).
    // The whole fenced block, including its delimiters, stays in the body;
    // the section only ends at the next REAL (non-fenced) `## ` heading.
    const md = [
      '## Acceptance Criteria',
      '- `npm test` passes',
      '- Example response is shown below:',
      '```',
      '### Example heading inside a pasted snippet',
      'more fenced content',
      '```',
      '- A real trailing criterion',
      '## Verification Commands',
      '- npm test',
    ].join('\n');
    expect(extractMarkdownSectionLines(md, 'Acceptance Criteria')).toEqual([
      '- `npm test` passes',
      '- Example response is shown below:',
      '```',
      '### Example heading inside a pasted snippet',
      'more fenced content',
      '```',
      '- A real trailing criterion',
    ]);
  });

  it('still terminates at a real, non-fenced `###` heading (earlier fix intent preserved) (FIX F2)', () => {
    const md = [
      '## Acceptance Criteria',
      '- `npm test` passes',
      '### Notes',
      'Some prose that belongs to the subheading, not the criteria list.',
    ].join('\n');
    expect(extractMarkdownSectionLines(md, 'Acceptance Criteria')).toEqual(['- `npm test` passes']);
  });
});
