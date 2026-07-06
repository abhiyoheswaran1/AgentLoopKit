import path from 'node:path';
import { execa } from 'execa';
import { describe, expect, test } from 'vitest';
import { STABLE_COMMANDS, JSON_COMMANDS } from '../src/core/stable-surface.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

describe('stable surface', () => {
  test('every stable command appears in top-level --help', async () => {
    const { stdout } = await execa(tsxPath, [cliPath, '--help']);
    for (const command of STABLE_COMMANDS) {
      expect(stdout).toContain(command);
    }
  });

  test('JSON_COMMANDS is a subset of STABLE_COMMANDS', () => {
    for (const command of JSON_COMMANDS) {
      expect(STABLE_COMMANDS).toContain(command);
    }
  });
});
