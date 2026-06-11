import path from 'node:path';
import { mkdir, readFile, realpath, stat, symlink } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { TASK_TYPES } from '../src/core/constants.js';
import { initializeAgentLoop } from '../src/core/init.js';
import { CLI_PROCESS_TIMEOUT_MS, makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

describe('create-task command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('lists supported task types in help output', async () => {
    const result = await execa(tsxPath, [cliPath, 'create-task', '--help']);

    expect(result.stdout).toContain('Supported task types:');
    expect(result.stdout).toContain('--risk <text>');
    expect(result.stdout).toContain('--risk-note <text>');
    for (const type of TASK_TYPES) {
      expect(result.stdout).toContain(type);
    }
  });

  test('accumulates repeated non-interactive list options', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );

    await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Repeated flags',
        '--type',
        'feature',
        '--out',
        '.agentloop/tasks/repeated-flags.md',
        '--constraint',
        'Keep the current CLI shape',
        '--constraint',
        'Do not add dependencies',
        '--non-goal',
        'No prompt redesign',
        '--non-goal',
        'No task database',
        '--likely-file',
        'src/cli/commands/create-task.ts',
        '--likely-file',
        'tests/create-task.test.ts',
        '--forbidden-file',
        'package.json',
        '--forbidden-file',
        'pnpm-lock.yaml',
        '--acceptance',
        'First criterion is preserved',
        '--acceptance',
        'Second criterion is preserved',
        '--verify-command',
        'pnpm test',
        '--verify-command',
        'pnpm build',
      ],
      { cwd: dir },
    );

    const markdown = await readFile(path.join(dir, '.agentloop/tasks/repeated-flags.md'), 'utf8');
    expect(markdown).toContain('- Keep the current CLI shape');
    expect(markdown).toContain('- Do not add dependencies');
    expect(markdown).toContain('- No prompt redesign');
    expect(markdown).toContain('- No task database');
    expect(markdown).toContain('- src/cli/commands/create-task.ts');
    expect(markdown).toContain('- tests/create-task.test.ts');
    expect(markdown).toContain('- package.json');
    expect(markdown).toContain('- pnpm-lock.yaml');
    expect(markdown).toContain('- First criterion is preserved');
    expect(markdown).toContain('- Second criterion is preserved');
    expect(markdown).toContain('- pnpm test');
    expect(markdown).toContain('- pnpm build');
  });

  test('writes task contracts to the parent AgentLoop root when run from a nested directory', async () => {
    const dir = await makeTempDir();
    const nested = path.join(dir, 'src', 'features');
    tempDirs.push(dir);
    await mkdir(nested, { recursive: true });
    await writeJson(path.join(dir, 'package.json'), { name: 'root-demo' });
    await initializeAgentLoop({ cwd: dir });

    const result = await execa(
      tsxPath,
      [cliPath, 'create-task', '--title', 'Nested command task', '--type', 'bugfix', '--json'],
      { cwd: nested, reject: false },
    );

    expect(result.exitCode).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.task.path).toContain(path.join(dir, '.agentloop', 'tasks'));
    expect(output.task.path).not.toContain(path.join(nested, '.agentloop'));
    await expect(readFile(output.task.path, 'utf8')).resolves.toContain('# Nested command task');
  });

  test('accepts task-contract field aliases in non-interactive mode', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );

    await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Document npm OTP publish blocker',
        '--type',
        'docs',
        '--out',
        '.agentloop/tasks/npm-otp-blocker.md',
        '--problem-statement',
        'Local npm publish passed checks but stopped at EOTP authentication.',
        '--desired-outcome',
        'Release docs explain the safe publish paths.',
        '--assumption',
        'No OTP is available to the CLI session.',
        '--verification',
        'git diff --check',
        '--verification',
        'pnpm test',
        '--rollback',
        'Revert the docs-only update.',
      ],
      { cwd: dir },
    );

    const markdown = await readFile(path.join(dir, '.agentloop/tasks/npm-otp-blocker.md'), 'utf8');
    expect(markdown).toContain(
      'Local npm publish passed checks but stopped at EOTP authentication.',
    );
    expect(markdown).toContain('Release docs explain the safe publish paths.');
    expect(markdown).toContain('- No OTP is available to the CLI session.');
    expect(markdown).toContain('- git diff --check');
    expect(markdown).toContain('- pnpm test');
    expect(markdown).toContain('Revert the docs-only update.');
  });

  test('accepts repeated risk note flags in non-interactive mode', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );

    await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Capture risk notes',
        '--type',
        'bugfix',
        '--out',
        '.agentloop/tasks/capture-risk-notes.md',
        '--risk',
        'Touches release automation',
        '--risk-note',
        'Requires reviewer check for generated files',
        '--risk',
        'Rollback depends on reverting one commit',
      ],
      { cwd: dir },
    );

    const markdown = await readFile(
      path.join(dir, '.agentloop/tasks/capture-risk-notes.md'),
      'utf8',
    );
    expect(markdown).toContain('## Risk Notes');
    expect(markdown).toContain('- Touches release automation');
    expect(markdown).toContain('- Requires reviewer check for generated files');
    expect(markdown).toContain('- Rollback depends on reverting one commit');
    expect(markdown).not.toContain(
      '- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.',
    );
  });

  test('accepts test-generation as a non-interactive task type', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );

    await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Add regression coverage',
        '--type',
        'test-generation',
        '--out',
        '.agentloop/tasks/test-generation.md',
        '--acceptance',
        'Regression test fails before implementation',
      ],
      { cwd: dir },
    );

    const markdown = await readFile(path.join(dir, '.agentloop/tasks/test-generation.md'), 'utf8');
    expect(markdown).toContain('- Task type: test-generation');
    expect(markdown).toContain('- Regression test fails before implementation');
  });

  test('rejects unsupported non-interactive task types without prompting', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Typo task type',
        '--type',
        'test-generaton',
        '--out',
        '.agentloop/tasks/typo.md',
      ],
      { cwd: dir, reject: false, timeout: CLI_PROCESS_TIMEOUT_MS },
    );

    expect(result.timedOut).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Unsupported task type "test-generaton"');
    expect(result.stderr).toContain('test-generation');
    await expect(stat(path.join(dir, '.agentloop/tasks/typo.md'))).rejects.toThrow();
  });

  test('prints unsupported task type errors as JSON when requested', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Typo task type',
        '--type',
        'test-generaton',
        '--out',
        '.agentloop/tasks/typo.md',
        '--json',
      ],
      { cwd: dir, reject: false, timeout: CLI_PROCESS_TIMEOUT_MS },
    );

    expect(result.timedOut).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'UNSUPPORTED_TASK_TYPE',
        message: 'Unsupported task type "test-generaton".',
        supportedTaskTypes: TASK_TYPES,
      },
    });
    await expect(stat(path.join(dir, '.agentloop/tasks/typo.md'))).rejects.toThrow();
  });

  test('prints created task details as JSON when requested', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );
    const resolvedDir = await realpath(dir);

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'JSON output',
        '--type',
        'feature',
        '--out',
        '.agentloop/tasks/json-output.md',
        '--acceptance',
        'JSON includes the created path',
        '--json',
      ],
      { cwd: dir },
    );

    expect(JSON.parse(result.stdout)).toEqual({
      task: {
        path: path.join(resolvedDir, '.agentloop/tasks/json-output.md'),
        markdown: expect.stringContaining('# JSON output'),
      },
    });
    expect(result.stdout).not.toContain('Task contract created:');
  });

  test('prints invalid config errors as JSON without creating a task', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(path.join(dir, 'agentloop.config.json'), { version: 2 });

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Invalid config',
        '--type',
        'bugfix',
        '--out',
        '.agentloop/tasks/invalid-config.md',
        '--json',
      ],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toMatchObject({
      error: {
        code: 'CONFIG_ERROR',
        message: expect.stringContaining('Invalid AgentLoopKit config'),
      },
    });
    await expect(stat(path.join(dir, '.agentloop/tasks/invalid-config.md'))).rejects.toThrow();
  });

  test('prints missing config errors as JSON without creating a task', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Missing config',
        '--type',
        'bugfix',
        '--out',
        '.agentloop/tasks/missing-config.md',
        '--json',
      ],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toMatchObject({
      error: {
        code: 'CONFIG_ERROR',
        message: expect.stringContaining('AgentLoopKit config not found'),
      },
    });
    await expect(stat(path.join(dir, '.agentloop/tasks/missing-config.md'))).rejects.toThrow();
  });

  test('rejects output paths outside the configured tasks directory', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir();
    tempDirs.push(dir, outsideDir);
    const outsidePath = path.join(outsideDir, 'outside-task.md');
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Outside write',
        '--type',
        'bugfix',
        '--out',
        outsidePath,
      ],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Task output path must stay inside .agentloop/tasks');
    await expect(stat(outsidePath)).rejects.toThrow();
  });

  test('prints outside output path errors as JSON when requested', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir();
    tempDirs.push(dir, outsideDir);
    const outsidePath = path.join(outsideDir, 'outside-task.md');
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Outside write',
        '--type',
        'bugfix',
        '--out',
        outsidePath,
        '--json',
      ],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'TASK_OUTPUT_PATH_OUTSIDE_TASKS_DIR',
        message: 'Task output path must stay inside .agentloop/tasks.',
        requestedOut: outsidePath,
        tasksDir: '.agentloop/tasks',
        reason: 'outside-tasks-dir',
      },
    });
    await expect(stat(outsidePath)).rejects.toThrow();
  });

  test('rejects output paths that traverse a symlinked task subdirectory', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir();
    tempDirs.push(dir, outsideDir);
    const requestedOut = '.agentloop/tasks/outside-link/escaped-task.md';
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    await symlink(outsideDir, path.join(dir, '.agentloop/tasks/outside-link'), 'dir');

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Symlink escape',
        '--type',
        'bugfix',
        '--out',
        requestedOut,
        '--json',
      ],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'TASK_OUTPUT_PATH_OUTSIDE_TASKS_DIR',
        message: 'Task output path must stay inside .agentloop/tasks.',
        requestedOut,
        tasksDir: '.agentloop/tasks',
        reason: 'outside-tasks-dir',
      },
    });
    await expect(stat(path.join(outsideDir, 'escaped-task.md'))).rejects.toThrow();
  });

  test('rejects default output when the configured tasks directory resolves outside the repo', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir();
    tempDirs.push(dir, outsideDir);
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );
    await mkdir(path.join(dir, '.agentloop'), { recursive: true });
    await symlink(outsideDir, path.join(dir, '.agentloop/tasks'), 'dir');

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Root symlink escape',
        '--type',
        'bugfix',
        '--out',
        '.agentloop/tasks/root-symlink-escape.md',
        '--json',
      ],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'TASK_OUTPUT_PATH_OUTSIDE_TASKS_DIR',
        message: 'Task output path must stay inside .agentloop/tasks.',
        requestedOut: '.agentloop/tasks/root-symlink-escape.md',
        tasksDir: '.agentloop/tasks',
        reason: 'outside-tasks-dir',
      },
    });
    await expect(stat(path.join(outsideDir, 'root-symlink-escape.md'))).rejects.toThrow();
  });

  test('prints non-Markdown output path errors as JSON when requested', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Text task',
        '--type',
        'docs',
        '--out',
        '.agentloop/tasks/text-task.txt',
        '--json',
      ],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'TASK_OUTPUT_PATH_NOT_MARKDOWN',
        message: 'Task output path must be a Markdown file.',
        requestedOut: '.agentloop/tasks/text-task.txt',
        tasksDir: '.agentloop/tasks',
        reason: 'not-markdown',
      },
    });
    await expect(stat(path.join(dir, '.agentloop/tasks/text-task.txt'))).rejects.toThrow();
  });
});
