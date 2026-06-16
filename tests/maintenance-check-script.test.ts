import { describe, expect, test } from 'vitest';
// @ts-expect-error TS7016: static import keeps helper usage visible to projscan.
import * as maintenance from '../scripts/maintenance-check.mjs';

describe('maintenance check script helpers', () => {
  test('builds a near-term roadmap health check plan', () => {
    const steps = maintenance.createMaintenanceCheckSteps();

    expect(steps.map((step: { name: string }) => step.name)).toEqual([
      'unit tests',
      'public docs hygiene',
      'markdown links',
      'release proof',
      'schemastore entry',
      'policy pack inventory',
      'policy pack safety tests',
      'github metadata import surface',
      'github metadata safety tests',
      'agentflight version',
      'projscan project health',
      'dogfood self-check',
    ]);

    expect(steps[0]).toMatchObject({
      command: 'npm',
      args: ['run', 'test:unit'],
      allowFailure: false,
    });
    expect(steps[1].args).toEqual(['run', 'check:public-docs']);
    expect(steps[2].args).toEqual(['run', 'check:links']);
    expect(steps[3].args).toEqual([
      '--no-install',
      'tsx',
      'src/cli/index.ts',
      'release-proof',
      '--strict',
      '--redact-paths',
    ]);
    expect(steps[4].args).toEqual([
      '--no-install',
      'tsx',
      'src/cli/index.ts',
      'schemastore',
      '--json',
    ]);
    expect(steps[5].args).toEqual([
      '--no-install',
      'tsx',
      'src/cli/index.ts',
      'policy',
      'packs',
      '--json',
    ]);
    expect(steps[6]).toMatchObject({
      command: 'npm',
      args: ['test', '--', 'tests/policy-packs.test.ts'],
      allowFailure: false,
    });
    expect(steps[7].args).toEqual([
      '--no-install',
      'tsx',
      'src/cli/index.ts',
      'github',
      'import',
      '--help',
    ]);
    expect(steps[8]).toMatchObject({
      command: 'npm',
      args: ['test', '--', 'tests/github-metadata.test.ts'],
      allowFailure: false,
    });
    expect(steps[9].args).toEqual(['--yes', 'agentflight@latest', '--version']);
    expect(steps[10].args).toEqual(['--yes', 'projscan', '--format', 'json', 'doctor']);
    expect(steps[11].args).toEqual(['run', 'dogfood']);
  });

  test('does not include release mutation or credential-reading commands', () => {
    const commandText = maintenance
      .createMaintenanceCheckSteps()
      .map((step: { command: string; args: string[] }) => [step.command, ...step.args].join(' '))
      .join('\n');

    expect(commandText).not.toMatch(/\bnpm publish\b/);
    expect(commandText).not.toMatch(/\bgh release create\b/);
    expect(commandText).not.toMatch(/\bgit tag\b/);
    expect(commandText).not.toMatch(/\bmcp-publisher publish\b/);
    expect(commandText).not.toMatch(/\btoken\b/i);
    expect(commandText).not.toMatch(/\.env/);
  });

  test('builds child process env without inheriting token-like variables', () => {
    const env = maintenance.buildMaintenanceEnv({
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
      AGENTLOOPKIT_MAINTENANCE_CHECK: '1',
      FORCE_COLOR: '0',
    });
    expect(env).not.toHaveProperty('NPM_TOKEN');
    expect(env).not.toHaveProperty('NODE_AUTH_TOKEN');
    expect(env).not.toHaveProperty('GITHUB_TOKEN');
  });
});
