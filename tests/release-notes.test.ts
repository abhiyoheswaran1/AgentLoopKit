import { existsSync } from 'node:fs';
import path from 'node:path';
import { mkdir, readdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { generateReleaseNotes } from '../src/core/release-notes.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

async function git(cwd: string, args: string[]) {
  return execa('git', args, { cwd });
}

async function createReleaseFixture(options: { withPreviousTag: boolean }) {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await git(dir, ['init', '-q']);
  await git(dir, ['config', 'user.email', 'agentloopkit@example.com']);
  await git(dir, ['config', 'user.name', 'AgentLoopKit Test']);

  const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
  await writeJson(path.join(dir, 'agentloop.config.json'), config);
  await writeJson(path.join(dir, 'package.json'), {
    name: 'demo',
    version: '1.2.3',
    scripts: { test: 'echo ok' },
  });
  await writeFile(
    path.join(dir, 'CHANGELOG.md'),
    '# Changelog\n\n## 1.2.3\n\n- Added release-note generation.\n- Improved release evidence.\n\n## 1.2.2\n\n- Previous release.\n',
  );
  await mkdir(path.join(dir, 'src'), { recursive: true });
  await writeFile(path.join(dir, 'src/index.ts'), 'export const previous = true;\n');
  await git(dir, ['add', '.']);
  await git(dir, ['commit', '-m', 'Initial release']);
  if (options.withPreviousTag) await git(dir, ['tag', 'v1.2.2']);

  await writeFile(path.join(dir, 'src/index.ts'), 'export const releaseNotes = true;\n');
  await git(dir, ['add', 'src/index.ts']);
  await git(dir, ['commit', '-m', 'Add release note behavior']);

  await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
  await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
  await mkdir(path.join(dir, '.agentloop/handoffs'), { recursive: true });
  await writeFile(
    path.join(dir, '.agentloop/tasks/2026-06-10-release-notes.md'),
    '# Prepare release notes\n\n- Status: review\n',
  );
  await writeFile(
    path.join(dir, '.agentloop/reports/2026-06-10-12-00-verification-report.md'),
    '# Verification Report\n\n- Overall status: pass\n',
  );
  await writeFile(
    path.join(dir, '.agentloop/reports/2026-06-10-12-05-ci-summary.md'),
    '# AgentLoopKit CI Summary\n\n- Overall status: pass\n',
  );

  return dir;
}

describe('release-notes command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('writes deterministic release notes as JSON from local evidence', async () => {
    const dir = await createReleaseFixture({ withPreviousTag: true });

    const result = await execa(
      tsxPath,
      [cliPath, 'release-notes', '--from', 'v1.2.2', '--to', 'HEAD', '--json', '--write'],
      { cwd: dir },
    );

    const output = JSON.parse(result.stdout);
    expect(output.version).toBe('1.2.3');
    expect(output.gitRange.from).toBe('v1.2.2');
    expect(output.gitRange.to).toBe('HEAD');
    expect(output.writtenPath).toMatch(/release-notes\.md$/);
    expect(existsSync(output.writtenPath)).toBe(true);
    expect(output.markdown).toContain('# Release Notes');
    expect(output.markdown).toContain('- Version: `1.2.3`');
    expect(output.markdown).toContain('- Range: `v1.2.2..HEAD`');
    expect(output.markdown).toContain('- Added release-note generation.');
    expect(output.markdown).toContain('Add release note behavior');
    expect(output.markdown).toContain('src/index.ts');
    expect(output.markdown).toContain('Uncommitted changes detected');
    expect(output.markdown).toContain('.agentloop/tasks/2026-06-10-release-notes.md');
    expect(output.markdown).toContain('Prepare release notes');
    expect(output.markdown).toContain('Overall status: `pass`');
    expect(output.markdown).toContain('Does not create tags, publish packages, call external APIs');

    const written = await readFile(output.writtenPath, 'utf8');
    expect(written).toBe(output.markdown);
  });

  test('escapes release-note file path labels when paths contain backticks', async () => {
    const dir = await createReleaseFixture({ withPreviousTag: true });
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
    const changedPath = 'src/release`path.ts';
    const dirtyPath = 'src/dirty`path.ts';

    await writeFile(path.join(dir, changedPath), 'export const changed = true;\n');
    await git(dir, ['add', changedPath]);
    await git(dir, ['commit', '-m', 'Add tricky release path']);
    await writeFile(path.join(dir, dirtyPath), 'export const dirty = true;\n');

    const output = await generateReleaseNotes({
      cwd: dir,
      config,
      from: 'v1.2.2',
      to: 'HEAD',
      timestamp: '2026-06-11-15-30',
    });

    expect(output.markdown).toContain(`- A \`\`${changedPath}\`\``);
    expect(output.markdown).toContain(`- \`\`?? ${dirtyPath}\`\``);
  });

  test('escapes release-note metadata and AgentLoop evidence labels when values contain backticks', async () => {
    const dir = await createReleaseFixture({ withPreviousTag: false });
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
    const taskPath = '.agentloop/tasks/release`task.md';

    await git(dir, ['tag', 'v1.2.2`old', 'HEAD~1']);
    await writeJson(path.join(dir, 'package.json'), {
      name: 'demo`pkg',
      version: '1.2.3`beta',
      scripts: { test: 'echo ok' },
    });
    await writeFile(path.join(dir, taskPath), '# Release `task`\n\n- Status: review`ready\n');
    await writeJson(path.join(dir, '.agentloop/state.json'), {
      version: 1,
      activeTaskPath: taskPath,
    });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-10-12-05-ci-summary.md'),
      '# CI `summary`\n\n- Overall status: pass\n',
    );

    const output = await generateReleaseNotes({
      cwd: dir,
      config,
      from: 'v1.2.2`old',
      to: 'HEAD',
      timestamp: '2026-06-11-15-31',
    });

    expect(output.packageName).toBe('demo`pkg');
    expect(output.version).toBe('1.2.3`beta');
    expect(output.gitRange.label).toBe('v1.2.2`old..HEAD');
    expect(output.evidence.task?.path).toBe(taskPath);
    expect(output.markdown).toContain('- Package: ``demo`pkg``');
    expect(output.markdown).toContain('- Version: ``1.2.3`beta``');
    expect(output.markdown).toContain('- Range: ``v1.2.2`old..HEAD``');
    expect(output.markdown).toContain(
      '- Task: `` Release `task` `` (``review`ready``) - ``.agentloop/tasks/release`task.md``',
    );
    expect(output.markdown).toContain(
      '- CI summary: `` CI `summary` `` - `.agentloop/reports/2026-06-10-12-05-ci-summary.md`',
    );
  });

  test('handles missing previous tags honestly in markdown output', async () => {
    const dir = await createReleaseFixture({ withPreviousTag: false });

    const result = await execa(tsxPath, [cliPath, 'release-notes'], { cwd: dir });

    expect(result.stdout).toContain('# Release Notes');
    expect(result.stdout).toContain('- Version: `1.2.3`');
    expect(result.stdout).toContain('No previous version tag was found');
    expect(result.stdout).toContain('No release notes file was written.');
  });

  test('accepts an explicit release version without colliding with the CLI version flag', async () => {
    const dir = await createReleaseFixture({ withPreviousTag: true });

    const result = await execa(
      tsxPath,
      [cliPath, 'release-notes', '--release-version', '9.9.9', '--json'],
      { cwd: dir },
    );

    const output = JSON.parse(result.stdout);
    expect(output.version).toBe('9.9.9');
    expect(output.markdown).toContain('- Version: `9.9.9`');
  });

  test('prints invalid config errors as JSON without writing release notes', async () => {
    const dir = await createReleaseFixture({ withPreviousTag: true });
    await writeFile(path.join(dir, 'agentloop.config.json'), '{"version":2}');

    const result = await execa(tsxPath, [cliPath, 'release-notes', '--json', '--write'], {
      cwd: dir,
      reject: false,
    });

    const output = JSON.parse(result.stdout);
    const handoffs = await readdir(path.join(dir, '.agentloop/handoffs'));
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(output.error).toMatchObject({
      code: 'CONFIG_ERROR',
      message: expect.stringContaining('Invalid AgentLoopKit config'),
    });
    expect(handoffs.some((file) => file.endsWith('-release-notes.md'))).toBe(false);
  });

  test('prints JSON errors when --out is provided without --write', async () => {
    const dir = await createReleaseFixture({ withPreviousTag: true });
    const outPath = path.join(dir, '.agentloop/handoffs/manual-release-notes.md');

    const result = await execa(tsxPath, [cliPath, 'release-notes', '--out', outPath, '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'OUT_REQUIRES_WRITE',
        message: '--out requires --write.',
        option: 'out',
        requiredOption: 'write',
        requestedPath: outPath,
      },
    });
    expect(existsSync(outPath)).toBe(false);
  });

  test('keeps --out without --write errors human-readable by default', async () => {
    const dir = await createReleaseFixture({ withPreviousTag: true });
    const outPath = path.join(dir, '.agentloop/handoffs/manual-release-notes.md');

    const result = await execa(tsxPath, [cliPath, 'release-notes', '--out', outPath], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('agentloop: --out requires --write.');
    expect(existsSync(outPath)).toBe(false);
  });

  test('rejects release-note output paths outside the handoffs directory', async () => {
    const dir = await createReleaseFixture({ withPreviousTag: true });
    const outPath = path.join(dir, 'outside-release-notes.md');

    const result = await execa(
      tsxPath,
      [cliPath, 'release-notes', '--write', '--out', outPath, '--json'],
      {
        cwd: dir,
        reject: false,
      },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'OUTPUT_PATH_INVALID',
        message: `Release notes output path must stay inside .agentloop/handoffs: ${outPath}`,
        artifactType: 'release-notes',
        requestedPath: outPath,
        expectedDir: '.agentloop/handoffs',
        expectedExtension: '.md',
        reason: 'outside-directory',
      },
    });
    expect(existsSync(outPath)).toBe(false);
  });

  test('rejects release-note writes when the configured handoffs directory resolves outside the repo', async () => {
    const dir = await createReleaseFixture({ withPreviousTag: true });
    const outsideDir = await makeTempDir();
    tempDirs.push(outsideDir);
    await rm(path.join(dir, '.agentloop/handoffs'), { recursive: true, force: true });
    await symlink(outsideDir, path.join(dir, '.agentloop/handoffs'), 'dir');

    const result = await execa(tsxPath, [cliPath, 'release-notes', '--write', '--json'], {
      cwd: dir,
      reject: false,
    });

    const output = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(output.error).toMatchObject({
      code: 'OUTPUT_PATH_INVALID',
      artifactType: 'release-notes',
      expectedDir: '.agentloop/handoffs',
      expectedExtension: '.md',
      reason: 'outside-directory',
    });
    expect(output.error.requestedPath).toContain('.agentloop/handoffs/');
    expect(output.error.requestedPath).toContain('-release-notes.md');
    expect(await readdir(outsideDir)).toEqual([]);
  });

  test('rejects release-note output paths with non-Markdown extensions', async () => {
    const dir = await createReleaseFixture({ withPreviousTag: true });
    const outPath = path.join(dir, '.agentloop/handoffs/manual-release-notes.txt');

    const result = await execa(
      tsxPath,
      [cliPath, 'release-notes', '--write', '--out', outPath, '--json'],
      {
        cwd: dir,
        reject: false,
      },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'OUTPUT_PATH_INVALID',
        message: `Release notes output path must use .md: ${outPath}`,
        artifactType: 'release-notes',
        requestedPath: outPath,
        expectedDir: '.agentloop/handoffs',
        expectedExtension: '.md',
        reason: 'wrong-extension',
      },
    });
    expect(existsSync(outPath)).toBe(false);
  });

  test('ignores verification and CI summary evidence from symlinked report roots outside the repo', async () => {
    const dir = await createReleaseFixture({ withPreviousTag: true });
    const outsideReports = await makeTempDir();
    tempDirs.push(outsideReports);
    await writeFile(
      path.join(outsideReports, '2026-06-10-12-00-verification-report.md'),
      '# Outside Verification\n\nOverall status: pass\n\noutside-secret-report-content\n',
    );
    await writeFile(
      path.join(outsideReports, '2026-06-10-12-05-ci-summary.md'),
      '# Outside CI Summary\n\noutside-secret-ci-summary-content\n',
    );
    await rm(path.join(dir, '.agentloop/reports'), { recursive: true, force: true });
    await symlink(outsideReports, path.join(dir, '.agentloop/reports'), 'dir');

    const result = await execa(
      tsxPath,
      [cliPath, 'release-notes', '--from', 'v1.2.2', '--to', 'HEAD', '--json'],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(0);
    expect(result.stdout).not.toContain('outside-secret');
    const output = JSON.parse(result.stdout);
    expect(output.evidence.verification).toBeUndefined();
    expect(output.evidence.ciSummary).toBeUndefined();
    expect(output.markdown).toContain('- Verification: not found');
    expect(output.markdown).toContain('- CI summary: not found');
  });

  test('handles an explicit missing from ref without pretending the range was read', async () => {
    const dir = await createReleaseFixture({ withPreviousTag: true });

    const result = await execa(tsxPath, [cliPath, 'release-notes', '--from', 'v9.9.9'], {
      cwd: dir,
    });

    expect(result.stdout).toContain('Git ref "v9.9.9" was not found');
    expect(result.stdout).toContain('- Range: `HEAD (missing from: v9.9.9)`');
    expect(result.stdout).toContain('Add release note behavior');
    expect(result.stdout).toContain('No changed files detected for the selected range');
  });

  test('rejects option-shaped git refs before running release-note git commands', async () => {
    const dir = await createReleaseFixture({ withPreviousTag: true });
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });

    await expect(
      generateReleaseNotes({
        cwd: dir,
        config,
        from: '--upload-pack=echo-owned',
        to: 'HEAD',
      }),
    ).rejects.toThrow('Invalid git ref for --from');
  });
});
