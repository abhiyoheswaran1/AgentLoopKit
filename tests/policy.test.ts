import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { listPolicies, readPolicy } from '../src/core/policy.js';
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
});
