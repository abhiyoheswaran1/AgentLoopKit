import path from 'node:path';
import { mkdir, readdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { initializeAgentLoop } from '../src/core/init.js';
import { createDefaultConfig } from '../src/core/config.js';
import { getCiSummary } from '../src/core/ci-summary.js';
import { singleLineInlineCode } from '../src/core/markdown-format.js';
import { makeTempDir, removeTempDir } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');
const CLI_ARTIFACT_LOOKUP_TEST_TIMEOUT_MS = 90_000;

let tempDirs: string[] = [];

async function createRepoWithEvidence() {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await execa('git', ['init', '-q'], { cwd: dir });
  await initializeAgentLoop({ cwd: dir });
  await writeFile(path.join(dir, 'changed.ts'), 'export const changed = true;\n');
  await writeFile(
    path.join(dir, '.agentloop/tasks/2026-06-10-ci-summary.md'),
    '# CI summary task\n\n- Status: in-progress\n\n## Files or Areas Not to Touch\n- node_modules/\n',
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
    expect(payload.gates.overallStatus).toBe('warn');
    expect(payload.gates.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'handoff-summary',
          status: 'warn',
          message: 'Latest handoff does not cover the current dirty files.',
        }),
      ]),
    );
    expect(payload.writtenPath).toMatch(/ci-summary\.md$/);

    const markdown = await readFile(payload.writtenPath, 'utf8');
    expect(markdown).toContain('# AgentLoopKit CI Summary');
    expect(markdown).toContain('- Provider: GitHub Actions');
    expect(markdown).toContain('- Run URL: `https://github.com/owner/repo/actions/runs/12345`');
    expect(markdown).toContain(
      '- Verification: `pass` - `.agentloop/reports/2026-06-10-11-00-verification-report.md`',
    );
    expect(markdown).not.toContain('TOKEN');
  });

  test('gates fail by default on a blocking soft spot; --allow-soft-spots downgrades to warn', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await initializeAgentLoop({ cwd: dir });
    await writeFile(path.join(dir, 'changed.ts'), 'export const changed = true;\n');
    // No "## Files or Areas Not to Touch" section at all, which
    // analyzeContract's unboundedScopeRule treats as an empty (blocking)
    // section — same trigger used by the check-gates/ready soft-spot tests.
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-10-ci-summary-soft-spot.md'),
      '# CI summary soft spot task\n\n- Status: in-progress\n',
    );
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-10-11-00-verification-report.md'),
      '# Verification Report\n\n- Overall status: pass\n',
    );
    await mkdir(path.join(dir, '.agentloop/handoffs'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/handoffs/2026-06-10-11-05-pr-summary.md'),
      '# PR Summary\n\nVerification status: Overall status: pass\n',
    );

    const defaultResult = await execa(tsxPath, [cliPath, 'ci-summary', '--json'], {
      cwd: dir,
      reject: false,
    });
    const defaultPayload = JSON.parse(defaultResult.stdout);
    expect(defaultPayload.gates.overallStatus).toBe('fail');
    expect(defaultPayload.gates.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'contract-hardening', status: 'fail' }),
      ]),
    );

    const allowResult = await execa(
      tsxPath,
      [cliPath, 'ci-summary', '--allow-soft-spots', '--json'],
      { cwd: dir, reject: false },
    );
    const allowPayload = JSON.parse(allowResult.stdout);
    expect(allowPayload.gates.overallStatus).toBe('warn');
    expect(allowPayload.gates.gates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'contract-hardening', status: 'warn' }),
      ]),
    );
  });

  test('keeps same-minute written CI summaries instead of overwriting them', async () => {
    const dir = await createRepoWithEvidence();
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });

    const first = await getCiSummary({
      cwd: dir,
      config,
      timestamp: '2026-06-10-12-00',
      nowIso: '2026-06-10T12:00:00.000Z',
      write: true,
      env: {
        GITHUB_ACTIONS: 'true',
        GITHUB_SERVER_URL: 'https://github.com',
        GITHUB_REPOSITORY: 'owner/repo',
        GITHUB_RUN_ID: '11111',
        GITHUB_WORKFLOW: 'First CI summary',
      },
    });
    const second = await getCiSummary({
      cwd: dir,
      config,
      timestamp: '2026-06-10-12-00',
      nowIso: '2026-06-10T12:00:30.000Z',
      write: true,
      env: {
        GITHUB_ACTIONS: 'true',
        GITHUB_SERVER_URL: 'https://github.com',
        GITHUB_REPOSITORY: 'owner/repo',
        GITHUB_RUN_ID: '22222',
        GITHUB_WORKFLOW: 'Second CI summary',
      },
    });

    expect(second.writtenPath).not.toBe(first.writtenPath);
    expect(second.writtenPath).toMatch(/-ci-summary-2\.md$/);
    await expect(readFile(first.writtenPath ?? '', 'utf8')).resolves.toContain('First CI summary');
    await expect(readFile(second.writtenPath ?? '', 'utf8')).resolves.toContain(
      'Second CI summary',
    );
  });

  test('prints written CI summary paths with Markdown-safe inline values', async () => {
    const dir = await createRepoWithEvidence();
    const outPath = path.join(dir, '.agentloop/reports/ci`summary\nmanual.md');

    const result = await execa(tsxPath, [cliPath, 'ci-summary', '--write', '--out', outPath], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain(`CI summary written: ${singleLineInlineCode(outPath)}`);
  });

  test('accepts redact-paths and redacts local roots in public CI summary output', async () => {
    const dir = await createRepoWithEvidence();
    const humanOutPath = path.join(dir, '.agentloop/reports/manual-ci-summary.md');
    const jsonOutPath = path.join(dir, '.agentloop/reports/manual-ci-summary-json.md');
    const rawJsonOutPath = path.join(dir, '.agentloop/reports/manual-ci-summary-json-raw.md');

    const helpResult = await execa(tsxPath, [cliPath, 'ci-summary', '--help'], { cwd: dir });
    const humanResult = await execa(
      tsxPath,
      [cliPath, 'ci-summary', '--write', '--out', humanOutPath, '--redact-paths'],
      {
        cwd: dir,
        reject: false,
        env: {
          GITHUB_ACTIONS: 'true',
          GITHUB_WORKFLOW: `CI ${dir}`,
        },
      },
    );
    const redactedJsonResult = await execa(
      tsxPath,
      [cliPath, 'ci-summary', '--write', '--out', jsonOutPath, '--json', '--redact-paths'],
      {
        cwd: dir,
        reject: false,
        env: {
          GITHUB_ACTIONS: 'true',
          GITHUB_WORKFLOW: `CI ${dir}`,
        },
      },
    );
    const rawJsonResult = await execa(
      tsxPath,
      [cliPath, 'ci-summary', '--write', '--out', rawJsonOutPath, '--json'],
      {
        cwd: dir,
        env: {
          GITHUB_ACTIONS: 'true',
          GITHUB_WORKFLOW: `CI ${dir}`,
        },
      },
    );

    expect(helpResult.stdout).toContain('--redact-paths');
    expect(humanResult.exitCode).toBe(0);
    expect(humanResult.stdout).toContain('- Workflow: `CI [git-root]`');
    expect(humanResult.stdout).toContain(
      'CI summary written: `[git-root]/.agentloop/reports/manual-ci-summary.md`',
    );
    expect(humanResult.stdout).not.toContain(dir);
    await expect(readFile(humanOutPath, 'utf8')).resolves.toContain('- Workflow: `CI [git-root]`');

    expect(redactedJsonResult.exitCode).toBe(0);
    const redactedPayload = JSON.parse(redactedJsonResult.stdout);
    expect(redactedPayload.ci.workflow).toBe('CI [git-root]');
    expect(redactedPayload.writtenPath).toBe(
      '[git-root]/.agentloop/reports/manual-ci-summary-json.md',
    );
    expect(redactedPayload.markdown).toContain('- Workflow: `CI [git-root]`');
    expect(JSON.stringify(redactedPayload)).not.toContain(dir);
    await expect(readFile(jsonOutPath, 'utf8')).resolves.toContain('- Workflow: `CI [git-root]`');

    const rawPayload = JSON.parse(rawJsonResult.stdout);
    expect(rawPayload.ci.workflow).toBe(`CI ${dir}`);
    expect(rawPayload.writtenPath).toBe(rawJsonOutPath);
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

  test('writes single-line markdown evidence paths when task data contains line breaks', async () => {
    const dir = await createRepoWithEvidence();
    const taskFileName = '2026-06-10-ci\n-summary.md';
    await writeFile(
      path.join(dir, '.agentloop/tasks', taskFileName),
      '# CI path task\n\n- Status: in-progress\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/state.json'),
      `${JSON.stringify(
        {
          version: 1,
          activeTaskPath: `.agentloop/tasks/${taskFileName}`,
        },
        null,
        2,
      )}\n`,
    );

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
        GITHUB_REF: 'refs/heads/feature',
        GITHUB_SHA: 'abcdef123456',
      },
    });

    expect(result.exitCode).toBe(0);
    const payload = JSON.parse(result.stdout);
    const markdown = await readFile(payload.writtenPath, 'utf8');
    expect(payload.evidence.task.path).toBe('.agentloop/tasks/2026-06-10-ci\n-summary.md');
    expect(markdown).toContain(
      '- Task: `CI path task` - `.agentloop/tasks/2026-06-10-ci\\n-summary.md`',
    );
    expect(markdown).toContain(
      '- [`pass`] `Task contract`: `CI path task` - `.agentloop/tasks/2026-06-10-ci\\n-summary.md`',
    );
    expect(markdown).not.toContain('ci\n-summary.md`');
  });

  test('writes markdown-safe CI evidence and gate details when values contain backticks', async () => {
    const dir = await createRepoWithEvidence();
    await rm(path.join(dir, '.agentloop/reports/2026-06-10-11-00-verification-report.md'), {
      force: true,
    });
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-10-ci`summary.md'),
      '# CI `gate`\n\n- Status: in-progress\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/state.json'),
      `${JSON.stringify(
        {
          version: 1,
          activeTaskPath: '.agentloop/tasks/2026-06-10-ci`summary.md',
        },
        null,
        2,
      )}\n`,
    );
    await writeFile(
      path.join(dir, '.agentloop/handoffs/2026-06-10-11-10-pr-summary.md'),
      '# Reviewer `brief`\n\nVerification status: Overall status: pass\n',
    );

    const result = await execa(tsxPath, [cliPath, 'ci-summary', '--json', '--write'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const payload = JSON.parse(result.stdout);
    const markdown = await readFile(payload.writtenPath, 'utf8');
    expect(payload.evidence.task.title).toBe('CI `gate`');
    expect(payload.evidence.task.path).toBe('.agentloop/tasks/2026-06-10-ci`summary.md');
    expect(payload.evidence.handoff.title).toBe('Reviewer `brief`');
    expect(markdown).toContain('- Overall status: `fail`');
    expect(markdown).toContain(
      '- Task: `` CI `gate` `` - ``.agentloop/tasks/2026-06-10-ci`summary.md``',
    );
    expect(markdown).toContain(
      '- Handoff: `` Reviewer `brief` `` - `.agentloop/handoffs/2026-06-10-11-10-pr-summary.md`',
    );
    expect(markdown).toContain('- Gates: `fail`');
    expect(markdown).toContain(
      '- [`pass`] `Task contract`: `` CI `gate` `` - ``.agentloop/tasks/2026-06-10-ci`summary.md``',
    );
    expect(markdown).toContain('- [`fail`] `Verification report`: `No verification report found.`');
    expect(markdown).toContain('Run `agentloop verify`.');
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

  test(
    'status, report, badge, and gates ignore newer CI summary artifacts when locating verification reports',
    async () => {
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
    },
    CLI_ARTIFACT_LOOKUP_TEST_TIMEOUT_MS,
  );
});
