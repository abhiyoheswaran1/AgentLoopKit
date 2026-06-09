import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { execa } from 'execa';
import { describe, expect, test } from 'vitest';

const cliPath = path.resolve('src/cli/index.ts');

describe('version command', () => {
  test('prints the package version', async () => {
    const packageJson = JSON.parse(await readFile(path.resolve('package.json'), 'utf8')) as {
      version: string;
    };

    const result = await execa('npx', ['tsx', cliPath, 'version']);

    expect(result.stdout.trim()).toBe(packageJson.version);
  });
});
