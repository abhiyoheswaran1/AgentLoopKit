import path from 'node:path';
import { readdir, utimes, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { initializeAgentLoop } from '../src/core/init.js';
import { makeTempDir, removeTempDir } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');
const CLI_RELEASE_CHECK_TEST_TIMEOUT_MS = 90_000;

let tempDirs: string[] = [];

async function git(cwd: string, args: string[]) {
  return execa('git', args, { cwd });
}

async function createReleaseRepo(
  options: {
    verification?: 'pass' | 'fail' | 'missing';
    handoff?: boolean;
    releaseNotes?: boolean;
    dirty?: boolean;
  } = {},
) {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await git(dir, ['init', '-q']);
  await git(dir, ['config', 'user.email', 'agentloopkit@example.com']);
  await git(dir, ['config', 'user.name', 'AgentLoopKit Test']);
  await initializeAgentLoop({ cwd: dir });
  await writeFile(
    path.join(dir, 'package.json'),
    JSON.stringify(
      {
        name: 'demo',
        version: '1.2.3',
        scripts: {
          test: 'echo test',
          lint: 'echo lint',
          typecheck: 'echo typecheck',
          build: 'echo build',
          'smoke:release': 'echo smoke',
        },
      },
      null,
      2,
    ),
  );
  await writeFile(
    path.join(dir, 'CHANGELOG.md'),
    '# Changelog\n\n## 1.2.3\n\n- Prepared release evidence.\n',
  );
  if (options.verification !== 'missing') {
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-11-10-00-verification-report.md'),
      `# Verification Report\n\nOverall status: ${options.verification ?? 'pass'}\n`,
    );
  }
  if (options.handoff ?? true) {
    await writeFile(
      path.join(dir, '.agentloop/handoffs/2026-06-11-10-05-pr-summary.md'),
      '# PR Summary\n\nReview release evidence.\n',
    );
  }
  if (options.releaseNotes ?? true) {
    await writeFile(
      path.join(dir, '.agentloop/handoffs/2026-06-11-10-10-release-notes.md'),
      '# Release Notes\n\nRelease evidence.\n',
    );
  }
  await writeFile(path.join(dir, '.env.local'), 'SECRET_VALUE=do-not-print\n');
  await git(dir, ['add', '.']);
  await git(dir, ['commit', '-m', 'Prepare release fixture']);
  if (options.dirty) {
    await writeFile(path.join(dir, 'src-dirty.ts'), 'export const dirty = true;\n');
  }
  return dir;
}

describe('release-check command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('prints machine-readable pass results from local release evidence', async () => {
    const dir = await createReleaseRepo();

    const result = await execa(tsxPath, [cliPath, 'release-check', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).not.toContain('do-not-print');
    const output = JSON.parse(result.stdout);
    expect(output.overallStatus).toBe('pass');
    expect(output.package).toEqual({ name: 'demo', version: '1.2.3' });
    expect(output.git).toMatchObject({
      isRepository: true,
      changedFileCount: 0,
      targetIsRoot: true,
    });
    expect(output.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'package-metadata', status: 'pass' }),
        expect.objectContaining({ id: 'changelog-section', status: 'pass' }),
        expect.objectContaining({ id: 'verification-report', status: 'pass' }),
        expect.objectContaining({ id: 'handoff-summary', status: 'pass' }),
        expect.objectContaining({ id: 'release-notes', status: 'pass' }),
        expect.objectContaining({ id: 'release-scripts', status: 'pass' }),
        expect.objectContaining({ id: 'package-safety', status: 'pass' }),
      ]),
    );
    expect(output.nextAction.command).toBe('npm publish --access public');
    expect(output.safety.doesNot).toContain('publish packages');
    expect(output.safety.doesNot).toContain('read npm tokens');
  });

  test('warns without failing by default when release evidence is incomplete', async () => {
    const dir = await createReleaseRepo({ handoff: false, releaseNotes: false });

    const result = await execa(tsxPath, [cliPath, 'release-check', '--json'], {
      cwd: dir,
      reject: false,
    });

    const output = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(0);
    expect(output.overallStatus).toBe('warn');
    expect(output.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'handoff-summary', status: 'warn' }),
        expect.objectContaining({ id: 'release-notes', status: 'warn' }),
      ]),
    );
    expect(output.nextAction.command).toBe('agentloop handoff');
  });

  test('blocks publish recommendation when changelog has unreleased entries', async () => {
    const dir = await createReleaseRepo();
    await writeFile(
      path.join(dir, 'CHANGELOG.md'),
      '# Changelog\n\n## Unreleased\n\n- Add pending hardening work.\n\n## 1.2.3\n\n- Prepared release evidence.\n',
    );

    const result = await execa(tsxPath, [cliPath, 'release-check', '--json'], {
      cwd: dir,
      reject: false,
    });

    const output = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(0);
    expect(output.overallStatus).toBe('warn');
    expect(output.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'changelog-unreleased',
          status: 'warn',
          message: 'CHANGELOG.md has pending Unreleased entries.',
        }),
      ]),
    );
    expect(output.nextAction.command).toBe('prepare release notes from CHANGELOG.md Unreleased');
  });

  test('warns when verification report predates the current task', async () => {
    const dir = await createReleaseRepo();
    const taskPath = path.join(dir, '.agentloop/tasks/2026-06-11-release-hardening.md');
    const reportPath = path.join(dir, '.agentloop/reports/2026-06-11-10-00-verification-report.md');
    await writeFile(taskPath, '# Release hardening\n\n- Status: in-progress\n');
    await writeFile(
      path.join(dir, '.agentloop/state.json'),
      JSON.stringify({
        version: 1,
        activeTaskPath: '.agentloop/tasks/2026-06-11-release-hardening.md',
      }),
    );
    await utimes(reportPath, new Date('2026-06-11T10:00:00Z'), new Date('2026-06-11T10:00:00Z'));
    await utimes(taskPath, new Date('2026-06-11T11:00:00Z'), new Date('2026-06-11T11:00:00Z'));

    const result = await execa(tsxPath, [cliPath, 'release-check', '--json'], {
      cwd: dir,
      reject: false,
    });

    const output = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(0);
    expect(output.overallStatus).toBe('warn');
    expect(output.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'verification-report',
          status: 'warn',
          message: 'Latest verification report predates the current task. Rerun verification.',
          path: '.agentloop/reports/2026-06-11-10-00-verification-report.md',
        }),
      ]),
    );
    expect(output.nextAction.command).toBe('agentloop verify');
  });

  test('strict mode exits non-zero for warnings', async () => {
    const dir = await createReleaseRepo({ handoff: false });

    const result = await execa(tsxPath, [cliPath, 'release-check', '--strict', '--json'], {
      cwd: dir,
      reject: false,
    });

    const output = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(output.strict).toBe(true);
    expect(output.overallStatus).toBe('fail');
    expect(output.checks).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'handoff-summary', status: 'warn' })]),
    );
  });

  test('stays read-only while reporting dirty working tree risk', async () => {
    const dir = await createReleaseRepo({ dirty: true });
    const beforeReports = await readdir(path.join(dir, '.agentloop/reports'));
    const beforeHandoffs = await readdir(path.join(dir, '.agentloop/handoffs'));

    const result = await execa(tsxPath, [cliPath, 'release-check'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain('# AgentLoopKit Release Check');
    expect(result.stdout).toContain('[`warn`] `Working tree`');
    expect(result.stdout).not.toContain('do-not-print');
    await expect(readdir(path.join(dir, '.agentloop/reports'))).resolves.toEqual(beforeReports);
    await expect(readdir(path.join(dir, '.agentloop/handoffs'))).resolves.toEqual(beforeHandoffs);
  });

  test(
    'renders markdown check values with safe inline code when release data contains backticks',
    async () => {
      const dir = await createReleaseRepo();
      await writeFile(
        path.join(dir, 'package.json'),
        JSON.stringify(
          {
            name: 'demo`pkg',
            version: '1.2.3`rc',
            scripts: {
              test: 'echo test',
              lint: 'echo lint',
              typecheck: 'echo typecheck',
              build: 'echo build',
              'smoke:release': 'echo smoke',
            },
          },
          null,
          2,
        ),
      );
      await writeFile(
        path.join(dir, 'CHANGELOG.md'),
        '# Changelog\n\n## 1.2.3`rc\n\n- Prepared release evidence.\n',
      );
      await git(dir, ['add', 'package.json', 'CHANGELOG.md']);
      await git(dir, ['commit', '-m', 'Prepare backtick release fixture']);
      await git(dir, ['checkout', '-b', 'release`branch']);

      const humanResult = await execa(tsxPath, [cliPath, 'release-check'], {
        cwd: dir,
        reject: false,
      });
      const jsonResult = await execa(tsxPath, [cliPath, 'release-check', '--json'], {
        cwd: dir,
        reject: false,
      });

      expect(humanResult.exitCode).toBe(0);
      expect(humanResult.stdout).toContain('- Overall status: `pass`');
      expect(humanResult.stdout).toContain('- Strict mode: `disabled`');
      expect(humanResult.stdout).toContain('- Package: ``demo`pkg@1.2.3`rc``');
      expect(humanResult.stdout).toContain('- Git: ``release`branch`` @ `');
      expect(humanResult.stdout).toContain('- Changed files: `0`');
      expect(humanResult.stdout).toContain(
        '- [`pass`] `Package metadata`: ``package.json declares demo`pkg@1.2.3`rc`` - `package.json`',
      );
      expect(humanResult.stdout).toContain(
        '- [`pass`] `Changelog section`: ``CHANGELOG.md includes 1.2.3`rc.`` - `CHANGELOG.md`',
      );
      expect(humanResult.stdout).toContain('Run `npm publish --access public`.');
      const output = JSON.parse(jsonResult.stdout);
      expect(output.package).toEqual({ name: 'demo`pkg', version: '1.2.3`rc' });
      expect(output.git.branch).toBe('release`branch');
      expect(output.checks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'package-metadata',
            message: 'package.json declares demo`pkg@1.2.3`rc',
            path: 'package.json',
          }),
        ]),
      );
    },
    CLI_RELEASE_CHECK_TEST_TIMEOUT_MS,
  );
});
