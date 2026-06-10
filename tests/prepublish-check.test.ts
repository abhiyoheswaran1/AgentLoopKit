import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { makeTempDir, removeTempDir } from './helpers.js';

let tempDirs: string[] = [];

const scriptPath = path.resolve('scripts/prepublish-check.mjs');

async function writeChangelog(cwd: string, unreleasedBody: string) {
  await writeFile(
    path.join(cwd, 'CHANGELOG.md'),
    `# Changelog

## Unreleased

${unreleasedBody}

## 0.20.0

- Previous release entry
`,
  );
}

describe('prepublish metadata check', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('fails when the Unreleased changelog section contains entries', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeChangelog(dir, '- Added a command that is not in package metadata.');

    const result = await execa('node', [scriptPath], { cwd: dir, reject: false });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('CHANGELOG.md has unreleased entries');
    expect(result.stderr).toContain('Move them into a versioned release section');
  });

  test('passes when the Unreleased changelog section is empty', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeChangelog(dir, '- No unreleased changes yet.');

    const result = await execa('node', [scriptPath], { cwd: dir, reject: false });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Prepublish metadata check passed');
  });
});
