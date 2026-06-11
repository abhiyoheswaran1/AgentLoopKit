import { existsSync } from 'node:fs';
import path from 'node:path';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
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
    expect(existsSync(output.outPath)).toBe(true);
  });

  test('keeps summarize read-only unless write is requested', async () => {
    const dir = await createSummaryFixture();

    const result = await execa(tsxPath, [cliPath, 'summarize', '--json'], { cwd: dir });

    const output = JSON.parse(result.stdout);
    expect(output.outPath).toContain('.agentloop/handoffs');
    expect(existsSync(output.outPath)).toBe(false);
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
    expect(existsSync(output.outPath)).toBe(false);
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
    expect(existsSync(output.outPath)).toBe(true);
  });

  test('uses explicit active task state when writing handoff', async () => {
    const dir = await createExplicitTaskFixture();

    const result = await execa(tsxPath, [cliPath, 'handoff', '--json'], { cwd: dir });

    const output = JSON.parse(result.stdout);
    expect(output.markdown).toContain('Task context: Demo task');
    expect(output.markdown).not.toContain('Task context: Newer task');
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
});
