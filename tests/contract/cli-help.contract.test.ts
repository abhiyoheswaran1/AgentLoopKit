import path from 'node:path';
import { execa } from 'execa';
import { describe, expect, test } from 'vitest';
import { STABLE_COMMANDS } from '../../src/core/stable-surface.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

describe('CLI help contract', () => {
  test('top-level --help is locked', async () => {
    const { stdout } = await execa(tsxPath, [cliPath, '--help'], { reject: false });
    expect(stdout).toMatchSnapshot();
  });

  for (const command of STABLE_COMMANDS) {
    test(`help for "${command}" is locked`, async () => {
      const { stdout } = await execa(tsxPath, [cliPath, command, '--help'], { reject: false });
      expect(stdout).toMatchSnapshot();
    });
  }
});
