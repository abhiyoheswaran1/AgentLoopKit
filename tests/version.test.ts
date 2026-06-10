import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { execa } from 'execa';
import { describe, expect, test } from 'vitest';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

describe('version command', () => {
  test('prints the package version', async () => {
    const packageJson = JSON.parse(await readFile(path.resolve('package.json'), 'utf8')) as {
      version: string;
    };

    const result = await execa(tsxPath, [cliPath, 'version']);

    expect(result.stdout.trim()).toBe(packageJson.version);
  });

  test('prints the package version as JSON when requested', async () => {
    const packageJson = JSON.parse(await readFile(path.resolve('package.json'), 'utf8')) as {
      version: string;
    };

    const result = await execa(tsxPath, [cliPath, 'version', '--json']);

    expect(JSON.parse(result.stdout)).toEqual({ version: packageJson.version });
  });
});
