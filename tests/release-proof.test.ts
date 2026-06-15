import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';
import { checkReleaseProof } from '../src/core/release-proof.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

async function git(cwd: string, args: string[]) {
  return execa('git', args, { cwd });
}

async function createReleaseProofRepo(version = '1.2.3', options: { mcpServer?: boolean } = {}) {
  const dir = await makeTempDir();
  const writeMcpServer = options.mcpServer ?? true;
  tempDirs.push(dir);
  await git(dir, ['init', '-q']);
  await git(dir, ['config', 'user.email', 'agentloopkit@example.com']);
  await git(dir, ['config', 'user.name', 'AgentLoopKit Test']);
  await writeJson(path.join(dir, 'package.json'), {
    name: 'agentloopkit',
    version,
    repository: {
      type: 'git',
      url: 'git+https://github.com/abhiyoheswaran1/AgentLoopKit.git',
    },
  });
  if (writeMcpServer) {
    await writeJson(path.join(dir, 'server.json'), {
      name: 'io.github.abhiyoheswaran1/agentloopkit',
      version,
      packages: [
        {
          registryType: 'npm',
          identifier: 'agentloopkit',
          version,
          transport: { type: 'stdio' },
        },
      ],
    });
  }
  await writeFile(path.join(dir, 'README.md'), '# Release proof fixture\n');
  await git(dir, ['add', '.']);
  await git(dir, ['commit', '-m', 'Prepare release proof fixture']);
  await git(dir, ['tag', `v${version}`]);
  return dir;
}

function proofFixtures(version = '1.2.3') {
  return {
    npmRegistryJson: JSON.stringify({
      version,
      versions: ['1.0.0', version],
    }),
    githubReleaseJson: JSON.stringify({
      tag_name: `v${version}`,
      html_url: `https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v${version}`,
      draft: false,
      prerelease: false,
      assets: [
        {
          name: `agentloopkit-${version}.tgz`,
          browser_download_url: `https://github.com/abhiyoheswaran1/AgentLoopKit/releases/download/v${version}/agentloopkit-${version}.tgz`,
        },
      ],
    }),
    ghcrTagsJson: JSON.stringify({
      name: 'abhiyoheswaran1/agentloopkit',
      tags: ['latest', '1.2', version],
    }),
    mcpRegistryJson: JSON.stringify({
      name: 'io.github.abhiyoheswaran1/agentloopkit',
      version,
      packages: [
        {
          registryType: 'npm',
          identifier: 'agentloopkit',
          version,
          transport: { type: 'stdio' },
        },
      ],
    }),
  };
}

async function writeFixtureFiles(dir: string, fixtures = proofFixtures()) {
  const paths = {
    npmRegistryJsonPath: path.join(dir, 'npm-view.json'),
    githubReleaseJsonPath: path.join(dir, 'github-release.json'),
    ghcrTagsJsonPath: path.join(dir, 'ghcr-tags.json'),
    mcpRegistryJsonPath: path.join(dir, 'mcp-registry.json'),
  };
  await writeFile(paths.npmRegistryJsonPath, fixtures.npmRegistryJson);
  await writeFile(paths.githubReleaseJsonPath, fixtures.githubReleaseJson);
  await writeFile(paths.ghcrTagsJsonPath, fixtures.ghcrTagsJson);
  await writeFile(paths.mcpRegistryJsonPath, fixtures.mcpRegistryJson);
  return paths;
}

describe('release proof', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('reports pass when captured release evidence matches the local version', async () => {
    const dir = await createReleaseProofRepo();
    const fixtures = proofFixtures();

    const result = await checkReleaseProof({
      cwd: dir,
      ...fixtures,
    });

    expect(result.overallStatus).toBe('pass');
    expect(result.package).toEqual({ name: 'agentloopkit', version: '1.2.3' });
    expect(result.git.tagExists).toBe(true);
    expect(result.channels).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'npm', status: 'pass' }),
        expect.objectContaining({ id: 'github-release', status: 'pass' }),
        expect.objectContaining({ id: 'ghcr', status: 'pass' }),
        expect.objectContaining({ id: 'mcp-registry', status: 'pass' }),
      ]),
    );
    expect(result.safety.doesNot).toContain('publish packages');
    expect(result.safety.doesNot).toContain('read .env files');
    expect(result.markdown).toContain('# AgentLoopKit Release Proof');
    expect(result.markdown).toContain('GHCR image tag found');
  });

  test('warns when a post-release channel is missing matching evidence', async () => {
    const dir = await createReleaseProofRepo();
    const fixtures = proofFixtures('1.2.2');

    const result = await checkReleaseProof({
      cwd: dir,
      ...fixtures,
      npmRegistryJson: proofFixtures('1.2.3').npmRegistryJson,
    });

    expect(result.overallStatus).toBe('warn');
    expect(result.channels).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'github-release', status: 'warn' }),
        expect.objectContaining({ id: 'ghcr', status: 'warn' }),
        expect.objectContaining({ id: 'mcp-registry', status: 'warn' }),
      ]),
    );
    expect(result.nextAction.command).toBe('fix release channel proof');
  });

  test('warns when the local release tag is missing even if channel proof matches', async () => {
    const dir = await createReleaseProofRepo();
    await git(dir, ['tag', '-d', 'v1.2.3']);

    const result = await checkReleaseProof({
      cwd: dir,
      ...proofFixtures(),
    });

    expect(result.git.tagExists).toBe(false);
    expect(result.overallStatus).toBe('warn');
    expect(result.nextAction.command).toBe('verify release tag');
  });

  test('warns instead of crashing when MCP Registry metadata is not configured', async () => {
    const dir = await createReleaseProofRepo('1.2.3', { mcpServer: false });
    const fixtures = proofFixtures();

    const result = await checkReleaseProof({
      cwd: dir,
      npmRegistryJson: fixtures.npmRegistryJson,
      githubReleaseJson: fixtures.githubReleaseJson,
      ghcrTagsJson: fixtures.ghcrTagsJson,
    });

    expect(result.overallStatus).toBe('warn');
    expect(result.channels).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'npm', status: 'pass' }),
        expect.objectContaining({ id: 'github-release', status: 'pass' }),
        expect.objectContaining({ id: 'ghcr', status: 'pass' }),
        expect.objectContaining({
          id: 'mcp-registry',
          status: 'warn',
          message: expect.stringContaining('MCP Registry proof is not configured'),
        }),
      ]),
    );
    expect(result.sources.mcpRegistry).toMatchObject({
      command: 'MCP Registry proof',
      exitCode: 1,
    });
  });

  test('checks only the requested release proof channel', async () => {
    const dir = await createReleaseProofRepo();
    const fixtures = proofFixtures();

    const result = await checkReleaseProof({
      cwd: dir,
      only: 'npm',
      npmRegistryJson: fixtures.npmRegistryJson,
    });

    expect(result.overallStatus).toBe('pass');
    expect(result.channels).toEqual([expect.objectContaining({ id: 'npm', status: 'pass' })]);
    expect(result.sources.npm.command).toContain('npm view');
    expect(result.sources.githubRelease).toMatchObject({
      command: 'skipped release-proof channel: github-release',
      exitCode: 0,
    });
    expect(result.sources.ghcr).toMatchObject({
      command: 'skipped release-proof channel: ghcr',
      exitCode: 0,
    });
    expect(result.sources.mcpRegistry).toMatchObject({
      command: 'skipped release-proof channel: mcp-registry',
      exitCode: 0,
    });
    expect(result.markdown).toContain('Checked channels: `npm`');
    expect(result.markdown).not.toContain('GitHub release proof could not be read');
  });

  test('CLI prints JSON release proof from captured fixture files', async () => {
    const dir = await createReleaseProofRepo();
    const paths = await writeFixtureFiles(dir);

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'release-proof',
        '--json',
        '--npm-registry-json',
        paths.npmRegistryJsonPath,
        '--github-release-json',
        paths.githubReleaseJsonPath,
        '--ghcr-tags-json',
        paths.ghcrTagsJsonPath,
        '--mcp-registry-json',
        paths.mcpRegistryJsonPath,
      ],
      {
        cwd: dir,
        env: { AGENTLOOPKIT_TEST_MARKER: 'do-not-print-marker' },
      },
    );

    expect(result.stderr).toBe('');
    expect(result.stdout).not.toContain('do-not-print');
    const output = JSON.parse(result.stdout);
    expect(output.overallStatus).toBe('pass');
    expect(output.sources.githubRelease.command).toContain('captured GitHub release JSON');
    expect(output.sources.ghcr.command).toContain('captured GHCR tag JSON');
    expect(output.sources.mcpRegistry.command).toContain('captured MCP Registry JSON');
  });

  test('CLI prints selected channel proof with --only', async () => {
    const dir = await createReleaseProofRepo();
    const paths = await writeFixtureFiles(dir);

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'release-proof',
        '--json',
        '--only',
        'npm',
        '--npm-registry-json',
        paths.npmRegistryJsonPath,
      ],
      { cwd: dir },
    );

    expect(result.stderr).toBe('');
    const output = JSON.parse(result.stdout);
    expect(output.overallStatus).toBe('pass');
    expect(output.channels).toEqual([expect.objectContaining({ id: 'npm', status: 'pass' })]);
    expect(output.sources.githubRelease.command).toBe(
      'skipped release-proof channel: github-release',
    );
    expect(output.sources.ghcr.command).toBe('skipped release-proof channel: ghcr');
    expect(output.sources.mcpRegistry.command).toBe('skipped release-proof channel: mcp-registry');
  });

  test('CLI rejects invalid --only values before reading proof files', async () => {
    const dir = await createReleaseProofRepo();
    const missingCapturePath = path.join(dir, 'missing-npm-view.json');

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'release-proof',
        '--json',
        '--only',
        'homebrew',
        '--npm-registry-json',
        missingCapturePath,
      ],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(result.stdout).not.toContain(missingCapturePath);
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'RELEASE_PROOF_ONLY_INVALID',
        message: 'Release proof --only must be one of: npm, github-release, ghcr, mcp-registry.',
        requestedOnly: 'homebrew',
        allowed: ['npm', 'github-release', 'ghcr', 'mcp-registry'],
      },
    });
  });

  test('CLI prints JSON warning instead of crashing when MCP metadata is absent', async () => {
    const dir = await createReleaseProofRepo('1.2.3', { mcpServer: false });
    const paths = await writeFixtureFiles(dir);

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'release-proof',
        '--json',
        '--npm-registry-json',
        paths.npmRegistryJsonPath,
        '--github-release-json',
        paths.githubReleaseJsonPath,
        '--ghcr-tags-json',
        paths.ghcrTagsJsonPath,
      ],
      { cwd: dir },
    );

    expect(result.stderr).toBe('');
    const output = JSON.parse(result.stdout);
    expect(output.overallStatus).toBe('warn');
    expect(output.channels).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'mcp-registry',
          status: 'warn',
          message: expect.stringContaining('MCP Registry proof is not configured'),
        }),
      ]),
    );
    expect(output.sources.mcpRegistry).toMatchObject({
      command: 'MCP Registry proof',
      exitCode: 1,
    });
  });

  test('CLI rejects captured proof files that look like env files without printing contents', async () => {
    const dir = await createReleaseProofRepo();
    const paths = await writeFixtureFiles(dir);
    const envPath = path.join(dir, '.env.local');
    await writeFile(envPath, 'SECRET_VALUE=do-not-print\n');

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'release-proof',
        '--json',
        '--npm-registry-json',
        paths.npmRegistryJsonPath,
        '--github-release-json',
        envPath,
        '--ghcr-tags-json',
        paths.ghcrTagsJsonPath,
        '--mcp-registry-json',
        paths.mcpRegistryJsonPath,
      ],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(result.stdout).not.toContain('do-not-print');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'RELEASE_PROOF_CAPTURE_INVALID',
        message: `Captured GitHub release JSON file must not be an env file: ${envPath}`,
        path: envPath,
        proof: 'github-release',
        reason: 'env-file',
      },
    });
  });
});
