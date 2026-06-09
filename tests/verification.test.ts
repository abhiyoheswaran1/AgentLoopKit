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
    expect(result.markdown).not.toContain('## CI Context');
  });

  test('includes allowlisted GitHub Actions context in markdown reports', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });

    const result = await runVerification({
      cwd: dir,
      config,
      reportTimestamp: '2026-06-09-12-33',
      nowIso: '2026-06-09T12:33:00.000Z',
      env: {
        CI: 'true',
        GITHUB_ACTIONS: 'true',
        GITHUB_WORKFLOW: 'AgentLoop Verification',
        GITHUB_EVENT_NAME: 'pull_request',
        GITHUB_REF: 'refs/pull/42/merge',
        GITHUB_SHA: 'abcdef1234567890',
        GITHUB_REPOSITORY: 'acme/demo',
        GITHUB_RUN_ID: '123456789',
        GITHUB_RUN_ATTEMPT: '2',
        GITHUB_SERVER_URL: 'https://github.com',
        EXTRA_ENV_VALUE: 'do-not-print',
      },
    });

    expect(result.markdown).toContain('## CI Context');
    expect(result.markdown).toContain('- Provider: GitHub Actions');
    expect(result.markdown).toContain('- Workflow: AgentLoop Verification');
    expect(result.markdown).toContain('- Event: pull_request');
    expect(result.markdown).toContain('- Ref: refs/pull/42/merge');
    expect(result.markdown).toContain('- Commit: abcdef1234567890');
    expect(result.markdown).toContain('- Run URL: https://github.com/acme/demo/actions/runs/123456789');
    expect(result.markdown).toContain('- Run attempt: 2');
    expect(result.markdown).not.toContain('EXTRA_ENV_VALUE');
    expect(result.markdown).not.toContain('do-not-print');
  });

  test('includes minimal generic CI context without provider-specific fields', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });

    const result = await runVerification({
      cwd: dir,
      config,
      reportTimestamp: '2026-06-09-12-34',
      nowIso: '2026-06-09T12:34:00.000Z',
      env: {
        CI: 'true',
        GITHUB_WORKFLOW: 'ignored outside GitHub Actions',
      },
    });

    expect(result.markdown).toContain('## CI Context');
    expect(result.markdown).toContain('- Provider: Generic CI');
    expect(result.markdown).not.toContain('ignored outside GitHub Actions');
    expect(result.markdown).not.toContain('Run URL:');
  });

  test('keeps the process environment available when CI context is injected', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({
      name: 'demo',
      type: 'generic',
      packageManager: 'npm',
      commands: {
        test: 'node -e "console.log(\\"path-ok\\")"',
        lint: '',
        typecheck: '',
        build: '',
        format: '',
      },
    });

    const result = await runVerification({
      cwd: dir,
      config,
      reportTimestamp: '2026-06-09-12-35',
      nowIso: '2026-06-09T12:35:00.000Z',
      env: {
        CI: 'true',
      },
    });

    expect(result.overallStatus).toBe('pass');
    expect(result.markdown).toContain('path-ok');
    expect(result.markdown).toContain('- Provider: Generic CI');
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
