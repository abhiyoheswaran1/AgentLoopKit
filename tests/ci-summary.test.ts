import path from 'node:path';
import { mkdir, readdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { initializeAgentLoop } from '../src/core/init.js';
import { makeTempDir, removeTempDir } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

async function createRepoWithEvidence() {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await execa('git', ['init', '-q'], { cwd: dir });
  await initializeAgentLoop({ cwd: dir });
  await writeFile(path.join(dir, 'changed.ts'), 'export const changed = true;\n');
  await writeFile(
    path.join(dir, '.agentloop/tasks/2026-06-10-ci-summary.md'),
    '# CI summary task\n\n- Status: in-progress\n',
  );
  await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
  await writeFile(
    path.join(dir, '.agentloop/reports/2026-06-10-11-00-verification-report.md'),
    '# Verification Report\n\n- Overall status: pass\n\n## CI Context\n- Provider: GitHub Actions\n',
  );
  await mkdir(path.join(dir, '.agentloop/handoffs'), { recursive: true });
  await writeFile(
    path.join(dir, '.agentloop/handoffs/2026-06-10-11-05-pr-summary.md'),
    '# PR Summary\n\nVerification status: Overall status: pass\n',
  );
  return dir;
}

describe('ci-summary command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('prints and writes a GitHub Actions CI summary without calling external services', async () => {
    const dir = await createRepoWithEvidence();
    const result = await execa(tsxPath, [cliPath, 'ci-summary', '--json', '--write'], {
      cwd: dir,
      reject: false,
      env: {
        GITHUB_ACTIONS: 'true',
        GITHUB_SERVER_URL: 'https://github.com',
        GITHUB_REPOSITORY: 'owner/repo',
        GITHUB_RUN_ID: '12345',
        GITHUB_RUN_ATTEMPT: '2',
        GITHUB_WORKFLOW: 'CI',
        GITHUB_EVENT_NAME: 'pull_request',
        GITHUB_REF: 'refs/pull/7/merge',
        GITHUB_SHA: 'abcdef123456',
      },
    });

    expect(result.exitCode).toBe(0);
    const payload = JSON.parse(result.stdout);
    expect(payload.ci.provider).toBe('github-actions');
    expect(payload.ci.runUrl).toBe('https://github.com/owner/repo/actions/runs/12345');
    expect(payload.evidence.task.title).toBe('CI summary task');
    expect(payload.evidence.verification.overallStatus).toBe('pass');
    expect(payload.gates.overallStatus).toBe('pass');
    expect(payload.writtenPath).toMatch(/ci-summary\.md$/);

    const markdown = await readFile(payload.writtenPath, 'utf8');
    expect(markdown).toContain('# AgentLoopKit CI Summary');
    expect(markdown).toContain('- Provider: GitHub Actions');
    expect(markdown).toContain('- Run URL: `https://github.com/owner/repo/actions/runs/12345`');
    expect(markdown).toContain('- Verification: pass');
    expect(markdown).not.toContain('TOKEN');
  });

  test('writes markdown-safe CI metadata when values contain backticks', async () => {
    const dir = await createRepoWithEvidence();
    const result = await execa(tsxPath, [cliPath, 'ci-summary', '--json', '--write'], {
      cwd: dir,
      reject: false,
      env: {
        GITHUB_ACTIONS: 'true',
        GITHUB_SERVER_URL: 'https://github.com',
        GITHUB_REPOSITORY: 'owner/repo',
        GITHUB_RUN_ID: '12345',
        GITHUB_RUN_ATTEMPT: '2',
        GITHUB_WORKFLOW: 'CI `nightly`',
        GITHUB_EVENT_NAME: 'pull_request',
        GITHUB_REF: 'refs/heads/feature/`agentloop`',
        GITHUB_SHA: 'abcdef123456',
      },
    });

    expect(result.exitCode).toBe(0);
    const payload = JSON.parse(result.stdout);
    const markdown = await readFile(payload.writtenPath, 'utf8');
    expect(markdown).toContain('- Workflow: `` CI `nightly` ``');
    expect(markdown).toContain('- Ref: `` refs/heads/feature/`agentloop` ``');
  });

  test('does not include handoff content from a symlinked handoff root outside the repo', async () => {
    const dir = await createRepoWithEvidence();
    const outsideHandoffs = await makeTempDir();
    tempDirs.push(outsideHandoffs);
    await rm(path.join(dir, '.agentloop/handoffs'), { recursive: true, force: true });
    await writeFile(
      path.join(outsideHandoffs, '2026-06-10-11-05-pr-summary.md'),
      '# Outside Handoff\n\noutside-secret-handoff-content\n',
    );
    await symlink(outsideHandoffs, path.join(dir, '.agentloop/handoffs'), 'dir');

    const result = await execa(tsxPath, [cliPath, 'ci-summary', '--json', '--write'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).not.toContain('outside-secret-handoff-content');
    const payload = JSON.parse(result.stdout);
    expect(payload.evidence.handoff).toBeUndefined();
    const markdown = await readFile(payload.writtenPath, 'utf8');
    expect(markdown).not.toContain('outside-secret-handoff-content');
    expect(markdown).toContain('- Handoff: not found');
  });

  test('prints and writes a GitLab CI summary without calling external services', async () => {
    const dir = await createRepoWithEvidence();
    const result = await execa(tsxPath, [cliPath, 'ci-summary', '--json', '--write'], {
      cwd: dir,
      reject: false,
      env: {
        CI: 'true',
        GITHUB_ACTIONS: 'false',
        BUILDKITE: 'false',
        GITLAB_CI: 'true',
        CI_PROJECT_PATH: 'owner/repo',
        CI_PIPELINE_SOURCE: 'merge_request_event',
        CI_COMMIT_REF_NAME: 'feature/agentloop',
        CI_COMMIT_SHA: 'abcdef123456',
        CI_PIPELINE_URL: 'https://gitlab.com/owner/repo/-/pipelines/12345',
        UNRELATED_ENV_VALUE: 'redacted-fixture-value',
      },
    });

    expect(result.exitCode).toBe(0);
    const payload = JSON.parse(result.stdout);
    expect(payload.ci.provider).toBe('gitlab-ci');
    expect(payload.ci.runUrl).toBe('https://gitlab.com/owner/repo/-/pipelines/12345');
    expect(payload.ci.workflow).toBe('owner/repo');
    expect(payload.evidence.verification.overallStatus).toBe('pass');

    const markdown = await readFile(payload.writtenPath, 'utf8');
    expect(markdown).toContain('- Provider: GitLab CI');
    expect(markdown).toContain('- Event: `merge_request_event`');
    expect(markdown).toContain('- Run URL: `https://gitlab.com/owner/repo/-/pipelines/12345`');
    expect(markdown).not.toContain('redacted-fixture-value');
  });

  test('prints and writes a Buildkite CI summary without calling external services', async () => {
    const dir = await createRepoWithEvidence();
    const result = await execa(tsxPath, [cliPath, 'ci-summary', '--json', '--write'], {
      cwd: dir,
      reject: false,
      env: {
        CI: 'true',
        GITHUB_ACTIONS: 'false',
        GITLAB_CI: 'false',
        BUILDKITE: 'true',
        BUILDKITE_PIPELINE_SLUG: 'agentloopkit',
        BUILDKITE_SOURCE: 'pull_request',
        BUILDKITE_BRANCH: 'feature/agentloop',
        BUILDKITE_COMMIT: 'abcdef123456',
        BUILDKITE_BUILD_URL: 'https://buildkite.com/owner/agentloopkit/builds/12345',
        UNRELATED_ENV_VALUE: 'redacted-fixture-value',
      },
    });

    expect(result.exitCode).toBe(0);
    const payload = JSON.parse(result.stdout);
    expect(payload.ci.provider).toBe('buildkite');
    expect(payload.ci.runUrl).toBe('https://buildkite.com/owner/agentloopkit/builds/12345');
    expect(payload.ci.workflow).toBe('agentloopkit');
    expect(payload.evidence.verification.overallStatus).toBe('pass');

    const markdown = await readFile(payload.writtenPath, 'utf8');
    expect(markdown).toContain('- Provider: Buildkite');
    expect(markdown).toContain('- Event: `pull_request`');
    expect(markdown).toContain(
      '- Run URL: `https://buildkite.com/owner/agentloopkit/builds/12345`',
    );
    expect(markdown).not.toContain('redacted-fixture-value');
  });

  test('prints generic CI markdown when only CI=true is present', async () => {
    const dir = await createRepoWithEvidence();
    const result = await execa(tsxPath, [cliPath, 'ci-summary'], {
      cwd: dir,
      reject: false,
      env: { CI: 'true', GITHUB_ACTIONS: 'false', GITLAB_CI: 'false', BUILDKITE: 'false' },
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('# AgentLoopKit CI Summary');
    expect(result.stdout).toContain('- Provider: Generic CI');
    expect(result.stdout).toContain('agentloop check-gates --strict');
  });

  test('prints invalid config errors as JSON without writing a CI summary', async () => {
    const dir = await createRepoWithEvidence();
    await writeFile(path.join(dir, 'agentloop.config.json'), '{"version":2}');

    const result = await execa(tsxPath, [cliPath, 'ci-summary', '--json', '--write'], {
      cwd: dir,
      reject: false,
    });

    const payload = JSON.parse(result.stdout);
    const reports = await readdir(path.join(dir, '.agentloop/reports'));
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(payload.error).toMatchObject({
      code: 'CONFIG_ERROR',
      message: expect.stringContaining('Invalid AgentLoopKit config'),
    });
    expect(reports.some((file) => file.endsWith('-ci-summary.md'))).toBe(false);
  });

  test('prints JSON errors when --out is provided without --write', async () => {
    const dir = await createRepoWithEvidence();
    const outPath = path.join(dir, '.agentloop/reports/manual-ci-summary.md');

    const result = await execa(tsxPath, [cliPath, 'ci-summary', '--out', outPath, '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'OUT_REQUIRES_WRITE',
        message: '--out requires --write.',
        option: 'out',
        requiredOption: 'write',
        requestedPath: outPath,
      },
    });
    await expect(readFile(outPath, 'utf8')).rejects.toThrow();
  });

  test('keeps --out without --write errors human-readable by default', async () => {
    const dir = await createRepoWithEvidence();
    const outPath = path.join(dir, '.agentloop/reports/manual-ci-summary.md');

    const result = await execa(tsxPath, [cliPath, 'ci-summary', '--out', outPath], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('agentloop: --out requires --write.');
    await expect(readFile(outPath, 'utf8')).rejects.toThrow();
  });

  test('rejects CI summary output paths outside the reports directory', async () => {
    const dir = await createRepoWithEvidence();
    const outPath = path.join(dir, 'outside-ci-summary.md');

    const result = await execa(
      tsxPath,
      [cliPath, 'ci-summary', '--write', '--out', outPath, '--json'],
      {
        cwd: dir,
        reject: false,
      },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'OUTPUT_PATH_INVALID',
        message: `CI summary output path must stay inside .agentloop/reports: ${outPath}`,
        artifactType: 'ci-summary',
        requestedPath: outPath,
        expectedDir: '.agentloop/reports',
        expectedExtension: '.md',
        reason: 'outside-directory',
      },
    });
    await expect(readFile(outPath, 'utf8')).rejects.toThrow();
  });

  test('rejects CI summary writes when the configured reports directory resolves outside the repo', async () => {
    const dir = await createRepoWithEvidence();
    const outsideDir = await makeTempDir();
    tempDirs.push(outsideDir);
    await rm(path.join(dir, '.agentloop/reports'), { recursive: true, force: true });
    await symlink(outsideDir, path.join(dir, '.agentloop/reports'), 'dir');

    const result = await execa(tsxPath, [cliPath, 'ci-summary', '--write', '--json'], {
      cwd: dir,
      reject: false,
    });

    const output = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(output.error).toMatchObject({
      code: 'OUTPUT_PATH_INVALID',
      artifactType: 'ci-summary',
      expectedDir: '.agentloop/reports',
      expectedExtension: '.md',
      reason: 'outside-directory',
    });
    expect(output.error.requestedPath).toContain('.agentloop/reports/');
    expect(output.error.requestedPath).toContain('-ci-summary.md');
    expect(await readdir(outsideDir)).toEqual([]);
  });

  test('rejects CI summary output paths with non-Markdown extensions', async () => {
    const dir = await createRepoWithEvidence();
    const outPath = path.join(dir, '.agentloop/reports/manual-ci-summary.txt');

    const result = await execa(
      tsxPath,
      [cliPath, 'ci-summary', '--write', '--out', outPath, '--json'],
      {
        cwd: dir,
        reject: false,
      },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'OUTPUT_PATH_INVALID',
        message: `CI summary output path must use .md: ${outPath}`,
        artifactType: 'ci-summary',
        requestedPath: outPath,
        expectedDir: '.agentloop/reports',
        expectedExtension: '.md',
        reason: 'wrong-extension',
      },
    });
    await expect(readFile(outPath, 'utf8')).rejects.toThrow();
  });

  test('status, report, badge, and gates ignore newer CI summary artifacts when locating verification reports', async () => {
    const dir = await createRepoWithEvidence();
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-10-12-00-ci-summary.md'),
      '# AgentLoopKit CI Summary\n\n- Overall status: fail\n- Verification: fail\n',
    );

    const statusResult = await execa(tsxPath, [cliPath, 'status', '--json'], {
      cwd: dir,
      reject: false,
    });
    const gatesResult = await execa(tsxPath, [cliPath, 'check-gates', '--json'], {
      cwd: dir,
      reject: false,
    });
    const badgeResult = await execa(tsxPath, [cliPath, 'badge', '--json'], {
      cwd: dir,
      reject: false,
    });
    const reportResult = await execa(tsxPath, [cliPath, 'report', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(statusResult.exitCode).toBe(0);
    expect(JSON.parse(statusResult.stdout).latestReport.path).toContain('verification-report.md');
    expect(JSON.parse(statusResult.stdout).latestReport.overallStatus).toBe('pass');

    expect(gatesResult.exitCode).toBe(0);
    const gates = JSON.parse(gatesResult.stdout);
    expect(gates.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'verification-report',
          status: 'pass',
          path: '.agentloop/reports/2026-06-10-11-00-verification-report.md',
        }),
      ]),
    );

    expect(badgeResult.exitCode).toBe(0);
    expect(JSON.parse(badgeResult.stdout).sourcePath).toContain('verification-report.md');
    expect(JSON.parse(badgeResult.stdout).status).toBe('pass');

    expect(reportResult.exitCode).toBe(0);
    expect(JSON.parse(reportResult.stdout).sourcePaths.verification).toContain(
      'verification-report.md',
    );
    expect(JSON.parse(reportResult.stdout).metadata.verificationStatus).toBe('pass');
  });
});
