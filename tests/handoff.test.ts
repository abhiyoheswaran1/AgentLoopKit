import { existsSync } from 'node:fs';
import path from 'node:path';
import { mkdir, readFile, readdir, symlink, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { inlineCode } from '../src/core/markdown-format.js';
import { summarizeRepository } from '../src/core/pr-summary.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

async function git(cwd: string, args: string[]) {
  return execa('git', args, { cwd });
}

async function createSummaryFixture() {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
  await writeJson(path.join(dir, 'agentloop.config.json'), config);
  await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
  await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
  await writeFile(path.join(dir, '.agentloop/tasks/2026-06-09-demo.md'), '# Demo task\n');
  await writeFile(
    path.join(dir, '.agentloop/reports/2026-06-09-12-00-verification-report.md'),
    '# Verification Report\n\nOverall status: pass\n',
  );
  return dir;
}

async function createExplicitVerificationFixture() {
  const dir = await createSummaryFixture();
  await writeFile(
    path.join(dir, '.agentloop/reports/manual-verification.md'),
    '# Verification Report\n\nOverall status: custom-pass\n',
  );
  return dir;
}

async function createExplicitTaskFixture() {
  const dir = await createSummaryFixture();
  await writeFile(path.join(dir, '.agentloop/tasks/2026-06-09-newer.md'), '# Newer task\n');
  await writeFile(
    path.join(dir, '.agentloop/state.json'),
    JSON.stringify({ version: 1, activeTaskPath: '.agentloop/tasks/2026-06-09-demo.md' }),
  );
  return dir;
}

async function createArchivedRunTaskFixture() {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
  await writeJson(path.join(dir, 'agentloop.config.json'), config);
  await mkdir(path.join(dir, '.agentloop/tasks/archive'), { recursive: true });
  await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
  await writeFile(
    path.join(dir, '.agentloop/tasks/archive/2026-06-09-demo.md'),
    '# Archived demo task\n\n- Status: done\n',
  );
  await writeFile(
    path.join(dir, '.agentloop/reports/2026-06-09-12-00-verification-report.md'),
    '# Verification Report\n\nOverall status: pass\n',
  );
  await writeJson(path.join(dir, '.agentloop/runs/2026-06-09-12-05-verify/metadata.json'), {
    id: '2026-06-09-12-05-verify',
    command: 'verify',
    createdAt: '2026-06-09-12-05',
    createdAtEpochMs: 1_000,
    task: {
      path: '.agentloop/tasks/2026-06-09-demo.md',
      title: 'Archived demo task',
      status: 'done',
    },
    verificationReportPath: '.agentloop/reports/2026-06-09-12-00-verification-report.md',
    overallStatus: 'pass',
    changedFileCount: 1,
  });
  return dir;
}

async function createDirtySummaryGitFixture(options: { sourceChange?: boolean } = {}) {
  const dir = await createSummaryFixture();
  await writeFile(
    path.join(dir, '.agentloop/tasks/2026-06-09-demo.md'),
    '# Demo task\n\n- Status: in-progress\n\n## Acceptance Criteria\n- Handoff stays readable.\n',
  );
  await git(dir, ['init', '-q']);
  await git(dir, ['config', 'user.email', 'agentloopkit@example.com']);
  await git(dir, ['config', 'user.name', 'AgentLoopKit Test']);
  await mkdir(path.join(dir, 'src'), { recursive: true });
  await mkdir(path.join(dir, '.agentloop/handoffs'), { recursive: true });
  await mkdir(path.join(dir, '.agentloop/runs'), { recursive: true });
  await writeFile(path.join(dir, 'src/index.ts'), 'export const value = "old";\n');
  await writeFile(path.join(dir, '.agentloop/handoffs/.gitkeep'), '');
  await writeFile(path.join(dir, '.agentloop/runs/.gitkeep'), '');
  await git(dir, ['add', '.']);
  await git(dir, ['commit', '-m', 'Initial summary fixture']);

  if (options.sourceChange !== false) {
    await writeFile(path.join(dir, 'src/index.ts'), 'export const value = "new";\n');
  }
  await writeFile(
    path.join(dir, '.agentloop/reports/2026-06-09-12-01-verification-report.md'),
    '# Verification Report\n\nOverall status: pass\n',
  );
  await writeFile(
    path.join(dir, '.agentloop/handoffs/2026-06-09-12-01-pr-summary.md'),
    '# PR Summary\n',
  );
  await mkdir(path.join(dir, '.agentloop/runs/2026-06-09-12-01-handoff'), { recursive: true });
  await writeFile(
    path.join(dir, '.agentloop/runs/2026-06-09-12-01-handoff/metadata.json'),
    '{"id":"2026-06-09-12-01-handoff"}\n',
  );

  return dir;
}

describe('handoff command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('writes a reviewer handoff by default and reports the path as JSON', async () => {
    const dir = await createSummaryFixture();

    const result = await execa(tsxPath, [cliPath, 'handoff', '--json'], { cwd: dir });

    const output = JSON.parse(result.stdout);
    expect(output.markdown).toContain('# PR Summary');
    expect(output.outPath).toContain('.agentloop/handoffs');
    expect(output.outPath).not.toContain(dir);
    expect(existsSync(path.join(dir, output.outPath))).toBe(true);
  });

  test('groups AgentLoop evidence churn in changed-file Markdown while preserving JSON output', async () => {
    const dir = await createDirtySummaryGitFixture();

    const result = await execa(tsxPath, [cliPath, 'handoff', '--json', '--write-run'], {
      cwd: dir,
    });
    const output = JSON.parse(result.stdout);
    const changedPaths = output.changedFiles.map((file: { path: string }) => file.path);
    const runChangedFiles = JSON.parse(
      await readFile(path.join(dir, output.run.path, 'changed-files.json'), 'utf8'),
    );
    const runChangedPaths = runChangedFiles.map((file: { path: string }) => file.path);

    expect(output.markdown).toContain('- M `src/index.ts`');
    expect(output.markdown).toContain(
      '- AgentLoop evidence: `3` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`.',
    );
    expect(output.markdown).toContain('Full paths remain in JSON output and run-ledger evidence.');
    expect(output.markdown).not.toContain(
      '.agentloop/reports/2026-06-09-12-01-verification-report.md',
    );
    expect(output.markdown).not.toContain('.agentloop/handoffs/2026-06-09-12-01-pr-summary.md');
    expect(changedPaths).toEqual(
      expect.arrayContaining([
        'src/index.ts',
        '.agentloop/reports/2026-06-09-12-01-verification-report.md',
        '.agentloop/handoffs/2026-06-09-12-01-pr-summary.md',
      ]),
    );
    expect(runChangedPaths).toEqual(expect.arrayContaining(changedPaths));
  });

  test('shows an explicit changed-file count when only AgentLoop evidence changed', async () => {
    const dir = await createDirtySummaryGitFixture({ sourceChange: false });

    const result = await execa(tsxPath, [cliPath, 'summarize', '--json'], { cwd: dir });
    const output = JSON.parse(result.stdout);

    expect(output.markdown).toContain(
      '- AgentLoop evidence: `3` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`.',
    );
    expect(output.markdown).toContain('Full paths remain in JSON output and run-ledger evidence.');
    expect(output.markdown).not.toContain('- No changed files detected.');
    expect(output.markdown).not.toContain(
      '.agentloop/reports/2026-06-09-12-01-verification-report.md',
    );
  });

  test('compact evidence summaries still cover handoff-only gate freshness', async () => {
    const dir = await createDirtySummaryGitFixture({ sourceChange: false });

    await execa(tsxPath, [cliPath, 'handoff', '--json'], { cwd: dir });
    const gatesResult = await execa(tsxPath, [cliPath, 'check-gates', '--json'], {
      cwd: dir,
      reject: false,
    });
    const gates = JSON.parse(gatesResult.stdout);

    expect(gates.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'handoff-summary',
          status: 'pass',
          message: 'Reviewer handoff found.',
        }),
      ]),
    );
  });

  test('keeps same-minute written handoffs instead of overwriting them', async () => {
    const dir = await createSummaryFixture();
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });

    const first = await summarizeRepository({
      cwd: dir,
      config,
      timestamp: '2026-06-09-12-05',
      write: true,
    });
    const second = await summarizeRepository({
      cwd: dir,
      config,
      timestamp: '2026-06-09-12-05',
      write: true,
    });

    expect(first.outPath).toBe(path.join(dir, '.agentloop/handoffs/2026-06-09-12-05-pr-summary.md'));
    expect(second.outPath).toBe(
      path.join(dir, '.agentloop/handoffs/2026-06-09-12-05-pr-summary-2.md'),
    );
    expect(existsSync(first.outPath)).toBe(true);
    expect(existsSync(second.outPath)).toBe(true);
  });

  test('keeps summarize read-only unless write is requested', async () => {
    const dir = await createSummaryFixture();

    const result = await execa(tsxPath, [cliPath, 'summarize', '--json'], { cwd: dir });

    const output = JSON.parse(result.stdout);
    expect(output.outPath).toContain('.agentloop/handoffs');
    expect(output.outPath).not.toContain(dir);
    expect(existsSync(path.join(dir, output.outPath))).toBe(false);
  });

  test('prints written summary paths with Markdown-safe inline values', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
    config.paths.handoffsDir = '.agentloop/handoffs`safe';
    await writeJson(path.join(dir, 'agentloop.config.json'), config);
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(path.join(dir, '.agentloop/tasks/2026-06-09-demo.md'), '# Demo task\n');
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-09-12-00-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );

    const result = await execa(tsxPath, [cliPath, 'summarize', '--write'], { cwd: dir });

    expect(result.stdout).toContain('Summary written:');
    expect(result.stdout).toContain(config.paths.handoffsDir);
    expect(result.stdout).not.toContain(dir);
  });

  test('keeps written summary and run paths on one line in human output while preserving JSON values', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
    config.paths.handoffsDir = '.agentloop/handoffs\nwith-break';
    await writeJson(path.join(dir, 'agentloop.config.json'), config);
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(path.join(dir, '.agentloop/tasks/2026-06-09-demo.md'), '# Demo task\n');
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-09-12-00-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );

    const humanResult = await execa(tsxPath, [cliPath, 'summarize', '--write', '--write-run'], {
      cwd: dir,
    });
    const jsonResult = await execa(
      tsxPath,
      [cliPath, 'summarize', '--write', '--write-run', '--json'],
      { cwd: dir },
    );
    const jsonOutput = JSON.parse(jsonResult.stdout);

    expect(humanResult.stdout).toContain('Summary written: `.agentloop/handoffs\\nwith-break/');
    expect(humanResult.stdout).toContain('Run written: `.agentloop/runs/');
    expect(humanResult.stdout).not.toContain('Summary written: `.agentloop/handoffs\nwith-break/');
    expect(jsonOutput.outPath).toContain(config.paths.handoffsDir);
    expect(jsonOutput.run.path).toContain('.agentloop/runs/');
  });

  test('accepts --format json for summarize output', async () => {
    const dir = await createSummaryFixture();

    const result = await execa(tsxPath, [cliPath, 'summarize', '--format', 'json'], {
      cwd: dir,
    });

    const output = JSON.parse(result.stdout);
    expect(output.markdown).toContain('# PR Summary');
    expect(output.outPath).toContain('.agentloop/handoffs');
    expect(output.outPath).not.toContain(dir);
    expect(existsSync(path.join(dir, output.outPath))).toBe(false);
  });

  test('rejects unsupported summarize formats without writing', async () => {
    const dir = await createSummaryFixture();

    const result = await execa(tsxPath, [cliPath, 'summarize', '--format', 'xml'], {
      cwd: dir,
      reject: false,
    });

    const handoffs = await readdir(path.join(dir, '.agentloop/handoffs')).catch(() => []);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('Unsupported output format "xml"');
    expect(result.stderr).toContain('markdown, json');
    expect(handoffs).toEqual([]);
  });

  test('prints unsupported handoff format errors as JSON without writing', async () => {
    const dir = await createSummaryFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'handoff', '--format', 'xml', '--json'],
      {
        cwd: dir,
        reject: false,
      },
    );

    const handoffs = await readdir(path.join(dir, '.agentloop/handoffs')).catch(() => []);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'UNSUPPORTED_OUTPUT_FORMAT',
        message: 'Unsupported output format "xml".',
        requestedFormat: 'xml',
        supportedFormats: ['markdown', 'json'],
      },
    });
    expect(handoffs).toEqual([]);
  });

  test('prints invalid config errors as JSON for summarize and handoff without writing', async () => {
    const dir = await createSummaryFixture();
    await writeFile(path.join(dir, 'agentloop.config.json'), '{"version":2}');

    const summarizeResult = await execa(tsxPath, [cliPath, 'summarize', '--json'], {
      cwd: dir,
      reject: false,
    });
    const handoffResult = await execa(tsxPath, [cliPath, 'handoff', '--json'], {
      cwd: dir,
      reject: false,
    });

    for (const result of [summarizeResult, handoffResult]) {
      const output = JSON.parse(result.stdout);
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toBe('');
      expect(output.error).toMatchObject({
        code: 'CONFIG_ERROR',
        message: expect.stringContaining('Invalid AgentLoopKit config'),
      });
    }
    const handoffs = await readdir(path.join(dir, '.agentloop/handoffs')).catch(() => []);
    expect(handoffs).toEqual([]);
  });

  test('accepts --verification as a summarize alias for --report', async () => {
    const dir = await createExplicitVerificationFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'summarize', '--verification', '.agentloop/reports/manual-verification.md', '--json'],
      { cwd: dir },
    );

    const output = JSON.parse(result.stdout);
    expect(output.markdown).toContain('Overall status: custom-pass');
    expect(output.outPath).not.toContain(dir);
    expect(existsSync(path.join(dir, output.outPath))).toBe(false);
  });

  test('accepts --verification as a handoff alias for --report', async () => {
    const dir = await createExplicitVerificationFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'handoff', '--verification', '.agentloop/reports/manual-verification.md', '--json'],
      { cwd: dir },
    );

    const output = JSON.parse(result.stdout);
    expect(output.markdown).toContain('Overall status: custom-pass');
    expect(output.outPath).not.toContain(dir);
    expect(existsSync(path.join(dir, output.outPath))).toBe(true);
  });

  test('uses explicit active task state when writing handoff', async () => {
    const dir = await createExplicitTaskFixture();

    const result = await execa(tsxPath, [cliPath, 'handoff', '--json'], { cwd: dir });

    const output = JSON.parse(result.stdout);
    expect(output.markdown).toContain(`Task context: ${inlineCode('Demo task')}`);
    expect(output.markdown).not.toContain('Task context: Newer task');
  });

  test('uses latest run task context after the task has been archived', async () => {
    const dir = await createArchivedRunTaskFixture();

    const result = await execa(tsxPath, [cliPath, 'handoff', '--json'], { cwd: dir });

    const output = JSON.parse(result.stdout);
    expect(output.markdown).toContain(`Task context: ${inlineCode('Archived demo task')}`);
    expect(output.markdown).not.toContain('No task contract found.');
  });

  test('does not invent task context when no task evidence exists', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
    await writeJson(path.join(dir, 'agentloop.config.json'), config);
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-09-12-00-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );

    const result = await execa(tsxPath, [cliPath, 'handoff', '--json'], { cwd: dir });

    const output = JSON.parse(result.stdout);
    expect(output.markdown).toContain(`Task context: ${inlineCode('No task contract found.')}`);
  });

  test('lets explicit handoff task paths override latest run task context', async () => {
    const dir = await createArchivedRunTaskFixture();
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-explicit.md'),
      '# Explicit handoff task\n\n- Status: in-progress\n',
    );

    const result = await execa(
      tsxPath,
      [cliPath, 'handoff', '--task', '.agentloop/tasks/2026-06-09-explicit.md', '--json'],
      { cwd: dir },
    );

    const output = JSON.parse(result.stdout);
    expect(output.markdown).toContain(`Task context: ${inlineCode('Explicit handoff task')}`);
    expect(output.markdown).not.toContain('Archived demo task');
  });

  test('prints explicit missing summarize task paths as JSON errors', async () => {
    const dir = await createSummaryFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'summarize', '--task', '.agentloop/tasks/missing.md', '--json'],
      { cwd: dir, reject: false },
    );

    const output = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(output).toEqual({
      error: {
        code: 'ARTIFACT_PATH_INVALID',
        message: 'Task artifact not found: .agentloop/tasks/missing.md',
        artifactType: 'task',
        requestedPath: '.agentloop/tasks/missing.md',
        expectedDir: '.agentloop/tasks',
        reason: 'missing',
      },
    });
  });

  test('prints explicit missing handoff verification paths as JSON errors without writing', async () => {
    const dir = await createSummaryFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'handoff', '--verification', '.agentloop/reports/missing.md', '--json'],
      { cwd: dir, reject: false },
    );

    const output = JSON.parse(result.stdout);
    const handoffs = await readdir(path.join(dir, '.agentloop/handoffs')).catch(() => []);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(output).toEqual({
      error: {
        code: 'ARTIFACT_PATH_INVALID',
        message: 'Verification artifact not found: .agentloop/reports/missing.md',
        artifactType: 'verification',
        requestedPath: '.agentloop/reports/missing.md',
        expectedDir: '.agentloop/reports',
        reason: 'missing',
      },
    });
    expect(handoffs).toEqual([]);
  });

  test('rejects handoff writes when the configured handoffs directory resolves outside the repo', async () => {
    const dir = await createSummaryFixture();
    const outsideDir = await makeTempDir();
    tempDirs.push(outsideDir);
    await symlink(outsideDir, path.join(dir, '.agentloop/handoffs'), 'dir');

    const result = await execa(tsxPath, [cliPath, 'handoff', '--json'], {
      cwd: dir,
      reject: false,
    });

    const output = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(output.error).toMatchObject({
      code: 'OUTPUT_PATH_INVALID',
      artifactType: 'handoff',
      expectedDir: '.agentloop/handoffs',
      expectedExtension: '.md',
      reason: 'outside-directory',
    });
    expect(output.error.requestedPath).toContain('.agentloop/handoffs/');
    expect(output.error.requestedPath).toContain('-pr-summary.md');
    expect(await readdir(outsideDir)).toEqual([]);
  });
});
