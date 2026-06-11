import path from 'node:path';
import { mkdir, rm, symlink, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { inlineCode } from '../src/core/markdown-format.js';
import { listPolicies, readPolicy, getPolicyStatus } from '../src/core/policy.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

async function createPolicyFixture() {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
  await writeJson(path.join(dir, 'agentloop.config.json'), config);
  await mkdir(path.join(dir, '.agentloop/policies'), { recursive: true });
  await writeFile(
    path.join(dir, '.agentloop/policies/security-policy.md'),
    '# Security Policy\n\nDo not expose secrets.\n',
  );
  await writeFile(
    path.join(dir, '.agentloop/policies/git-policy.md'),
    '# Git Policy\n\nDo not rewrite shared history.\n',
  );
  await writeFile(path.join(dir, '.agentloop/policies/notes.txt'), 'not a policy\n');
  return { dir, config };
}

async function createUninitializedPolicyFixture() {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
  await writeJson(path.join(dir, 'agentloop.config.json'), config);
  return dir;
}

describe('policy reader', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('lists local Markdown policies with titles', async () => {
    const { dir, config } = await createPolicyFixture();

    const policies = await listPolicies({ cwd: dir, config });

    expect(policies).toEqual([
      {
        name: 'git-policy',
        title: 'Git Policy',
        path: '.agentloop/policies/git-policy.md',
      },
      {
        name: 'security-policy',
        title: 'Security Policy',
        path: '.agentloop/policies/security-policy.md',
      },
    ]);
  });

  test('reads a policy by slug or filename without allowing path traversal', async () => {
    const { dir, config } = await createPolicyFixture();
    await writeFile(path.join(dir, 'AGENTS.md'), '# Outside\n');

    await expect(readPolicy({ cwd: dir, config, policyName: 'security' })).resolves.toMatchObject({
      name: 'security-policy',
      title: 'Security Policy',
      path: '.agentloop/policies/security-policy.md',
      content: '# Security Policy\n\nDo not expose secrets.\n',
    });
    await expect(
      readPolicy({ cwd: dir, config, policyName: 'security-policy.md' }),
    ).resolves.toMatchObject({
      name: 'security-policy',
      title: 'Security Policy',
    });
    await expect(readPolicy({ cwd: dir, config, policyName: '../AGENTS.md' })).rejects.toThrow(
      'Policy not found',
    );
  });

  test('explains when local policies have not been initialized', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
    await writeJson(path.join(dir, 'agentloop.config.json'), config);

    await expect(listPolicies({ cwd: dir, config })).rejects.toThrow('Run `agentloop init`');
  });

  test('treats symlinked policy roots outside the repo as missing', async () => {
    const dir = await makeTempDir();
    const outsidePolicies = await makeTempDir();
    tempDirs.push(dir, outsidePolicies);
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
    await writeJson(path.join(dir, 'agentloop.config.json'), config);
    await mkdir(path.join(dir, '.agentloop'), { recursive: true });
    await writeFile(
      path.join(outsidePolicies, 'security-policy.md'),
      '# Outside Policy\n\nDo not leak this content.\n',
    );
    await symlink(outsidePolicies, path.join(dir, '.agentloop/policies'), 'dir');

    await expect(listPolicies({ cwd: dir, config })).rejects.toThrow('Run `agentloop init`');
    await expect(getPolicyStatus({ cwd: dir, config })).rejects.toThrow('Run `agentloop init`');
    await expect(readPolicy({ cwd: dir, config, policyName: 'security' })).rejects.toThrow(
      'Run `agentloop init`',
    );
  });

  test('compares local policies to bundled templates', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
    await writeJson(path.join(dir, 'agentloop.config.json'), config);
    await mkdir(path.join(dir, '.agentloop/policies'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/policies/security-policy.md'),
      '# Security Policy\n\nLocal security guidance.\n',
    );
    await rm(path.join(dir, '.agentloop/policies/git-policy.md'), { force: true });
    await writeFile(
      path.join(dir, '.agentloop/policies/custom-policy.md'),
      '# Custom Policy\n\nRepo-only guidance.\n',
    );

    const status = await getPolicyStatus({ cwd: dir, config });

    expect(status.summary).toEqual({
      current: 0,
      modified: 1,
      missing: 7,
      extra: 1,
    });
    expect(status.policies).toEqual([
      {
        name: 'custom-policy',
        title: 'Custom Policy',
        path: '.agentloop/policies/custom-policy.md',
        status: 'extra',
        templatePath: null,
      },
      {
        name: 'database-change-policy',
        title: 'Database Change Policy',
        path: '.agentloop/policies/database-change-policy.md',
        status: 'missing',
        templatePath: 'templates/policies/database-change-policy.md',
      },
      {
        name: 'dependency-change-policy',
        title: 'Dependency Change Policy',
        path: '.agentloop/policies/dependency-change-policy.md',
        status: 'missing',
        templatePath: 'templates/policies/dependency-change-policy.md',
      },
      {
        name: 'git-policy',
        title: 'Git Policy',
        path: '.agentloop/policies/git-policy.md',
        status: 'missing',
        templatePath: 'templates/policies/git-policy.md',
      },
      {
        name: 'no-destructive-actions',
        title: 'No Destructive Actions Policy',
        path: '.agentloop/policies/no-destructive-actions.md',
        status: 'missing',
        templatePath: 'templates/policies/no-destructive-actions.md',
      },
      {
        name: 'public-api-change-policy',
        title: 'Public API Change Policy',
        path: '.agentloop/policies/public-api-change-policy.md',
        status: 'missing',
        templatePath: 'templates/policies/public-api-change-policy.md',
      },
      {
        name: 'secrets-policy',
        title: 'Secrets Policy',
        path: '.agentloop/policies/secrets-policy.md',
        status: 'missing',
        templatePath: 'templates/policies/secrets-policy.md',
      },
      {
        name: 'security-policy',
        title: 'Security Policy',
        path: '.agentloop/policies/security-policy.md',
        status: 'modified',
        templatePath: 'templates/policies/security-policy.md',
      },
      {
        name: 'ui-change-policy',
        title: 'UI Change Policy',
        path: '.agentloop/policies/ui-change-policy.md',
        status: 'missing',
        templatePath: 'templates/policies/ui-change-policy.md',
      },
    ]);
  });
});

describe('policy command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('lists and shows local policies from the CLI', async () => {
    const { dir } = await createPolicyFixture();

    const listResult = await execa(tsxPath, [cliPath, 'policy', 'list', '--json'], { cwd: dir });
    const showResult = await execa(tsxPath, [cliPath, 'policy', 'show', 'security'], {
      cwd: dir,
    });
    const traversalResult = await execa(tsxPath, [cliPath, 'policy', 'show', '../AGENTS.md'], {
      cwd: dir,
      reject: false,
    });

    expect(JSON.parse(listResult.stdout)).toEqual({
      policies: [
        {
          name: 'git-policy',
          title: 'Git Policy',
          path: '.agentloop/policies/git-policy.md',
        },
        {
          name: 'security-policy',
          title: 'Security Policy',
          path: '.agentloop/policies/security-policy.md',
        },
      ],
    });
    expect(showResult.stdout).toBe('# Security Policy\n\nDo not expose secrets.');
    expect(traversalResult.exitCode).toBe(1);
    expect(traversalResult.stderr).toContain('Policy not found');
    expect(traversalResult.stdout).toBe('');
  });

  test('formats policy list and status human output with safe inline Markdown', async () => {
    const { dir } = await createPolicyFixture();
    await writeFile(
      path.join(dir, '.agentloop/policies/custom`policy.md'),
      '# Custom `Policy`\n\nRepo guidance.\n',
    );

    const listResult = await execa(tsxPath, [cliPath, 'policy', 'list'], { cwd: dir });
    const statusResult = await execa(tsxPath, [cliPath, 'policy', 'status'], { cwd: dir });
    const showResult = await execa(tsxPath, [cliPath, 'policy', 'show', 'custom`policy'], {
      cwd: dir,
    });

    expect(listResult.stdout).toContain(`- ${inlineCode('Custom `Policy`')}`);
    expect(listResult.stdout).toContain(
      `  ${inlineCode('.agentloop/policies/custom`policy.md')}`,
    );
    expect(statusResult.stdout).toContain(
      `- ${inlineCode('extra')}: ${inlineCode('Custom `Policy`')}`,
    );
    expect(statusResult.stdout).toContain(
      `  ${inlineCode('.agentloop/policies/custom`policy.md')}`,
    );
    expect(showResult.stdout).toBe('# Custom `Policy`\n\nRepo guidance.');
  });

  test('prints missing policy errors as JSON when requested', async () => {
    const { dir } = await createPolicyFixture();

    const result = await execa(tsxPath, [cliPath, 'policy', 'show', 'secrets', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'POLICY_NOT_FOUND',
        message: 'Policy not found: secrets',
        requestedPolicy: 'secrets',
        availablePolicies: ['git-policy', 'security-policy'],
      },
    });
  });

  test('prints invalid config errors as JSON for policy subcommands', async () => {
    const { dir } = await createPolicyFixture();
    await writeFile(path.join(dir, 'agentloop.config.json'), '{"version":2}');

    const commands = [
      ['policy', 'list', '--json'],
      ['policy', 'status', '--json'],
      ['policy', 'show', 'security', '--json'],
    ];

    for (const args of commands) {
      const result = await execa(tsxPath, [cliPath, ...args], {
        cwd: dir,
        reject: false,
      });

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toBe('');
      expect(JSON.parse(result.stdout)).toMatchObject({
        error: {
          code: 'CONFIG_ERROR',
          message: expect.stringContaining('Invalid AgentLoopKit config'),
        },
      });
    }
  });

  test('keeps missing policy errors human-readable by default', async () => {
    const { dir } = await createPolicyFixture();

    const result = await execa(tsxPath, [cliPath, 'policy', 'show', 'secrets'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('agentloop: Policy not found: secrets');
  });

  test('prints missing policy directory errors as JSON for list', async () => {
    const dir = await createUninitializedPolicyFixture();

    const result = await execa(tsxPath, [cliPath, 'policy', 'list', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'POLICY_DIRECTORY_MISSING',
        message:
          'No AgentLoopKit policy files found. Run `agentloop init` to generate .agentloop/policies/.',
        policiesDir: '.agentloop/policies',
        nextCommand: 'agentloop init',
      },
    });
  });

  test('prints missing policy directory errors as JSON for status', async () => {
    const dir = await createUninitializedPolicyFixture();

    const result = await execa(tsxPath, [cliPath, 'policy', 'status', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'POLICY_DIRECTORY_MISSING',
        message:
          'No AgentLoopKit policy files found. Run `agentloop init` to generate .agentloop/policies/.',
        policiesDir: '.agentloop/policies',
        nextCommand: 'agentloop init',
      },
    });
  });

  test('keeps missing policy directory errors human-readable by default', async () => {
    const dir = await createUninitializedPolicyFixture();

    const result = await execa(tsxPath, [cliPath, 'policy', 'list'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('agentloop: No AgentLoopKit policy files found.');
  });

  test('prints policy status from the CLI as JSON', async () => {
    const { dir } = await createPolicyFixture();

    const statusResult = await execa(tsxPath, [cliPath, 'policy', 'status', '--json'], {
      cwd: dir,
    });

    const parsed = JSON.parse(statusResult.stdout);
    expect(parsed.summary).toEqual({
      current: 0,
      modified: 2,
      missing: 6,
      extra: 0,
    });
    expect(parsed.policies).toContainEqual({
      name: 'security-policy',
      title: 'Security Policy',
      path: '.agentloop/policies/security-policy.md',
      status: 'modified',
      templatePath: 'templates/policies/security-policy.md',
    });
    expect(parsed.policies).toContainEqual({
      name: 'ui-change-policy',
      title: 'UI Change Policy',
      path: '.agentloop/policies/ui-change-policy.md',
      status: 'missing',
      templatePath: 'templates/policies/ui-change-policy.md',
    });
  });
});
