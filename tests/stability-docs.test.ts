import { readFile } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';
import { STABLE_COMMANDS } from '../src/core/stable-surface.js';

describe('stability docs', () => {
  test('stability.md documents every stable command', async () => {
    const doc = await readFile('docs/stability.md', 'utf8');
    for (const command of STABLE_COMMANDS) {
      expect(doc).toContain(`agentloop ${command}`);
    }
  });

  test('stability.md names all six committed axes', async () => {
    const doc = await readFile('docs/stability.md', 'utf8');
    for (const axis of [
      'CLI commands',
      'config',
      'MCP',
      'JSON output',
      'exit code',
      'harness format',
    ]) {
      expect(doc.toLowerCase()).toContain(axis.toLowerCase());
    }
  });
});
