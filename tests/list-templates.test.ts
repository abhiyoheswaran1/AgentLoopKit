import path from 'node:path';
import { execa } from 'execa';
import { describe, expect, test } from 'vitest';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

describe('list-templates command', () => {
  test('prints grouped human output by default', async () => {
    const result = await execa(tsxPath, [cliPath, 'list-templates']);

    expect(result.stdout).toContain('root:');
    expect(result.stdout).toContain('  - AGENTS.md');
    expect(result.stdout).toContain('loops:');
    expect(result.stdout).toContain('  - feature.md');
  });

  test('prints grouped template data as JSON when requested', async () => {
    const result = await execa(tsxPath, [cliPath, 'list-templates', '--json']);

    expect(JSON.parse(result.stdout)).toEqual({
      templates: expect.objectContaining({
        root: expect.arrayContaining(['AGENTS.md', 'AGENTLOOP.md', 'agentloop.config.json']),
        loops: expect.arrayContaining(['feature.md', 'bugfix.md']),
        agents: expect.arrayContaining(['codex.md', 'claude-code.md']),
      }),
    });
  });
});
