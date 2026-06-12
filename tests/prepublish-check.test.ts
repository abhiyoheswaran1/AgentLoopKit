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

async function writeReleaseMetadata(
  cwd: string,
  options: {
    packageVersion?: string;
    serverVersion?: string;
    serverPackageVersion?: string;
  } = {},
) {
  const packageVersion = options.packageVersion ?? '0.20.0';
  const serverVersion = options.serverVersion ?? packageVersion;
  const serverPackageVersion = options.serverPackageVersion ?? packageVersion;

  await writeFile(
    path.join(cwd, 'package.json'),
    JSON.stringify(
      {
        name: 'agentloopkit',
        version: packageVersion,
        mcpName: 'io.github.example/agentloopkit',
      },
      null,
      2,
    ),
  );
  await writeFile(
    path.join(cwd, 'server.json'),
    JSON.stringify(
      {
        name: 'io.github.example/agentloopkit',
        version: serverVersion,
        packages: [
          {
            registryType: 'npm',
            identifier: 'agentloopkit',
            version: serverPackageVersion,
            transport: {
              type: 'stdio',
            },
          },
        ],
      },
      null,
      2,
    ),
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
    await writeReleaseMetadata(dir);

    const result = await execa('node', [scriptPath], { cwd: dir, reject: false });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('CHANGELOG.md has unreleased entries');
    expect(result.stderr).toContain('Move them into a versioned release section');
  });

  test('passes when the Unreleased changelog section is empty', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeChangelog(dir, '- No unreleased changes yet.');
    await writeReleaseMetadata(dir);

    const result = await execa('node', [scriptPath], { cwd: dir, reject: false });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Prepublish metadata check passed');
  });

  test('fails when server.json top-level version does not match package.json', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeChangelog(dir, '- No unreleased changes yet.');
    await writeReleaseMetadata(dir, {
      packageVersion: '0.28.2',
      serverVersion: '0.28.1',
      serverPackageVersion: '0.28.2',
    });

    const result = await execa('node', [scriptPath], { cwd: dir, reject: false });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain(
      'server.json version mismatch: expected 0.28.2 from package.json, got 0.28.1.',
    );
  });

  test('fails when server.json npm package version does not match package.json', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeChangelog(dir, '- No unreleased changes yet.');
    await writeReleaseMetadata(dir, {
      packageVersion: '0.28.2',
      serverVersion: '0.28.2',
      serverPackageVersion: '0.28.1',
    });

    const result = await execa('node', [scriptPath], { cwd: dir, reject: false });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain(
      'server.json package agentloopkit version mismatch: expected 0.28.2 from package.json, got 0.28.1.',
    );
  });
});
