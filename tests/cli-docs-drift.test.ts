import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { execa } from 'execa';
import { describe, expect, test } from 'vitest';
import { renderCompletionScript } from '../src/core/completions.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

const publicCommands = [
  'init',
  'doctor',
  'create-task',
  'verify',
  'summarize',
  'handoff',
  'status',
  'next',
  'review-context',
  'check-gates',
  'ship',
  'prepare-pr',
  'runs',
  'show-run',
  'intent',
  'maintainer-check',
  'report',
  'badge',
  'artifacts',
  'upgrade-harness',
  'ci-summary',
  'release-notes',
  'release-check',
  'npm-status',
  'mcp-server',
  'schemastore',
  'github',
  'policy',
  'task',
  'install-agent',
  'list-templates',
  'completion',
  'version',
] as const;

describe('CLI docs drift', () => {
  test('public command surface is reflected in help, README, CLI reference, and completions', async () => {
    const [help, readme, cliReference] = await Promise.all([
      execa(tsxPath, [cliPath, '--help']),
      readFile('README.md', 'utf8'),
      readFile('docs/cli-reference.md', 'utf8'),
    ]);
    const zshCompletion = renderCompletionScript('zsh');

    for (const command of publicCommands) {
      expect(help.stdout).toContain(command);
      expect(readme).toContain(`agentloop ${command}`);
      expect(cliReference).toContain(`agentloop ${command}`);
      expect(zshCompletion).toContain(`${command}:`);
    }
  });
});
