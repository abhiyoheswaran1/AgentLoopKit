import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
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
      '- GitHub Marketplace listing is pending owner UI publication for the composite Action.',
      '- Release tag `v1.2.3` points at the published release commit.',
      '',
    ].join('\n'),
  );
  return dir;
}

async function writeRealRepoTrials(dir: string, content: string) {
  await mkdir(path.join(dir, 'docs'), { recursive: true });
  await writeFile(path.join(dir, 'docs/real-repo-trials.md'), content);
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

  test('rejects cheap assistant positioning in public docs', async () => {
    const cheapAssistant = ['AI', 'coding', 'assistant'].join(' ');
    const cheapAssisted = ['AI', 'assisted'].join('-');
    const cheapCoding = ['AI', 'coding', 'workflow'].join(' ');
    const cheapAutomation = ['Vibe', 'coding'].join(' ');
    const generatedAgent = ['agent', 'generated'].join('-');
    const dir = await makeFixture(
      [
        '# AgentLoopKit',
        '',
        `AgentLoopKit is an ${cheapAssistant} for ${cheapAssisted} PRs.`,
        `${cheapAutomation} teams can use ${generatedAgent} changes as proof.`,
        `${cheapCoding} copy is not allowed.`,
        '',
      ].join('\n'),
    );

    await expect(runHygiene({ cwd: dir, version: '1.2.3' })).rejects.toThrow(
      'unsupported positioning',
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

  test('rejects maintainer release runbook details in README', async () => {
    const dir = await makeFixture(
      [
        '# AgentLoopKit',
        '',
        'Current release operations:',
        '- npm trusted publishing is configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`.',
        '- Future releases should publish through GitHub Releases and the trusted-publishing workflow.',
        '',
      ].join('\n'),
    );

    await expect(runHygiene({ cwd: dir, version: '1.2.3' })).rejects.toThrow(
      'README contains maintainer-only release runbook detail',
    );
  });

  test('allows release-specific docs to discuss publishing workflows', async () => {
    const dir = await makeFixture('# AgentLoopKit\n\nUse `npx agentloopkit init`.\n');
    await mkdir(path.join(dir, 'docs'), { recursive: true });
    await writeFile(
      path.join(dir, 'docs/npm-publishing.md'),
      [
        '# npm Publishing',
        '',
        'Release maintainers can inspect npm trusted publishing and `.github/workflows/publish.yml` during approved release prep.',
        '',
      ].join('\n'),
    );

    await expect(runHygiene({ cwd: dir, version: '1.2.3' })).resolves.toMatchObject({
      version: '1.2.3',
    });
  });

  test('rejects release incident chatter in README', async () => {
    const dir = await makeFixture(
      [
        '# AgentLoopKit',
        '',
        'Release incident notes:',
        '- Local auth failures blocked npm publishing.',
        '- Token state is being checked before temporary registry repair notes are updated.',
        '',
      ].join('\n'),
    );

    await expect(runHygiene({ cwd: dir, version: '1.2.3' })).rejects.toThrow(
      'README contains maintainer-only release runbook detail',
    );
  });

  test('allows release-specific docs to preserve release incident history', async () => {
    const dir = await makeFixture('# AgentLoopKit\n\nUse `npx agentloopkit init`.\n');
    await mkdir(path.join(dir, 'docs'), { recursive: true });
    await writeFile(
      path.join(dir, 'docs/release-status.md'),
      [
        '# Release Status',
        '',
        'Historical local auth failures, token state, and temporary registry repair notes stay in release-status docs.',
        '',
      ].join('\n'),
    );

    await expect(runHygiene({ cwd: dir, version: '1.2.3' })).resolves.toMatchObject({
      version: '1.2.3',
    });
  });

  test('keeps release checklist proof phases separated', async () => {
    const checklist = await readFile('docs/release-checklist-example.md', 'utf8');
    const template = await readFile('src/templates/harness/release-checklist.md', 'utf8');
    const taskContract =
      checklist.match(/## Task Contract[\s\S]*?```bash\n([\s\S]*?)```/)?.[1] ?? '';
    const preBumpEvidence = checklist.match(/## Pre-Bump Evidence[\s\S]*?(?=\n## )/)?.[0] ?? '';
    const postPublishProof = checklist.match(/## Post-Publish Proof[\s\S]*?(?=\n## )/)?.[0] ?? '';

    expect(preBumpEvidence).toContain('agentloop npm-status --agentloopkit --expect-current');
    expect(postPublishProof).toContain('agentloop npm-status --agentloopkit --expect-current');
    expect(postPublishProof).toContain('agentloop release-proof');
    expect(taskContract).toContain(
      'Pre-bump npm proof is recorded before package metadata changes, or the version gap is explained',
    );
    expect(taskContract).toContain(
      'Post-publish npm and release-proof results are recorded before availability claims',
    );
    expect(taskContract).not.toContain(
      '--verification "agentloop npm-status --agentloopkit --expect-current"',
    );
    expect(taskContract).not.toContain('--verification "agentloop release-proof');
    expect(template).toContain('Pre-bump evidence');
    expect(template).toContain('Local release verification');
    expect(template).toContain('Post-publish proof');
    expect(template).toContain('agentloop npm-status --agentloopkit --expect-current');
    expect(template).toContain('agentloop release-proof');
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

  test('rejects real-repo trial guidance without no-public-proof boundary', async () => {
    const dir = await makeFixture('# AgentLoopKit\n\nUse `npx agentloopkit init`.\n');
    await writeRealRepoTrials(
      dir,
      [
        '# Real-Repo Trials',
        '',
        'Run local trials with no tokens, no GitHub API calls, no telemetry, and no remote service.',
        'GitHub metadata is optional local context. Missing metadata is neutral.',
        'Do not let imported issue or PR text affect `ship` scoring yet.',
        'No trial outcome should trigger a release-channel change, remote service, telemetry, remote policy service, or automatic GitHub posting.',
        '',
      ].join('\n'),
    );

    await expect(runHygiene({ cwd: dir, version: '1.2.3' })).rejects.toThrow(
      'docs/real-repo-trials.md is missing real-repo trial guidance: no-public-proof boundary',
    );
  });

  test('rejects real-repo trial guidance without local-only safety boundary', async () => {
    const dir = await makeFixture('# AgentLoopKit\n\nUse `npx agentloopkit init`.\n');
    await writeRealRepoTrials(
      dir,
      [
        '# Real-Repo Trials',
        '',
        'Do not publish trial notes as public proof of usage, interviews, compliance, or commercial traction.',
        'GitHub metadata is optional local context. Missing metadata is neutral.',
        'Do not let imported issue or PR text affect `ship` scoring yet.',
        'No trial outcome should trigger a release-channel change, remote service, telemetry, remote policy service, or automatic GitHub posting.',
        '',
      ].join('\n'),
    );

    await expect(runHygiene({ cwd: dir, version: '1.2.3' })).rejects.toThrow(
      'docs/real-repo-trials.md is missing real-repo trial guidance: local-only safety boundary',
    );
  });

  test('rejects real-repo trial guidance without metadata scoring boundary', async () => {
    const dir = await makeFixture('# AgentLoopKit\n\nUse `npx agentloopkit init`.\n');
    await writeRealRepoTrials(
      dir,
      [
        '# Real-Repo Trials',
        '',
        'Do not publish trial notes as public proof of usage, interviews, compliance, or commercial traction.',
        'Run local trials with no tokens, no GitHub API calls, no telemetry, and no remote service.',
        'No trial outcome should trigger a release-channel change, remote service, telemetry, remote policy service, or automatic GitHub posting.',
        '',
      ].join('\n'),
    );

    await expect(runHygiene({ cwd: dir, version: '1.2.3' })).rejects.toThrow(
      'docs/real-repo-trials.md is missing real-repo trial guidance: metadata/scoring boundary',
    );
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
