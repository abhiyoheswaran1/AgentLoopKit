import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { importGithubMetadata, readGithubMetadataContext } from '../src/core/github-metadata.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

async function createGithubFixture() {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  const config = createDefaultConfig({
    name: 'github-demo',
    type: 'generic',
    packageManager: 'npm',
  });
  await writeJson(path.join(dir, 'agentloop.config.json'), config);
  await writeJson(path.join(dir, 'issue.json'), {
    number: 42,
    title: 'Login redirect drops target',
    state: 'OPEN',
    url: 'https://github.com/example/app/issues/42',
    author: { login: 'octocat' },
    labels: [{ name: 'bug' }, { name: 'ai-review' }],
    body: 'Users lose redirect targets after reset.',
  });
  await writeJson(path.join(dir, 'pr.json'), {
    number: 77,
    title: 'Fix login redirect',
    state: 'OPEN',
    url: 'https://github.com/example/app/pull/77',
    author: { login: 'contributor' },
    labels: [{ name: 'bugfix' }],
    isDraft: false,
    baseRefName: 'main',
    headRefName: 'fix/login-redirect',
    changedFiles: 3,
    additions: 42,
    deletions: 9,
    body: 'Implements the redirect fix.',
  });
  return { dir, config };
}

describe('GitHub metadata import', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('imports issue and pull request metadata from explicit local JSON files', async () => {
    const { dir, config } = await createGithubFixture();

    const result = await importGithubMetadata({
      cwd: dir,
      config,
      issueJsonPath: 'issue.json',
      prJsonPath: 'pr.json',
    });

    expect(result).toMatchObject({
      status: 'pass',
      writesFiles: true,
      outputPath: '.agentloop/github/context.json',
      issue: {
        number: 42,
        title: 'Login redirect drops target',
        labels: ['bug', 'ai-review'],
        author: 'octocat',
      },
      pullRequest: {
        number: 77,
        title: 'Fix login redirect',
        baseRefName: 'main',
        headRefName: 'fix/login-redirect',
        changedFiles: 3,
      },
      safety: {
        readsOnlyExplicitJson: true,
        callsGithubApi: false,
        readsTokens: false,
        readsEnvFiles: false,
      },
    });

    const written = JSON.parse(
      await readFile(path.join(dir, '.agentloop/github/context.json'), 'utf8'),
    );
    expect(written.issue.bodyExcerpt).toBe('Users lose redirect targets after reset.');
    expect(written.pullRequest.bodyExcerpt).toBe('Implements the redirect fix.');
  });

  test('reads normalized imported context without requiring raw issue or PR body fields', async () => {
    const { dir, config } = await createGithubFixture();

    await importGithubMetadata({
      cwd: dir,
      config,
      issueJsonPath: 'issue.json',
      prJsonPath: 'pr.json',
    });

    const context = await readGithubMetadataContext({ cwd: dir, config });

    expect(context).toMatchObject({
      status: 'present',
      path: '.agentloop/github/context.json',
      issue: {
        number: 42,
        title: 'Login redirect drops target',
        bodyExcerpt: 'Users lose redirect targets after reset.',
      },
      pullRequest: {
        number: 77,
        title: 'Fix login redirect',
        bodyExcerpt: 'Implements the redirect fix.',
      },
      safety: {
        callsGithubApi: false,
        readsTokens: false,
        readsEnvFiles: false,
      },
    });
  });

  test('bounds untrusted metadata fields during import and context reads', async () => {
    const { dir, config } = await createGithubFixture();
    const longTitle = 'T'.repeat(260);
    const longState = 'S'.repeat(90);
    const longUrl = `https://github.com/example/app/issues/${'u'.repeat(600)}`;
    const longAuthor = 'author-'.repeat(30);
    const longBranch = `feature/${'branch-'.repeat(40)}`;
    const manyLabels = Array.from({ length: 25 }, (_, index) => ({
      name: `label-${index}-${'x'.repeat(100)}`,
    }));

    await writeJson(path.join(dir, 'large-issue.json'), {
      number: 1,
      title: longTitle,
      state: longState,
      url: longUrl,
      author: { login: longAuthor },
      labels: manyLabels,
      body: 'B'.repeat(700),
    });
    await writeJson(path.join(dir, 'large-pr.json'), {
      number: 2,
      title: longTitle,
      state: longState,
      url: longUrl,
      author: { login: longAuthor },
      labels: manyLabels,
      isDraft: false,
      baseRefName: longBranch,
      headRefName: longBranch,
      changedFiles: 1,
      additions: 1,
      deletions: 1,
      body: 'P'.repeat(700),
    });

    const result = await importGithubMetadata({
      cwd: dir,
      config,
      issueJsonPath: 'large-issue.json',
      prJsonPath: 'large-pr.json',
    });

    expect(result.issue?.title).toContain('[truncated]');
    expect(result.issue?.title.length).toBeLessThan(longTitle.length);
    expect(result.issue?.state).toContain('[truncated]');
    expect(result.issue?.url).toContain('[truncated]');
    expect(result.issue?.author).toContain('[truncated]');
    expect(result.issue?.labels).toHaveLength(20);
    expect(result.issue?.labels[0]).toContain('[truncated]');
    expect(result.issue?.labels.some((label) => label.startsWith('label-24'))).toBe(false);
    expect(result.issue?.bodyExcerpt).toContain('[truncated]');
    expect(result.pullRequest?.baseRefName).toContain('[truncated]');
    expect(result.pullRequest?.headRefName).toContain('[truncated]');

    const context = await readGithubMetadataContext({ cwd: dir, config });

    expect(context.status).toBe('present');
    if (context.status === 'present') {
      expect(context.issue?.labels).toHaveLength(20);
      expect(context.pullRequest?.headRefName).toContain('[truncated]');
    }
  });

  test('reports missing and invalid imported context as local read results', async () => {
    const { dir, config } = await createGithubFixture();

    await expect(readGithubMetadataContext({ cwd: dir, config })).resolves.toEqual({
      status: 'missing',
      path: '.agentloop/github/context.json',
    });

    await mkdir(path.join(dir, '.agentloop/github'), { recursive: true });
    await writeFile(path.join(dir, '.agentloop/github/context.json'), '[');

    await expect(readGithubMetadataContext({ cwd: dir, config })).resolves.toMatchObject({
      status: 'invalid',
      path: '.agentloop/github/context.json',
      message: expect.stringContaining('could not be read'),
    });
  });

  test('supports dry-run import without writing context files', async () => {
    const { dir, config } = await createGithubFixture();

    const result = await importGithubMetadata({
      cwd: dir,
      config,
      issueJsonPath: 'issue.json',
      dryRun: true,
    });

    expect(result.writesFiles).toBe(false);
    await expect(
      readFile(path.join(dir, '.agentloop/github/context.json'), 'utf8'),
    ).rejects.toThrow();
  });

  test('rejects env files and paths outside the repository', async () => {
    const { dir, config } = await createGithubFixture();

    await expect(importGithubMetadata({ cwd: dir, config, issueJsonPath: '.env' })).rejects.toThrow(
      'GitHub metadata import refuses env files',
    );
    await expect(
      importGithubMetadata({ cwd: dir, config, issueJsonPath: '../issue.json' }),
    ).rejects.toThrow('must stay inside the repository');
  });

  test('restricts output to AgentLoop GitHub metadata files', async () => {
    const { dir, config } = await createGithubFixture();

    await expect(
      importGithubMetadata({
        cwd: dir,
        config,
        issueJsonPath: 'issue.json',
        outputPath: 'package.json',
      }),
    ).rejects.toThrow('output path must stay under .agentloop/github');
    await expect(
      importGithubMetadata({
        cwd: dir,
        config,
        issueJsonPath: 'issue.json',
        outputPath: '.env',
      }),
    ).rejects.toThrow('refuses env files');
  });

  test('exposes read-only local JSON import through the CLI', async () => {
    const { dir } = await createGithubFixture();

    const result = await execa(
      tsxPath,
      [
        cliPath,
        'github',
        'import',
        '--issue-json',
        'issue.json',
        '--pr-json',
        'pr.json',
        '--dry-run',
        '--json',
      ],
      { cwd: dir },
    );

    expect(JSON.parse(result.stdout)).toMatchObject({
      status: 'pass',
      writesFiles: false,
      issue: { number: 42 },
      pullRequest: { number: 77 },
      safety: { callsGithubApi: false, readsTokens: false },
    });
  });

  test('keeps imported titles and output paths on one line in human output while preserving JSON values', async () => {
    const { dir } = await createGithubFixture();
    await writeJson(path.join(dir, 'issue-newline.json'), {
      number: 50,
      title: 'Login\nredirect drops target',
      state: 'OPEN',
    });
    await writeJson(path.join(dir, 'pr-newline.json'), {
      number: 88,
      title: 'Fix\nlogin redirect',
      state: 'OPEN',
      isDraft: false,
    });
    const outputPath = '.agentloop/github/context\nwith-break.json';

    const humanResult = await execa(
      tsxPath,
      [
        cliPath,
        'github',
        'import',
        '--issue-json',
        'issue-newline.json',
        '--pr-json',
        'pr-newline.json',
        '--output',
        outputPath,
        '--dry-run',
      ],
      { cwd: dir },
    );
    const jsonResult = await execa(
      tsxPath,
      [
        cliPath,
        'github',
        'import',
        '--issue-json',
        'issue-newline.json',
        '--pr-json',
        'pr-newline.json',
        '--output',
        outputPath,
        '--dry-run',
        '--json',
      ],
      { cwd: dir },
    );

    const outputLine = humanResult.stdout
      .split('\n')
      .find((line) => line.startsWith('- Output:'));
    const issueLine = humanResult.stdout.split('\n').find((line) => line.startsWith('- Issue:'));
    const pullRequestLine = humanResult.stdout
      .split('\n')
      .find((line) => line.startsWith('- Pull request:'));

    expect(outputLine).toContain('context\\nwith-break.json');
    expect(issueLine).toContain('Login\\nredirect drops target');
    expect(pullRequestLine).toContain('Fix\\nlogin redirect');

    const output = JSON.parse(jsonResult.stdout);
    expect(output.outputPath).toBe(outputPath);
    expect(output.issue.title).toBe('Login\nredirect drops target');
    expect(output.pullRequest.title).toBe('Fix\nlogin redirect');
  });
});
