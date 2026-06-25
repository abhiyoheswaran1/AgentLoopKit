import { describe, expect, test } from 'vitest';
import { escapeMarkdownProse, inlineCode } from '../src/core/markdown-format.js';

describe('markdown formatting helpers', () => {
  test('wraps inline code with single backticks when content has no backticks', () => {
    expect(inlineCode('src/index.ts')).toBe('`src/index.ts`');
  });

  test('uses longer delimiters when content contains backticks', () => {
    expect(inlineCode('src/weird`path.ts')).toBe('``src/weird`path.ts``');
    expect(inlineCode('node -e "console.log(`ok`)"')).toBe('``node -e "console.log(`ok`)"``');
  });

  test('pads content that starts or ends with a backtick or space', () => {
    expect(inlineCode('`leading')).toBe('`` `leading ``');
    expect(inlineCode('trailing`')).toBe('`` trailing` ``');
    expect(inlineCode(' spaced ')).toBe('`  spaced  `');
  });

  test('keeps angle brackets inside inline command prose readable', () => {
    expect(escapeMarkdownProse('Run `agentloop intent <file>` before review.')).toBe(
      'Run `agentloop intent <file>` before review.',
    );
  });

  test('keeps underscores inside inline command prose readable', () => {
    expect(escapeMarkdownProse('Call `agentloop_latest_handoff` from MCP.')).toBe(
      'Call `agentloop_latest_handoff` from MCP.',
    );
  });

  test('escapes leading blockquote markers without escaping every greater-than sign', () => {
    expect(escapeMarkdownProse('> quoted\nx > y')).toBe('\\> quoted\nx > y');
  });
});
