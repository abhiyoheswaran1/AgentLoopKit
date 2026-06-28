import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

async function git(cwd: string, args: string[]) {
  return execa('git', args, { cwd });
}

async function createLoopFixture() {
  const dir = await makeTempDir();
  tempDirs.push(dir);

  await git(dir, ['init', '-q']);
  await git(dir, ['config', 'user.email', 'agentloopkit@example.com']);
  await git(dir, ['config', 'user.name', 'AgentLoopKit Test']);

  const config = createDefaultConfig({
    name: 'demo',
    type: 'typescript-package',
    packageManager: 'npm',
    commands: {
      test: 'npm test',
      lint: 'npm run lint',
      typecheck: 'npm run typecheck',
      build: 'npm run build',
    },
  });
  await writeJson(path.join(dir, 'agentloop.config.json'), config);
  await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
  await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
  await mkdir(path.join(dir, 'src/auth'), { recursive: true });
  await writeFile(path.join(dir, 'src/auth/copy.ts'), 'export const copy = "old";\n');
  await git(dir, ['add', '.']);
  await git(dir, ['commit', '-m', 'Initial state']);

  return dir;
}

describe('loop command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('creates a local loop contract and a native AgentLoop task', async () => {
    const dir = await createLoopFixture();

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'loop',
        'create',
        '--goal',
        'Keep AgentLoopKit release-ready',
        '--cadence',
        'manual',
        '--budget-tokens',
        '50000',
        '--max-iterations',
        '5',
        '--json',
      ],
      { cwd: dir },
    );
    const payload = JSON.parse(result.stdout);

    expect(payload.loop).toMatchObject({
      schemaVersion: '1.0',
      kind: 'agentloop-loop',
      goal: 'Keep AgentLoopKit release-ready',
      cadence: 'manual',
      status: 'active',
      budget: {
        maxEstimatedTokens: 50000,
        maxIterations: 5,
        usedEstimatedTokens: 0,
      },
      controls: {
        agentNeutral: true,
        externalAgentExecution: false,
        localEvidenceOnly: true,
      },
    });
    expect(payload.loop.id).toMatch(/keep-agentloopkit-release-ready/);
    expect(payload.loop.task.nativeTaskPath).toMatch(/^\.agentloop\/tasks\/.+\.md$/);
    expect(payload.loop.latestTokenReceipt).toMatchObject({
      heuristic: 'chars-divided-by-four',
      warning: expect.any(String),
    });

    const loopPath = path.join(dir, payload.loop.path);
    const taskPath = path.join(dir, payload.loop.task.nativeTaskPath);
    const storedLoop = JSON.parse(await readFile(loopPath, 'utf8'));
    const taskMarkdown = await readFile(taskPath, 'utf8');

    expect(storedLoop.goal).toBe('Keep AgentLoopKit release-ready');
    expect(storedLoop.iterations).toEqual([]);
    expect(taskMarkdown).toContain('# Loop: Keep AgentLoopKit release-ready');
    expect(taskMarkdown).toContain('Loop iterations record readiness and context-budget evidence.');
    expect(payload.markdown).toContain('AgentLoopKit will not execute a coding agent for this loop.');
  });

  test('creates dogfood loop presets without running their suggested commands', async () => {
    const dir = await createLoopFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'loop', 'create', '--preset', 'agentloopkit-maintenance', '--json'],
      { cwd: dir },
    );
    const payload = JSON.parse(result.stdout);

    expect(payload.loop.goal).toContain('Keep AgentLoopKit tests, docs, release proof, and gates healthy');
    expect(payload.loop.suggestedCommands).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ command: 'npm run maintenance:check' }),
        expect.objectContaining({ command: 'npx --yes projscan doctor --format markdown' }),
        expect.objectContaining({ command: 'agentloop check-gates --strict' }),
      ]),
    );
    expect(payload.loop.safety).toMatchObject({
      commandsExecuted: [],
      writesLoopContract: true,
      writesNativeTask: true,
    });
  });

  test('records loop ticks with readiness, token ledger, and deterministic stop decisions', async () => {
    const dir = await createLoopFixture();
    const createResult = await execa(
      tsxPath,
      [
        cliPath,
        'loop',
        'create',
        '--goal',
        'Tighten auth copy',
        '--budget-tokens',
        '9000',
        '--max-iterations',
        '3',
        '--json',
      ],
      { cwd: dir },
    );
    const created = JSON.parse(createResult.stdout);
    await writeFile(path.join(dir, 'src/auth/copy.ts'), 'export const copy = "new";\n');

    const tickResult = await execa(
      tsxPath,
      [cliPath, 'loop', 'tick', '--id', created.loop.id, '--json'],
      { cwd: dir },
    );
    const tick = JSON.parse(tickResult.stdout);

    expect(tick.iteration).toMatchObject({
      index: 1,
      decision: 'continue',
      readinessStatus: 'blocked',
      contextHandles: expect.arrayContaining(['task:active', 'evidence-map:current']),
    });
    expect(tick.iteration.tokenReceipt).toMatchObject({
      estimatedBroadContextTokens: expect.any(Number),
      estimatedCompactContextTokens: expect.any(Number),
      estimatedAgentLoopOverheadTokens: expect.any(Number),
      estimatedNetContextReductionTokens: expect.any(Number),
    });
    expect(tick.loop.budget.usedEstimatedTokens).toBeGreaterThan(0);
    expect(tick.loop.iterations).toHaveLength(1);
    expect(tick.loop.safety.commandsExecuted).toEqual([]);

    const statusResult = await execa(
      tsxPath,
      [cliPath, 'loop', 'status', '--id', created.loop.id, '--json'],
      { cwd: dir },
    );
    const status = JSON.parse(statusResult.stdout);
    expect(status.loop.iterations).toHaveLength(1);
    expect(status.summary).toMatchObject({
      iterations: 1,
      status: 'active',
      usedEstimatedTokens: expect.any(Number),
    });
  });

  test('runs an explicitly configured runner and records command evidence', async () => {
    const dir = await createLoopFixture();
    await writeFile(
      path.join(dir, 'runner.mjs'),
      [
        "import { writeFileSync } from 'node:fs';",
        "writeFileSync('src/auth/copy.ts', 'export const copy = \"runner\";\\n');",
        "console.log('runner completed');",
        '',
      ].join('\n'),
    );
    const createResult = await execa(
      tsxPath,
      [
        cliPath,
        'loop',
        'create',
        '--goal',
        'Runner loop',
        '--runner-command',
        'node runner.mjs',
        '--runner-timeout-ms',
        '5000',
        '--json',
      ],
      { cwd: dir },
    );
    const created = JSON.parse(createResult.stdout);

    const runResult = await execa(
      tsxPath,
      [cliPath, 'loop', 'run', '--id', created.loop.id, '--json'],
      { cwd: dir },
    );
    const run = JSON.parse(runResult.stdout);

    expect(run.iteration.runner).toMatchObject({
      command: 'node runner.mjs',
      exitCode: 0,
      status: 'passed',
      shell: false,
      outputExcerpt: expect.stringContaining('runner completed'),
    });
    expect(run.iteration.runner.changedFilesAfter).toContain('src/auth/copy.ts');
    expect(run.loop.safety.commandsExecuted).toEqual(['node runner.mjs']);
    expect(run.loop.iterations).toHaveLength(1);
    expect(run.markdown).toContain('Runner: `passed`');
  });

  test('rejects loop run when no runner is configured', async () => {
    const dir = await createLoopFixture();
    const createResult = await execa(
      tsxPath,
      [cliPath, 'loop', 'create', '--goal', 'No runner loop', '--json'],
      { cwd: dir },
    );
    const created = JSON.parse(createResult.stdout);

    const result = await execa(
      tsxPath,
      [cliPath, 'loop', 'run', '--id', created.loop.id, '--json'],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(1);
    expect(JSON.parse(result.stdout).error).toMatchObject({
      code: 'LOOP_RUNNER_REQUIRED',
    });
  });

  test('rejects unconfigured runner command overrides', async () => {
    const dir = await createLoopFixture();
    const createResult = await execa(
      tsxPath,
      [
        cliPath,
        'loop',
        'create',
        '--goal',
        'Pinned runner loop',
        '--runner-command',
        'node runner.mjs',
        '--json',
      ],
      { cwd: dir },
    );
    const created = JSON.parse(createResult.stdout);

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'loop',
        'run',
        '--id',
        created.loop.id,
        '--command',
        'node other-runner.mjs',
        '--json',
      ],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(1);
    expect(JSON.parse(result.stdout).error).toMatchObject({
      code: 'LOOP_RUNNER_NOT_ALLOWED',
    });
  });

  test('rejects unsafe runner shell syntax and protected commands', async () => {
    const dir = await createLoopFixture();

    const shellResult = await execa(
      tsxPath,
      [
        cliPath,
        'loop',
        'create',
        '--goal',
        'Unsafe shell loop',
        '--runner-command',
        'node runner.mjs && rm -rf .',
        '--json',
      ],
      { cwd: dir, reject: false },
    );
    const publishResult = await execa(
      tsxPath,
      [
        cliPath,
        'loop',
        'create',
        '--goal',
        'Unsafe publish loop',
        '--runner-command',
        'npm publish',
        '--json',
      ],
      { cwd: dir, reject: false },
    );
    const gitCommitResult = await execa(
      tsxPath,
      [
        cliPath,
        'loop',
        'create',
        '--goal',
        'Unsafe git loop',
        '--runner-command',
        'git commit -am change',
        '--json',
      ],
      { cwd: dir, reject: false },
    );

    expect(shellResult.exitCode).toBe(1);
    expect(JSON.parse(shellResult.stdout).error).toMatchObject({
      code: 'LOOP_RUNNER_COMMAND_UNSAFE',
    });
    expect(publishResult.exitCode).toBe(1);
    expect(JSON.parse(publishResult.stdout).error).toMatchObject({
      code: 'LOOP_RUNNER_COMMAND_BLOCKED',
    });
    expect(gitCommitResult.exitCode).toBe(1);
    expect(JSON.parse(gitCommitResult.stdout).error).toMatchObject({
      code: 'LOOP_RUNNER_COMMAND_BLOCKED',
    });
  });

  test('does not run configured runners after a loop reaches max iterations', async () => {
    const dir = await createLoopFixture();
    await writeFile(
      path.join(dir, 'runner.mjs'),
      [
        "import { appendFileSync } from 'node:fs';",
        "appendFileSync('runner-count.txt', 'run\\n');",
        '',
      ].join('\n'),
    );
    const createResult = await execa(
      tsxPath,
      [
        cliPath,
        'loop',
        'create',
        '--goal',
        'One run loop',
        '--max-iterations',
        '1',
        '--runner-command',
        'node runner.mjs',
        '--json',
      ],
      { cwd: dir },
    );
    const created = JSON.parse(createResult.stdout);
    await execa(tsxPath, [cliPath, 'loop', 'run', '--id', created.loop.id, '--json'], {
      cwd: dir,
    });

    const result = await execa(
      tsxPath,
      [cliPath, 'loop', 'run', '--id', created.loop.id, '--json'],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(1);
    expect(JSON.parse(result.stdout).error).toMatchObject({
      code: 'LOOP_TERMINAL',
    });
    expect(await readFile(path.join(dir, 'runner-count.txt'), 'utf8')).toBe('run\n');
  });

  test('stops a loop when max iterations are exhausted', async () => {
    const dir = await createLoopFixture();
    const createResult = await execa(
      tsxPath,
      [
        cliPath,
        'loop',
        'create',
        '--goal',
        'One pass only',
        '--max-iterations',
        '1',
        '--json',
      ],
      { cwd: dir },
    );
    const created = JSON.parse(createResult.stdout);

    const tickResult = await execa(
      tsxPath,
      [cliPath, 'loop', 'tick', '--id', created.loop.id, '--json'],
      { cwd: dir },
    );
    const tick = JSON.parse(tickResult.stdout);

    expect(tick.iteration.decision).toBe('stop');
    expect(tick.loop.status).toBe('stopped');
    expect(tick.loop.stopReason).toContain('maximum iteration count');
  });

  test('rejects ticks after a loop reaches a terminal state', async () => {
    const dir = await createLoopFixture();
    const createResult = await execa(
      tsxPath,
      [
        cliPath,
        'loop',
        'create',
        '--goal',
        'One terminal pass',
        '--max-iterations',
        '1',
        '--json',
      ],
      { cwd: dir },
    );
    const created = JSON.parse(createResult.stdout);
    await execa(tsxPath, [cliPath, 'loop', 'tick', '--id', created.loop.id, '--json'], {
      cwd: dir,
    });

    const result = await execa(
      tsxPath,
      [cliPath, 'loop', 'tick', '--id', created.loop.id, '--json'],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(1);
    expect(JSON.parse(result.stdout).error).toMatchObject({
      code: 'LOOP_TERMINAL',
    });
  });

  test('prints a loop report with token ledger and next action', async () => {
    const dir = await createLoopFixture();
    const createResult = await execa(
      tsxPath,
      [cliPath, 'loop', 'create', '--goal', 'Review docs drift', '--json'],
      { cwd: dir },
    );
    const created = JSON.parse(createResult.stdout);
    await execa(tsxPath, [cliPath, 'loop', 'tick', '--id', created.loop.id], { cwd: dir });

    const reportResult = await execa(
      tsxPath,
      [cliPath, 'loop', 'report', '--id', created.loop.id, '--redact-paths'],
      { cwd: dir },
    );

    expect(reportResult.stdout).toContain('# AgentLoopKit Loop Report');
    expect(reportResult.stdout).toContain('## Token Ledger');
    expect(reportResult.stdout).toContain('AgentLoopKit overhead');
    expect(reportResult.stdout).toContain('## Iterations');
    expect(reportResult.stdout).toContain('## Next Action');
    expect(reportResult.stdout).not.toContain(dir);
  });

  test('rejects path traversal loop identifiers', async () => {
    const dir = await createLoopFixture();

    const result = await execa(
      tsxPath,
      [cliPath, 'loop', 'status', '--id', '../escape', '--json'],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(1);
    expect(JSON.parse(result.stdout).error).toMatchObject({
      code: 'LOOP_PATH_INVALID',
    });
  });
});
