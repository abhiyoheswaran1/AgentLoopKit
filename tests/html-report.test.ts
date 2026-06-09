import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
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
});
