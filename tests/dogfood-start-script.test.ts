import { describe, expect, test } from 'vitest';
// @ts-expect-error TS7016: static import keeps helper usage visible to projscan.
import * as dogfoodStart from '../scripts/dogfood-start.mjs';

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
      args: [
        '--no-install',
        'tsx',
        'src/cli/index.ts',
        'status',
        '--brief',
        '--redact-paths',
      ],
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
    expect(summary.steps.every((step: { status: string }) => step.status === 'planned')).toBe(
      true,
    );
  });

  test('requires a task title before running companion tools', () => {
    const options = dogfoodStart.parseArgs(['--type', 'feature']);

    expect(options.errors).toContain('Missing required --title value.');
    expect(options.title).toBe('');
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
});
