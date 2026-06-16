import { describe, expect, test } from 'vitest';
import { mkdtemp, mkdir, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
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

  test('rejects incomplete README redaction guidance', () => {
    const readme = [
      'Use `--redact-paths` with `status`, `next`, `check-gates`, `ship`, or `prepare-pr` before pasting output into a public issue, PR, or CI log.',
    ].join('\n');

    expect(() => smoke.assertReadmeRedactionGuidance(readme)).toThrow(
      'README redaction guidance is missing `doctor`',
    );
  });

  test('accepts README redaction guidance with every shareable redaction command', () => {
    const readme = [
      'Use `--redact-paths` with `doctor`, `status`, `next`, `review-context`, `check-gates`, `ship`, `prepare-pr`, `maintainer-check`, `upgrade-harness`, `release-check`, or `release-proof` before pasting output into a public issue, PR, or CI log.',
    ].join('\n');

    expect(() => smoke.assertReadmeRedactionGuidance(readme)).not.toThrow();
  });

  test('rejects stale planned-release batch guidance in repo harness files', () => {
    expect(() =>
      smoke.assertRepoHarnessAvoidsStaleReleaseBatch([
        {
          filePath: 'AGENTS.md',
          content:
            'Accumulate current unreleased work for the planned `0.28.0` batch until the maintainer explicitly asks for release prep.',
        },
      ]),
    ).toThrow('AGENTS.md contains stale repo harness release guidance');
  });

  test('accepts roadmap current-state release lines for the expected version', () => {
    const content = [
      '# Roadmap',
      '',
      '## Current State',
      '',
      '- GitHub release `v0.28.3` is public.',
      '- npm latest is `agentloopkit@0.28.3`.',
      '- GHCR and MCP Registry are live for `0.28.3`.',
      '- GitHub Marketplace listing is pending owner UI publication for the composite Action.',
      '- Release tag `v0.28.3` points at the published release commit. Current `main` may include post-release bookkeeping.',
      '',
      '## Later',
    ].join('\n');

    expect(() =>
      smoke.assertRoadmapCurrentReleaseState({
        filePath: 'ROADMAP.md',
        content,
        version: '0.28.3',
      }),
    ).not.toThrow();
  });

  test('rejects stale roadmap current-state release lines', () => {
    const content = [
      '# Roadmap',
      '',
      '## Current State',
      '',
      '- GitHub release `v0.28.1` is public.',
      '- npm latest is `agentloopkit@0.28.1`.',
      '- GHCR and MCP Registry are live for `0.28.1`.',
      '- GitHub Marketplace listing is pending owner UI publication for the composite Action.',
      '- Release tag `v0.28.1` points at the published release commit. Current `main` may include post-release bookkeeping.',
      '',
      '## Later',
    ].join('\n');

    expect(() =>
      smoke.assertRoadmapCurrentReleaseState({
        filePath: 'ROADMAP.md',
        content,
        version: '0.28.3',
      }),
    ).toThrow('ROADMAP.md current state is stale: expected current public release v0.28.3');
  });

  test('current public docs avoid hardcoded AgentLoopKit version pins', async () => {
    const files = await smoke.collectPublicDocPinFiles(process.cwd());

    expect(() => smoke.assertPublicDocsDoNotPinVersions(files)).not.toThrow();
  });

  test('current public docs avoid unsupported channel claims and internal chatter', async () => {
    const files = await smoke.collectPublicDocPinFiles(process.cwd());

    expect(() => smoke.assertPublicDocsAvoidUnsupportedClaims(files)).not.toThrow();
  });

  test('current repo harness avoids stale planned-release batch guidance', async () => {
    const files = await smoke.collectRepoHarnessFiles(process.cwd());

    expect(() => smoke.assertRepoHarnessAvoidsStaleReleaseBatch(files)).not.toThrow();
  });

  test('current roadmap release state matches package metadata', async () => {
    const [roadmap, packageJson] = await Promise.all([
      readFile('ROADMAP.md', 'utf8'),
      readFile('package.json', 'utf8'),
    ]);
    const version = JSON.parse(packageJson).version;

    expect(() =>
      smoke.assertRoadmapCurrentReleaseState({
        filePath: 'ROADMAP.md',
        content: roadmap,
        version,
      }),
    ).not.toThrow();
  });

  test('public docs hygiene helper checks docs, repo harness, and roadmap without packing', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'agentloopkit-public-docs-hygiene-'));
    await mkdir(path.join(dir, 'docs'), { recursive: true });
    await mkdir(path.join(dir, 'examples'), { recursive: true });
    await mkdir(path.join(dir, '.github'), { recursive: true });

    await writeFile(path.join(dir, 'package.json'), JSON.stringify({ version: '9.8.7' }));
    await writeFile(path.join(dir, 'README.md'), 'Run `npx agentloopkit init`.\n');
    await writeFile(path.join(dir, 'docs', 'guide.md'), 'No cloud backend.\n');
    await writeFile(path.join(dir, 'examples', 'README.md'), 'Example.\n');
    await writeFile(path.join(dir, '.github', 'PULL_REQUEST_TEMPLATE.md'), 'Checklist.\n');
    await writeFile(path.join(dir, 'AGENTS.md'), 'Keep release guidance generic.\n');
    await writeFile(path.join(dir, 'AGENTLOOP.md'), 'Use the local loop.\n');
    await writeFile(
      path.join(dir, 'ROADMAP.md'),
      [
        '# Roadmap',
        '',
        '## Current State',
        '',
        '- GitHub release `v9.8.7` is public.',
        '- npm latest is `agentloopkit@9.8.7`.',
        '- GHCR and MCP Registry are live for `9.8.7`.',
        '- GitHub Marketplace listing is pending owner UI publication for the composite Action.',
        '- Release tag `v9.8.7` points at the published release commit.',
      ].join('\n'),
    );

    await expect(smoke.runPublicDocsHygiene({ cwd: dir })).resolves.toMatchObject({
      version: '9.8.7',
      publicDocCount: 4,
      repoHarnessCount: 2,
    });

    await writeFile(path.join(dir, 'README.md'), 'Latest GitHub release: v9.8.7.\n');

    await expect(smoke.runPublicDocsHygiene({ cwd: dir })).rejects.toThrow(
      'README.md contains maintainer-only release chatter',
    );
  });

  test('public docs hygiene rejects stale final handoff current release copy', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'agentloopkit-final-handoff-hygiene-'));
    await mkdir(path.join(dir, 'docs'), { recursive: true });
    await mkdir(path.join(dir, 'examples'), { recursive: true });
    await mkdir(path.join(dir, '.github'), { recursive: true });

    await writeFile(path.join(dir, 'package.json'), JSON.stringify({ version: '9.8.7' }));
    await writeFile(path.join(dir, 'README.md'), 'Run `npx agentloopkit init`.\n');
    await writeFile(path.join(dir, 'docs', 'guide.md'), 'No cloud backend.\n');
    await writeFile(path.join(dir, 'examples', 'README.md'), 'Example.\n');
    await writeFile(path.join(dir, '.github', 'PULL_REQUEST_TEMPLATE.md'), 'Checklist.\n');
    await writeFile(path.join(dir, 'AGENTS.md'), 'Keep release guidance generic.\n');
    await writeFile(path.join(dir, 'AGENTLOOP.md'), 'Use the local loop.\n');
    await writeFile(
      path.join(dir, 'ROADMAP.md'),
      [
        '# Roadmap',
        '',
        '## Current State',
        '',
        '- GitHub release `v9.8.7` is public.',
        '- npm latest is `agentloopkit@9.8.7`.',
        '- GHCR and MCP Registry are live for `9.8.7`.',
        '- GitHub Marketplace listing is pending owner UI publication for the composite Action.',
        '- Release tag `v9.8.7` points at the published release commit.',
      ].join('\n'),
    );
    await writeFile(
      path.join(dir, 'FINAL_HANDOFF.md'),
      [
        '# AgentLoopKit Final Handoff',
        '',
        '## Current publish state',
        '',
        '- GitHub release `v9.8.6` is public.',
        '- npm latest is `0.28.3`; registry versions include `0.28.3`.',
        '- Do not publish stale intermediate versions from current `main`.',
        '',
        '## How users install it',
        '',
        '```bash',
        'npx --yes agentloopkit@0.24.5 version',
        '```',
      ].join('\n'),
    );

    await expect(smoke.runPublicDocsHygiene({ cwd: dir })).rejects.toThrow(
      'FINAL_HANDOFF.md current state is stale',
    );
  });

  test('public docs hygiene rejects stale final handoff publish-state label copy', () => {
    const content = [
      '# AgentLoopKit Final Handoff',
      '',
      '## How to publish to npm',
      '',
      'Current publish state:',
      '',
      '- GitHub release `v9.8.6` is public.',
      '- npm latest is `9.8.6`; registry versions include `9.8.6`.',
      '- Releases now publish through GitHub Releases and trusted publishing.',
      '',
      '## How users install it',
      '',
      '```bash',
      'npx agentloopkit init',
      '```',
    ].join('\n');

    expect(() =>
      smoke.assertFinalHandoffCurrentReleaseState({
        filePath: 'FINAL_HANDOFF.md',
        content,
        version: '9.8.7',
      }),
    ).toThrow('FINAL_HANDOFF.md current state is stale: expected current GitHub release v9.8.7');
  });
});
