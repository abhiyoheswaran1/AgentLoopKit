import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { checkNpmStatus, parseNpmViewJson } from '../src/core/npm-status.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

async function createPackageFixture() {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await writeJson(path.join(dir, 'package.json'), {
    name: 'agentloopkit',
    version: '0.23.0',
  });
  return dir;
}

describe('npm status', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('parses npm view version and versions JSON', () => {
    const parsed = parseNpmViewJson(
      JSON.stringify({ version: '0.1.1', versions: ['0.1.0', '0.1.1'] }),
    );

    expect(parsed.latest).toBe('0.1.1');
    expect(parsed.versions).toEqual(['0.1.0', '0.1.1']);
  });

  test('reports catch-up needed when npm latest differs from local package version', async () => {
    const dir = await createPackageFixture();

    const result = await checkNpmStatus({
      cwd: dir,
      registryJson: JSON.stringify({ version: '0.1.1', versions: ['0.1.0', '0.1.1'] }),
    });

    expect(result.status).toBe('catch-up-needed');
    expect(result.packageName).toBe('agentloopkit');
    expect(result.localVersion).toBe('0.23.0');
    expect(result.registry.latest).toBe('0.1.1');
    expect(result.registry.hasLocalVersion).toBe(false);
    expect(result.markdown).toContain('npm latest differs from local package version');
    expect(result.markdown).toContain('Do not backfill stale intermediate versions');
    expect(result.markdown).toContain('This command only runs `npm view');
    expect(result.markdown).toContain('does not publish');
  });

  test('reports current when npm latest equals local package version', async () => {
    const dir = await createPackageFixture();

    const result = await checkNpmStatus({
      cwd: dir,
      registryJson: JSON.stringify({ version: '0.23.0', versions: ['0.1.1', '0.23.0'] }),
    });

    expect(result.status).toBe('current');
    expect(result.registry.hasLocalVersion).toBe(true);
    expect(result.markdown).toContain('npm latest matches local package version');
  });

  test('CLI uses captured registry JSON and fails only when expect-current is requested', async () => {
    const dir = await createPackageFixture();
    const registryPath = path.join(dir, 'npm-view.json');
    await writeFile(
      registryPath,
      JSON.stringify({ version: '0.1.1', versions: ['0.1.0', '0.1.1'] }),
    );

    const jsonResult = await execa(
      tsxPath,
      [cliPath, 'npm-status', '--registry-json', registryPath, '--json'],
      { cwd: dir },
    );
    const json = JSON.parse(jsonResult.stdout);

    expect(json.status).toBe('catch-up-needed');
    expect(json.source.command).toContain('captured npm view JSON');

    const strictResult = await execa(
      tsxPath,
      [cliPath, 'npm-status', '--registry-json', registryPath, '--expect-current'],
      { cwd: dir, reject: false },
    );

    expect(strictResult.exitCode).toBe(1);
    expect(strictResult.stdout).toContain('npm latest differs from local package version');
    expect(strictResult.stdout).toContain('agentloopkit');
    expect(strictResult.stderr).toBe('');
  });
});
