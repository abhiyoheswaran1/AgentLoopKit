import { existsSync } from 'node:fs';
import path from 'node:path';
import { mkdir, readdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { initializeAgentLoop } from '../src/core/init.js';
import { generateHtmlReport, writeHtmlReport } from '../src/core/html-report.js';
import { makeTempDir, removeTempDir } from './helpers.js';

let tempDirs: string[] = [];

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

describe('HTML report generation', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('escapes task, verification, handoff, and git-derived text', () => {
    const report = generateHtmlReport({
      timestamp: '2026-06-10-12-30',
      repoName: 'demo <repo>',
      branch: 'main<script>',
      commit: 'abc123',
      workingTreeStatus: 'dirty',
      taskPath: '.agentloop/tasks/evil.md',
      verificationPath: '.agentloop/reports/evil.md',
      handoffPath: '.agentloop/handoffs/evil.md',
      changedFiles: [{ status: 'M', path: 'src/<script>.ts' }],
      diffStat: '1 file changed <unsafe>',
      taskMarkdown: '# Add <script>alert("x")</script>\n',
      verificationMarkdown: '# Verification Report\n\nOverall status: fail<script>\n',
      handoffMarkdown: '# PR Summary\n\nReviewer note <img src=x onerror=alert(1)>\n',
      summaryMarkdown: '# PR Summary\n\n## Review Focus\n- Check <danger>\n',
    });

    expect(report.html).toContain('Add &lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
    expect(report.html).toContain('main&lt;script&gt;');
    expect(report.html).toContain('src/&lt;script&gt;.ts');
    expect(report.html).toContain('Overall status: fail&lt;script&gt;');
    expect(report.html).toContain('Reviewer note &lt;img src=x onerror=alert(1)&gt;');
    expect(report.html).not.toContain('<script>alert');
    expect(report.html).not.toContain('<img src=x');
  });

  test('writes a local static report from repo artifacts', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    await writeFile(path.join(dir, 'src.ts'), 'export const value = 1;\n');
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-10-demo-task.md'),
      '# Demo task\n\n- Status: in-progress\n',
    );
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-10-12-00-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );
    await mkdir(path.join(dir, '.agentloop/handoffs'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/handoffs/2026-06-10-12-05-pr-summary.md'),
      '# PR Summary\n\n## Review Focus\n- Review source changes.\n',
    );

    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
    const result = await writeHtmlReport({
      cwd: dir,
      config,
      timestamp: '2026-06-10-12-30',
      nowIso: '2026-06-10T12:30:00.000Z',
    });
    const html = await readFile(result.outPath, 'utf8');

    expect(path.basename(result.outPath)).toBe('2026-06-10-12-30-agentloop-report.html');
    expect(result.metadata.taskTitle).toBe('Demo task');
    expect(result.metadata.verificationStatus).toBe('pass');
    expect(result.metadata.changedFileCount).toBeGreaterThan(0);
    expect(html).toContain('<title>AgentLoopKit Report - demo</title>');
    expect(html).toContain('Demo task');
    expect(html).toContain('Overall status: pass');
    expect(html).toContain('Review source changes.');
  });

  test('CLI report command supports JSON output and custom output path', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-10-cli-task.md'),
      '# CLI task\n\n- Status: in-progress\n',
    );

    const outPath = path.join(dir, '.agentloop/reports/custom-report.html');
    const result = await execa(tsxPath, [cliPath, 'report', '--out', outPath, '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const payload = JSON.parse(result.stdout);
    expect(payload.outPath).toBe(outPath);
    expect(payload.metadata.taskTitle).toBe('CLI task');
    expect(payload.sourcePaths.handoff).toBeUndefined();
    expect(payload.html).toBeUndefined();
    expect(await readFile(outPath, 'utf8')).toContain('CLI task');
  });

  test('CLI report command prints invalid config errors as JSON without writing', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await writeFile(path.join(dir, 'agentloop.config.json'), '{"version":2}');

    const outPath = path.join(dir, '.agentloop/reports/custom-report.html');
    const result = await execa(tsxPath, [cliPath, 'report', '--out', outPath, '--json'], {
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
    expect(existsSync(outPath)).toBe(false);
  });

  test('CLI report command rejects output paths outside the reports directory', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    const outPath = path.join(dir, 'outside-report.html');

    const result = await execa(tsxPath, [cliPath, 'report', '--out', outPath, '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'OUTPUT_PATH_INVALID',
        message: `Report output path must stay inside .agentloop/reports: ${outPath}`,
        artifactType: 'report',
        requestedPath: outPath,
        expectedDir: '.agentloop/reports',
        expectedExtension: '.html',
        reason: 'outside-directory',
      },
    });
    expect(existsSync(outPath)).toBe(false);
  });

  test('CLI report command rejects output when the configured reports directory resolves outside the repo', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir();
    tempDirs.push(dir, outsideDir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    await rm(path.join(dir, '.agentloop/reports'), { recursive: true, force: true });
    await symlink(outsideDir, path.join(dir, '.agentloop/reports'), 'dir');

    const result = await execa(tsxPath, [cliPath, 'report', '--json'], {
      cwd: dir,
      reject: false,
    });

    const output = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(output.error).toMatchObject({
      code: 'OUTPUT_PATH_INVALID',
      artifactType: 'report',
      expectedDir: '.agentloop/reports',
      expectedExtension: '.html',
      reason: 'outside-directory',
    });
    expect(output.error.requestedPath).toContain('.agentloop/reports/');
    expect(output.error.requestedPath).toContain('-agentloop-report.html');
    expect(await readdir(outsideDir)).toEqual([]);
  });

  test('CLI report command rejects output paths with non-HTML extensions', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    const outPath = path.join(dir, '.agentloop/reports/custom-report.txt');

    const result = await execa(tsxPath, [cliPath, 'report', '--out', outPath, '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'OUTPUT_PATH_INVALID',
        message: `Report output path must use .html: ${outPath}`,
        artifactType: 'report',
        requestedPath: outPath,
        expectedDir: '.agentloop/reports',
        expectedExtension: '.html',
        reason: 'wrong-extension',
      },
    });
    expect(existsSync(outPath)).toBe(false);
  });

  test('CLI report command accepts --verification as an alias for --report', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    await writeFile(
      path.join(dir, '.agentloop/reports/manual-verification.md'),
      '# Verification Report\n\nOverall status: custom-pass\n',
    );

    const outPath = path.join(dir, '.agentloop/reports/custom-report.html');
    const result = await execa(
      tsxPath,
      [
        cliPath,
        'report',
        '--verification',
        '.agentloop/reports/manual-verification.md',
        '--out',
        outPath,
        '--json',
      ],
      { cwd: dir },
    );

    const payload = JSON.parse(result.stdout);
    expect(payload.metadata.verificationStatus).toBe('custom-pass');
    expect(payload.sourcePaths.verification).toBe('.agentloop/reports/manual-verification.md');
    expect(await readFile(outPath, 'utf8')).toContain('Overall status: custom-pass');
  });

  test('CLI report command prints explicit missing handoff paths as JSON errors without writing', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });

    const outPath = path.join(dir, '.agentloop/reports/custom-report.html');
    const result = await execa(
      tsxPath,
      [cliPath, 'report', '--handoff', '.agentloop/handoffs/missing.md', '--out', outPath, '--json'],
      { cwd: dir, reject: false },
    );

    const payload = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(payload).toEqual({
      error: {
        code: 'ARTIFACT_PATH_INVALID',
        message: 'Handoff artifact not found: .agentloop/handoffs/missing.md',
        artifactType: 'handoff',
        requestedPath: '.agentloop/handoffs/missing.md',
        expectedDir: '.agentloop/handoffs',
        reason: 'missing',
      },
    });
    expect(existsSync(outPath)).toBe(false);
  });
});
