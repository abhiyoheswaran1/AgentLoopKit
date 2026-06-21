import path from 'node:path';
import { mkdir, realpath, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { renderMaintainerCheckMarkdown } from '../src/core/maintainer-check.js';
import { setActiveTask } from '../src/core/task-state.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

async function git(cwd: string, args: string[]) {
  return execa('git', args, { cwd });
}

async function createMaintainerFixture() {
  const dir = await makeTempDir();
  tempDirs.push(dir);

  await git(dir, ['init', '-q']);
  await git(dir, ['config', 'user.email', 'agentloopkit@example.com']);
  await git(dir, ['config', 'user.name', 'AgentLoopKit Test']);

  const config = createDefaultConfig({
    name: 'demo',
    type: 'typescript-package',
    packageManager: 'npm',
  });
  await writeJson(path.join(dir, 'agentloop.config.json'), config);
  await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
  await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
  await mkdir(path.join(dir, '.agentloop/handoffs'), { recursive: true });
  const taskPath = path.join(dir, '.agentloop/tasks/2026-06-11-auth.md');
  await writeFile(
    taskPath,
    '# Review auth redirect\n\n- Status: in-progress\n\n## Acceptance Criteria\n- Redirect behavior is covered.\n\n## Verification Commands\n- npm test -- auth\n',
  );
  await setActiveTask({ cwd: dir, config, taskPath });
  await writeFile(
    path.join(dir, '.agentloop/reports/2026-06-11-12-00-verification-report.md'),
    '# Verification Report\n\n- Overall status: pass\n',
  );
  await writeFile(
    path.join(dir, '.agentloop/handoffs/2026-06-11-12-05-pr-summary.md'),
    '# PR Summary\n\n- Verification status: Overall status: pass\n',
  );
  await mkdir(path.join(dir, 'src/auth'), { recursive: true });
  await writeFile(path.join(dir, 'src/auth/callback.ts'), 'export const redirect = "old";\n');
  await git(dir, ['add', '.']);
  await git(dir, ['commit', '-m', 'Initial state']);
  await writeFile(path.join(dir, 'src/auth/callback.ts'), 'export const redirect = "fixed";\n');

  return dir;
}

async function createReviewableFixture(
  options: {
    freshHandoffRun?: boolean;
    dirtySourceFile?: boolean;
    taskTitle?: string | ((dir: string) => string);
  } = {},
) {
  const dir = await makeTempDir();
  tempDirs.push(dir);

  await git(dir, ['init', '-q']);
  await git(dir, ['config', 'user.email', 'agentloopkit@example.com']);
  await git(dir, ['config', 'user.name', 'AgentLoopKit Test']);

  const config = createDefaultConfig({
    name: 'demo',
    type: 'typescript-package',
    packageManager: 'npm',
  });
  await writeJson(path.join(dir, 'agentloop.config.json'), config);
  await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
  await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
  await mkdir(path.join(dir, '.agentloop/handoffs'), { recursive: true });
  const taskPath = path.join(dir, '.agentloop/tasks/2026-06-12-reviewable-change.md');
  const taskTitle =
    typeof options.taskTitle === 'function'
      ? options.taskTitle(dir)
      : (options.taskTitle ?? 'Reviewable change');
  await writeFile(
    taskPath,
    `# ${taskTitle}\n\n- Status: in-progress\n\n## Acceptance Criteria\n- The change is covered.\n\n## Verification Commands\n- npm test\n`,
  );
  await setActiveTask({ cwd: dir, config, taskPath });
  await writeFile(
    path.join(dir, '.agentloop/reports/2026-06-12-13-30-verification-report.md'),
    '# Verification Report\n\n- Overall status: pass\n',
  );
  await writeFile(
    path.join(dir, '.agentloop/handoffs/2026-06-12-13-34-pr-summary.md'),
    '# PR Summary\n\n- Verification status: Overall status: pass\n',
  );

  if (options.freshHandoffRun) {
    await writeJson(path.join(dir, '.agentloop/runs/2026-06-12-13-34-handoff/metadata.json'), {
      id: '2026-06-12-13-34-handoff',
      command: 'handoff',
      createdAt: '2026-06-12-13-34',
      createdAtEpochMs: 1781264042972,
      task: {
        path: '.agentloop/tasks/2026-06-12-reviewable-change.md',
        title: 'Reviewable change',
        status: 'in-progress',
      },
      verificationReportPath: '.agentloop/reports/2026-06-12-13-30-verification-report.md',
      handoffPath: '.agentloop/handoffs/2026-06-12-13-34-pr-summary.md',
      changedFileCount: 1,
    });
    await writeJson(path.join(dir, '.agentloop/runs/2026-06-12-13-34-handoff/changed-files.json'), [
      { status: 'M', path: 'src/index.ts' },
    ]);
  }

  await mkdir(path.join(dir, 'src'), { recursive: true });
  await writeFile(path.join(dir, 'src/index.ts'), 'export const value = "old";\n');
  await git(dir, ['add', '.']);
  await git(dir, ['commit', '-m', 'Initial state']);
  if (options.dirtySourceFile !== false) {
    await writeFile(path.join(dir, 'src/index.ts'), 'export const value = "new";\n');
  }

  return dir;
}

describe('maintainer-check command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('warns maintainers about risky but reviewable agent-assisted changes', async () => {
    const dir = await createMaintainerFixture();

    const result = await execa(tsxPath, [cliPath, 'maintainer-check', '--json'], { cwd: dir });
    const output = JSON.parse(result.stdout);

    expect(output.status).toBe('warn');
    expect(output.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'task-contract', status: 'pass' }),
        expect.objectContaining({ id: 'verification-evidence', status: 'pass' }),
        expect.objectContaining({ id: 'auth-security-files', status: 'warn' }),
      ]),
    );
    expect(output.maintainerChecklist).toContain('Review auth/security-sensitive files manually.');
    expect(output.suggestedContributorRequest).toContain(
      'Please confirm the auth/security-sensitive changes were reviewed manually.',
    );
  });

  test('warns when the latest handoff does not cover the current dirty files', async () => {
    const dir = await createReviewableFixture();

    const result = await execa(tsxPath, [cliPath, 'maintainer-check', '--json'], { cwd: dir });
    const output = JSON.parse(result.stdout);

    expect(output.status).toBe('warn');
    expect(output.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'handoff-summary',
          status: 'warn',
          message: 'Latest handoff does not cover the current dirty files.',
        }),
        expect.objectContaining({ id: 'changed-file-count', status: 'pass' }),
        expect.objectContaining({ id: 'auth-security-files', status: 'pass' }),
      ]),
    );
    expect(output.suggestedContributorRequest).toContain(
      'Please address the AgentLoopKit maintainer warnings',
    );
  });

  test('passes handoff evidence when the latest handoff run covers the current dirty files', async () => {
    const dir = await createReviewableFixture({ freshHandoffRun: true });

    const result = await execa(tsxPath, [cliPath, 'maintainer-check', '--json'], { cwd: dir });
    const output = JSON.parse(result.stdout);

    expect(output.status).toBe('pass');
    expect(output.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'handoff-summary',
          status: 'pass',
          message: 'Reviewer handoff found.',
        }),
      ]),
    );
  });

  test('does not warn about broad changed-file count for AgentLoop evidence churn', async () => {
    const dir = await createReviewableFixture({
      dirtySourceFile: false,
      freshHandoffRun: true,
    });

    for (let index = 0; index < 30; index += 1) {
      await writeFile(
        path.join(
          dir,
          `.agentloop/reports/2026-06-12-14-${String(index).padStart(2, '0')}-verification-report.md`,
        ),
        '# Verification Report\n\n- Overall status: pass\n',
      );
    }

    const result = await execa(tsxPath, [cliPath, 'maintainer-check', '--json'], { cwd: dir });
    const output = JSON.parse(result.stdout);
    const changedFileCount = output.checks.find(
      (item: { id: string }) => item.id === 'changed-file-count',
    );

    expect(changedFileCount).toEqual(
      expect.objectContaining({
        status: 'pass',
        message:
          '30 changed file(s) detected (0 non-evidence file(s), 30 AgentLoop evidence file(s)).',
      }),
    );
  });

  test('warns about broad changed-file count based on non-evidence files', async () => {
    const dir = await createReviewableFixture({
      dirtySourceFile: false,
      freshHandoffRun: true,
    });

    for (let index = 0; index < 6; index += 1) {
      await writeFile(
        path.join(dir, `src/file-${index}.ts`),
        `export const value${index} = true;\n`,
      );
    }
    await mkdir(path.join(dir, 'docs'), { recursive: true });
    for (let index = 0; index < 20; index += 1) {
      await writeFile(path.join(dir, `docs/guide-${index}.md`), `# Guide ${index}\n`);
    }
    for (let index = 0; index < 2; index += 1) {
      await writeFile(
        path.join(
          dir,
          `.agentloop/reports/2026-06-12-15-${String(index).padStart(2, '0')}-verification-report.md`,
        ),
        '# Verification Report\n\n- Overall status: pass\n',
      );
    }

    const result = await execa(tsxPath, [cliPath, 'maintainer-check', '--json'], { cwd: dir });
    const output = JSON.parse(result.stdout);
    const changedFileCount = output.checks.find(
      (item: { id: string }) => item.id === 'changed-file-count',
    );

    expect(changedFileCount).toEqual(
      expect.objectContaining({
        status: 'warn',
        message:
          '28 changed file(s) detected (26 non-evidence file(s), 2 AgentLoop evidence file(s)). Non-evidence review areas: Documentation 20, Source 6.',
      }),
    );
  });

  test('uses stable title ordering when non-evidence review area counts tie', async () => {
    const dir = await createReviewableFixture({
      dirtySourceFile: false,
      freshHandoffRun: true,
    });

    for (let index = 0; index < 13; index += 1) {
      await writeFile(
        path.join(dir, `src/file-${index}.ts`),
        `export const value${index} = true;\n`,
      );
    }
    await mkdir(path.join(dir, 'docs'), { recursive: true });
    for (let index = 0; index < 13; index += 1) {
      await writeFile(path.join(dir, `docs/guide-${index}.md`), `# Guide ${index}\n`);
    }

    const result = await execa(tsxPath, [cliPath, 'maintainer-check', '--json'], { cwd: dir });
    const output = JSON.parse(result.stdout);
    const changedFileCount = output.checks.find(
      (item: { id: string }) => item.id === 'changed-file-count',
    );

    expect(changedFileCount).toEqual(
      expect.objectContaining({
        status: 'warn',
        message:
          '26 changed file(s) detected. Non-evidence review areas: Documentation 13, Source 13.',
      }),
    );
  });

  test('keeps safety checks on the full changed-file list when evidence is separated', async () => {
    const dir = await createReviewableFixture({
      dirtySourceFile: false,
      freshHandoffRun: true,
    });

    for (let index = 0; index < 30; index += 1) {
      await writeFile(
        path.join(
          dir,
          `.agentloop/reports/2026-06-12-16-${String(index).padStart(2, '0')}-verification-report.md`,
        ),
        '# Verification Report\n\n- Overall status: pass\n',
      );
    }
    await writeFile(path.join(dir, 'package.json'), '{"scripts":{"test":"vitest"}}\n');

    const result = await execa(tsxPath, [cliPath, 'maintainer-check', '--json'], { cwd: dir });
    const humanResult = await execa(tsxPath, [cliPath, 'maintainer-check'], { cwd: dir });
    const output = JSON.parse(result.stdout);

    expect(output.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'changed-file-count',
          status: 'pass',
          message:
            '31 changed file(s) detected (1 non-evidence file(s), 30 AgentLoop evidence file(s)).',
        }),
        expect.objectContaining({
          id: 'dependency-lockfiles',
          status: 'warn',
          message: 'Package manifest changes detected.',
        }),
      ]),
    );
    expect(output.maintainerChecklist).toContain('Review package manifest changes manually.');
    expect(humanResult.stdout).toContain(
      '- [`warn`] `package-manifest`: `Package manifest changes detected.`',
    );
    expect(humanResult.stdout).not.toContain(
      '- [`warn`] `dependency-lockfiles`: `Package manifest changes detected.`',
    );
  });

  test('warns specifically about dependency lockfile changes', async () => {
    const dir = await createReviewableFixture({
      dirtySourceFile: false,
      freshHandoffRun: true,
    });

    await writeFile(path.join(dir, 'pnpm-lock.yaml'), 'lockfileVersion: 9.0\n');

    const result = await execa(tsxPath, [cliPath, 'maintainer-check', '--json'], { cwd: dir });
    const humanResult = await execa(tsxPath, [cliPath, 'maintainer-check'], { cwd: dir });
    const output = JSON.parse(result.stdout);

    expect(output.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'dependency-lockfiles',
          status: 'warn',
          message: 'Dependency lockfile changes detected.',
        }),
      ]),
    );
    expect(output.maintainerChecklist).toContain('Review dependency lockfile changes manually.');
    expect(humanResult.stdout).toContain(
      '- [`warn`] `dependency-lockfiles`: `Dependency lockfile changes detected.`',
    );
  });

  test('warns specifically about combined package manifest and lockfile changes', async () => {
    const dir = await createReviewableFixture({
      dirtySourceFile: false,
      freshHandoffRun: true,
    });

    await writeFile(path.join(dir, 'package.json'), '{"scripts":{"test":"vitest"}}\n');
    await writeFile(path.join(dir, 'package-lock.json'), '{"lockfileVersion":3}\n');

    const result = await execa(tsxPath, [cliPath, 'maintainer-check', '--json'], { cwd: dir });
    const humanResult = await execa(tsxPath, [cliPath, 'maintainer-check'], { cwd: dir });
    const output = JSON.parse(result.stdout);

    expect(output.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'dependency-lockfiles',
          status: 'warn',
          message: 'Package manifest and dependency lockfile changes detected.',
        }),
      ]),
    );
    expect(output.maintainerChecklist).toContain(
      'Review package manifest and dependency lockfile changes manually.',
    );
    expect(humanResult.stdout).toContain(
      '- [`warn`] `package-dependency-files`: `Package manifest and dependency lockfile changes detected.`',
    );
  });

  test('reports imported GitHub metadata as optional review context', async () => {
    const dir = await createReviewableFixture({ freshHandoffRun: true });
    await writeJson(path.join(dir, '.agentloop/github/context.json'), {
      issue: {
        number: 42,
        title: 'Login redirect drops target',
        state: 'OPEN',
        url: 'https://github.com/example/app/issues/42',
        author: 'octocat',
        labels: ['bug'],
        bodyExcerpt: 'Users lose redirect targets after reset.',
      },
      pullRequest: {
        number: 77,
        title: 'Fix login redirect',
        state: 'OPEN',
        url: 'https://github.com/example/app/pull/77',
        author: 'contributor',
        labels: ['bugfix'],
        isDraft: false,
        baseRefName: 'main',
        headRefName: 'fix/login-redirect',
        changedFiles: 3,
        additions: 42,
        deletions: 9,
        bodyExcerpt: 'Implements the redirect fix.',
      },
    });
    await git(dir, ['add', '.agentloop/github/context.json']);
    await git(dir, ['commit', '-m', 'Add GitHub metadata context']);

    const result = await execa(tsxPath, [cliPath, 'maintainer-check', '--json'], { cwd: dir });
    const output = JSON.parse(result.stdout);

    expect(output.status).toBe('pass');
    expect(output.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'github-metadata',
          status: 'pass',
          message: 'Imported GitHub metadata found: issue #42: PR #77',
          path: '.agentloop/github/context.json',
        }),
      ]),
    );
  });

  test('accepts redacted output mode for public maintainer review logs', async () => {
    const externalUrl = 'https://github.com/example/app/issues/42';
    const dir = await createReviewableFixture({
      freshHandoffRun: true,
      taskTitle: (fixtureDir) => `Review ${externalUrl} from ${fixtureDir}/src/index.ts`,
    });
    const nestedDir = path.join(dir, 'packages', 'web');
    await mkdir(nestedDir, { recursive: true });
    const root = await realpath(dir);

    const jsonResult = await execa(
      tsxPath,
      [cliPath, 'maintainer-check', '--json', '--redact-paths'],
      { cwd: nestedDir },
    );
    const humanResult = await execa(tsxPath, [cliPath, 'maintainer-check', '--redact-paths'], {
      cwd: nestedDir,
    });

    expect(jsonResult.exitCode).toBe(0);
    expect(humanResult.exitCode).toBe(0);
    expect(jsonResult.stdout).not.toContain(root);
    expect(humanResult.stdout).not.toContain(root);
    expect(jsonResult.stdout).toContain(externalUrl);
    expect(humanResult.stdout).toContain(externalUrl);
    expect(jsonResult.stdout).not.toContain('https:[git-root]');
    expect(humanResult.stdout).not.toContain('https:[git-root]');
    expect(jsonResult.stdout).toContain('[git-root]/src/index.ts');
    expect(humanResult.stdout).toContain('[git-root]/src/index.ts');
    expect(JSON.parse(jsonResult.stdout).status).toBe('pass');
    expect(humanResult.stdout).toContain('# AgentLoopKit Maintainer Check');
  });

  test('renders human maintainer-check values on one markdown line', () => {
    const markdown = renderMaintainerCheckMarkdown({
      status: 'warn',
      checks: [
        {
          id: 'task\ncontract',
          status: 'warn',
          message: 'Task title has line one\nline two',
          path: '.agentloop/tasks/task\ncontract.md',
        },
      ],
      maintainerChecklist: ['Review line one\nline two'],
      suggestedContributorRequest: 'Please explain line one\nline two.',
    });

    expect(markdown).toContain(
      '- [`warn`] `task\\ncontract`: `Task title has line one\\nline two` (`.agentloop/tasks/task\\ncontract.md`)',
    );
    expect(markdown).toContain('- [ ] Review line one\\nline two');
    expect(markdown).toContain('Please explain line one\\nline two.');
    expect(markdown).not.toContain('task\ncontract');
    expect(markdown).not.toContain('line one\nline two');
  });

  test('prints maintainer-check evidence paths with markdown-safe inline values', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await git(dir, ['init', '-q']);
    await git(dir, ['config', 'user.email', 'agentloopkit@example.com']);
    await git(dir, ['config', 'user.name', 'AgentLoopKit Test']);
    const config = createDefaultConfig({
      name: 'demo',
      type: 'typescript-package',
      packageManager: 'npm',
    });
    config.paths.tasksDir = '.agentloop/tasks\ncontracts';
    config.paths.reportsDir = '.agentloop/reports\nproof';
    config.paths.handoffsDir = '.agentloop/handoffs\nreview';
    await writeJson(path.join(dir, 'agentloop.config.json'), config);
    await mkdir(path.join(dir, config.paths.tasksDir), { recursive: true });
    await mkdir(path.join(dir, config.paths.reportsDir), { recursive: true });
    await mkdir(path.join(dir, config.paths.handoffsDir), { recursive: true });
    const taskPath = path.join(dir, config.paths.tasksDir, '2026-06-12-demo.md');
    await writeFile(taskPath, '# Demo task\n\n- Status: in-progress\n');
    await setActiveTask({ cwd: dir, config, taskPath });
    await writeFile(
      path.join(dir, config.paths.reportsDir, '2026-06-12-13-30-verification-report.md'),
      '# Verification Report\n\n- Overall status: pass\n',
    );
    await writeFile(
      path.join(dir, config.paths.handoffsDir, '2026-06-12-13-34-pr-summary.md'),
      '# PR Summary\n\n- Verification status: Overall status: pass\n',
    );
    await git(dir, ['add', '.']);
    await git(dir, ['commit', '-m', 'Initial state']);

    const result = await execa(tsxPath, [cliPath, 'maintainer-check'], { cwd: dir });

    expect(result.stdout).toContain('`.agentloop/tasks\\ncontracts/2026-06-12-demo.md`');
    expect(result.stdout).toContain(
      '`.agentloop/reports\\nproof/2026-06-12-13-30-verification-report.md`',
    );
    expect(result.stdout).toContain(
      '`.agentloop/handoffs\\nreview/2026-06-12-13-34-pr-summary.md`',
    );
    expect(result.stdout).not.toContain('.agentloop/tasks\ncontracts');
    expect(result.stdout).not.toContain('.agentloop/reports\nproof');
    expect(result.stdout).not.toContain('.agentloop/handoffs\nreview');
  });

  test('accepts latest run task evidence when the task contract was archived', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await git(dir, ['init', '-q']);
    await git(dir, ['config', 'user.email', 'agentloopkit@example.com']);
    await git(dir, ['config', 'user.name', 'AgentLoopKit Test']);
    const config = createDefaultConfig({
      name: 'demo',
      type: 'typescript-package',
      packageManager: 'npm',
    });
    await writeJson(path.join(dir, 'agentloop.config.json'), config);
    await mkdir(path.join(dir, '.agentloop/tasks/archive'), { recursive: true });
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await mkdir(path.join(dir, '.agentloop/handoffs'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/tasks/archive/2026-06-12-demo.md'),
      '# Demo task\n\n- Status: done\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-12-13-30-verification-report.md'),
      '# Verification Report\n\n- Overall status: pass\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/handoffs/2026-06-12-13-34-pr-summary.md'),
      '# PR Summary\n\n- Verification status: Overall status: pass\n',
    );
    await writeJson(path.join(dir, '.agentloop/runs/2026-06-12-13-33-ship/metadata.json'), {
      id: '2026-06-12-13-33-ship',
      command: 'ship',
      createdAt: '2026-06-12-13-33',
      createdAtEpochMs: 1781264042972,
      task: {
        path: '.agentloop/tasks/2026-06-12-demo.md',
        title: 'Demo task',
        status: 'done',
      },
      verificationReportPath: '.agentloop/reports/2026-06-12-13-30-verification-report.md',
      handoffPath: '.agentloop/handoffs/2026-06-12-13-34-pr-summary.md',
      shipReportPath: '.agentloop/reports/2026-06-12-13-33-ship-report.md',
      score: 96,
      changedFileCount: 1,
    });
    await writeJson(path.join(dir, '.agentloop/runs/2026-06-12-13-33-ship/changed-files.json'), [
      { status: 'M', path: 'changed.ts' },
    ]);
    await writeFile(path.join(dir, 'changed.ts'), 'export const changed = false;\n');
    await git(dir, ['add', '.']);
    await git(dir, ['commit', '-m', 'Initial state']);
    await writeFile(path.join(dir, 'changed.ts'), 'export const changed = true;\n');

    const result = await execa(tsxPath, [cliPath, 'maintainer-check', '--json'], { cwd: dir });
    const output = JSON.parse(result.stdout);

    expect(output.status).toBe('pass');
    expect(output.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'task-contract',
          status: 'pass',
          message: 'Task contract found: Demo task',
          path: '.agentloop/tasks/archive/2026-06-12-demo.md',
        }),
        expect.objectContaining({ id: 'verification-evidence', status: 'pass' }),
        expect.objectContaining({ id: 'handoff-summary', status: 'pass' }),
      ]),
    );
  });
});
