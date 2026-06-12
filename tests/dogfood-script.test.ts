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
      'review evidence gates',
      'artifact inventory',
      'maintainer reviewability check',
      'agent review context',
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
    expect(steps[3].args).toEqual([
      '--no-install',
      'tsx',
      'src/cli/index.ts',
      'check-gates',
      '--redact-paths',
    ]);
    expect(steps[3].allowFailure).toBe(true);
    expect(steps[5].allowFailure).toBe(true);
    expect(steps[7].command).toBe('npx');
    expect(steps[7].args).toEqual(['--yes', 'projscan', 'doctor', '--format', 'markdown']);
  });

  test('adds strict gate mode only when requested', () => {
    const steps = dogfood.createDogfoodSteps({ strict: true });

    expect(steps[3].args).toEqual([
      '--no-install',
      'tsx',
      'src/cli/index.ts',
      'check-gates',
      '--redact-paths',
      '--strict',
    ]);
    expect(steps[3].allowFailure).toBe(false);
    expect(steps[5].allowFailure).toBe(false);
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
