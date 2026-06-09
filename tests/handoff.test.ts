import { existsSync } from 'node:fs';
import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
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
});
