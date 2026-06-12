import { existsSync } from 'node:fs';
import path from 'node:path';
import { mkdir, readdir, symlink, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { inlineCode } from '../src/core/markdown-format.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

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
