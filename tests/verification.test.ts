import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { afterEach, describe, expect, test } from 'vitest';
import { makeTempDir, removeTempDir } from './helpers.js';
import { createDefaultConfig } from '../src/core/config.js';
import { runVerification } from '../src/core/verification.js';
import { execa } from 'execa';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

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
    expect(result.markdown).not.toContain('## Failure Summary');
    expect(result.markdown).toContain('ok');
  });

  test('reports no verification when no commands are configured', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });

    const result = await runVerification({
      cwd: dir,
      config,
      reportTimestamp: '2026-06-09-12-31',
      env: {},
    });

    expect(result.overallStatus).toBe('not-run');
    expect(result.markdown).toContain('No verification commands were configured');
    expect(result.markdown).not.toContain('## Failure Summary');
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

  test('summarizes failed commands before full output excerpts', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    await writeFile(
      path.join(dir, 'fail-late.mjs'),
      [
        'console.log("setup line");',
        'console.log("intermediate detail");',
        'console.error("ASSERTION: expected enabled to be true");',
        'console.error("STACK: demo.test.ts:42");',
        'process.exit(7);',
      ].join('\n'),
    );
    const config = createDefaultConfig({
      name: 'demo',
      type: 'generic',
      packageManager: 'npm',
      commands: {
        test: 'node fail-late.mjs',
        lint: '',
        typecheck: '',
        build: '',
        format: '',
      },
    });

    const result = await runVerification({
      cwd: dir,
      config,
      reportTimestamp: '2026-06-10-12-00',
      nowIso: '2026-06-10T12:00:00.000Z',
    });

    expect(result.overallStatus).toBe('fail');
    expect(result.markdown).toContain('## Failure Summary');
    expect(result.markdown).toContain('### test: `node fail-late.mjs`');
    expect(result.markdown).toContain('- Exit code: 7');
    expect(result.markdown).toContain('ASSERTION: expected enabled to be true');
    expect(result.markdown).toContain('STACK: demo.test.ts:42');
    expect(result.markdown.indexOf('## Failure Summary')).toBeLessThan(
      result.markdown.indexOf('## Commands Run'),
    );
    expect(result.markdown).toContain('## Commands Run');
    expect(result.markdown).toContain('setup line');
  });

  test('includes task context when a task path is provided', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/tasks/demo-task.md'),
      [
        '# Add billing webhook',
        '',
        '- Created date: 2026-06-10',
        '- Task type: feature',
        '- Status: in-progress',
        '',
      ].join('\n'),
    );
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
      taskPath: '.agentloop/tasks/demo-task.md',
      reportTimestamp: '2026-06-10-12-01',
      nowIso: '2026-06-10T12:01:00.000Z',
    });

    expect(result.markdown).toContain('## Task Context');
    expect(result.markdown).toContain('- Path: .agentloop/tasks/demo-task.md');
    expect(result.markdown).toContain('- Title: Add billing webhook');
    expect(result.markdown).toContain('- Task type: feature');
    expect(result.markdown).toContain('- Status: in-progress');
    expect(result.markdown.indexOf('## Task Context')).toBeLessThan(
      result.markdown.indexOf('## Commands Run'),
    );
  });

  test('reports missing task context without failing configured commands', async () => {
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
      taskPath: '.agentloop/tasks/missing.md',
      reportTimestamp: '2026-06-10-12-02',
      nowIso: '2026-06-10T12:02:00.000Z',
    });

    expect(result.overallStatus).toBe('pass');
    expect(result.markdown).toContain('## Task Context');
    expect(result.markdown).toContain('- Path: .agentloop/tasks/missing.md');
    expect(result.markdown).toContain('- Status: unavailable');
    expect(result.markdown).toContain('Task file could not be read.');
  });

  test('does not read env files passed as task paths', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeFile(
      path.join(dir, '.env'),
      ['# Secret Title', '- Task type: feature', '- Status: leaked', ''].join('\n'),
    );
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
      taskPath: '.env',
      reportTimestamp: '2026-06-10-12-03',
      nowIso: '2026-06-10T12:03:00.000Z',
    });

    expect(result.overallStatus).toBe('pass');
    expect(result.markdown).toContain('## Task Context');
    expect(result.markdown).toContain('- Path: .env');
    expect(result.markdown).toContain('- Status: unavailable');
    expect(result.markdown).toContain('Task path must point to a Markdown task contract.');
    expect(result.markdown).not.toContain('Secret Title');
    expect(result.markdown).not.toContain('leaked');
  });

  test('CLI verify wires --task into the written report', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    await writeFile(
      path.join(dir, 'agentloop.config.json'),
      JSON.stringify(
        createDefaultConfig({
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
        }),
        null,
        2,
      ),
    );
    await writeFile(
      path.join(dir, '.agentloop/tasks/demo-task.md'),
      ['# CLI task context', '', '- Task type: docs', '- Status: review', ''].join('\n'),
    );

    const result = await execa(
      tsxPath,
      [cliPath, 'verify', '--task', '.agentloop/tasks/demo-task.md'],
      { cwd: dir },
    );
    const reportPath = result.stdout.match(/Verification report written: (.+)/)?.[1];
    expect(reportPath).toBeTruthy();
    const markdown = await readFile(reportPath as string, 'utf8');
    expect(markdown).toContain('## Task Context');
    expect(markdown).toContain('- Title: CLI task context');
    expect(markdown).toContain('- Task type: docs');
    expect(markdown).toContain('- Status: review');
  });
});
