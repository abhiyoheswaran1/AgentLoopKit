import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
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

async function readAgentLoopKitVersion() {
  const packageJson = JSON.parse(await readFile(path.resolve('package.json'), 'utf8')) as {
    version: string;
  };
  return packageJson.version;
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

  test('escapes npm-status version labels when versions contain backticks', async () => {
    const dir = await createPackageFixture();

    const result = await checkNpmStatus({
      cwd: dir,
      localVersion: '1.0.0`local',
      registryJson: JSON.stringify({
        version: '1.0.0`local',
        versions: ['0.9.0`old', '1.0.0`local'],
      }),
    });

    expect(result.markdown).toContain('- Local version: ``1.0.0`local``');
    expect(result.markdown).toContain('- npm latest: ``1.0.0`local``');
    expect(result.markdown).toContain('``0.9.0`old``');
    expect(result.markdown).toContain('``1.0.0`local``');
  });

  test('can check the AgentLoopKit package from a different current package', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(path.join(dir, 'package.json'), {
      name: 'agentloopkit-release',
      version: '0.0.0',
    });
    const agentloopkitVersion = await readAgentLoopKitVersion();

    const result = await checkNpmStatus({
      cwd: dir,
      agentloopkit: true,
      registryJson: JSON.stringify({
        version: agentloopkitVersion,
        versions: ['0.1.0', agentloopkitVersion],
      }),
    });

    expect(result.status).toBe('current');
    expect(result.packageName).toBe('agentloopkit');
    expect(result.localVersion).toBe(agentloopkitVersion);
    expect(result.markdown).toContain('npm view --json agentloopkit version versions');
  });

  test('rejects npm package names that could be interpreted as npm flags or aliases', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);

    await expect(
      checkNpmStatus({
        cwd: dir,
        packageName: '--registry=https://example.invalid',
        registryJson: JSON.stringify({ version: '1.0.0', versions: ['1.0.0'] }),
      }),
    ).rejects.toThrow('Invalid npm package name');

    await expect(
      checkNpmStatus({
        cwd: dir,
        packageName: 'npm:agentloopkit',
        registryJson: JSON.stringify({ version: '1.0.0', versions: ['1.0.0'] }),
      }),
    ).rejects.toThrow('Invalid npm package name');
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

  test('CLI --agentloopkit checks AgentLoopKit instead of the current folder package', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(path.join(dir, 'package.json'), {
      name: 'agentloopkit-release',
      version: '0.0.0',
    });
    const agentloopkitVersion = await readAgentLoopKitVersion();
    const registryPath = path.join(dir, 'npm-view.json');
    await writeFile(
      registryPath,
      JSON.stringify({
        version: agentloopkitVersion,
        versions: ['0.1.0', agentloopkitVersion],
      }),
    );

    const result = await execa(
      tsxPath,
      [cliPath, 'npm-status', '--agentloopkit', '--registry-json', registryPath, '--json'],
      { cwd: dir },
    );

    const json = JSON.parse(result.stdout);
    expect(json.status).toBe('current');
    expect(json.packageName).toBe('agentloopkit');
    expect(json.localVersion).toBe(agentloopkitVersion);
    expect(json.source.command).toContain('captured npm view JSON');
  });

  test('CLI prints missing captured registry files as JSON errors', async () => {
    const dir = await createPackageFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'npm-status', '--registry-json', 'missing-npm-view.json', '--json'],
      { cwd: dir, reject: false },
    );

    const json = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(json).toEqual({
      error: {
        code: 'NPM_STATUS_REGISTRY_JSON_INVALID',
        message: 'Captured npm registry JSON file was not found: missing-npm-view.json',
        registryJson: 'missing-npm-view.json',
        reason: 'missing',
      },
    });
  });

  test('CLI prints malformed captured registry JSON as JSON errors', async () => {
    const dir = await createPackageFixture();
    const registryPath = path.join(dir, 'npm-view.json');
    await writeFile(registryPath, '{not-json');

    const result = await execa(
      tsxPath,
      [cliPath, 'npm-status', '--registry-json', registryPath, '--json'],
      { cwd: dir, reject: false },
    );

    const json = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(json).toEqual({
      error: {
        code: 'NPM_STATUS_REGISTRY_JSON_INVALID',
        message: `Captured npm registry JSON file could not be parsed: ${registryPath}`,
        registryJson: registryPath,
        reason: 'invalid-json',
      },
    });
  });

  test('CLI refuses to read env files as captured registry JSON', async () => {
    const dir = await createPackageFixture();
    const envPath = path.join(dir, '.env');
    await writeFile(envPath, 'NPM_TOKEN=do-not-read\n');

    const result = await execa(
      tsxPath,
      [cliPath, 'npm-status', '--registry-json', envPath, '--json'],
      { cwd: dir, reject: false },
    );

    const json = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(json).toEqual({
      error: {
        code: 'NPM_STATUS_REGISTRY_JSON_INVALID',
        message: `Captured npm registry JSON file must not be an env file: ${envPath}`,
        registryJson: envPath,
        reason: 'env-file',
      },
    });
  });

  test('CLI prints invalid captured npm view JSON shape as JSON errors', async () => {
    const dir = await createPackageFixture();
    const registryPath = path.join(dir, 'npm-view.json');
    await writeFile(registryPath, JSON.stringify({ versions: [] }));

    const result = await execa(
      tsxPath,
      [cliPath, 'npm-status', '--registry-json', registryPath, '--json'],
      { cwd: dir, reject: false },
    );

    const json = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(json.error).toMatchObject({
      code: 'NPM_STATUS_REGISTRY_JSON_INVALID',
      message: `Captured npm registry JSON file could not be parsed: ${registryPath}`,
      registryJson: registryPath,
      reason: 'invalid-json',
    });
  });

  test('CLI prints invalid timeout values as JSON errors', async () => {
    const dir = await createPackageFixture();

    const result = await execa(tsxPath, [cliPath, 'npm-status', '--timeout-ms', 'nope', '--json'], {
      cwd: dir,
      reject: false,
    });

    const json = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(json).toEqual({
      error: {
        code: 'NPM_STATUS_TIMEOUT_INVALID',
        message: 'Timeout must be a positive integer.',
        requestedTimeout: 'nope',
        reason: 'not-positive-integer',
      },
    });
  });

  test('CLI rejects zero timeout values as JSON errors', async () => {
    const dir = await createPackageFixture();

    const result = await execa(tsxPath, [cliPath, 'npm-status', '--timeout-ms', '0', '--json'], {
      cwd: dir,
      reject: false,
    });

    const json = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(json.error).toMatchObject({
      code: 'NPM_STATUS_TIMEOUT_INVALID',
      requestedTimeout: '0',
      reason: 'not-positive-integer',
    });
  });

  test('CLI keeps invalid timeout values human-readable by default', async () => {
    const dir = await createPackageFixture();

    const result = await execa(tsxPath, [cliPath, 'npm-status', '--timeout-ms', 'nope'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('agentloop: Timeout must be a positive integer.');
  });
});
