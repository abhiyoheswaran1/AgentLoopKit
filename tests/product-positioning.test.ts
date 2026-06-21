import { readFile } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';

const PRODUCT_DIRECTION_FILES = [
  '.agentloop/product-panel.md',
  '.agentloop/user-personas.md',
  '.agentloop/backlog.md',
] as const;

const unsupportedPositioning = [
  {
    label: 'cheap assisted-positioning phrase',
    pattern: new RegExp(`\\b${['AI', 'assisted'].join('[-\\s]')}\\b`, 'i'),
  },
  {
    label: 'cheap generated-positioning phrase',
    pattern: new RegExp(`\\b${['AI', 'generated'].join('[-\\s]')}\\b`, 'i'),
  },
  {
    label: 'cheap coding-positioning phrase',
    pattern: new RegExp(`\\b${['AI', 'coding'].join('[-\\s]+')}\\b`, 'i'),
  },
  {
    label: 'generic assistant-positioning phrase',
    pattern: new RegExp(`\\b${['coding', 'assistant'].join('[-\\s]+')}\\b`, 'i'),
  },
  {
    label: 'cheap automation-positioning phrase',
    pattern: new RegExp(`\\b${['vibe', 'coding'].join('[-\\s]+')}\\b`, 'i'),
  },
  {
    label: 'agent output proof phrase',
    pattern: new RegExp(`\\b${['agent', 'generated'].join('[-\\s]')}\\b`, 'i'),
  },
  {
    label: 'cheap agent-prefix phrase',
    pattern: new RegExp(`\\b${['AI', 'agent'].join('[-\\s]')}\\b`, 'i'),
  },
  {
    label: 'cheap skeptic-prefix phrase',
    pattern: new RegExp(`\\b${['AI', 'skeptical'].join('[-\\s]')}\\b`, 'i'),
  },
  {
    label: 'narrow coding-agent phrase',
    pattern: new RegExp(`\\b${['coding', 'agent'].join('[-\\s]')}s?\\b`, 'i'),
  },
  {
    label: 'narrow coding-session phrase',
    pattern: new RegExp(`\\b${['coding', 'session'].join('[-\\s]')}s?\\b`, 'i'),
  },
] as const;

describe('product positioning language', () => {
  test('keeps internal product-direction files aligned with agent-assisted engineering wording', async () => {
    const violations: string[] = [];

    for (const filePath of PRODUCT_DIRECTION_FILES) {
      const content = await readFile(filePath, 'utf8');
      for (const claim of unsupportedPositioning) {
        if (claim.pattern.test(content)) {
          violations.push(`${filePath}: ${claim.label}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
