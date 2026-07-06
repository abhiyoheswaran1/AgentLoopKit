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

  test('consistency audit exists and is triaged', async () => {
    const audit = await readFile('docs/1.0-consistency-audit.md', 'utf8');
    expect(audit).toMatch(/fix-before-1\.0|accept-as-is|defer-to-experimental/);
  });

  test('versioning.md states the SemVer, deprecation, and experimental policy', async () => {
    const doc = await readFile('docs/versioning.md', 'utf8');
    expect(doc.toLowerCase()).toContain('semver');
    expect(doc.toLowerCase()).toContain('deprecat');
    expect(doc.toLowerCase()).toContain('experimental');
  });

  test('README links the stability and versioning guarantees', async () => {
    const readme = await readFile('README.md', 'utf8');
    expect(readme).toContain('docs/stability.md');
    expect(readme).toContain('docs/versioning.md');
  });
});
