import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { makeTempDir, removeTempDir } from './helpers.js';
// @ts-expect-error TS7016: static import keeps helper usage visible to projscan.
import * as dogfoodStart from '../scripts/dogfood-start.mjs';

const originalCwd = process.cwd();
let tempDirs: string[] = [];

function placeholderTaskMarkdown(title: string) {
  return `# ${title}

- Created date: 2026-06-16
- Task type: feature
- Status: proposed

## Problem Statement
AgentFlight session task: ${title}

## Desired Outcome
Task is implemented with local verification evidence.

## Constraints
- Keep changes scoped and do not claim completion without proof.
`;
}

async function writeTask(dir: string, relativePath: string, markdown: string) {
  const absolutePath = path.join(dir, relativePath);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, markdown);
}

afterEach(async () => {
  process.chdir(originalCwd);
  await Promise.all(tempDirs.map(removeTempDir));
  tempDirs = [];
});

describe('dogfood start script helpers', () => {
  test('builds the companion-tool start plan in safe sequential order', () => {
    const options = dogfoodStart.parseArgs([
      '--title',
      'Add review helper',
      '--type',
      'feature',
      '--problem',
      'Manual starts are easy to sequence incorrectly.',
      '--outcome',
      'The session starts companion tools in a repeatable order.',
      '--acceptance',
      'AgentFlight starts before AgentLoop task creation.',
      '--verification',
      'npm test -- tests/dogfood-start-script.test.ts',
    ]);

    expect(options.errors).toEqual([]);

    const steps = dogfoodStart.createDogfoodStartSteps(options);

    expect(steps.map((step: { name: string }) => step.name)).toEqual([
      'agentflight session start',
      'agentloop task contract',
      'agentloop status',
      'projscan project scan',
    ]);
    expect(steps[0]).toMatchObject({
      command: 'npx',
      args: ['--yes', 'agentflight', 'start', '--task', 'Add review helper', '--yes'],
    });
    expect(steps[1]).toMatchObject({
      command: 'npx',
      args: [
        '--no-install',
        'tsx',
        'src/cli/index.ts',
        'create-task',
        '--type',
        'feature',
        '--title',
        'Add review helper',
        '--problem',
        'Manual starts are easy to sequence incorrectly.',
        '--outcome',
        'The session starts companion tools in a repeatable order.',
        '--acceptance',
        'AgentFlight starts before AgentLoop task creation.',
        '--verification',
        'npm test -- tests/dogfood-start-script.test.ts',
      ],
    });
    expect(steps[2]).toMatchObject({
      command: 'npx',
      args: ['--no-install', 'tsx', 'src/cli/index.ts', 'status', '--brief', '--redact-paths'],
    });
    expect(steps[3]).toMatchObject({
      command: 'npx',
      args: ['--yes', 'projscan', 'start'],
    });

    const commandText = steps
      .map((step: { command: string; args: string[] }) => [step.command, ...step.args].join(' '))
      .join('\n');
    expect(commandText).not.toContain('dist/cli/index.js');
  });

  test('dry-run reports planned commands without running child processes', async () => {
    const summary = await dogfoodStart.runDogfoodStart({
      dryRun: true,
      title: 'Dry run task',
      type: 'bugfix',
      logger: { log: () => undefined, error: () => undefined },
      runProcess: async () => {
        throw new Error('dry-run should not execute commands');
      },
    });

    expect(summary).toMatchObject({
      status: 'pass',
      dryRun: true,
      safety: {
        publishesPackages: false,
        createsTags: false,
        createsGithubReleases: false,
        readsEnvFiles: false,
        readsTokenFiles: false,
      },
    });
    expect(summary.steps).toHaveLength(4);
    expect(summary.steps.every((step: { status: string }) => step.status === 'planned')).toBe(true);
  });

  test('requires a task title before running companion tools', () => {
    const options = dogfoodStart.parseArgs(['--type', 'feature']);

    expect(options.errors).toContain('Missing required --title value.');
    expect(options.title).toBe('');
  });

  test('normalizes singular test task type before building companion commands', () => {
    const options = dogfoodStart.parseArgs(['--title', 'Add smoke coverage', '--type', 'test']);

    expect(options.errors).toEqual([]);
    expect(options.type).toBe('tests');

    const steps = dogfoodStart.createDogfoodStartSteps(options);

    expect(steps[1]).toMatchObject({
      command: 'npx',
      args: [
        '--no-install',
        'tsx',
        'src/cli/index.ts',
        'create-task',
        '--type',
        'tests',
        '--title',
        'Add smoke coverage',
      ],
    });
  });

  test('rejects unsupported task types before starting AgentFlight', async () => {
    const options = dogfoodStart.parseArgs([
      '--title',
      'Invalid type task',
      '--type',
      'investigation',
    ]);

    expect(options.errors).toContain(
      'Unsupported task type "investigation". Supported task types: feature, bugfix, refactor, tests, test-generation, docs, release, security-review, dependency-upgrade, migration.',
    );

    let startedProcesses = 0;
    await expect(
      dogfoodStart.runDogfoodStart({
        title: 'Invalid type task',
        type: 'investigation',
        logger: { log: () => undefined, error: () => undefined },
        runProcess: async () => {
          startedProcesses += 1;
          return { exitCode: 0 };
        },
      }),
    ).rejects.toThrow('Unsupported task type "investigation"');
    expect(startedProcesses).toBe(0);
  });

  test('help output lists supported task types', async () => {
    const result = await execa(process.execPath, ['scripts/dogfood-start.mjs', '--help'], {
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Supported task types:');
    expect(result.stdout).toContain('tests');
    expect(result.stdout).toContain('test-generation');
  });

  test('builds child process env without inheriting token-like variables', () => {
    const env = dogfoodStart.buildDogfoodStartEnv({
      PATH: '/usr/bin',
      HOME: '/Users/example',
      TMP: '/tmp',
      NPM_TOKEN: 'fixture',
      NODE_AUTH_TOKEN: 'fixture',
      GITHUB_TOKEN: 'fixture',
    });

    expect(env).toMatchObject({
      PATH: '/usr/bin',
      HOME: '/Users/example',
      TMP: '/tmp',
      AGENTLOOPKIT_DOGFOOD: '1',
      FORCE_COLOR: '0',
    });
    expect(env).not.toHaveProperty('NPM_TOKEN');
    expect(env).not.toHaveProperty('NODE_AUTH_TOKEN');
    expect(env).not.toHaveProperty('GITHUB_TOKEN');
  });

  test('detects all exact AgentFlight placeholder task contracts', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const title = 'Prevent dogfood start placeholder task clutter';
    await writeTask(
      dir,
      '.agentloop/tasks/2026-06-16-prevent-dogfood-start-placeholder-task-clutter.md',
      placeholderTaskMarkdown(title),
    );
    await writeTask(
      dir,
      '.agentloop/tasks/2026-06-16-prevent-dogfood-start-placeholder-task-clutter-2.md',
      `# ${title}

- Created date: 2026-06-16
- Task type: bugfix
- Status: in-progress

## Problem Statement
dogfood:start can leave an AgentFlight-generated placeholder task contract parked beside the detailed AgentLoop task.

## Desired Outcome
dogfood:start preserves the detailed AgentLoop task as the active task.
`,
    );
    await writeTask(
      dir,
      '.agentloop/tasks/2026-06-16-other-placeholder.md',
      placeholderTaskMarkdown('Other task'),
    );

    const placeholders = await dogfoodStart.findAgentFlightPlaceholderTaskPaths({
      cwd: dir,
      title,
    });

    expect(placeholders).toEqual([
      '.agentloop/tasks/2026-06-16-other-placeholder.md',
      '.agentloop/tasks/2026-06-16-prevent-dogfood-start-placeholder-task-clutter.md',
    ]);
  });

  test('parks placeholder duplicates after creating the detailed task contract', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const title = 'Prevent dogfood start placeholder task clutter';
    const placeholderPath =
      '.agentloop/tasks/2026-06-16-prevent-dogfood-start-placeholder-task-clutter.md';
    const otherPlaceholderPath = '.agentloop/tasks/2026-06-16-other-placeholder.md';
    await writeTask(dir, placeholderPath, placeholderTaskMarkdown(title));
    await writeTask(dir, otherPlaceholderPath, placeholderTaskMarkdown('Other task'));
    const executedSteps: Array<{ name: string; command: string; args: string[] }> = [];

    const summary = await dogfoodStart.runDogfoodStart({
      cwd: dir,
      title,
      type: 'bugfix',
      logger: { log: () => undefined, error: () => undefined },
      runProcess: async (step: { name: string; command: string; args: string[] }) => {
        executedSteps.push(step);
        return { exitCode: 0 };
      },
    });

    expect(summary.status).toBe('pass');
    expect(executedSteps.map((step) => step.name)).toEqual([
      'agentflight session start',
      'agentloop task contract',
      'agentloop park AgentFlight placeholder task',
      'agentloop park AgentFlight placeholder task',
      'agentloop status',
      'projscan project scan',
    ]);
    expect(executedSteps[2]).toMatchObject({
      command: 'npx',
      args: [
        '--no-install',
        'tsx',
        'src/cli/index.ts',
        'task',
        'status',
        otherPlaceholderPath,
        'deferred',
      ],
    });
    expect(executedSteps[3]).toMatchObject({
      command: 'npx',
      args: [
        '--no-install',
        'tsx',
        'src/cli/index.ts',
        'task',
        'status',
        placeholderPath,
        'deferred',
      ],
    });
    await expect(readFile(path.join(dir, placeholderPath), 'utf8')).resolves.toContain(
      'AgentFlight session task:',
    );
    await expect(readFile(path.join(dir, otherPlaceholderPath), 'utf8')).resolves.toContain(
      'AgentFlight session task:',
    );
  });
});
