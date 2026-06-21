import { describe, expect, test } from 'vitest';
// @ts-expect-error TS7016: static import keeps helper usage visible to projscan.
import * as maintenance from '../scripts/maintenance-check.mjs';

describe('maintenance check script helpers', () => {
  test('builds a near-term roadmap health check plan', () => {
    const steps = maintenance.createMaintenanceCheckSteps();

    expect(steps.map((step: { name: string }) => step.name)).toEqual([
      'unit tests',
      'typecheck',
      'public docs hygiene',
      'markdown links',
      'release proof smoke',
      'npm status safety tests',
      'schemastore entry',
      'schemastore consistency tests',
      'policy pack inventory',
      'policy pack safety tests',
      'github metadata import surface',
      'github metadata safety tests',
      'github metadata ship-score neutrality tests',
      'agentflight version',
      'projscan project health',
      'dogfood self-check',
    ]);

    expect(steps[0]).toMatchObject({
      command: 'npm',
      args: ['run', 'test:unit'],
      allowFailure: false,
    });
    expect(steps[1]).toMatchObject({
      command: 'npm',
      args: ['run', 'typecheck'],
      allowFailure: false,
    });
    expect(steps[2].args).toEqual(['run', 'check:public-docs']);
    expect(steps[3].args).toEqual(['run', 'check:links']);
    expect(steps[4].args).toEqual([
      '--no-install',
      'tsx',
      'src/cli/index.ts',
      'release-proof',
      '--only',
      'npm',
      '--redact-paths',
    ]);
    expect(steps[5]).toMatchObject({
      command: 'npm',
      args: ['test', '--', 'tests/npm-status.test.ts'],
      allowFailure: false,
    });
    expect(steps[6].args).toEqual([
      '--no-install',
      'tsx',
      'src/cli/index.ts',
      'schemastore',
      '--json',
    ]);
    expect(steps[7]).toMatchObject({
      command: 'npm',
      args: ['test', '--', 'tests/schemastore.test.ts'],
      allowFailure: false,
    });
    expect(steps[8].args).toEqual([
      '--no-install',
      'tsx',
      'src/cli/index.ts',
      'policy',
      'packs',
      '--json',
    ]);
    expect(steps[9]).toMatchObject({
      command: 'npm',
      args: ['test', '--', 'tests/policy-packs.test.ts'],
      allowFailure: false,
    });
    expect(steps[10].args).toEqual([
      '--no-install',
      'tsx',
      'src/cli/index.ts',
      'github',
      'import',
      '--help',
    ]);
    expect(steps[11]).toMatchObject({
      command: 'npm',
      args: ['test', '--', 'tests/github-metadata.test.ts'],
      allowFailure: false,
    });
    expect(steps[12]).toMatchObject({
      command: 'npm',
      args: [
        'test',
        '--',
        'tests/ship.test.ts',
        '-t',
        'keeps imported GitHub metadata neutral for ship scoring',
      ],
      allowFailure: false,
    });
    expect(steps[13].args).toEqual(['--yes', 'agentflight@latest', '--version']);
    expect(steps[14].args).toEqual(['--yes', 'projscan', '--format', 'json', 'doctor']);
    expect(steps[15].args).toEqual(['run', 'dogfood']);
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
    expect(commandText).not.toContain('release-proof --strict');
    expect(commandText).not.toMatch(/\btoken\b/i);
    expect(commandText).not.toMatch(/\.env/);
  });

  test('maintenance check includes SchemaStore consistency tests', () => {
    const steps = maintenance.createMaintenanceCheckSteps();
    const stepNames = steps.map((step: { name: string }) => step.name);
    const entryIndex = stepNames.indexOf('schemastore entry');
    const consistencyIndex = stepNames.indexOf('schemastore consistency tests');

    expect(entryIndex).toBeGreaterThanOrEqual(0);
    expect(consistencyIndex).toBeGreaterThan(entryIndex);
    expect(steps[consistencyIndex]).toMatchObject({
      command: 'npm',
      args: ['test', '--', 'tests/schemastore.test.ts'],
      allowFailure: false,
    });
  });

  test('maintenance check includes npm status safety tests', () => {
    const steps = maintenance.createMaintenanceCheckSteps();
    const stepNames = steps.map((step: { name: string }) => step.name);
    const releaseProofIndex = stepNames.indexOf('release proof smoke');
    const npmStatusIndex = stepNames.indexOf('npm status safety tests');
    const schemaStoreIndex = stepNames.indexOf('schemastore entry');

    expect(releaseProofIndex).toBeGreaterThanOrEqual(0);
    expect(npmStatusIndex).toBe(releaseProofIndex + 1);
    expect(schemaStoreIndex).toBe(npmStatusIndex + 1);
    expect(steps[npmStatusIndex]).toMatchObject({
      command: 'npm',
      args: ['test', '--', 'tests/npm-status.test.ts'],
      allowFailure: false,
    });
  });

  test('maintenance check includes policy pack safety tests', () => {
    const steps = maintenance.createMaintenanceCheckSteps();
    const stepNames = steps.map((step: { name: string }) => step.name);
    const inventoryIndex = stepNames.indexOf('policy pack inventory');
    const safetyIndex = stepNames.indexOf('policy pack safety tests');

    expect(inventoryIndex).toBeGreaterThanOrEqual(0);
    expect(safetyIndex).toBeGreaterThan(inventoryIndex);
    expect(steps[safetyIndex]).toMatchObject({
      command: 'npm',
      args: ['test', '--', 'tests/policy-packs.test.ts'],
      allowFailure: false,
    });
  });

  test('maintenance check includes GitHub metadata safety tests', () => {
    const steps = maintenance.createMaintenanceCheckSteps();
    const stepNames = steps.map((step: { name: string }) => step.name);
    const surfaceIndex = stepNames.indexOf('github metadata import surface');
    const safetyIndex = stepNames.indexOf('github metadata safety tests');

    expect(surfaceIndex).toBeGreaterThanOrEqual(0);
    expect(safetyIndex).toBeGreaterThan(surfaceIndex);
    expect(steps[surfaceIndex].args).toEqual([
      '--no-install',
      'tsx',
      'src/cli/index.ts',
      'github',
      'import',
      '--help',
    ]);
    expect(steps[safetyIndex]).toMatchObject({
      command: 'npm',
      args: ['test', '--', 'tests/github-metadata.test.ts'],
      allowFailure: false,
    });
  });

  test('maintenance check includes GitHub metadata ship scoring neutrality tests', () => {
    const steps = maintenance.createMaintenanceCheckSteps();
    const stepNames = steps.map((step: { name: string }) => step.name);
    const safetyIndex = stepNames.indexOf('github metadata safety tests');
    const neutralityIndex = stepNames.indexOf('github metadata ship-score neutrality tests');

    expect(safetyIndex).toBeGreaterThanOrEqual(0);
    expect(neutralityIndex).toBeGreaterThan(safetyIndex);
    expect(steps[neutralityIndex]).toMatchObject({
      command: 'npm',
      args: [
        'test',
        '--',
        'tests/ship.test.ts',
        '-t',
        'keeps imported GitHub metadata neutral for ship scoring',
      ],
      allowFailure: false,
    });
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
