import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';

let tempDirs: string[] = [];

async function runHygiene(options: { cwd: string; version: string }) {
  // @ts-expect-error The smoke script is plain ESM and is exercised through Vitest here.
  const { runPublicDocsHygiene } = await import('../scripts/smoke-packed-release.mjs');
  return runPublicDocsHygiene(options);
}

async function makeFixture(readme: string) {
  const dir = await mkdtemp(path.join(tmpdir(), 'agentloopkit-public-docs-'));
  tempDirs.push(dir);
  await writeFile(
    path.join(dir, 'package.json'),
    JSON.stringify({ name: 'agentloopkit', version: '1.2.3' }, null, 2),
  );
  await writeFile(path.join(dir, 'README.md'), readme);
  await writeFile(path.join(dir, 'AGENTS.md'), '# Agents\n');
  await writeFile(path.join(dir, 'AGENTLOOP.md'), '# AgentLoop\n');
  await writeFile(
    path.join(dir, 'ROADMAP.md'),
    [
      '# Roadmap',
      '',
      '## Current State',
      '',
      '- GitHub release `v1.2.3` is public.',
      '- npm latest is `agentloopkit@1.2.3`.',
      '- GHCR and MCP Registry are live for `1.2.3`.',
      '- Release tag `v1.2.3` points at the published release commit.',
      '',
    ].join('\n'),
  );
  return dir;
}

describe('public docs hygiene', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map((dir) => rm(dir, { recursive: true, force: true })));
    tempDirs = [];
  });

  test('rejects public adoption or testimonial claims without evidence', async () => {
    const dir = await makeFixture(
      '# AgentLoopKit\n\nDevelopers love AgentLoopKit and users told us it is changing how teams ship.\n',
    );

    await expect(runHygiene({ cwd: dir, version: '1.2.3' })).rejects.toThrow(
      'unsupported public claim',
    );
  });

  test('rejects premature Pro or SaaS upgrade copy in public docs', async () => {
    const dir = await makeFixture(
      '# AgentLoopKit\n\nUpgrade to AgentLoopKit Pro for hosted dashboards and paid team plans.\n',
    );

    await expect(runHygiene({ cwd: dir, version: '1.2.3' })).rejects.toThrow(
      'unsupported public claim',
    );
  });

  test('rejects unsupported marketplace and package-manager availability claims', async () => {
    const dir = await makeFixture(
      [
        '# AgentLoopKit',
        '',
        'AgentLoopKit is trusted by thousands of production teams.',
        'Install it from the VS Code Marketplace, Open VSX, Scoop, or WinGet.',
        '`scoop install agentloopkit`',
        '`winget install agentloopkit`',
        '',
      ].join('\n'),
    );

    await expect(runHygiene({ cwd: dir, version: '1.2.3' })).rejects.toThrow(
      'unsupported public claim',
    );
  });

  test('allows deferred channel design docs to describe future gates', async () => {
    const dir = await makeFixture('# AgentLoopKit\n\nUse `npx agentloopkit init`.\n');
    await mkdir(path.join(dir, 'docs/designs'), { recursive: true });
    await writeFile(
      path.join(dir, 'docs/designs/windows-package-managers.md'),
      [
        '# Windows Package Manager Design',
        '',
        'Defer public Scoop and WinGet install claims.',
        '',
        'Do not claim `scoop install agentloopkit` until a Scoop bucket manifest is tested.',
        'Do not claim `winget install agentloopkit` until a WinGet manifest is validated.',
        '',
      ].join('\n'),
    );
    await writeFile(
      path.join(dir, 'docs/designs/vscode-open-vsx-extension.md'),
      [
        '# VS Code and Open VSX Extension Design',
        '',
        'Do not publish to the VS Code Marketplace or Open VSX until validation gates pass.',
        '',
      ].join('\n'),
    );

    await expect(runHygiene({ cwd: dir, version: '1.2.3' })).resolves.toMatchObject({
      version: '1.2.3',
    });
  });

  test('ignores internal planning docs when checking public claims', async () => {
    const dir = await makeFixture('# AgentLoopKit\n\nUse `npx agentloopkit init`.\n');
    await mkdir(path.join(dir, 'docs/superpowers/plans'), { recursive: true });
    await writeFile(
      path.join(dir, 'docs/superpowers/plans/internal-plan.md'),
      '# Internal Plan\n\nMention Homebrew here without making a public availability claim.\n',
    );

    await expect(runHygiene({ cwd: dir, version: '1.2.3' })).resolves.toMatchObject({
      version: '1.2.3',
    });
  });
});
