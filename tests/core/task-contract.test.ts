import { describe, it, expect } from 'vitest';
import { extractMarkdownSectionLines } from '../../src/core/task-contract.js';

describe('extractMarkdownSectionLines', () => {
  it('returns trimmed non-empty lines under a heading', () => {
    const md = ['## Non-Goals', '- No SaaS', '', '- No telemetry', '## Assumptions', '- x'].join('\n');
    expect(extractMarkdownSectionLines(md, 'Non-Goals')).toEqual(['- No SaaS', '- No telemetry']);
  });
});
