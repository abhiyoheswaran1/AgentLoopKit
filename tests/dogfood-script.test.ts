import { describe, expect, test } from 'vitest';
// @ts-expect-error TS7016: static import keeps helper usage visible to projscan.
import * as dogfood from '../scripts/dogfood.mjs';

describe('dogfood script helpers', () => {
  test('builds the default read-only dogfood step plan', () => {
    const steps = dogfood.createDogfoodSteps({ strict: false });

    expect(steps.map((step: { name: string }) => step.name)).toEqual([
      'task folder hygiene',
      'current loop status',
      'public docs hygiene',
      'dependency audit',
      'harness upgrade audit',
      'review evidence gates',
      'artifact inventory',
      'maintainer reviewability check',
      'agent review context',
      'agentflight session health',
      'projscan project health',
    ]);

    expect(steps[0].args).toEqual([
      '--no-install',
      'tsx',
      'src/cli/index.ts',
      'task',
      'doctor',
      '--json',
    ]);
    expect(steps[2].command).toBe('node');
    expect(steps[2].args).toEqual(['scripts/public-docs-hygiene.mjs']);
    expect(steps[2].allowFailure).toBe(false);
    expect(steps[3].command).toBe('npx');
    expect(steps[3].args).toEqual([
      '--yes',
      'pnpm@10.12.1',
      'audit',
      '--audit-level',
      'high',
    ]);
    expect(steps[3].allowFailure).toBe(false);
    expect(steps[4].args).toEqual([
      '--no-install',
      'tsx',
      'src/cli/index.ts',
      'upgrade-harness',
      '--json',
      '--redact-paths',
    ]);
    expect(steps[4].allowFailure).toBe(false);
    expect(steps[5].args).toEqual([
      '--no-install',
      'tsx',
      'src/cli/index.ts',
      'check-gates',
      '--redact-paths',
    ]);
    expect(steps[5].allowFailure).toBe(true);
    expect(steps[7].args).toEqual([
      '--no-install',
      'tsx',
      'src/cli/index.ts',
      'maintainer-check',
      '--json',
      '--redact-paths',
    ]);
    expect(steps[7].allowFailure).toBe(true);
    expect(steps[8].args).toEqual([
      '--no-install',
      'tsx',
      'src/cli/index.ts',
      'review-context',
      '--json',
      '--redact-paths',
    ]);
    expect(steps[9].command).toBe('npx');
    expect(steps[9].args).toEqual(['--yes', 'agentflight', 'doctor']);
    expect(steps[9].allowFailure).toBe(false);
    expect(steps[10].command).toBe('npx');
    expect(steps[10].args).toEqual(['--yes', 'projscan', '--format', 'markdown', 'doctor']);
  });

  test('adds strict gate mode only when requested', () => {
    const steps = dogfood.createDogfoodSteps({ strict: true });

    expect(steps[5].args).toEqual([
      '--no-install',
      'tsx',
      'src/cli/index.ts',
      'check-gates',
      '--redact-paths',
      '--strict',
    ]);
    expect(steps[5].allowFailure).toBe(false);
    expect(steps[7].allowFailure).toBe(false);
  });

  test('parses JSON mode without changing strict mode parsing', () => {
    expect(dogfood.parseArgs(['--json'])).toMatchObject({
      json: true,
      strict: false,
      help: false,
    });
    expect(dogfood.parseArgs(['--strict', '--json'])).toMatchObject({
      json: true,
      strict: true,
      help: false,
    });
  });

  test('returns a deterministic JSON-friendly summary for passing dogfood steps', async () => {
    const logs: string[] = [];
    const summary = await dogfood.runDogfood({
      strict: true,
      json: true,
      cwd: process.cwd(),
      steps: [
        { name: 'first check', command: 'node', args: ['first.js'], allowFailure: false },
        { name: 'second check', command: 'node', args: ['second.js'], allowFailure: false },
      ],
      logger: {
        log: (message: string) => logs.push(message),
        error: (message: string) => logs.push(message),
      },
      now: (() => {
        const values = [1000, 1017, 2000, 2042];
        return () => values.shift() ?? 2042;
      })(),
      runProcess: async () => ({ exitCode: 0 }),
    });

    expect(logs).toEqual([]);
    expect(summary).toMatchObject({
      mode: 'strict',
      strict: true,
      status: 'pass',
      safety: {
        publishesPackages: false,
        createsTags: false,
        readsEnvFiles: false,
        readsTokenFiles: false,
        runsVerificationCommands: false,
      },
      steps: [
        {
          name: 'first check',
          commandText: 'node first.js',
          allowFailure: false,
          exitCode: 0,
          status: 'pass',
          durationMs: 17,
        },
        {
          name: 'second check',
          commandText: 'node second.js',
          allowFailure: false,
          exitCode: 0,
          status: 'pass',
          durationMs: 42,
        },
      ],
    });
  });

  test('records a failed JSON summary and skips remaining strict steps', async () => {
    const seen: string[] = [];
    const summary = await dogfood.runDogfood({
      strict: true,
      json: true,
      cwd: process.cwd(),
      steps: [
        { name: 'fails', command: 'node', args: ['fail.js'], allowFailure: false },
        { name: 'skipped', command: 'node', args: ['skip.js'], allowFailure: false },
      ],
      logger: { log: () => undefined, error: () => undefined },
      now: (() => {
        const values = [3000, 3050];
        return () => values.shift() ?? 3050;
      })(),
      runProcess: async (step: { name: string }) => {
        seen.push(step.name);
        return { exitCode: 9, errorMessage: 'fixture failure' };
      },
    });

    expect(seen).toEqual(['fails']);
    expect(summary).toMatchObject({
      status: 'fail',
      steps: [
        {
          name: 'fails',
          status: 'fail',
          exitCode: 9,
          errorMessage: 'fixture failure',
          durationMs: 50,
        },
      ],
    });
  });

  test('redacts the workspace root from JSON summaries', async () => {
    const cwd = process.cwd();
    const summary = await dogfood.runDogfood({
      strict: true,
      json: true,
      cwd,
      steps: [
        {
          name: 'path leak fixture',
          command: 'node',
          args: [cwd, `${cwd}/src/cli/index.ts`],
          allowFailure: false,
        },
      ],
      logger: { log: () => undefined, error: () => undefined },
      now: (() => {
        const values = [5000, 5011];
        return () => values.shift() ?? 5011;
      })(),
      runProcess: async () => ({
        exitCode: 7,
        errorMessage: `failed while reading ${cwd}/agentloop.config.json`,
      }),
    });

    const json = JSON.stringify(summary);
    expect(json).not.toContain(cwd);
    expect(summary.steps[0]).toMatchObject({
      args: ['[git-root]', '[git-root]/src/cli/index.ts'],
      commandText: 'node [git-root] [git-root]/src/cli/index.ts',
      errorMessage: 'failed while reading [git-root]/agentloop.config.json',
    });
  });

  test('keeps allowed default-mode dogfood failures non-blocking in JSON summaries', async () => {
    const summary = await dogfood.runDogfood({
      strict: false,
      json: true,
      cwd: process.cwd(),
      steps: [{ name: 'warning gate', command: 'node', args: ['warn.js'], allowFailure: true }],
      logger: { log: () => undefined, error: () => undefined },
      now: (() => {
        const values = [4000, 4025];
        return () => values.shift() ?? 4025;
      })(),
      runProcess: async () => ({ exitCode: 2 }),
    });

    expect(summary.status).toBe('pass');
    expect(summary.steps[0]).toMatchObject({
      name: 'warning gate',
      status: 'allowed-failure',
      exitCode: 2,
      durationMs: 25,
    });
  });

  test('does not include release, publish, token, or write-heavy commands', () => {
    const steps = dogfood.createDogfoodSteps({ strict: true });
    const commandText = steps
      .map((step: { command: string; args: string[] }) => [step.command, ...step.args].join(' '))
      .join('\n');

    expect(commandText).not.toMatch(/\bpublish\b/);
    expect(commandText).not.toMatch(/\brelease-check\b/);
    expect(commandText).not.toMatch(/\bnpm-status\b/);
    expect(commandText).not.toMatch(/\bship\b/);
    expect(commandText).not.toMatch(/\bprepare-pr\b/);
    expect(commandText).not.toMatch(/\bverify\b/);
    expect(commandText).not.toMatch(/\bpack\b/);
    expect(commandText).not.toMatch(/\btoken\b/i);
    expect(commandText).toContain('npx --yes pnpm@10.12.1 audit --audit-level high');
    expect(commandText).toContain('npx --yes agentflight doctor');
    expect(commandText).toContain('npx --yes projscan --format markdown doctor');
  });

  test('builds child process env without inheriting token-like variables', () => {
    const env = dogfood.buildDogfoodEnv({
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
