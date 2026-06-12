import path from 'node:path';
import { access, mkdir, readdir, readFile, symlink, writeFile } from 'node:fs/promises';
import { afterEach, describe, expect, test } from 'vitest';
import { makeTempDir, removeTempDir } from './helpers.js';
import { createDefaultConfig } from '../src/core/config.js';
import { inlineCode } from '../src/core/markdown-format.js';
import { runVerification } from '../src/core/verification.js';
import { execa } from 'execa';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

function unwrapInlineCode(value: string) {
  const fence = value.match(/^`+/)?.[0] ?? '';
  if (!fence || !value.endsWith(fence)) return value;
  const unwrapped = value.slice(fence.length, -fence.length);
  if (unwrapped.startsWith(' ') && unwrapped.endsWith(' ')) return unwrapped.slice(1, -1);
  return unwrapped;
}

function extractWrittenVerificationReportPath(stdout: string) {
  const rawPath = stdout.match(/Verification report written: (.+)/)?.[1];
  return rawPath ? unwrapInlineCode(rawPath) : undefined;
}

function resolveOutputPath(cwd: string, filePath: string) {
  return path.isAbsolute(filePath) ? filePath : path.join(cwd, filePath);
}

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

  test('emits bounded progress events for executed verification commands', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const events: Array<Record<string, unknown>> = [];
    const config = createDefaultConfig({
      name: 'demo',
      type: 'generic',
      packageManager: 'npm',
      commands: {
        test: 'node -e "console.log(\\"test-ok\\")"',
        lint: 'node -e "console.log(\\"lint-ok\\")"',
        typecheck: '',
        build: '',
        format: '',
      },
    });

    const result = await runVerification({
      cwd: dir,
      config,
      reportTimestamp: '2026-06-12-17-30',
      nowIso: '2026-06-12T17:30:00.000Z',
      onProgress: (event) => events.push(event),
    });

    expect(result.overallStatus).toBe('pass');
    expect(events).toHaveLength(4);
    expect(events[0]).toEqual({
      event: 'start',
      index: 1,
      total: 2,
      key: 'test',
      command: 'node -e "console.log(\\"test-ok\\")"',
    });
    expect(events[1]).toMatchObject({
      event: 'finish',
      index: 1,
      total: 2,
      key: 'test',
      command: 'node -e "console.log(\\"test-ok\\")"',
      status: 'pass',
      exitCode: 0,
    });
    expect(events[1].durationMs).toEqual(expect.any(Number));
    expect(events[2]).toMatchObject({
      event: 'start',
      index: 2,
      total: 2,
      key: 'lint',
    });
    expect(events[3]).toMatchObject({
      event: 'finish',
      index: 2,
      total: 2,
      key: 'lint',
      status: 'pass',
      exitCode: 0,
    });
    expect(events[3].durationMs).toEqual(expect.any(Number));
  });

  test('formats report metadata values as safe inline Markdown', async () => {
    const dir = await makeTempDir();
    const repoDir = path.join(dir, 'demo`repo');
    tempDirs.push(dir);
    await mkdir(repoDir, { recursive: true });
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
      cwd: repoDir,
      config,
      reportTimestamp: '2026-06-09-12-32',
      nowIso: '2026-06-09T12:32:00.000Z',
    });

    expect(result.markdown).toContain(`- Timestamp: ${inlineCode('2026-06-09T12:32:00.000Z')}`);
    expect(result.markdown).toContain(`- Repo: ${inlineCode('demo`repo')}`);
    expect(result.markdown).toContain(`- Git branch: ${inlineCode('not available')}`);
    expect(result.markdown).toContain(`- Git commit: ${inlineCode('not available')}`);
    expect(result.markdown).toContain(`- Working tree: ${inlineCode('clean or unavailable')}`);
    expect(result.markdown).toContain('- Overall status: pass');
  });

  test('writes verification reports to the parent AgentLoop root when run from a nested directory', async () => {
    const dir = await makeTempDir();
    const nested = path.join(dir, 'src', 'features');
    tempDirs.push(dir);
    await mkdir(nested, { recursive: true });
    const config = createDefaultConfig({
      name: 'root-demo',
      type: 'generic',
      packageManager: 'npm',
      commands: {
        test: 'node -e "console.log(\\"nested-ok\\")"',
        lint: '',
        typecheck: '',
        build: '',
        format: '',
      },
    });
    await writeFile(path.join(dir, 'agentloop.config.json'), JSON.stringify(config, null, 2));

    const result = await execa(tsxPath, [cliPath, 'verify', '--json'], {
      cwd: nested,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.reportPath).toMatch(/\.agentloop\/reports\/.+-verification-report\.md$/);
    expect(output.reportPath).not.toContain(dir);
    expect(output.reportPath).not.toContain(nested);
    await expect(readFile(path.join(dir, output.reportPath), 'utf8')).resolves.toContain('nested-ok');
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
    expect(result.markdown).toContain('- Workflow: `AgentLoop Verification`');
    expect(result.markdown).toContain('- Event: `pull_request`');
    expect(result.markdown).toContain('- Ref: `refs/pull/42/merge`');
    expect(result.markdown).toContain('- Commit: `abcdef1234567890`');
    expect(result.markdown).toContain(
      '- Run URL: `https://github.com/acme/demo/actions/runs/123456789`',
    );
    expect(result.markdown).toContain('- Run attempt: `2`');
    expect(result.markdown).not.toContain('EXTRA_ENV_VALUE');
    expect(result.markdown).not.toContain('do-not-print');
  });

  test('uses markdown-safe inline code for CI metadata containing backticks', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });

    const result = await runVerification({
      cwd: dir,
      config,
      reportTimestamp: '2026-06-09-12-35',
      nowIso: '2026-06-09T12:35:00.000Z',
      env: {
        GITHUB_ACTIONS: 'true',
        GITHUB_WORKFLOW: 'CI `nightly`',
        GITHUB_EVENT_NAME: 'pull_request',
        GITHUB_REF: 'refs/heads/feature/`agentloop`',
        GITHUB_SHA: 'abcdef1234567890',
        GITHUB_REPOSITORY: 'acme/demo',
        GITHUB_RUN_ID: '123456789',
        GITHUB_RUN_ATTEMPT: '2',
        GITHUB_SERVER_URL: 'https://github.com',
      },
    });

    expect(result.markdown).toContain('- Workflow: `` CI `nightly` ``');
    expect(result.markdown).toContain('- Ref: `` refs/heads/feature/`agentloop` ``');
  });

  test('includes allowlisted GitLab CI context in markdown reports', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });

    const result = await runVerification({
      cwd: dir,
      config,
      reportTimestamp: '2026-06-09-12-36',
      nowIso: '2026-06-09T12:36:00.000Z',
      env: {
        CI: 'true',
        GITLAB_CI: 'true',
        CI_PROJECT_PATH: 'acme/demo',
        CI_PIPELINE_SOURCE: 'merge_request_event',
        CI_COMMIT_REF_NAME: 'feature/agentloop',
        CI_COMMIT_SHA: '1234567890abcdef',
        CI_PIPELINE_URL: 'https://gitlab.com/acme/demo/-/pipelines/123',
        UNRELATED_ENV_VALUE: 'redacted-fixture-value',
        EXTRA_ENV_VALUE: 'do-not-print-extra',
      },
    });

    expect(result.markdown).toContain('## CI Context');
    expect(result.markdown).toContain('- Provider: GitLab CI');
    expect(result.markdown).toContain('- Workflow: `acme/demo`');
    expect(result.markdown).toContain('- Event: `merge_request_event`');
    expect(result.markdown).toContain('- Ref: `feature/agentloop`');
    expect(result.markdown).toContain('- Commit: `1234567890abcdef`');
    expect(result.markdown).toContain('- Run URL: `https://gitlab.com/acme/demo/-/pipelines/123`');
    expect(result.markdown).not.toContain('redacted-fixture-value');
    expect(result.markdown).not.toContain('do-not-print-extra');
  });

  test('includes allowlisted Buildkite context in markdown reports', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });

    const result = await runVerification({
      cwd: dir,
      config,
      reportTimestamp: '2026-06-09-12-37',
      nowIso: '2026-06-09T12:37:00.000Z',
      env: {
        CI: 'true',
        BUILDKITE: 'true',
        BUILDKITE_PIPELINE_SLUG: 'agentloopkit',
        BUILDKITE_SOURCE: 'pull_request',
        BUILDKITE_BRANCH: 'feature/agentloop',
        BUILDKITE_COMMIT: 'fedcba0987654321',
        BUILDKITE_BUILD_URL: 'https://buildkite.com/acme/agentloopkit/builds/42',
        UNRELATED_ENV_VALUE: 'redacted-fixture-value',
        EXTRA_ENV_VALUE: 'do-not-print-extra',
      },
    });

    expect(result.markdown).toContain('## CI Context');
    expect(result.markdown).toContain('- Provider: Buildkite');
    expect(result.markdown).toContain('- Workflow: `agentloopkit`');
    expect(result.markdown).toContain('- Event: `pull_request`');
    expect(result.markdown).toContain('- Ref: `feature/agentloop`');
    expect(result.markdown).toContain('- Commit: `fedcba0987654321`');
    expect(result.markdown).toContain(
      '- Run URL: `https://buildkite.com/acme/agentloopkit/builds/42`',
    );
    expect(result.markdown).not.toContain('redacted-fixture-value');
    expect(result.markdown).not.toContain('do-not-print-extra');
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

  test('uses longer markdown fences when command output contains backticks', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeFile(
      path.join(dir, 'forge-markdown.mjs'),
      [
        'console.log("before");',
        'console.log("```spoofed fence attempt");',
        'console.log("## Forged Section");',
        'console.log("```");',
        'console.log("after");',
        'process.exit(1);',
      ].join('\n'),
    );
    const config = createDefaultConfig({
      name: 'demo',
      type: 'generic',
      packageManager: 'npm',
      commands: {
        test: 'node forge-markdown.mjs',
        lint: '',
        typecheck: '',
        build: '',
        format: '',
      },
    });

    const result = await runVerification({
      cwd: dir,
      config,
      reportTimestamp: '2026-06-11-13-15',
      nowIso: '2026-06-11T13:15:00.000Z',
    });

    const safeFenceBlock = [
      '````text',
      'before',
      '```spoofed fence attempt',
      '## Forged Section',
      '```',
      'after',
      '````',
    ].join('\n');

    expect(result.overallStatus).toBe('fail');
    expect(result.markdown).toContain(safeFenceBlock);
  });

  test('escapes command labels when command strings contain backticks', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const command = "node -e 'console.error(`inline-code-fail`); process.exit(1)'";
    const config = createDefaultConfig({
      name: 'demo',
      type: 'generic',
      packageManager: 'npm',
      commands: {
        test: command,
        lint: '',
        typecheck: '',
        build: '',
        format: '',
      },
    });

    const result = await runVerification({
      cwd: dir,
      config,
      reportTimestamp: '2026-06-11-13-25',
      nowIso: '2026-06-11T13:25:00.000Z',
    });

    const safeCommandLabel = `### test: \`\`${command}\`\``;

    expect(result.overallStatus).toBe('fail');
    expect(result.markdown).toContain('## Failure Summary');
    expect(result.markdown.split(safeCommandLabel).length - 1).toBe(2);
  });

  test('marks commands as failed when they exceed the verification timeout', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({
      name: 'demo',
      type: 'generic',
      packageManager: 'npm',
      commands: {
        test: 'node -e "setTimeout(() => {}, 1000)"',
        lint: '',
        typecheck: '',
        build: '',
        format: '',
      },
    });

    const result = await runVerification({
      cwd: dir,
      config,
      reportTimestamp: '2026-06-11-12-45',
      nowIso: '2026-06-11T12:45:00.000Z',
      timeoutMs: 50,
    });

    expect(result.overallStatus).toBe('fail');
    expect(result.commands[0]).toMatchObject({
      key: 'test',
      passed: false,
      timedOut: true,
    });
    expect(result.markdown).toContain('Timed out: yes');
    expect(result.markdown).toContain('Command timed out after 50ms.');
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
    expect(result.markdown).toContain(`- Path: ${inlineCode('.agentloop/tasks/demo-task.md')}`);
    expect(result.markdown).toContain(`- Title: ${inlineCode('Add billing webhook')}`);
    expect(result.markdown).toContain(`- Task type: ${inlineCode('feature')}`);
    expect(result.markdown).toContain(`- Status: ${inlineCode('in-progress')}`);
    expect(result.markdown.indexOf('## Task Context')).toBeLessThan(
      result.markdown.indexOf('## Commands Run'),
    );
  });

  test('formats task context metadata as safe inline Markdown', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    const taskPath = '.agentloop/tasks/demo`task.md';
    await writeFile(
      path.join(dir, taskPath),
      [
        '# Add `billing` webhook',
        '',
        '- Created date: 2026-06-10',
        '- Task type: feature`flag',
        '- Status: review`ready',
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
      taskPath,
      reportTimestamp: '2026-06-10-12-04',
      nowIso: '2026-06-10T12:04:00.000Z',
    });

    expect(result.markdown).toContain(`- Path: ${inlineCode(taskPath)}`);
    expect(result.markdown).toContain(`- Title: ${inlineCode('Add `billing` webhook')}`);
    expect(result.markdown).toContain(`- Task type: ${inlineCode('feature`flag')}`);
    expect(result.markdown).toContain(`- Status: ${inlineCode('review`ready')}`);
  });

  test('does not run task verification commands unless explicitly requested', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/tasks/task-commands.md'),
      [
        '# Task command safety',
        '',
        '- Task type: docs',
        '- Status: in-progress',
        '',
        '## Verification Commands',
        "- node -e \"require('fs').writeFileSync('task-command-ran.txt', 'yes')\"",
        '',
      ].join('\n'),
    );
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });

    const result = await runVerification({
      cwd: dir,
      config,
      taskPath: '.agentloop/tasks/task-commands.md',
      reportTimestamp: '2026-06-10-12-05',
      nowIso: '2026-06-10T12:05:00.000Z',
    });

    expect(result.overallStatus).toBe('not-run');
    expect(result.taskCommands).toEqual({ requested: false, foundCount: 0, commands: [] });
    await expect(access(path.join(dir, 'task-command-ran.txt'))).rejects.toThrow();
  });

  test('runs task verification commands with explicit opt-in', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/tasks/task-commands.md'),
      [
        '# Task command opt-in',
        '',
        '- Task type: docs',
        '- Status: in-progress',
        '',
        '## Verification Commands',
        "- node -e \"require('fs').writeFileSync('task-command-ran.txt', 'yes'); console.log('task-check')\"",
        '',
      ].join('\n'),
    );
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });

    const result = await runVerification({
      cwd: dir,
      config,
      taskPath: '.agentloop/tasks/task-commands.md',
      taskCommands: true,
      reportTimestamp: '2026-06-10-12-06',
      nowIso: '2026-06-10T12:06:00.000Z',
    });

    expect(result.overallStatus).toBe('pass');
    expect(result.taskCommands).toEqual({
      requested: true,
      foundCount: 1,
      commands: [
        "node -e \"require('fs').writeFileSync('task-command-ran.txt', 'yes'); console.log('task-check')\"",
      ],
    });
    expect(result.commands).toEqual([
      expect.objectContaining({
        key: 'task',
        command:
          "node -e \"require('fs').writeFileSync('task-command-ran.txt', 'yes'); console.log('task-check')\"",
        passed: true,
      }),
    ]);
    expect(result.markdown).toContain('### task: `node -e');
    expect(result.markdown).not.toContain(
      'Task verification commands were requested, but none were found.',
    );
    expect(await readFile(path.join(dir, 'task-command-ran.txt'), 'utf8')).toBe('yes');
  });

  test('runs exact duplicate configured and task commands only once', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const duplicateCommand = 'node duplicate-command.mjs';
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    await writeFile(
      path.join(dir, 'duplicate-command.mjs'),
      [
        "import { readFileSync, writeFileSync } from 'node:fs';",
        "const path = 'duplicate-count.txt';",
        "const current = Number(readFileSync(path, 'utf8') || '0');",
        'writeFileSync(path, String(current + 1));',
        '',
      ].join('\n'),
    );
    await writeFile(path.join(dir, 'duplicate-count.txt'), '0');
    await writeFile(
      path.join(dir, '.agentloop/tasks/task-commands.md'),
      [
        '# Duplicate command opt-in',
        '',
        '- Task type: tests',
        '- Status: in-progress',
        '',
        '## Verification Commands',
        `- ${duplicateCommand}`,
        '',
      ].join('\n'),
    );
    const config = createDefaultConfig({
      name: 'demo',
      type: 'generic',
      packageManager: 'npm',
      commands: {
        test: duplicateCommand,
        lint: '',
        typecheck: '',
        build: '',
        format: '',
      },
    });

    const result = await runVerification({
      cwd: dir,
      config,
      taskPath: '.agentloop/tasks/task-commands.md',
      taskCommands: true,
      reportTimestamp: '2026-06-12-19-15',
      nowIso: '2026-06-12T19:15:00.000Z',
    });

    expect(result.overallStatus).toBe('pass');
    expect(result.taskCommands).toEqual({
      requested: true,
      foundCount: 1,
      commands: [duplicateCommand],
    });
    expect(result.skippedDuplicateCommands).toEqual([
      {
        command: duplicateCommand,
        originalKey: 'test',
        duplicateKey: 'task',
      },
    ]);
    expect(result.commands).toEqual([
      expect.objectContaining({ key: 'test', command: duplicateCommand, passed: true }),
    ]);
    expect(result.markdown).toContain('## Duplicate Commands');
    expect(result.markdown).toContain(
      '- Skipped duplicate `task` command `node duplicate-command.mjs`; already selected as `test`.',
    );
    expect(await readFile(path.join(dir, 'duplicate-count.txt'), 'utf8')).toBe('1');
  });

  test('does not run post-verification gates with task verification commands', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/tasks/task-commands.md'),
      [
        '# Task command opt-in',
        '',
        '- Task type: docs',
        '- Status: in-progress',
        '',
        '## Verification Commands',
        "- node -e \"require('fs').writeFileSync('task-command-ran.txt', 'yes')\"",
        '',
        '## Post-Verification Gates',
        "- node -e \"require('fs').writeFileSync('post-verification-ran.txt', 'yes')\"",
        '',
      ].join('\n'),
    );
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });

    const result = await runVerification({
      cwd: dir,
      config,
      taskPath: '.agentloop/tasks/task-commands.md',
      taskCommands: true,
      reportTimestamp: '2026-06-10-12-07',
      nowIso: '2026-06-10T12:07:00.000Z',
    });

    expect(result.overallStatus).toBe('pass');
    expect(result.taskCommands).toEqual({
      requested: true,
      foundCount: 1,
      commands: ["node -e \"require('fs').writeFileSync('task-command-ran.txt', 'yes')\""],
    });
    await expect(readFile(path.join(dir, 'task-command-ran.txt'), 'utf8')).resolves.toBe('yes');
    await expect(access(path.join(dir, 'post-verification-ran.txt'))).rejects.toThrow();
  });

  test('reports when task verification commands are requested but absent', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/tasks/no-task-commands.md'),
      [
        '# No task commands',
        '',
        '- Task type: docs',
        '- Status: in-progress',
        '',
        '## Verification Commands',
        '- No verification command recorded.',
        '',
      ].join('\n'),
    );
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });

    const result = await runVerification({
      cwd: dir,
      config,
      taskPath: '.agentloop/tasks/no-task-commands.md',
      taskCommands: true,
      reportTimestamp: '2026-06-10-12-08',
      nowIso: '2026-06-10T12:08:00.000Z',
    });

    expect(result.overallStatus).toBe('not-run');
    expect(result.taskCommands).toEqual({ requested: true, foundCount: 0, commands: [] });
    expect(result.markdown).toContain('## Task Commands');
    expect(result.markdown).toContain(
      'Task verification commands were requested, but none were found in the task contract.',
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
    expect(result.markdown).toContain(`- Path: ${inlineCode('.agentloop/tasks/missing.md')}`);
    expect(result.markdown).toContain(`- Status: ${inlineCode('unavailable')}`);
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
    expect(result.markdown).toContain(`- Path: ${inlineCode('.env')}`);
    expect(result.markdown).toContain(`- Status: ${inlineCode('unavailable')}`);
    expect(result.markdown).toContain('Task path must point to a Markdown task contract.');
    expect(result.markdown).not.toContain('Secret Title');
    expect(result.markdown).not.toContain('leaked');
  });

  test('does not read markdown task paths outside the configured tasks directory', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir();
    tempDirs.push(dir, outsideDir);
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    await writeFile(
      path.join(outsideDir, 'outside-task.md'),
      ['# Outside Secret Task', '- Task type: feature', '- Status: leaked', ''].join('\n'),
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
      taskPath: path.join(outsideDir, 'outside-task.md'),
      reportTimestamp: '2026-06-10-12-04',
      nowIso: '2026-06-10T12:04:00.000Z',
    });

    expect(result.overallStatus).toBe('pass');
    expect(result.markdown).toContain('## Task Context');
    expect(result.markdown).toContain(`- Status: ${inlineCode('unavailable')}`);
    expect(result.markdown).toContain('Task path must point to a Markdown task contract.');
    expect(result.markdown).not.toContain('Outside Secret Task');
    expect(result.markdown).not.toContain('leaked');
  });

  test('does not run task commands from markdown paths outside the configured tasks directory', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir();
    tempDirs.push(dir, outsideDir);
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    await writeFile(
      path.join(outsideDir, 'outside-task.md'),
      [
        '# Outside Command Task',
        '',
        '## Verification Commands',
        "- node -e \"require('fs').writeFileSync('outside-command-ran.txt', 'yes')\"",
        '',
      ].join('\n'),
    );
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });

    const result = await runVerification({
      cwd: dir,
      config,
      taskPath: path.join(outsideDir, 'outside-task.md'),
      taskCommands: true,
      reportTimestamp: '2026-06-10-12-07',
      nowIso: '2026-06-10T12:07:00.000Z',
    });

    expect(result.overallStatus).toBe('not-run');
    expect(result.taskCommands).toEqual({ requested: true, foundCount: 0, commands: [] });
    expect(result.markdown).toContain('Task path must point to a Markdown task contract.');
    expect(result.markdown).not.toContain('Outside Command Task');
    await expect(access(path.join(dir, 'outside-command-ran.txt'))).rejects.toThrow();
  });

  test('does not read or run task commands through symlinked task subdirectories', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir();
    tempDirs.push(dir, outsideDir);
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    await writeFile(
      path.join(outsideDir, 'outside-task.md'),
      [
        '# Outside Symlink Task',
        '- Task type: feature',
        '- Status: leaked',
        '',
        '## Verification Commands',
        "- node -e \"require('fs').writeFileSync('symlink-command-ran.txt', 'yes')\"",
        '',
      ].join('\n'),
    );
    await symlink(outsideDir, path.join(dir, '.agentloop/tasks/outside-link'), 'dir');
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });

    const result = await runVerification({
      cwd: dir,
      config,
      taskPath: '.agentloop/tasks/outside-link/outside-task.md',
      taskCommands: true,
      reportTimestamp: '2026-06-10-12-08',
      nowIso: '2026-06-10T12:08:00.000Z',
    });

    expect(result.overallStatus).toBe('not-run');
    expect(result.taskCommands).toEqual({ requested: true, foundCount: 0, commands: [] });
    expect(result.markdown).toContain('Task path must point to a Markdown task contract.');
    expect(result.markdown).not.toContain('Outside Symlink Task');
    expect(result.markdown).not.toContain('leaked');
    await expect(access(path.join(dir, 'symlink-command-ran.txt'))).rejects.toThrow();
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
    const reportPath = extractWrittenVerificationReportPath(result.stdout);
    expect(reportPath).toBeTruthy();
    expect(reportPath).not.toContain(dir);
    const markdown = await readFile(resolveOutputPath(dir, reportPath as string), 'utf8');
    expect(markdown).toContain('## Task Context');
    expect(markdown).toContain(`- Title: ${inlineCode('CLI task context')}`);
    expect(markdown).toContain(`- Task type: ${inlineCode('docs')}`);
    expect(markdown).toContain(`- Status: ${inlineCode('review')}`);
  });

  test('CLI verify prints report path and status with Markdown-safe inline values', async () => {
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
    config.paths.reportsDir = '.agentloop/reports`safe';
    await writeFile(path.join(dir, 'agentloop.config.json'), JSON.stringify(config, null, 2));

    const result = await execa(tsxPath, [cliPath, 'verify'], { cwd: dir });

    expect(result.stdout).toContain('Verification report written:');
    expect(result.stdout).toContain(config.paths.reportsDir);
    expect(result.stdout).not.toContain(dir);
    expect(result.stdout).toContain(`Overall status: ${inlineCode('pass')}`);
  });

  test('CLI verify --progress prints bounded command progress without raw command output', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeFile(
      path.join(dir, 'emit-hidden-output.mjs'),
      "console.log('raw-child-output-hidden-from-progress');\n",
    );
    await writeFile(
      path.join(dir, 'agentloop.config.json'),
      JSON.stringify(
        createDefaultConfig({
          name: 'demo',
          type: 'generic',
          packageManager: 'npm',
          commands: {
            test: 'node emit-hidden-output.mjs',
            lint: 'node -e "console.log(\\"lint-ok\\")"',
            typecheck: '',
            build: '',
            format: '',
          },
        }),
        null,
        2,
      ),
    );

    const result = await execa(tsxPath, [cliPath, 'verify', '--progress'], { cwd: dir });

    expect(result.stdout).toContain('[1/2] test started: `node emit-hidden-output.mjs`');
    expect(result.stdout).toMatch(/\[1\/2\] test passed in \d+ms/);
    expect(result.stdout).toContain('[2/2] lint started: `node -e "console.log(\\"lint-ok\\")"`');
    expect(result.stdout).toMatch(/\[2\/2\] lint passed in \d+ms/);
    expect(result.stdout).toContain('Verification report written:');
    expect(result.stdout).toContain(`Overall status: ${inlineCode('pass')}`);
    expect(result.stdout).not.toContain('raw-child-output-hidden-from-progress');
  });

  test('CLI verify --json suppresses progress output even when --progress is provided', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeFile(
      path.join(dir, 'agentloop.config.json'),
      JSON.stringify(
        createDefaultConfig({
          name: 'demo',
          type: 'generic',
          packageManager: 'npm',
          commands: {
            test: 'node -e "console.log(\\"json-ok\\")"',
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

    const result = await execa(tsxPath, [cliPath, 'verify', '--json', '--progress'], { cwd: dir });
    const output = JSON.parse(result.stdout);

    expect(output.overallStatus).toBe('pass');
    expect(result.stdout).not.toContain('[1/1]');
    expect(result.stderr).toBe('');
  });

  test('CLI verify prints invalid task paths as JSON errors', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir();
    tempDirs.push(dir, outsideDir);
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    await writeFile(
      path.join(dir, 'agentloop.config.json'),
      JSON.stringify(
        createDefaultConfig({
          name: 'demo',
          type: 'generic',
          packageManager: 'npm',
          commands: {
            test: "node -e \"require('fs').writeFileSync('verify-command-ran.txt', 'yes')\"",
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
    const invalidTaskPath = path.join(outsideDir, 'outside-task.md');
    await writeFile(invalidTaskPath, '# Outside task\n');

    const result = await execa(tsxPath, [cliPath, 'verify', '--task', invalidTaskPath, '--json'], {
      cwd: dir,
      reject: false,
    });

    const output = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(output).toEqual({
      error: {
        code: 'ARTIFACT_PATH_INVALID',
        message: `Task artifact path must stay inside .agentloop/tasks: ${invalidTaskPath}`,
        artifactType: 'task',
        requestedPath: invalidTaskPath,
        expectedDir: '.agentloop/tasks',
        reason: 'outside-directory',
      },
    });
    await expect(access(path.join(dir, 'verify-command-ran.txt'))).rejects.toThrow();
    await expect(access(path.join(dir, '.agentloop/reports'))).rejects.toThrow();
  });

  test('CLI verify rejects task paths that traverse symlinked task subdirectories', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir();
    tempDirs.push(dir, outsideDir);
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    await writeFile(
      path.join(dir, 'agentloop.config.json'),
      JSON.stringify(
        createDefaultConfig({
          name: 'demo',
          type: 'generic',
          packageManager: 'npm',
          commands: {
            test: "node -e \"require('fs').writeFileSync('verify-command-ran.txt', 'yes')\"",
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
    await writeFile(path.join(outsideDir, 'outside-task.md'), '# Outside task\n');
    await symlink(outsideDir, path.join(dir, '.agentloop/tasks/outside-link'), 'dir');
    const invalidTaskPath = '.agentloop/tasks/outside-link/outside-task.md';

    const result = await execa(tsxPath, [cliPath, 'verify', '--task', invalidTaskPath, '--json'], {
      cwd: dir,
      reject: false,
    });

    const output = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(output).toEqual({
      error: {
        code: 'ARTIFACT_PATH_INVALID',
        message: `Task artifact path must stay inside .agentloop/tasks: ${invalidTaskPath}`,
        artifactType: 'task',
        requestedPath: invalidTaskPath,
        expectedDir: '.agentloop/tasks',
        reason: 'outside-directory',
      },
    });
    await expect(access(path.join(dir, 'verify-command-ran.txt'))).rejects.toThrow();
    await expect(access(path.join(dir, '.agentloop/reports'))).rejects.toThrow();
  });

  test('CLI verify rejects report writes when the configured reports directory resolves outside the repo', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir();
    tempDirs.push(dir, outsideDir);
    await mkdir(path.join(dir, '.agentloop'), { recursive: true });
    await symlink(outsideDir, path.join(dir, '.agentloop/reports'), 'dir');
    await writeFile(
      path.join(dir, 'agentloop.config.json'),
      JSON.stringify(
        createDefaultConfig({
          name: 'demo',
          type: 'generic',
          packageManager: 'npm',
          commands: {
            test: "node -e \"require('fs').writeFileSync('verify-command-ran.txt', 'yes')\"",
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

    const result = await execa(tsxPath, [cliPath, 'verify', '--json'], {
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
      expectedExtension: '.md',
      reason: 'outside-directory',
    });
    expect(output.error.requestedPath).toContain('.agentloop/reports/');
    expect(output.error.requestedPath).toContain('-verification-report.md');
    await expect(access(path.join(dir, 'verify-command-ran.txt'))).rejects.toThrow();
    await expect(access(path.join(outsideDir, 'verify-command-ran.txt'))).rejects.toThrow();
    expect(await readdir(outsideDir)).toEqual([]);
  });

  test('CLI verify prints invalid config errors as JSON without running commands', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    await writeFile(
      path.join(dir, 'agentloop.config.json'),
      JSON.stringify({
        version: 2,
        commands: {
          test: "node -e \"require('fs').writeFileSync('verify-command-ran.txt', 'yes')\"",
        },
      }),
    );

    const result = await execa(tsxPath, [cliPath, 'verify', '--json'], {
      cwd: dir,
      reject: false,
    });

    const output = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(output.error).toMatchObject({
      code: 'CONFIG_ERROR',
      message: expect.stringContaining('Invalid AgentLoopKit config'),
    });
    await expect(access(path.join(dir, 'verify-command-ran.txt'))).rejects.toThrow();
  });

  test('CLI verify keeps invalid task paths human-readable by default', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir();
    tempDirs.push(dir, outsideDir);
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
    const invalidTaskPath = path.join(outsideDir, 'outside-task.md');
    await writeFile(invalidTaskPath, '# Outside task\n');

    const result = await execa(tsxPath, [cliPath, 'verify', '--task', invalidTaskPath], {
      cwd: dir,
    });

    const reportPath = extractWrittenVerificationReportPath(result.stdout);
    expect(reportPath).toBeTruthy();
    expect(reportPath).not.toContain(dir);
    const markdown = await readFile(resolveOutputPath(dir, reportPath as string), 'utf8');
    expect(markdown).toContain(`- Status: ${inlineCode('unavailable')}`);
    expect(markdown).toContain('Task path must point to a Markdown task contract.');
  });

  test('CLI verify runs task verification commands with --task-commands', async () => {
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
            test: '',
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
      [
        '# CLI task commands',
        '',
        '- Task type: docs',
        '- Status: in-progress',
        '',
        '## Verification Commands',
        '- node -e "console.log(\'cli-task-check\')"',
        '',
      ].join('\n'),
    );

    const result = await execa(
      tsxPath,
      [cliPath, 'verify', '--task', '.agentloop/tasks/demo-task.md', '--task-commands', '--json'],
      { cwd: dir },
    );
    const output = JSON.parse(result.stdout);
    expect(output.overallStatus).toBe('pass');
    expect(output.taskCommands).toEqual({
      requested: true,
      foundCount: 1,
      commands: ['node -e "console.log(\'cli-task-check\')"'],
    });
    expect(output.commands).toEqual([
      expect.objectContaining({
        key: 'task',
        command: 'node -e "console.log(\'cli-task-check\')"',
        passed: true,
      }),
    ]);
  });

  test('CLI verify can run only task verification commands', async () => {
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
            test: "node -e \"require('fs').writeFileSync('configured-test-ran.txt', 'yes')\"",
            lint: "node -e \"require('fs').writeFileSync('configured-lint-ran.txt', 'yes')\"",
            typecheck:
              "node -e \"require('fs').writeFileSync('configured-typecheck-ran.txt', 'yes')\"",
            build: "node -e \"require('fs').writeFileSync('configured-build-ran.txt', 'yes')\"",
            format: '',
          },
        }),
        null,
        2,
      ),
    );
    await writeFile(
      path.join(dir, '.agentloop/tasks/demo-task.md'),
      [
        '# CLI task-only commands',
        '',
        '- Task type: docs',
        '- Status: in-progress',
        '',
        '## Verification Commands',
        '- node -e "require(\'fs\').writeFileSync(\'task-command-ran.txt\', \'yes\'); console.log(\'task-only-check\')"',
        '',
      ].join('\n'),
    );

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'verify',
        '--task',
        '.agentloop/tasks/demo-task.md',
        '--task-commands',
        '--only-task-commands',
        '--json',
      ],
      { cwd: dir },
    );
    const output = JSON.parse(result.stdout);
    expect(output.overallStatus).toBe('pass');
    expect(output.notRun).toEqual(expect.arrayContaining(['test', 'lint', 'typecheck', 'build']));
    expect(output.commands).toEqual([
      expect.objectContaining({
        key: 'task',
        command:
          'node -e "require(\'fs\').writeFileSync(\'task-command-ran.txt\', \'yes\'); console.log(\'task-only-check\')"',
        passed: true,
      }),
    ]);
    await expect(readFile(path.join(dir, 'task-command-ran.txt'), 'utf8')).resolves.toBe('yes');
    await expect(access(path.join(dir, 'configured-test-ran.txt'))).rejects.toThrow();
    await expect(access(path.join(dir, 'configured-lint-ran.txt'))).rejects.toThrow();
    await expect(access(path.join(dir, 'configured-typecheck-ran.txt'))).rejects.toThrow();
    await expect(access(path.join(dir, 'configured-build-ran.txt'))).rejects.toThrow();
  });

  test('CLI verify rejects --only-task-commands without --task-commands before running commands', async () => {
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
            test: "node -e \"require('fs').writeFileSync('configured-test-ran.txt', 'yes')\"",
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
      [
        '# CLI task-only commands',
        '',
        '- Task type: docs',
        '- Status: in-progress',
        '',
        '## Verification Commands',
        '- node -e "require(\'fs\').writeFileSync(\'task-command-ran.txt\', \'yes\')"',
        '',
      ].join('\n'),
    );

    const result = await execa(
      tsxPath,
      [cliPath, 'verify', '--task', '.agentloop/tasks/demo-task.md', '--only-task-commands', '--json'],
      { cwd: dir, reject: false },
    );
    const output = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(output.error).toMatchObject({
      code: 'ONLY_TASK_COMMANDS_REQUIRES_TASK_COMMANDS',
      option: 'only-task-commands',
      requiredOption: 'task-commands',
    });
    await expect(access(path.join(dir, 'task-command-ran.txt'))).rejects.toThrow();
    await expect(access(path.join(dir, 'configured-test-ran.txt'))).rejects.toThrow();
  });

  test('CLI verify rejects --only-task-commands without --task before running commands', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeFile(
      path.join(dir, 'agentloop.config.json'),
      JSON.stringify(
        createDefaultConfig({
          name: 'demo',
          type: 'generic',
          packageManager: 'npm',
          commands: {
            test: "node -e \"require('fs').writeFileSync('configured-test-ran.txt', 'yes')\"",
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

    const result = await execa(
      tsxPath,
      [cliPath, 'verify', '--task-commands', '--only-task-commands', '--json'],
      { cwd: dir, reject: false },
    );
    const output = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(output.error).toMatchObject({
      code: 'ONLY_TASK_COMMANDS_REQUIRES_TASK',
      option: 'only-task-commands',
      requiredOption: 'task',
    });
    await expect(access(path.join(dir, 'configured-test-ran.txt'))).rejects.toThrow();
  });
});
