import path from 'node:path';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { afterEach, describe, expect, test } from 'vitest';
import { makeTempDir, removeTempDir } from './helpers.js';
import { initializeAgentLoop } from '../src/core/init.js';
import { runDoctor } from '../src/core/doctor.js';

let tempDirs: string[] = [];

describe('doctor', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('reports healthy initialized setup', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });

    const result = await runDoctor({ cwd: dir });

    expect(result.serious).toHaveLength(0);
    expect(result.checks.some((check) => check.name === 'AGENTLOOP.md')).toBe(true);
    expect(result.checks).toContainEqual({
      name: 'Template manifest',
      status: 'pass',
      message: 'template version 1 is current',
    });
    expect(result.markdown).toContain('AgentLoopKit Doctor');
  });

  test('warns when template manifest is missing', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await rm(path.join(dir, '.agentloop/manifest.json'));

    const result = await runDoctor({ cwd: dir });

    expect(result.serious).toHaveLength(0);
    expect(result.checks).toContainEqual({
      name: 'Template manifest',
      status: 'warn',
      message:
        'missing .agentloop/manifest.json; run agentloop init with the current CLI to add missing files without overwriting existing harness files',
    });
  });

  test('warns when template manifest is stale, invalid, or newer than the CLI', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    const manifestPath = path.join(dir, '.agentloop/manifest.json');

    await writeFile(
      manifestPath,
      JSON.stringify({ version: 1, templateVersion: 0, generatedBy: 'agentloopkit' }),
    );
    await expect(runDoctor({ cwd: dir })).resolves.toMatchObject({
      checks: expect.arrayContaining([
        {
          name: 'Template manifest',
          status: 'warn',
          message:
            'template version 0 is older than current version 1; review docs/template-migrations.md and rerun agentloop init to add missing files',
        },
      ]),
    });

    await writeFile(manifestPath, '{not json');
    await expect(runDoctor({ cwd: dir })).resolves.toMatchObject({
      checks: expect.arrayContaining([
        {
          name: 'Template manifest',
          status: 'warn',
          message:
            'invalid .agentloop/manifest.json; review docs/template-migrations.md and recreate the manifest with agentloop init if needed',
        },
      ]),
    });

    await writeFile(
      manifestPath,
      JSON.stringify({ version: 1, templateVersion: 999, generatedBy: 'agentloopkit' }),
    );
    await expect(runDoctor({ cwd: dir })).resolves.toMatchObject({
      checks: expect.arrayContaining([
        {
          name: 'Template manifest',
          status: 'warn',
          message:
            'template version 999 is newer than this CLI supports; upgrade AgentLoopKit before changing generated harness files',
        },
      ]),
    });
  });

  test('flags invalid config as serious', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await import('node:fs/promises').then(({ writeFile }) =>
      writeFile(path.join(dir, 'agentloop.config.json'), '{"version": 2}'),
    );

    const result = await runDoctor({ cwd: dir });

    expect(result.serious.some((check) => check.name === 'agentloop.config.json')).toBe(true);
  });

  test('warns when common monorepo markers are present', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await writeFile(path.join(dir, 'pnpm-workspace.yaml'), 'packages:\n  - packages/*\n');
    await writeFile(path.join(dir, 'turbo.json'), '{}');

    const result = await runDoctor({ cwd: dir });
    const monorepoCheck = result.checks.find((check) => check.name === 'Monorepo');
    const expectedMessage =
      'workspace markers detected: pnpm-workspace.yaml, turbo.json. Root checks may not cover every package; add package-specific verification commands to the task contract, such as pnpm --filter <package> test, npm --workspace <package> test, or cd packages/<name> && npm test. AgentLoopKit does not run workspace commands automatically.';

    expect(result.serious).toHaveLength(0);
    expect(monorepoCheck).toEqual({
      name: 'Monorepo',
      status: 'warn',
      message: expectedMessage,
    });
    expect(result.markdown).toContain(`[warn] Monorepo: ${expectedMessage}`);
  });

  test('shows risk file categories with capped path examples', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await mkdir(path.join(dir, 'migrations'), { recursive: true });
    await mkdir(path.join(dir, 'src/auth'), { recursive: true });
    await mkdir(path.join(dir, '.github/workflows'), { recursive: true });
    await writeFile(path.join(dir, 'migrations/001-create-users.sql'), 'select 1;');
    await writeFile(path.join(dir, 'migrations/002-add-index.sql'), 'select 1;');
    await writeFile(path.join(dir, 'migrations/003-add-team.sql'), 'select 1;');
    await writeFile(path.join(dir, 'migrations/004-add-plan.sql'), 'select 1;');
    await writeFile(path.join(dir, 'src/auth/session.ts'), 'export const session = true;');
    await writeFile(path.join(dir, '.env.local'), 'SECRET_VALUE=do-not-print');
    await writeFile(path.join(dir, '.github/workflows/deploy.yml'), 'name: Deploy');
    await writeFile(path.join(dir, 'package-lock.json'), '{}');

    const result = await runDoctor({ cwd: dir });
    const riskChecks = result.checks.filter((check) => check.name.startsWith('Risk files: '));

    expect(result.serious).toHaveLength(0);
    expect(result.checks).toContainEqual({
      name: 'Potential risk files',
      status: 'warn',
      message: '8 risk file(s) detected',
    });
    expect(riskChecks).toEqual([
      {
        name: 'Risk files: migrations',
        status: 'warn',
        message:
          '4 detected: migrations/001-create-users.sql, migrations/002-add-index.sql, migrations/003-add-team.sql (+1 more)',
      },
      {
        name: 'Risk files: auth',
        status: 'warn',
        message: '1 detected: src/auth/session.ts',
      },
      {
        name: 'Risk files: deployment',
        status: 'warn',
        message: '1 detected: .github/workflows/deploy.yml',
      },
      {
        name: 'Risk files: lockfiles',
        status: 'warn',
        message: '1 detected: package-lock.json',
      },
      {
        name: 'Risk files: env files',
        status: 'warn',
        message: '1 detected: .env.local',
      },
    ]);
    expect(result.markdown).toContain('- [warn] Risk files: env files: 1 detected: .env.local');
    expect(result.markdown).not.toContain('do-not-print');
  });
});
