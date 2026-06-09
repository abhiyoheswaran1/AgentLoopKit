import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import { afterEach, describe, expect, test } from 'vitest';
import { makeTempDir, removeTempDir } from './helpers.js';
import { createDefaultConfig } from '../src/core/config.js';
import { runVerification } from '../src/core/verification.js';

let tempDirs: string[] = [];

describe('verification', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('runs configured commands and writes a markdown report', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({
      name: 'demo',
      type: 'generic',
      packageManager: 'npm',
      commands: {
        test: 'node -e "console.log(\\"ok\\")"',
        lint: '',
        typecheck: '',
        build: '',
        format: '',
      },
    });

    const result = await runVerification({
      cwd: dir,
      config,
      reportTimestamp: '2026-06-09-12-30',
      nowIso: '2026-06-09T12:30:00.000Z',
    });

    expect(result.overallStatus).toBe('pass');
    expect(result.commands).toHaveLength(1);
    expect(result.reportPath).toBe(
      path.join(dir, '.agentloop/reports/2026-06-09-12-30-verification-report.md'),
    );
    expect(result.markdown).toContain('Overall status: pass');
    expect(result.markdown).toContain('ok');
  });

  test('reports no verification when no commands are configured', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });

    const result = await runVerification({ cwd: dir, config, reportTimestamp: '2026-06-09-12-31' });

    expect(result.overallStatus).toBe('not-run');
    expect(result.markdown).toContain('No verification commands were configured');
  });

  test('preserves the beginning and end when command output is truncated', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const output = [
      'START: command setup context',
      ...Array.from({ length: 900 }, (_, index) => {
        return `middle-${String(index).padStart(4, '0')} ${'x'.repeat(32)}`;
      }),
      'END: assertion failed at final line',
    ].join('\n');
    await writeFile(
      path.join(dir, 'emit-output.mjs'),
      `console.log(${JSON.stringify(output)});\nprocess.exit(1);\n`,
    );
    const config = createDefaultConfig({
      name: 'demo',
      type: 'generic',
      packageManager: 'npm',
      commands: {
        test: 'node emit-output.mjs',
        lint: '',
        typecheck: '',
        build: '',
        format: '',
      },
    });

    const result = await runVerification({
      cwd: dir,
      config,
      reportTimestamp: '2026-06-09-12-32',
      nowIso: '2026-06-09T12:32:00.000Z',
    });

    expect(result.overallStatus).toBe('fail');
    expect(result.markdown).toContain('START: command setup context');
    expect(result.markdown).toContain('END: assertion failed at final line');
    expect(result.markdown).toContain('[output truncated: showing first');
    expect(result.markdown).not.toContain('middle-0450');
  });
});
