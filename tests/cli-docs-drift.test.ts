import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { execa } from 'execa';
import { describe, expect, test } from 'vitest';
import { renderCompletionScript } from '../src/core/completions.js';
import { STABLE_COMMANDS as publicCommands } from '../src/core/stable-surface.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

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
