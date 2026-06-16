import path from 'node:path';
import { mkdir, readdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { generateSvgBadge, writeEvidenceBadge } from '../src/core/badge.js';
import { createDefaultConfig } from '../src/core/config.js';
import { initializeAgentLoop } from '../src/core/init.js';
import { inlineCode } from '../src/core/markdown-format.js';
import { makeTempDir, removeTempDir } from './helpers.js';

let tempDirs: string[] = [];

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

describe('badge generation', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('escapes SVG label and message text', () => {
    const badge = generateSvgBadge({
      label: 'agent<script>',
      message: 'pass & "safe"',
      status: 'pass',
    });

    expect(badge.svg).toContain('agent&lt;script&gt;');
    expect(badge.svg).toContain('pass &amp; &quot;safe&quot;');
    expect(badge.svg).not.toContain('<script>');
    expect(badge.status).toBe('pass');
  });

  test('writes a verification badge from the latest verification report', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-10-12-00-verification-report.md'),
      '# Verification Report\n\n- Overall status: pass\n',
    );

    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
    const result = await writeEvidenceBadge({ cwd: dir, config, source: 'verification' });
    const svg = await readFile(result.outPath, 'utf8');

    expect(path.basename(result.outPath)).toBe('agentloop-verification.svg');
    expect(result.source).toBe('verification');
    expect(result.status).toBe('pass');
    expect(result.message).toBe('pass');
    expect(svg).toContain('verification');
    expect(svg).toContain('pass');
  });

  test('CLI writes a gates badge with compact JSON output', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-10-cli-task.md'),
      '# CLI task\n\n- Status: in-progress\n',
    );
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-10-12-00-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );
    await mkdir(path.join(dir, '.agentloop/handoffs'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/handoffs/2026-06-10-12-05-pr-summary.md'),
      '# PR Summary\n\nVerification status: Overall status: pass\n',
    );

    const result = await execa(tsxPath, [cliPath, 'badge', '--source', 'gates', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const payload = JSON.parse(result.stdout);
    expect(payload.source).toBe('gates');
    expect(payload.outPath).toContain('.agentloop/reports/agentloop-gates.svg');
    expect(payload.svg).toBeUndefined();
    const svg = await readFile(payload.outPath, 'utf8');
    expect(svg).toContain('gates');
    expect(svg).toContain(payload.status);
  });

  test('CLI prints badge confirmation values with Markdown-safe inline values', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-10-12-00-verification-report.md'),
      '# Verification Report\n\nOverall status: pass`ok\n',
    );

    const outPath = path.join(dir, '.agentloop/reports/agentloop`verification.svg');
    const result = await execa(tsxPath, [cliPath, 'badge', '--out', outPath], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain(`Badge written: ${inlineCode(outPath)}`);
    expect(result.stdout).toContain(`Source: ${inlineCode('verification')}`);
    expect(result.stdout).toContain(`Status: ${inlineCode('pass')}`);
    expect(result.stdout).toContain(`Message: ${inlineCode('pass')}`);
  });

  test('CLI keeps badge confirmation path on one line while preserving JSON values', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-10-12-00-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );
    const outPath = path.join(dir, '.agentloop/reports/badge\nwith-break.svg');

    const humanResult = await execa(tsxPath, [cliPath, 'badge', '--out', outPath], {
      cwd: dir,
    });
    const jsonResult = await execa(tsxPath, [cliPath, 'badge', '--out', outPath, '--json'], {
      cwd: dir,
    });
    const jsonOutput = JSON.parse(jsonResult.stdout);

    expect(humanResult.stdout).toContain('Badge written: ');
    expect(humanResult.stdout).toContain('/.agentloop/reports/badge\\nwith-break.svg`');
    expect(humanResult.stdout).not.toContain('/.agentloop/reports/badge\nwith-break.svg`');
    expect(jsonOutput.outPath).toBe(outPath);
  });

  test('CLI prints invalid config errors as JSON without writing a badge', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await writeFile(path.join(dir, 'agentloop.config.json'), '{"version":2}');

    const outPath = path.join(dir, '.agentloop/reports/custom-badge.svg');
    const result = await execa(tsxPath, [cliPath, 'badge', '--out', outPath, '--json'], {
      cwd: dir,
      reject: false,
    });

    const payload = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(payload.error).toMatchObject({
      code: 'CONFIG_ERROR',
      message: expect.stringContaining('Invalid AgentLoopKit config'),
    });
    await expect(readFile(outPath, 'utf8')).rejects.toThrow();
  });

  test('CLI rejects badge output paths outside the reports directory', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    const outPath = path.join(dir, 'outside-badge.svg');

    const result = await execa(tsxPath, [cliPath, 'badge', '--out', outPath, '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'OUTPUT_PATH_INVALID',
        message: `Badge output path must stay inside .agentloop/reports: ${outPath}`,
        artifactType: 'badge',
        requestedPath: outPath,
        expectedDir: '.agentloop/reports',
        expectedExtension: '.svg',
        reason: 'outside-directory',
      },
    });
    await expect(readFile(outPath, 'utf8')).rejects.toThrow();
  });

  test('CLI rejects badge output when the configured reports directory resolves outside the repo', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir();
    tempDirs.push(dir, outsideDir);
    await initializeAgentLoop({ cwd: dir });
    await rm(path.join(dir, '.agentloop/reports'), { recursive: true, force: true });
    await symlink(outsideDir, path.join(dir, '.agentloop/reports'), 'dir');

    const result = await execa(tsxPath, [cliPath, 'badge', '--json'], {
      cwd: dir,
      reject: false,
    });

    const output = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(output.error).toMatchObject({
      code: 'OUTPUT_PATH_INVALID',
      artifactType: 'badge',
      expectedDir: '.agentloop/reports',
      expectedExtension: '.svg',
      reason: 'outside-directory',
    });
    expect(output.error.requestedPath).toContain('.agentloop/reports/agentloop-verification.svg');
    expect(await readdir(outsideDir)).toEqual([]);
  });

  test('CLI rejects badge output paths with non-SVG extensions', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    const outPath = path.join(dir, '.agentloop/reports/review-status.txt');

    const result = await execa(tsxPath, [cliPath, 'badge', '--out', outPath, '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'OUTPUT_PATH_INVALID',
        message: `Badge output path must use .svg: ${outPath}`,
        artifactType: 'badge',
        requestedPath: outPath,
        expectedDir: '.agentloop/reports',
        expectedExtension: '.svg',
        reason: 'wrong-extension',
      },
    });
    await expect(readFile(outPath, 'utf8')).rejects.toThrow();
  });

  test('CLI prints a structured JSON error for an unsupported badge source', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });

    const result = await execa(
      tsxPath,
      [cliPath, 'badge', '--source', 'vibes', '--json'],
      {
        cwd: dir,
        reject: false,
      },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    const payload = JSON.parse(result.stdout);
    expect(payload).toEqual({
      error: {
        code: 'UNSUPPORTED_BADGE_SOURCE',
        message: 'Unsupported badge source "vibes".',
        requestedSource: 'vibes',
        supportedSources: ['verification', 'gates'],
      },
    });
  });

  test('CLI keeps human-readable output for an unsupported badge source without JSON', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });

    const result = await execa(tsxPath, [cliPath, 'badge', '--source', 'vibes'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain(
      'agentloop: Unsupported badge source. Use one of: verification, gates.',
    );
  });
});
