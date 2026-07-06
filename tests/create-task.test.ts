import path from 'node:path';
import { mkdir, readFile, realpath, stat, symlink, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { TASK_TYPES } from '../src/core/constants.js';
import { initializeAgentLoop } from '../src/core/init.js';
import { inlineCode, singleLineInlineCode } from '../src/core/markdown-format.js';
import { setActiveTask } from '../src/core/task-state.js';
import { CLI_PROCESS_TIMEOUT_MS, makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

async function initializeGitFixture(dir: string) {
  await execa('git', ['init', '-q'], { cwd: dir });
  await execa('git', ['config', 'user.email', 'agentloopkit@example.com'], { cwd: dir });
  await execa('git', ['config', 'user.name', 'AgentLoopKit Test'], { cwd: dir });
}

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
    expect(result.stdout).toContain('--post-verification <command>');
    expect(result.stdout).toContain('--include-config-commands');
    for (const type of TASK_TYPES) {
      expect(result.stdout).toContain(type);
    }
  });

  test('uses engineering-session wording in help and root guidance', async () => {
    const [help, localGuide, templateGuide] = await Promise.all([
      execa(tsxPath, [cliPath, 'create-task', '--help']),
      readFile('AGENTLOOP.md', 'utf8'),
      readFile('src/templates/root/AGENTLOOP.md', 'utf8'),
    ]);
    const liveCopy = [help.stdout, localGuide, templateGuide].join('\n');
    const oldPhrase = ['agentic', 'coding', 'session'].join(' ');

    expect(liveCopy).toContain('agentic engineering session');
    expect(liveCopy).not.toContain(oldPhrase);
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
        '--post-verification',
        'npm run dogfood:strict',
        '--post-verification',
        'agentloop ship',
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
    expect(markdown).toContain('## Post-Verification Gates');
    expect(markdown).toContain('- npm run dogfood:strict');
    expect(markdown).toContain('- agentloop ship');
  });

  test('can include configured verification commands without executing them', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({
        name: 'demo',
        type: 'typescript-package',
        packageManager: 'pnpm',
        commands: {
          test: 'node ./missing-test-command.js',
          lint: 'pnpm lint',
          typecheck: 'pnpm typecheck',
          build: 'pnpm build',
        },
      }),
    );

    await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Use configured checks',
        '--type',
        'feature',
        '--out',
        '.agentloop/tasks/use-configured-checks.md',
        '--include-config-commands',
        '--verification',
        'pnpm typecheck',
        '--verification',
        'node ./custom-smoke.js',
      ],
      { cwd: dir },
    );

    const markdown = await readFile(
      path.join(dir, '.agentloop/tasks/use-configured-checks.md'),
      'utf8',
    );
    const verificationSection = markdown.match(
      /## Verification Commands\n(?<body>[\s\S]*?)\n\n## Post-Verification Gates/,
    )?.groups?.body;

    expect(verificationSection).toBe(
      [
        '- node ./missing-test-command.js',
        '- pnpm lint',
        '- pnpm typecheck',
        '- pnpm build',
        '- node ./custom-smoke.js',
      ].join('\n'),
    );
  });

  test('allocates a unique default path instead of overwriting same-title tasks', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );

    const first = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Duplicate task title',
        '--type',
        'bugfix',
        '--problem',
        'First problem statement',
        '--json',
      ],
      { cwd: dir },
    );
    const firstOutput = JSON.parse(first.stdout);

    const second = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Duplicate task title',
        '--type',
        'bugfix',
        '--problem',
        'Second problem statement',
        '--json',
      ],
      { cwd: dir },
    );
    const secondOutput = JSON.parse(second.stdout);

    expect(secondOutput.task.path).not.toBe(firstOutput.task.path);
    expect(secondOutput.task.path).toMatch(/duplicate-task-title-2\.md$/);
    await expect(readFile(firstOutput.task.path, 'utf8')).resolves.toContain(
      'First problem statement',
    );
    await expect(readFile(secondOutput.task.path, 'utf8')).resolves.toContain(
      'Second problem statement',
    );
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

  test('prints created task paths with Markdown-safe inline values', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );
    const resolvedDir = await realpath(dir);
    const taskPath = '.agentloop/tasks/manual`task.md';

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Manual output path',
        '--type',
        'docs',
        '--out',
        taskPath,
      ],
      { cwd: dir },
    );

    expect(result.stdout).toContain(
      `Task contract created: ${inlineCode(path.join(resolvedDir, taskPath))}`,
    );
    expect(result.stdout).toContain(`Active task set: ${inlineCode(taskPath)}`);
  });

  test('--harden reports unresolved contract soft spots after creating the task', async () => {
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
        'Harden hint fixture',
        '--type',
        'feature',
        '--out',
        '.agentloop/tasks/harden-hint.md',
        '--harden',
      ],
      { cwd: dir },
    );

    expect(result.stdout).toContain('Task contract created:');
    expect(result.stdout).toMatch(/soft spot/i);
    expect(result.stdout).toMatch(/blocking/i);
    expect(result.stdout).toContain('agentloop harden --resolve');
  });

  test('does not print soft-spot output without --harden', async () => {
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
        'No harden flag fixture',
        '--type',
        'feature',
        '--out',
        '.agentloop/tasks/no-harden-hint.md',
      ],
      { cwd: dir },
    );

    expect(result.stdout).toContain('Task contract created:');
    expect(result.stdout).not.toMatch(/soft spot/i);
  });

  test('--redact-paths redacts the absolute task path in human output', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );
    const resolvedDir = await realpath(dir);
    const taskPath = '.agentloop/tasks/redact-human.md';

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Redacted output path',
        '--type',
        'docs',
        '--out',
        taskPath,
        '--redact-paths',
      ],
      { cwd: dir },
    );

    expect(result.stdout).toContain(`Task contract created: ${inlineCode('[git-root]/' + taskPath)}`);
    expect(result.stdout).not.toContain(resolvedDir);
  });

  test('--redact-paths redacts the absolute task path in JSON output', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );
    const resolvedDir = await realpath(dir);
    const taskPath = '.agentloop/tasks/redact-json.md';

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Redacted JSON output path',
        '--type',
        'docs',
        '--out',
        taskPath,
        '--redact-paths',
        '--json',
      ],
      { cwd: dir },
    );

    const output = JSON.parse(result.stdout);
    expect(output.task.path).toBe(`[git-root]/${taskPath}`);
    expect(result.stdout).not.toContain(resolvedDir);
  });

  test('prints created task paths containing line breaks on one Markdown line', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );
    const resolvedDir = await realpath(dir);
    const taskPath = '.agentloop/tasks/manual\ntask.md';

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Manual output path',
        '--type',
        'docs',
        '--out',
        taskPath,
      ],
      { cwd: dir },
    );

    expect(result.stdout).toContain(
      `Task contract created: ${singleLineInlineCode(path.join(resolvedDir, taskPath))}`,
    );
    expect(result.stdout).toContain(`Active task set: ${singleLineInlineCode(taskPath)}`);
    expect(result.stdout).not.toContain(
      `Task contract created: ${inlineCode(path.join(resolvedDir, taskPath))}`,
    );
    expect(result.stdout).not.toContain(`Active task set: ${inlineCode(taskPath)}`);
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

  test('accepts research as a non-interactive task type', async () => {
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
        'Interview checkout users',
        '--type',
        'research',
        '--out',
        '.agentloop/tasks/research.md',
        '--acceptance',
        'Research plan and findings are recorded as local evidence',
      ],
      { cwd: dir },
    );

    const markdown = await readFile(path.join(dir, '.agentloop/tasks/research.md'), 'utf8');
    expect(markdown).toContain('- Task type: research');
    expect(markdown).toContain('- Research plan and findings are recorded as local evidence');
  });

  test('prints loop guidance when the created task type has a loop template', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );
    await mkdir(path.join(dir, '.agentloop/loops'), { recursive: true });
    await writeFile(path.join(dir, '.agentloop/loops/research.md'), '# Research Loop\n');

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Interview checkout users',
        '--type',
        'research',
        '--out',
        '.agentloop/tasks/research-loop.md',
        '--acceptance',
        'Research plan and findings are recorded as local evidence',
      ],
      { cwd: dir },
    );

    expect(result.stdout).toContain('Loop guidance: `.agentloop/loops/research.md`');
    const markdown = await readFile(path.join(dir, '.agentloop/tasks/research-loop.md'), 'utf8');
    expect(markdown).toContain('- Task type: research');
    expect(markdown).not.toContain('Loop guidance:');
  });

  test('prints loop guidance as additive JSON when the loop file exists', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );
    await mkdir(path.join(dir, '.agentloop/loops'), { recursive: true });
    await writeFile(path.join(dir, '.agentloop/loops/research.md'), '# Research Loop\n');

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Research output',
        '--type',
        'research',
        '--out',
        '.agentloop/tasks/research-output.md',
        '--json',
      ],
      { cwd: dir },
    );

    expect(JSON.parse(result.stdout)).toMatchObject({
      activeTask: {
        path: '.agentloop/tasks/research-output.md',
        title: 'Research output',
        status: 'proposed',
      },
      loopGuidance: {
        taskType: 'research',
        path: '.agentloop/loops/research.md',
      },
    });
  });

  test('omits loop guidance from JSON when no matching loop template exists', async () => {
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
        'Unit test cleanup',
        '--type',
        'tests',
        '--out',
        '.agentloop/tasks/unit-test-cleanup.md',
        '--json',
      ],
      { cwd: dir },
    );

    expect(JSON.parse(result.stdout)).not.toHaveProperty('loopGuidance');
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
        '--problem',
        'Agents need parseable task details.',
        '--outcome',
        'JSON includes task and active-task fields.',
        '--likely-file',
        'src/cli/commands/create-task.ts',
        '--acceptance',
        'JSON includes the created path',
        '--verification',
        'npm test -- tests/create-task.test.ts',
        '--rollback',
        'Revert the JSON output test fixture.',
        '--json',
      ],
      { cwd: dir },
    );

    expect(JSON.parse(result.stdout)).toEqual({
      activeTask: {
        path: '.agentloop/tasks/json-output.md',
        title: 'JSON output',
        status: 'proposed',
      },
      task: {
        path: path.join(resolvedDir, '.agentloop/tasks/json-output.md'),
        markdown: expect.stringContaining('# JSON output'),
      },
    });
    const output = JSON.parse(result.stdout);
    expect(output.task.markdown).toContain(
      '- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.',
    );
    expect(output.task.markdown).not.toContain(
      'Pre-existing dirty non-evidence files before task creation',
    );
    expect(result.stdout).not.toContain('Task contract created:');
  });

  test('warns in JSON when generated task contracts keep review-critical placeholders', async () => {
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
        'Thin task',
        '--type',
        'feature',
        '--out',
        '.agentloop/tasks/thin-task.md',
        '--json',
      ],
      { cwd: dir },
    );

    const output = JSON.parse(result.stdout);
    expect(output.task.markdown).toContain('# Thin task');
    expect(output.activeTask).toMatchObject({
      path: '.agentloop/tasks/thin-task.md',
      title: 'Thin task',
      status: 'proposed',
    });
    expect(output.warnings).toEqual([
      {
        code: 'TASK_CONTRACT_PLACEHOLDER_SECTIONS',
        message:
          'Task contract still contains review-critical placeholder sections. Replace them before implementation or review handoff.',
        sections: [
          'Problem Statement',
          'Desired Outcome',
          'Likely Files or Areas',
          'Acceptance Criteria',
          'Verification Commands',
          'Rollback Notes',
        ],
        suggestion: 'Run `agentloop task doctor` or edit the task contract before implementation.',
      },
    ]);
  });

  test('warns in human output when generated task contracts keep review-critical placeholders', async () => {
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
        'Human thin task',
        '--type',
        'bugfix',
        '--out',
        '.agentloop/tasks/human-thin-task.md',
      ],
      { cwd: dir },
    );

    expect(result.stdout).toContain(
      'Warning: Task contract still contains review-critical placeholder sections.',
    );
    expect(result.stdout).toContain(
      [
        inlineCode('Problem Statement'),
        inlineCode('Desired Outcome'),
        inlineCode('Likely Files or Areas'),
        inlineCode('Acceptance Criteria'),
        inlineCode('Verification Commands'),
        inlineCode('Rollback Notes'),
      ].join(', '),
    );
    expect(result.stdout).toContain('Run `agentloop task doctor` or edit the task contract');
  });

  test('does not warn when generated task contracts have review-critical content', async () => {
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
        'Complete task',
        '--type',
        'feature',
        '--out',
        '.agentloop/tasks/complete-task.md',
        '--problem',
        'Users need a complete task contract before implementation.',
        '--outcome',
        'The task contract has reviewable implementation boundaries.',
        '--likely-file',
        'src/cli/commands/create-task.ts',
        '--acceptance',
        'The warning is absent for complete contracts.',
        '--verification',
        'npm test -- tests/create-task.test.ts',
        '--rollback',
        'Revert the focused task creation output change.',
        '--json',
      ],
      { cwd: dir },
    );

    const output = JSON.parse(result.stdout);
    expect(output.warnings).toBeUndefined();
    expect(output.task.markdown).toContain(
      'Users need a complete task contract before implementation.',
    );
  });

  test('warns in JSON when creating a task over dirty non-evidence work', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );
    await initializeGitFixture(dir);
    await mkdir(path.join(dir, 'src'), { recursive: true });
    await writeFile(path.join(dir, 'src/index.ts'), 'export const value = 1;\n');
    await execa('git', ['add', '.'], { cwd: dir });
    await execa('git', ['commit', '-m', 'Initial state'], { cwd: dir });
    await writeFile(path.join(dir, 'src/index.ts'), 'export const value = 2;\n');
    await mkdir(path.join(dir, 'docs'), { recursive: true });
    await writeFile(path.join(dir, 'docs/new-task-guide.md'), '# New task guide\n');

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Dirty work task',
        '--type',
        'feature',
        '--out',
        '.agentloop/tasks/dirty-work-task.md',
        '--problem',
        'Agents need to notice existing dirty work before starting a task.',
        '--outcome',
        'The task warning makes scope contamination visible.',
        '--likely-file',
        'src/cli/commands/create-task.ts',
        '--acceptance',
        'Dirty work warning is emitted.',
        '--verification',
        'npm test -- tests/create-task.test.ts',
        '--rollback',
        'Revert the dirty work warning.',
        '--json',
      ],
      { cwd: dir },
    );

    const output = JSON.parse(result.stdout);
    expect(output.warnings).toEqual([
      {
        code: 'DIRTY_WORKTREE_BEFORE_TASK_CREATION',
        message:
          'Git already had dirty non-evidence files before this task was created. Review them before treating the new task as isolated.',
        fileCount: 2,
        examples: ['src/index.ts', 'docs/new-task-guide.md'],
        suggestion:
          'Run `agentloop status --redact-paths` and confirm existing dirty files belong to this task before implementation.',
      },
    ]);
    expect(output.task.markdown).toContain('## Risk Notes');
    expect(output.task.markdown).toContain(
      '- Pre-existing dirty non-evidence files before task creation: 2 total; examples: `src/index.ts`, `docs/new-task-guide.md`. Confirm they belong to this task before implementation.',
    );
  });

  test('warns in human output when creating a task over dirty non-evidence work', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );
    await initializeGitFixture(dir);
    await mkdir(path.join(dir, 'src'), { recursive: true });
    await writeFile(path.join(dir, 'src/index.ts'), 'export const value = 1;\n');
    await execa('git', ['add', '.'], { cwd: dir });
    await execa('git', ['commit', '-m', 'Initial state'], { cwd: dir });
    await writeFile(path.join(dir, 'src/index.ts'), 'export const value = 2;\n');

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Human dirty work task',
        '--type',
        'feature',
        '--out',
        '.agentloop/tasks/human-dirty-work-task.md',
        '--problem',
        'Agents need to notice existing dirty work before starting a task.',
        '--outcome',
        'The task warning makes scope contamination visible.',
        '--likely-file',
        'src/cli/commands/create-task.ts',
        '--acceptance',
        'Dirty work warning is emitted.',
        '--verification',
        'npm test -- tests/create-task.test.ts',
        '--rollback',
        'Revert the dirty work warning.',
      ],
      { cwd: dir },
    );

    expect(result.stdout).toContain(
      'Warning: Git already had dirty non-evidence files before this task was created.',
    );
    expect(result.stdout).toContain(
      `Dirty non-evidence files: 1 total; examples: ${inlineCode('src/index.ts')}`,
    );
    expect(result.stdout).toContain('Run `agentloop status --redact-paths`');
    const markdown = await readFile(
      path.join(dir, '.agentloop/tasks/human-dirty-work-task.md'),
      'utf8',
    );
    expect(markdown).toContain(
      '- Pre-existing dirty non-evidence files before task creation: 1 total; examples: `src/index.ts`. Confirm they belong to this task before implementation.',
    );
  });

  test('does not warn for AgentLoop evidence-only dirty files before task creation', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' }),
    );
    await initializeGitFixture(dir);
    await execa('git', ['add', '.'], { cwd: dir });
    await execa('git', ['commit', '-m', 'Initial state'], { cwd: dir });
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-20-12-00-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Evidence only task',
        '--type',
        'feature',
        '--out',
        '.agentloop/tasks/evidence-only-task.md',
        '--problem',
        'Agents need a task without dirty-work false positives.',
        '--outcome',
        'AgentLoop evidence churn does not trigger dirty-work warnings.',
        '--likely-file',
        'src/cli/commands/create-task.ts',
        '--acceptance',
        'Dirty work warning is absent.',
        '--verification',
        'npm test -- tests/create-task.test.ts',
        '--rollback',
        'Revert the dirty work warning.',
        '--json',
      ],
      { cwd: dir },
    );

    expect(JSON.parse(result.stdout).warnings).toBeUndefined();
  });

  test('warns in JSON when verification commands look like post-verification gates', async () => {
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
        'Misplaced gate',
        '--type',
        'release',
        '--out',
        '.agentloop/tasks/misplaced-gate.md',
        '--problem',
        'Post-verification gates need clear placement.',
        '--outcome',
        'The warning stays focused on misplaced gate commands.',
        '--likely-file',
        'src/cli/commands/create-task.ts',
        '--acceptance',
        'The misplaced gate warning is emitted.',
        '--verification',
        'agentloop ship',
        '--verification',
        'npx --no-install agentloop prepare-pr --github-comment',
        '--rollback',
        'Move the command warning behavior back to the previous implementation.',
        '--json',
      ],
      { cwd: dir },
    );

    const output = JSON.parse(result.stdout);
    expect(output.warnings).toEqual([
      {
        code: 'POST_VERIFICATION_GATE_IN_VERIFICATION_COMMANDS',
        message:
          'Some verification commands look like post-verification gates. Move them to --post-verification if they need a fresh AgentLoop report.',
        commands: ['agentloop ship', 'npx --no-install agentloop prepare-pr --github-comment'],
        suggestion:
          'Use --post-verification for each listed command that needs a fresh AgentLoop report.',
      },
    ]);

    const markdown = await readFile(path.join(dir, '.agentloop/tasks/misplaced-gate.md'), 'utf8');
    expect(markdown).toContain(
      [
        '## Verification Commands',
        '- agentloop ship',
        '- npx --no-install agentloop prepare-pr --github-comment',
      ].join('\n'),
    );
    expect(markdown).toContain('## Post-Verification Gates\n- No post-verification gate recorded.');
  });

  test('warns in human output when verification commands look like post-verification gates', async () => {
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
        'Human misplaced gate',
        '--type',
        'release',
        '--out',
        '.agentloop/tasks/human-misplaced-gate.md',
        '--verification',
        'node dist/cli/index.js release-check --strict',
      ],
      { cwd: dir },
    );

    expect(result.stdout).toContain(
      'Warning: Some verification commands look like post-verification gates.',
    );
    expect(result.stdout).toContain(
      `Move to --post-verification: ${inlineCode('node dist/cli/index.js release-check --strict')}`,
    );
    const markdown = await readFile(
      path.join(dir, '.agentloop/tasks/human-misplaced-gate.md'),
      'utf8',
    );
    expect(markdown).toContain(
      '## Verification Commands\n- node dist/cli/index.js release-check --strict',
    );
    expect(markdown).toContain('## Post-Verification Gates\n- No post-verification gate recorded.');
  });

  test('prints post-verification warnings containing line breaks on one Markdown line', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const flaggedCommand = 'node dist/cli/index.js\nrelease-check --strict';
    await writeJson(
      path.join(dir, 'agentloop.config.json'),
      createDefaultConfig({
        name: 'demo',
        type: 'generic',
        packageManager: 'npm',
        commands: {
          test: flaggedCommand,
          lint: '',
          typecheck: '',
          build: '',
        },
      }),
    );

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'Human multiline misplaced gate',
        '--type',
        'release',
        '--out',
        '.agentloop/tasks/human-multiline-misplaced-gate.md',
        '--include-config-commands',
      ],
      { cwd: dir },
    );

    expect(result.stdout).toContain(
      `Move to --post-verification: ${singleLineInlineCode(flaggedCommand)}`,
    );
    expect(result.stdout).not.toContain(
      `Move to --post-verification: ${inlineCode(flaggedCommand)}`,
    );

    const jsonResult = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'JSON multiline misplaced gate',
        '--type',
        'release',
        '--out',
        '.agentloop/tasks/json-multiline-misplaced-gate.md',
        '--include-config-commands',
        '--json',
      ],
      { cwd: dir },
    );
    expect(JSON.parse(jsonResult.stdout).warnings[0].commands).toEqual([flaggedCommand]);
  });

  test('sets the newly created task as active even when another task was pinned', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
    await writeJson(path.join(dir, 'agentloop.config.json'), config);
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    const oldTaskPath = path.join(dir, '.agentloop/tasks/old-task.md');
    await writeFile(oldTaskPath, '# Old task\n\n- Status: in-progress\n');
    await setActiveTask({ cwd: dir, config, taskPath: oldTaskPath });

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'create-task',
        '--title',
        'New active task',
        '--type',
        'bugfix',
        '--out',
        '.agentloop/tasks/new-active-task.md',
        '--json',
      ],
      { cwd: dir },
    );
    const current = JSON.parse(
      (await execa(tsxPath, [cliPath, 'task', 'current', '--json'], { cwd: dir })).stdout,
    );

    expect(JSON.parse(result.stdout)).toMatchObject({
      activeTask: {
        path: '.agentloop/tasks/new-active-task.md',
        title: 'New active task',
        status: 'proposed',
      },
    });
    expect(current.activeTask).toMatchObject({
      path: '.agentloop/tasks/new-active-task.md',
      title: 'New active task',
      status: 'proposed',
    });
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
