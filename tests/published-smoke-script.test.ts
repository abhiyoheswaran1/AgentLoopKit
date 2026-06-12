import { describe, expect, test } from 'vitest';
// @ts-expect-error TS7016: static import keeps helper usage visible to projscan.
import * as publishedSmoke from '../scripts/smoke-published-package.mjs';

describe('published package smoke script helpers', () => {
  test('builds a clean-temp published package smoke plan', () => {
    const steps = publishedSmoke.createPublishedSmokeSteps({
      packageName: 'agentloopkit',
      version: '0.28.1',
    });

    expect(steps.map((step: { name: string }) => step.name)).toEqual([
      'registry version lookup',
      'npx package binary version',
      'npx init dry-run',
      'install published package',
      'installed agentloop bin version',
      'installed agentloopkit bin version',
    ]);

    expect(steps[0]).toMatchObject({
      command: 'npm',
      args: ['view', 'agentloopkit@0.28.1', 'version'],
      cwdMode: 'base',
      expectedStdout: '0.28.1',
    });
    expect(steps[1]).toMatchObject({
      command: 'npx',
      args: ['--yes', 'agentloopkit@0.28.1', 'version'],
      cwdMode: 'npx-temp',
      expectedStdout: '0.28.1',
    });
    expect(steps[2]).toMatchObject({
      command: 'npx',
      args: ['--yes', 'agentloopkit@0.28.1', 'init', '--dry-run', '--json'],
      cwdMode: 'npx-temp',
    });
    expect(steps[3]).toMatchObject({
      command: 'npm',
      args: [
        'install',
        'agentloopkit@0.28.1',
        '--ignore-scripts',
        '--no-audit',
        '--no-fund',
      ],
      cwdMode: 'install-temp',
    });
    expect(steps[4].cwdMode).toBe('install-temp');
    expect(steps[5].cwdMode).toBe('install-temp');
  });

  test('resolves installed bin paths cross-platform', () => {
    expect(
      publishedSmoke.createInstalledBinCommand({
        cwd: '/tmp/check',
        binName: 'agentloop',
        platform: 'darwin',
      }),
    ).toEqual({
      command: '/tmp/check/node_modules/.bin/agentloop',
      args: ['version'],
    });

    expect(
      publishedSmoke.createInstalledBinCommand({
        cwd: 'C:\\tmp\\check',
        binName: 'agentloopkit',
        platform: 'win32',
      }),
    ).toEqual({
      command: 'C:\\tmp\\check\\node_modules\\.bin\\agentloopkit.cmd',
      args: ['version'],
    });
  });

  test('does not include publish, tag, GitHub, or token commands', () => {
    const steps = publishedSmoke.createPublishedSmokeSteps({
      packageName: 'agentloopkit',
      version: '0.28.1',
    });
    const commandText = steps
      .map((step: { command: string; args: string[] }) => [step.command, ...step.args].join(' '))
      .join('\n');

    expect(commandText).not.toMatch(/\bpublish\b/);
    expect(commandText).not.toMatch(/\btag\b/);
    expect(commandText).not.toMatch(/\bgh\b/);
    expect(commandText).not.toMatch(/\bgithub\b/i);
    expect(commandText).not.toMatch(/\btoken\b/i);
  });

  test('builds child process env without inheriting token-like variables', () => {
    const env = publishedSmoke.buildPublishedSmokeEnv({
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
      AGENTLOOPKIT_PUBLISHED_SMOKE: '1',
      FORCE_COLOR: '0',
    });
    expect(env).not.toHaveProperty('NPM_TOKEN');
    expect(env).not.toHaveProperty('NODE_AUTH_TOKEN');
    expect(env).not.toHaveProperty('GITHUB_TOKEN');
  });

  test('summarizes init dry-run JSON without printing generated paths', () => {
    const summary = publishedSmoke.summarizeDryRunJson(
      JSON.stringify({
        created: ['/tmp/repo/.agentloop/README.md', '/tmp/repo/AGENTS.md'],
        updated: ['/tmp/repo/AGENTLOOP.md'],
        skipped: [],
        dryRun: true,
      }),
    );

    expect(summary).toBe('dryRun=true; created=2; updated=1; skipped=0');
  });

  test('formats installed bin commands without absolute temp paths', () => {
    const display = publishedSmoke.formatStepCommandForDisplay({
      command: '/tmp/check/node_modules/.bin/agentloop',
      args: ['version'],
      installedBin: 'agentloop',
    });

    expect(display).toBe('<installed agentloop bin> version');
  });
});
