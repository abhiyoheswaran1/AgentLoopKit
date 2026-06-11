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
      'packed init rejects symlinked harness targets',
      'packed task archive rejects symlinked archive destinations',
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

  test('builds child process env without inheriting token-like variables', () => {
    const env = smoke.buildChildEnv(
      {
        PATH: '/usr/bin',
        HOME: '/Users/example',
        TMP: '/tmp',
        NPM_TOKEN: 'fixture',
        NODE_AUTH_TOKEN: 'fixture',
        GITHUB_TOKEN: 'fixture',
      },
      { AGENTLOOPKIT_SMOKE: '1' },
    );

    expect(env).toMatchObject({
      PATH: '/usr/bin',
      HOME: '/Users/example',
      TMP: '/tmp',
      AGENTLOOPKIT_SMOKE: '1',
      FORCE_COLOR: '0',
    });
    expect(env).not.toHaveProperty('NPM_TOKEN');
    expect(env).not.toHaveProperty('NODE_AUTH_TOKEN');
    expect(env).not.toHaveProperty('GITHUB_TOKEN');
  });

  test('accepts README pins for the packed package version', () => {
    const readme = [
      'npx --yes agentloopkit@0.24.4 version',
      'npx --yes agentloopkit@0.24.4 init',
    ].join('\n');

    expect(() => smoke.assertReadmePins(readme, '0.24.4')).not.toThrow();
  });

  test('accepts README without exact package version pins', () => {
    const readme = ['npx agentloopkit init', 'npm install --save-dev agentloopkit'].join('\n');

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

  test('rejects hardcoded AgentLoopKit version pins in normal public docs', () => {
    expect(() =>
      smoke.assertPublicDocsDoNotPinVersions([
        {
          filePath: 'docs/github-actions.md',
          content: 'npm install --no-save agentloopkit@0.26.1',
        },
        {
          filePath: 'examples/github-actions/README.md',
          content: 'uses: abhiyoheswaran1/AgentLoopKit@v0.26.1',
        },
      ]),
    ).toThrow('docs/github-actions.md contains hardcoded AgentLoopKit version pin 0.26.1');
  });

  test('allows release history docs to keep exact version evidence', () => {
    expect(() =>
      smoke.assertPublicDocsDoNotPinVersions([
        {
          filePath: 'docs/release-status.md',
          content: 'npx --yes agentloopkit@0.27.0 version',
        },
        {
          filePath: 'docs/launch-checklist.md',
          content: 'GitHub release `v0.27.0` is public',
        },
      ]),
    ).not.toThrow();
  });

  test('rejects unsupported install-channel claims in public docs', () => {
    expect(() =>
      smoke.assertPublicDocsAvoidUnsupportedClaims([
        {
          filePath: 'docs/npm-publishing.md',
          content: 'Users can run brew install agentloopkit through Homebrew.',
        },
      ]),
    ).toThrow('docs/npm-publishing.md contains unsupported public claim: Homebrew claim');
  });

  test('rejects maintainer-only chatter in normal public docs', () => {
    expect(() =>
      smoke.assertPublicDocsAvoidUnsupportedClaims([
        {
          filePath: 'README.md',
          content: 'Latest GitHub release: v0.27.0. npm still serves an old package.',
        },
      ]),
    ).toThrow('README.md contains maintainer-only release chatter');
  });

  test('allows release history docs to discuss trusted publishing state', () => {
    expect(() =>
      smoke.assertPublicDocsAvoidUnsupportedClaims([
        {
          filePath: 'docs/release-status.md',
          content: 'npm trusted publishing is configured for the release workflow.',
        },
      ]),
    ).not.toThrow();
  });

  test('current public docs avoid hardcoded AgentLoopKit version pins', async () => {
    const files = await smoke.collectPublicDocPinFiles(process.cwd());

    expect(() => smoke.assertPublicDocsDoNotPinVersions(files)).not.toThrow();
  });

  test('current public docs avoid unsupported channel claims and internal chatter', async () => {
    const files = await smoke.collectPublicDocPinFiles(process.cwd());

    expect(() => smoke.assertPublicDocsAvoidUnsupportedClaims(files)).not.toThrow();
  });
});
