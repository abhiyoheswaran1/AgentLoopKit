import path from 'node:path';
import { mkdir, readdir, readFile, realpath, utimes, writeFile } from 'node:fs/promises';
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
    releaseNotesContent?: string;
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
      options.releaseNotesContent ?? '# Release Notes\n\n## 1.2.3\n\nRelease evidence.\n',
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
    expect(output.nextAction.command).toBe('agentloop npm-status');
    expect(output.nextAction.reason).toContain('Check npm registry state before publishing.');
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

  test('warns when generated release notes do not mention the package version', async () => {
    const dir = await createReleaseRepo({
      releaseNotesContent: '# Release Notes\n\n## 1.2.2\n\nOld release evidence.\n',
    });

    const defaultResult = await execa(tsxPath, [cliPath, 'release-check', '--json'], {
      cwd: dir,
      reject: false,
    });
    const strictResult = await execa(tsxPath, [cliPath, 'release-check', '--strict', '--json'], {
      cwd: dir,
      reject: false,
    });

    const defaultOutput = JSON.parse(defaultResult.stdout);
    expect(defaultResult.exitCode).toBe(0);
    expect(defaultOutput.overallStatus).toBe('warn');
    expect(defaultOutput.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'release-notes',
          status: 'warn',
          message:
            'Latest generated release notes do not mention package version 1.2.3. Regenerate release notes for this release.',
          path: '.agentloop/handoffs/2026-06-11-10-10-release-notes.md',
        }),
      ]),
    );
    expect(defaultOutput.nextAction.command).toBe('agentloop release-notes --write');

    expect(strictResult.exitCode).toBe(1);
    const strictOutput = JSON.parse(strictResult.stdout);
    expect(strictOutput.overallStatus).toBe('fail');
    expect(strictOutput.checks).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'release-notes', status: 'warn' })]),
    );
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

  test('redacts local git root paths when requested', async () => {
    const dir = await createReleaseRepo();
    const nestedDir = path.join(dir, 'packages', 'web');
    await mkdir(nestedDir, { recursive: true });
    const root = await realpath(dir);

    const defaultResult = await execa(tsxPath, [cliPath, 'release-check', '--json'], {
      cwd: nestedDir,
      reject: false,
    });
    const redactedJsonResult = await execa(
      tsxPath,
      [cliPath, 'release-check', '--json', '--redact-paths'],
      {
        cwd: nestedDir,
        reject: false,
      },
    );
    const redactedHumanResult = await execa(tsxPath, [cliPath, 'release-check', '--redact-paths'], {
      cwd: nestedDir,
      reject: false,
    });

    expect(defaultResult.exitCode).toBe(0);
    expect(JSON.parse(defaultResult.stdout).git.root).toBe(root);

    expect(redactedJsonResult.exitCode).toBe(0);
    const redacted = JSON.parse(redactedJsonResult.stdout);
    expect(redacted.git.root).toBe('[git-root]');
    expect(JSON.stringify(redacted)).not.toContain(root);

    expect(redactedHumanResult.exitCode).toBe(0);
    expect(redactedHumanResult.stdout).not.toContain(root);
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
      await writeFile(
        path.join(dir, '.agentloop/handoffs/2026-06-11-10-10-release-notes.md'),
        '# Release Notes\n\n## 1.2.3`rc\n\nRelease evidence.\n',
      );
      await git(dir, [
        'add',
        'package.json',
        'CHANGELOG.md',
        '.agentloop/handoffs/2026-06-11-10-10-release-notes.md',
      ]);
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
      expect(humanResult.stdout).toContain('Run `agentloop npm-status`.');
      expect(humanResult.stdout).not.toContain('Run `npm publish --access public`.');
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

  test(
    'renders markdown check values as single-line inline code when release data contains line breaks',
    async () => {
      const dir = await createReleaseRepo();
      await writeFile(
        path.join(dir, 'package.json'),
        JSON.stringify(
          {
            name: 'demo\n- [x] injected',
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
      await writeFile(
        path.join(dir, '.agentloop/handoffs/2026-06-11-10-10-release-notes.md'),
        '# Release Notes\n\n## 1.2.3\n\nRelease evidence.\n',
      );

      const humanResult = await execa(tsxPath, [cliPath, 'release-check'], {
        cwd: dir,
        reject: false,
      });
      const jsonResult = await execa(tsxPath, [cliPath, 'release-check', '--json'], {
        cwd: dir,
        reject: false,
      });

      expect(humanResult.exitCode).toBe(0);
      expect(humanResult.stdout).toContain('- Package: `demo\\n- [x] injected@1.2.3`');
      expect(humanResult.stdout).toContain(
        '- [`pass`] `Package metadata`: `package.json declares demo\\n- [x] injected@1.2.3` - `package.json`',
      );
      expect(humanResult.stdout).not.toContain('\n- [x] injected@1.2.3`');
      const output = JSON.parse(jsonResult.stdout);
      expect(output.package).toEqual({
        name: 'demo\n- [x] injected',
        version: '1.2.3',
      });
      expect(output.checks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'package-metadata',
            message: 'package.json declares demo\n- [x] injected@1.2.3',
            path: 'package.json',
          }),
        ]),
      );
    },
    CLI_RELEASE_CHECK_TEST_TIMEOUT_MS,
  );

  test('explains when commits after the current version tag do not affect package release contents', async () => {
    const dir = await createReleaseRepo();
    await git(dir, ['tag', 'v1.2.3']);
    await mkdir(path.join(dir, 'docs'), { recursive: true });
    await writeFile(path.join(dir, 'docs', 'release-status.md'), '# Release proof\n');
    await git(dir, ['add', 'docs/release-status.md']);
    await git(dir, ['commit', '-m', 'docs: record release proof']);

    const result = await execa(tsxPath, [cliPath, 'release-check', '--json'], {
      cwd: dir,
      reject: false,
    });
    const humanResult = await execa(tsxPath, [cliPath, 'release-check'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.releaseDelta).toMatchObject({
      tag: 'v1.2.3',
      commitCount: 1,
      packageImpactingChangedFileCount: 0,
      recommendation: 'no-release-needed',
    });
    expect(output.releaseDelta.changedFiles).toEqual(['docs/release-status.md']);
    expect(output.releaseDelta.packageImpactingChangedFiles).toEqual([]);
    expect(output.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'release-delta',
          status: 'pass',
          message: '1 commit since v1.2.3, but no package-impacting files changed.',
        }),
        expect.objectContaining({
          id: 'release-tag',
          status: 'warn',
        }),
      ]),
    );
    expect(output.nextAction).toEqual({
      command: 'do not cut a release yet',
      reason: 'The current version is already tagged and commits since that tag do not affect package release contents.',
    });
    expect(humanResult.stdout).toContain(
      '- [`pass`] `Release delta`: `1 commit since v1.2.3, but no package-impacting files changed.`',
    );
    expect(humanResult.stdout).toContain('Run `do not cut a release yet`.');
  });

  test('explains when commits after the current version tag require a new version choice', async () => {
    const dir = await createReleaseRepo();
    await git(dir, ['tag', 'v1.2.3']);
    await writeFile(path.join(dir, 'README.md'), '# Updated package README\n');
    await git(dir, ['add', 'README.md']);
    await git(dir, ['commit', '-m', 'docs: update package readme']);

    const result = await execa(tsxPath, [cliPath, 'release-check', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.releaseDelta).toMatchObject({
      tag: 'v1.2.3',
      commitCount: 1,
      packageImpactingChangedFileCount: 1,
      recommendation: 'choose-next-version',
    });
    expect(output.releaseDelta.packageImpactingChangedFiles).toEqual(['README.md']);
    expect(output.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'release-delta',
          status: 'warn',
          message:
            '1 package-impacting file changed since v1.2.3; choose the next package version before release.',
        }),
      ]),
    );
    expect(output.nextAction.command).toBe('choose the intended release version');
    expect(output.nextAction.reason).toBe(
      'Package-impacting changes exist after the current version tag.',
    );
  });

  test('treats package files globs as release-impacting delta paths', async () => {
    const dir = await createReleaseRepo();
    const packageJson = JSON.parse(await readFile(path.join(dir, 'package.json'), 'utf8'));
    packageJson.files = ['public/**/*.json'];
    await writeFile(path.join(dir, 'package.json'), JSON.stringify(packageJson, null, 2));
    await git(dir, ['add', 'package.json']);
    await git(dir, ['commit', '-m', 'Add package files list']);
    await git(dir, ['tag', 'v1.2.3']);
    await mkdir(path.join(dir, 'public', 'metadata'), { recursive: true });
    await writeFile(path.join(dir, 'public', 'metadata', 'manifest.json'), '{"name":"demo"}\n');
    await git(dir, ['add', 'public/metadata/manifest.json']);
    await git(dir, ['commit', '-m', 'Add package manifest']);

    const result = await execa(tsxPath, [cliPath, 'release-check', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.releaseDelta.packageImpactingChangedFiles).toEqual([
      'public/metadata/manifest.json',
    ]);
    expect(output.releaseDelta.recommendation).toBe('choose-next-version');
  });
});
