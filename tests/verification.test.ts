import path from 'node:path';
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
});
