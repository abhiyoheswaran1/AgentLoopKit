import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { generateSvgBadge, writeEvidenceBadge } from '../src/core/badge.js';
import { createDefaultConfig } from '../src/core/config.js';
import { initializeAgentLoop } from '../src/core/init.js';
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
});
