import { describe, expect, test } from 'vitest';
// @ts-expect-error TS7016: static import keeps helper usage visible to projscan.
import * as smoke from '../scripts/smoke-packed-release.mjs';

describe('release smoke script helpers', () => {
  test('detects direct execution when the script path contains spaces', () => {
    expect(
      smoke.isDirectRun(
        'file:///Users/example/local%20dev%20folder/Apps/AgentLoopKit/scripts/smoke-packed-release.mjs',
        '/Users/example/local dev folder/Apps/AgentLoopKit/scripts/smoke-packed-release.mjs',
      ),
    ).toBe(true);
  });

  test('builds isolated packed-package smoke steps', () => {
    const steps = smoke.createSmokeSteps({
      version: '0.24.4',
      tarballPath: '/tmp/agentloopkit-0.24.4.tgz',
    });

    expect(steps.map((step: { name: string }) => step.name)).toEqual([
      'packed binary prints package version',
      'packed init writes AgentLoopKit files in a project directory',
      'packed local-only init excludes AgentLoopKit files from local git tracking',
      'packed create-task rejects output outside the task directory',
      'packed verify reports outside task paths as unavailable',
      'packed init dry-run refuses the home directory',
    ]);
    for (const step of steps) {
      expect(step.cwd).toBe('temp');
      expect(step.env).toEqual({});
    }
    expect(steps[0].command).toEqual('npx');
    expect(steps[0].args).toEqual([
      '--yes',
      '--package',
      '/tmp/agentloopkit-0.24.4.tgz',
      'agentloop',
      'version',
    ]);
    expect(steps[2].args).toEqual([
      '--yes',
      '--package',
      '/tmp/agentloopkit-0.24.4.tgz',
      'agentloop',
      'init',
      '--local-only',
    ]);
  });

  test('accepts README pins for the packed package version', () => {
    const readme = [
      'npx --yes agentloopkit@0.24.4 version',
      'npx --yes agentloopkit@0.24.4 init',
    ].join('\n');

    expect(() => smoke.assertReadmePins(readme, '0.24.4')).not.toThrow();
  });

  test('rejects stale README pins for older package versions', () => {
    const readme = [
      'npx --yes agentloopkit@0.24.3 version',
      'npx --yes agentloopkit@0.24.4 init',
    ].join('\n');

    expect(() => smoke.assertReadmePins(readme, '0.24.4')).toThrow(
      'README contains stale pinned version 0.24.3',
    );
  });
});
