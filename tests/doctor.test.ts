import path from 'node:path';
import { execFile } from 'node:child_process';
import { mkdir, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';
import { initializeAgentLoop } from '../src/core/init.js';
import { runDoctor } from '../src/core/doctor.js';

let tempDirs: string[] = [];
const execFileAsync = promisify(execFile);
const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

async function initGitRepository(dir: string) {
  await execFileAsync('git', ['init'], { cwd: dir });
}

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
      message: 'template version 2 is current',
    });
    expect(result.markdown).toContain('AgentLoopKit Doctor');
  });

  test('reports git root context for repository root targets', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initGitRepository(dir);
    await initializeAgentLoop({ cwd: dir });

    const result = await runDoctor({ cwd: dir });

    expect(result.git).toEqual({
      isRepository: true,
      root: await realpath(dir),
      targetIsRoot: true,
    });
    expect(result.checks).toContainEqual({
      name: 'Git root',
      status: 'pass',
      message: await realpath(dir),
    });
    expect(result.checks).toContainEqual({
      name: 'Git target',
      status: 'pass',
      message: 'current directory is the Git root',
    });
    expect(result.markdown).not.toContain('AgentLoopKit files live in the current directory');
  });

  test('doctor uses parent AgentLoop config root when run from a nested directory', async () => {
    const dir = await makeTempDir();
    const nested = path.join(dir, 'src', 'features');
    tempDirs.push(dir);
    await initGitRepository(dir);
    await mkdir(nested, { recursive: true });
    await initializeAgentLoop({ cwd: dir });

    const result = await execa(tsxPath, [cliPath, 'doctor', '--json'], {
      cwd: nested,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const doctor = JSON.parse(result.stdout);
    expect(doctor.git).toEqual({
      isRepository: true,
      root: await realpath(dir),
      targetIsRoot: true,
    });
    expect(doctor.checks).toContainEqual({
      name: 'AGENTS.md',
      status: 'pass',
      message: 'found',
    });
  });

  test('redacts local git root paths when requested', async () => {
    const dir = await makeTempDir();
    const packageDir = path.join(dir, 'packages', 'web');
    tempDirs.push(dir);
    await initGitRepository(dir);
    await mkdir(packageDir, { recursive: true });
    await writeJson(path.join(packageDir, 'package.json'), { name: 'demo-web' });
    await initializeAgentLoop({ cwd: packageDir });

    const root = await realpath(dir);
    const defaultResult = await execa(tsxPath, [cliPath, 'doctor', '--json'], {
      cwd: packageDir,
      reject: false,
    });
    const redactedJsonResult = await execa(
      tsxPath,
      [cliPath, 'doctor', '--json', '--redact-paths'],
      {
        cwd: packageDir,
        reject: false,
      },
    );
    const redactedHumanResult = await execa(tsxPath, [cliPath, 'doctor', '--redact-paths'], {
      cwd: packageDir,
      reject: false,
    });

    expect(defaultResult.exitCode).toBe(0);
    expect(JSON.parse(defaultResult.stdout).git.root).toBe(root);

    expect(redactedJsonResult.exitCode).toBe(0);
    const redacted = JSON.parse(redactedJsonResult.stdout);
    expect(redacted.git.root).toBe('[git-root]');
    expect(JSON.stringify(redacted)).not.toContain(root);
    expect(redacted.checks).toEqual(
      expect.arrayContaining([
        {
          name: 'Git root',
          status: 'pass',
          message: '[git-root]',
        },
        expect.objectContaining({
          name: 'Current directory',
          status: 'pass',
          message: expect.stringContaining('[git-root]'),
        }),
      ]),
    );

    expect(redactedHumanResult.exitCode).toBe(0);
    expect(redactedHumanResult.stdout).toContain('- [`pass`] `Git root`: `[git-root]`');
    expect(redactedHumanResult.stdout).not.toContain(root);
  });

  test('redacts raw cwd when it differs from the resolved git root', async () => {
    const dir = await makeTempDir();
    const linkParent = await makeTempDir();
    const linkedDir = path.join(linkParent, 'linked-repo');
    tempDirs.push(dir, linkParent);
    await initGitRepository(dir);
    await initializeAgentLoop({ cwd: dir });
    await symlink(dir, linkedDir, 'dir');

    const result = await runDoctor({ cwd: linkedDir, redactPaths: true });
    const serialized = JSON.stringify(result);

    expect(result.git.root).toBe('[git-root]');
    expect(result.checks).toContainEqual({
      name: 'Current directory',
      status: 'pass',
      message: '[git-root]',
    });
    expect(serialized).not.toContain(await realpath(dir));
    expect(serialized).not.toContain(linkedDir);
  });

  test('doctor human output warns when target is a git repository subdirectory', async () => {
    const dir = await makeTempDir();
    const packageDir = path.join(dir, 'packages', 'web');
    tempDirs.push(dir);
    await initGitRepository(dir);
    await mkdir(packageDir, { recursive: true });
    await writeJson(path.join(packageDir, 'package.json'), { name: 'demo-web' });
    await initializeAgentLoop({ cwd: packageDir });

    const result = await execa(tsxPath, [cliPath, 'doctor'], {
      cwd: packageDir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain(`- [\`pass\`] \`Git root\`: \`${await realpath(dir)}\``);
    expect(result.stdout).toContain(
      '- [`warn`] `Git target`: `current directory is a Git subdirectory`',
    );
    expect(result.stdout).toContain(
      '- [`warn`] `Git subdirectory target`: `AgentLoopKit files live in the current directory, not the Git root.`',
    );
  });

  test('warns when template manifest is missing', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await rm(path.join(dir, '.agentloop/manifest.json'));

    const result = await runDoctor({ cwd: dir });

    expect(result.strict).toBe(false);
    expect(result.overallStatus).toBe('warn');
    expect(result.serious).toHaveLength(0);
    expect(result.checks).toContainEqual({
      name: 'Template manifest',
      status: 'warn',
      message:
        'missing .agentloop/manifest.json; run agentloop init with the current CLI to add missing files without overwriting existing harness files',
    });
  });

  test('strict mode treats warnings as failures in JSON output', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await rm(path.join(dir, '.agentloop/manifest.json'));

    const result = await execa(tsxPath, [cliPath, 'doctor', '--strict', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    const output = JSON.parse(result.stdout);
    expect(output.strict).toBe(true);
    expect(output.overallStatus).toBe('fail');
    expect(output.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Template manifest',
          status: 'warn',
        }),
      ]),
    );
  });

  test('advisory mode exits zero while keeping failing JSON diagnostics', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initGitRepository(dir);

    const defaultResult = await execa(tsxPath, [cliPath, 'doctor', '--json'], {
      cwd: dir,
      reject: false,
    });
    const advisoryResult = await execa(tsxPath, [cliPath, 'doctor', '--advisory', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(defaultResult.exitCode).toBe(1);
    const defaultDoctor = JSON.parse(defaultResult.stdout);
    expect(defaultDoctor.overallStatus).toBe('fail');
    expect(defaultDoctor.advisory).toBe(false);

    expect(advisoryResult.exitCode).toBe(0);
    const advisoryDoctor = JSON.parse(advisoryResult.stdout);
    expect(advisoryDoctor.overallStatus).toBe('fail');
    expect(advisoryDoctor.advisory).toBe(true);
    expect(advisoryDoctor.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'agentloop.config.json',
          status: 'fail',
        }),
      ]),
    );
  });

  test('advisory mode labels human output and keeps failure details', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initGitRepository(dir);

    const result = await execa(tsxPath, [cliPath, 'doctor', '--advisory', '--redact-paths'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('- Overall status: `fail`');
    expect(result.stdout).toContain('- Advisory mode: `enabled`');
    expect(result.stdout).toContain('- [`fail`] `agentloop.config.json`:');
    expect(result.stdout).toContain('Run `agentloop init`');
  });

  test('includes actionable next steps for common warnings', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await rm(path.join(dir, '.agentloop/manifest.json'));
    await writeFile(
      path.join(dir, 'package.json'),
      JSON.stringify({ name: 'demo', version: '1.0.0', scripts: {} }, null, 2),
    );
    await writeFile(path.join(dir, '.env.local'), 'SECRET_VALUE=do-not-print\n');

    const result = await runDoctor({ cwd: dir });

    expect(result.nextActions).toEqual(
      expect.arrayContaining([
        {
          id: 'refresh-harness',
          command: 'agentloop init',
          reason:
            'Refresh missing or stale AgentLoopKit harness metadata without overwriting existing files.',
        },
        {
          id: 'add-verification',
          command: 'add package scripts or configure verification.commands',
          reason:
            'AgentLoopKit needs project-specific verification commands before agents can prove completion.',
        },
        {
          id: 'review-risk-files',
          command: 'review risk files before starting autonomous work',
          reason:
            'Risk files were detected; protect sensitive areas in the task contract before editing.',
        },
      ]),
    );
    expect(result.markdown).toContain('## Next Steps');
    expect(result.markdown).toContain('Run `agentloop init`');
    expect(result.markdown).toContain(
      'Run `add package scripts or configure verification.commands`',
    );
    expect(result.markdown).not.toContain('do-not-print');
  });

  test('recommends upgrade-harness when generated guidance misses the current loop', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await writeFile(
      path.join(dir, 'AGENTS.md'),
      '# AGENTS\n\nUse `agentloop verify` and `agentloop handoff` before review.\n',
    );
    await writeFile(
      path.join(dir, 'AGENTLOOP.md'),
      '# AGENTLOOP\n\nRun `agentloop create-task`, `agentloop verify`, and `agentloop handoff`.\n',
    );

    const result = await runDoctor({ cwd: dir });

    expect(result.checks).toContainEqual({
      name: 'Harness guidance',
      status: 'warn',
      message:
        'generated guidance is missing current agent-readiness topics; run agentloop upgrade-harness --details for copyable suggestions',
    });
    expect(result.nextActions).toEqual(
      expect.arrayContaining([
        {
          id: 'upgrade-harness',
          command: 'agentloop upgrade-harness --details',
          reason:
            'Generated guidance is missing current agent-readiness topics such as agentloop start, context source handles, ship, prepare-pr, run ledger, review context, or maintainer-check.',
        },
      ]),
    );
    expect(result.markdown).toContain('Run `agentloop upgrade-harness --details`');
  });

  test('doctor human output renders check values with safe inline code when paths contain backticks', async () => {
    const parent = await makeTempDir();
    const dir = path.join(parent, 'doctor`repo');
    tempDirs.push(parent);
    await mkdir(path.join(dir, 'src'), { recursive: true });
    await initializeAgentLoop({ cwd: dir });
    await writeFile(path.join(dir, 'src/auth`session.ts'), 'export const session = true;\n');
    await writeFile(
      path.join(dir, 'package.json'),
      JSON.stringify(
        {
          name: 'doctor-backtick-fixture',
          version: '1.0.0',
          scripts: {
            test: 'echo test',
            lint: 'echo lint',
            typecheck: 'echo typecheck',
            build: 'echo build',
          },
        },
        null,
        2,
      ),
    );

    const humanResult = await execa(tsxPath, [cliPath, 'doctor'], {
      cwd: dir,
      reject: false,
    });
    const jsonResult = await execa(tsxPath, [cliPath, 'doctor', '--json'], {
      cwd: dir,
      reject: false,
    });
    const expectedDir = await realpath(dir);

    expect(humanResult.exitCode).toBe(0);
    expect(humanResult.stdout).toContain('- Overall status: `warn`');
    expect(humanResult.stdout).toContain('- Strict mode: `disabled`');
    expect(humanResult.stdout).toContain(
      `- [\`pass\`] \`Current directory\`: \`\`${expectedDir}\`\``,
    );
    expect(humanResult.stdout).toContain(
      '- [`warn`] `Risk files: auth`: ``1 detected: src/auth`session.ts``',
    );
    expect(humanResult.stdout).toContain(
      '- Run `review risk files before starting autonomous work`: `Risk files were detected; protect sensitive areas in the task contract before editing.`',
    );
    const output = JSON.parse(jsonResult.stdout);
    expect(output.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Current directory',
          status: 'pass',
          message: expectedDir,
        }),
        expect.objectContaining({
          name: 'Risk files: auth',
          status: 'warn',
          message: '1 detected: src/auth`session.ts',
        }),
      ]),
    );
  });

  test('doctor human output renders dynamic values as single-line inline code', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await mkdir(path.join(dir, 'src'), { recursive: true });
    await writeFile(
      path.join(dir, 'src', 'auth\n- [x] injected.ts'),
      'export const auth = true;\n',
    );
    await writeFile(
      path.join(dir, 'package.json'),
      JSON.stringify(
        {
          name: 'demo*pkg\n- [x] injected',
          version: '1.0.0',
          scripts: {
            test: 'echo test',
            lint: 'echo lint',
            typecheck: 'echo typecheck',
            build: 'echo build',
          },
        },
        null,
        2,
      ),
    );

    const humanResult = await execa(tsxPath, [cliPath, 'doctor'], {
      cwd: dir,
      reject: false,
    });
    const jsonResult = await execa(tsxPath, [cliPath, 'doctor', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(humanResult.exitCode).toBe(0);
    expect(humanResult.stdout).toContain('- [`pass`] `Package name`: `demo*pkg\\n- [x] injected`');
    expect(humanResult.stdout).toContain(
      '- [`warn`] `Risk files: auth`: `1 detected: src/auth\\n- [x] injected.ts`',
    );
    expect(humanResult.stdout).not.toContain('\n- [x] injected`:');
    const output = JSON.parse(jsonResult.stdout);
    expect(output.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Package name',
          status: 'pass',
          message: 'demo*pkg\n- [x] injected',
        }),
        expect.objectContaining({
          name: 'Risk files: auth',
          status: 'warn',
          message: '1 detected: src/auth\n- [x] injected.ts',
        }),
      ]),
    );
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
            'template version 0 is older than current version 2; review docs/template-migrations.md and rerun agentloop init to add missing files',
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
    expect(result.markdown).toContain('- [`warn`] `Monorepo`:');
    expect(result.markdown).toContain(expectedMessage);
  });

  test('warns when nested package manifests indicate a monorepo layout', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await mkdir(path.join(dir, 'apps/web'), { recursive: true });
    await mkdir(path.join(dir, 'functions'), { recursive: true });
    await mkdir(path.join(dir, 'firestore-tests'), { recursive: true });
    await writeFile(path.join(dir, 'apps/web/package.json'), '{"name":"web"}');
    await writeFile(path.join(dir, 'functions/package.json'), '{"name":"functions"}');
    await writeFile(
      path.join(dir, 'firestore-tests/package.json'),
      '{"name":"firestore-tests"}',
    );

    const result = await runDoctor({ cwd: dir });
    const monorepoCheck = result.checks.find((check) => check.name === 'Monorepo');
    const expectedMessage =
      'workspace markers detected: nested package manifests: apps/web/package.json, functions/package.json, firestore-tests/package.json. Root checks may not cover every package; add package-specific verification commands to the task contract, such as pnpm --filter <package> test, npm --workspace <package> test, or cd packages/<name> && npm test. AgentLoopKit does not run workspace commands automatically.';

    expect(result.serious).toHaveLength(0);
    expect(monorepoCheck).toEqual({
      name: 'Monorepo',
      status: 'warn',
      message: expectedMessage,
    });
    expect(result.markdown).toContain(expectedMessage);
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
    expect(result.markdown).toContain(
      '- [`warn`] `Risk files: env files`: `1 detected: .env.local`',
    );
    expect(result.markdown).not.toContain('do-not-print');
  });

  test('warns when risk file scanning is truncated', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await mkdir(path.join(dir, 'src'), { recursive: true });
    await writeFile(path.join(dir, 'src/auth-session.ts'), 'export const session = true;');
    await writeFile(path.join(dir, 'src/billing.ts'), 'export const billing = true;');
    await writeFile(path.join(dir, 'src/extra.ts'), 'export const extra = true;');

    const result = await runDoctor({ cwd: dir, riskScanMaxEntries: 2 });

    expect(result.checks).toContainEqual({
      name: 'Risk file scan',
      status: 'warn',
      message: 'Risk scan stopped after 2 entries; review large repos with targeted checks.',
    });
  });
});
