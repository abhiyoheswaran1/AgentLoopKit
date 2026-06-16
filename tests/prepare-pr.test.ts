import path from 'node:path';
import { mkdir, readFile, realpath, rename, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { parseGitStatus } from '../src/core/git.js';
import { setActiveTask } from '../src/core/task-state.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');
const CLI_PREPARE_PR_TEST_TIMEOUT_MS = 90_000;

let tempDirs: string[] = [];

async function git(cwd: string, args: string[]) {
  return execa('git', args, { cwd });
}

async function createPreparePrFixture(
  options: {
    acceptanceCriteria?: string;
    riskNotes?: string;
  } = {},
) {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  const acceptanceCriteria =
    options.acceptanceCriteria ??
    `- Password-reset login redirects to the requested page.
- Existing session login still redirects to the dashboard.
- Reviewer can see every acceptance criterion in the PR body.`;
  const riskNotes = options.riskNotes ?? '- Auth flow touched; review redirect edge cases.';

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
  await mkdir(path.join(dir, '.agentloop/harness'), { recursive: true });
  await mkdir(path.join(dir, '.agentloop/policies'), { recursive: true });
  await writeFile(path.join(dir, 'AGENTS.md'), '# Agents\n');
  await writeFile(path.join(dir, 'AGENTLOOP.md'), '# AgentLoop\n');
  for (const file of [
    'commands.md',
    'definition-of-done.md',
    'review-checklist.md',
    'autonomous-work-rules.md',
  ]) {
    await writeFile(path.join(dir, '.agentloop/harness', file), `# ${file}\n`);
  }
  for (const file of ['no-destructive-actions.md', 'git-policy.md', 'secrets-policy.md']) {
    await writeFile(path.join(dir, '.agentloop/policies', file), `# ${file}\n`);
  }

  const taskPath = path.join(dir, '.agentloop/tasks/2026-06-11-fix-login.md');
  await writeFile(
    taskPath,
    `# Fix login redirect bug

- Created date: 2026-06-11
- Task type: bugfix
- Status: in-progress

## Problem Statement
Login redirects users to the wrong page after password reset.

## Desired Outcome
Users land on the intended destination after a successful login.

## Acceptance Criteria
${acceptanceCriteria}

## Verification Commands
- npm test -- auth

## Risk Notes
${riskNotes}

## Rollback Notes
Revert the auth callback change.
`,
  );
  await setActiveTask({ cwd: dir, config, taskPath });
  await writeFile(
    path.join(dir, '.agentloop/reports/2026-06-11-12-00-verification-report.md'),
    '# Verification Report\n\n- Overall status: pass\n',
  );
  await mkdir(path.join(dir, 'src/auth'), { recursive: true });
  await writeFile(path.join(dir, 'src/auth/callback.ts'), 'export const redirect = "old";\n');
  await git(dir, ['add', '.']);
  await git(dir, ['commit', '-m', 'Initial state']);
  await writeFile(path.join(dir, 'src/auth/callback.ts'), 'export const redirect = "fixed";\n');

  return dir;
}

describe('prepare-pr command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('generates a PR description and GitHub comment markdown from local evidence', async () => {
    const dir = await createPreparePrFixture();

    const result = await execa(tsxPath, [cliPath, 'prepare-pr', '--json', '--github-comment'], {
      cwd: dir,
    });
    const output = JSON.parse(result.stdout);

    expect(output.titleSuggestion).toBe('Fix login redirect bug');
    expect(output.body).toContain('# Fix login redirect bug');
    expect(output.body).toContain('## Changed Files');
    expect(output.body).toContain('src/auth/callback.ts');
    expect(output.body).toContain('## Verification Evidence');
    expect(output.body).toContain('Password-reset login redirects to the requested page.');
    expect(output.body).toContain('Existing session login still redirects to the dashboard.');
    expect(output.body).toContain('Reviewer can see every acceptance criterion in the PR body.');
    expect(output.body).toContain('Overall status: pass');
    expect(output.body).toContain('## Risks');
    expect(output.body).toContain('Auth flow touched; review redirect edge cases.');
    expect(output.body).toContain('## Rollback Notes');
    expect(output.body).toContain('Revert the auth callback change.');
    expect(output.body).toContain('.agentloop/reports/');
    expect(output.body).not.toContain(dir);
    expect(output.githubComment).toContain('## AgentLoopKit Review Readiness');
    expect(output.githubComment).toContain(
      'This is a review-readiness score, not a code-quality score.',
    );
    expect(output.githubComment).toContain('.agentloop/reports/');
    expect(output.githubComment).not.toContain(dir);
    expect(output.shipReportPath).toMatch(/\.agentloop\/reports\/.+-ship-report\.md$/);
    expect(output.shipReportPath).not.toContain(dir);
    expect(output.handoffPath).not.toContain(dir);
    const runs = JSON.parse(
      (await execa(tsxPath, [cliPath, 'runs', '--json'], { cwd: dir })).stdout,
    );
    const shipRuns = runs.runs.filter((run: { command: string }) => run.command === 'ship');
    expect(shipRuns).toHaveLength(1);
    expect(output.shipEvidence).toMatchObject({
      source: 'refreshed',
      runId: shipRuns[0].id,
    });
  });

  test(
    'escapes Markdown control characters in generated PR body and GitHub comment lists',
    async () => {
      const dir = await createPreparePrFixture({
        acceptanceCriteria: `- [ ] Do not render as a checkbox.
- # Do not render as a heading.
- See [runbook](https://example.com).`,
        riskNotes: '- Auth *flow* touched; review [runbook](https://example.com).',
      });
      await writeFile(path.join(dir, 'src/auth/[callback].ts'), 'export const extra = true;\n');
      await git(dir, ['add', '-N', 'src/auth/[callback].ts']);

      const output = JSON.parse(
        (await execa(tsxPath, [cliPath, 'prepare-pr', '--json', '--github-comment'], { cwd: dir }))
          .stdout,
      );

      expect(output.body).toContain('- \\[ \\] Do not render as a checkbox.');
      expect(output.body).toContain('- \\# Do not render as a heading.');
      expect(output.body).toContain('- See \\[runbook\\]\\(https://example.com\\).');
      expect(output.body).toContain(
        '- Auth \\*flow\\* touched; review \\[runbook\\]\\(https://example.com\\).',
      );
      expect(output.body).not.toContain('- [ ] Do not render as a checkbox.');
      expect(output.body).not.toContain('- # Do not render as a heading.');
      expect(output.body).not.toContain('- See [runbook](https://example.com).');
      expect(output.githubComment).toContain('src/auth/\\[callback\\].ts');
      expect(output.githubComment).not.toContain('src/auth/[callback].ts');
    },
    CLI_PREPARE_PR_TEST_TIMEOUT_MS,
  );

  test(
    'includes imported GitHub issue and pull request context in PR output',
    async () => {
      const dir = await createPreparePrFixture();
      await writeJson(path.join(dir, '.agentloop/github/context.json'), {
        issue: {
          number: 42,
          title: 'Fix [login](https://example.com) redirect',
          state: 'OPEN',
          url: 'https://github.com/example/app/issues/42',
          author: 'octocat',
          labels: ['bug', 'agent-review'],
          bodyExcerpt: 'User loses *redirect* target.\nSecond line.',
        },
        pullRequest: {
          number: 77,
          title: 'Agent fix for login redirect',
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
          bodyExcerpt: 'Implements [the fix](https://example.com).',
        },
      });

      const output = JSON.parse(
        (await execa(tsxPath, [cliPath, 'prepare-pr', '--json'], { cwd: dir })).stdout,
      );

      expect(output.githubMetadata).toMatchObject({
        status: 'present',
        path: '.agentloop/github/context.json',
        issue: {
          number: 42,
          title: 'Fix [login](https://example.com) redirect',
          bodyExcerpt: 'User loses *redirect* target.\nSecond line.',
        },
        pullRequest: {
          number: 77,
          headRefName: 'fix/login-redirect',
          bodyExcerpt: 'Implements [the fix](https://example.com).',
        },
      });
      expect(output.body).toContain('## Imported GitHub Context');
      expect(output.body).toContain('- Metadata file: `.agentloop/github/context.json`');
      expect(output.body).toContain(
        '- Issue: `#42` `OPEN` - Fix \\[login\\]\\(https://example.com\\) redirect',
      );
      expect(output.body).toContain('- Issue labels: `bug`, `agent-review`');
      expect(output.body).toContain(
        '- Issue excerpt: User loses \\*redirect\\* target. Second line.',
      );
      expect(output.body).toContain('- PR branch: `fix/login-redirect` -> `main`');
      expect(output.body).toContain(
        '- PR excerpt: Implements \\[the fix\\]\\(https://example.com\\).',
      );
      expect(output.body).not.toContain(dir);
    },
    CLI_PREPARE_PR_TEST_TIMEOUT_MS,
  );

  test('accepts redacted output when refreshing ship evidence', async () => {
    const dir = await createPreparePrFixture();
    const realRoot = await realpath(dir);

    const result = await execa(
      tsxPath,
      [cliPath, 'prepare-pr', '--json', '--github-comment', '--redact-paths'],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(0);
    expect(result.stdout).not.toContain(realRoot);
    const output = JSON.parse(result.stdout);
    expect(output.githubComment).toContain('## AgentLoopKit Review Readiness');
    expect(output.shipEvidence.source).toBe('refreshed');
    expect(output.shipReportPath).toMatch(/\.agentloop\/reports\/.+-ship-report\.md$/);
  });

  test(
    'reuses a fresh ship run instead of writing duplicate run ledger entries',
    async () => {
      const dir = await createPreparePrFixture();

      const ship = JSON.parse(
        (await execa(tsxPath, [cliPath, 'ship', '--json'], { cwd: dir })).stdout,
      );
      const prepared = JSON.parse(
        (await execa(tsxPath, [cliPath, 'prepare-pr', '--write', '--json'], { cwd: dir })).stdout,
      );
      const runs = JSON.parse(
        (await execa(tsxPath, [cliPath, 'runs', '--json'], { cwd: dir })).stdout,
      );
      const shipRuns = runs.runs.filter((run: { command: string }) => run.command === 'ship');

      expect(prepared.shipReportPath).toBe(ship.shipReportPath);
      expect(prepared.shipReportPath).not.toContain(dir);
      expect(prepared.shipEvidence).toEqual({
        source: 'reused',
        runId: ship.run.id,
      });
      expect(shipRuns).toHaveLength(1);
      expect(shipRuns[0].id).toBe(ship.run.id);
    },
    CLI_PREPARE_PR_TEST_TIMEOUT_MS,
  );

  test(
    'reuses archived latest-run task evidence for PR copy without writing duplicate ship runs',
    async () => {
      const dir = await createPreparePrFixture();

      await execa(tsxPath, [cliPath, 'ship', '--json'], { cwd: dir });
      await mkdir(path.join(dir, '.agentloop/tasks/archive'), { recursive: true });
      await rename(
        path.join(dir, '.agentloop/tasks/2026-06-11-fix-login.md'),
        path.join(dir, '.agentloop/tasks/archive/2026-06-11-fix-login.md'),
      );

      const archivedShip = JSON.parse(
        (await execa(tsxPath, [cliPath, 'ship', '--json'], { cwd: dir })).stdout,
      );
      const prepared = JSON.parse(
        (await execa(tsxPath, [cliPath, 'prepare-pr', '--write', '--json'], { cwd: dir })).stdout,
      );
      const runs = JSON.parse(
        (await execa(tsxPath, [cliPath, 'runs', '--json'], { cwd: dir })).stdout,
      );
      const shipRuns = runs.runs.filter((run: { command: string }) => run.command === 'ship');

      expect(archivedShip.task).toMatchObject({
        path: '.agentloop/tasks/archive/2026-06-11-fix-login.md',
        title: 'Fix login redirect bug',
      });
      expect(prepared.titleSuggestion).toBe('Fix login redirect bug');
      expect(prepared.body).toContain('# Fix login redirect bug');
      expect(prepared.body).toContain('Password-reset login redirects to the requested page.');
      expect(prepared.body).toContain('Auth flow touched; review redirect edge cases.');
      expect(prepared.body).toContain('Revert the auth callback change.');
      expect(prepared.shipReportPath).toBe(archivedShip.shipReportPath);
      expect(prepared.shipEvidence).toEqual({
        source: 'reused',
        runId: archivedShip.run.id,
      });
      expect(shipRuns).toHaveLength(2);
    },
    CLI_PREPARE_PR_TEST_TIMEOUT_MS,
  );

  test(
    'groups changed files by review area in the PR body',
    async () => {
      const dir = await createPreparePrFixture();

      await mkdir(path.join(dir, 'tests/ui'), { recursive: true });
      await mkdir(path.join(dir, 'docs'), { recursive: true });
      await mkdir(path.join(dir, 'src/ui'), { recursive: true });
      await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
      await writeFile(path.join(dir, 'src/ui/button.ts'), 'export const label = "Save";\n');
      await writeFile(path.join(dir, 'tests/ui/button.test.ts'), 'test("button", () => {});\n');
      await writeFile(path.join(dir, 'docs/login`flow.md'), '# Login flow\n');
      await writeFile(
        path.join(dir, '.agentloop/reports/2026-06-12-extra.md'),
        '# Extra evidence\n',
      );
      await git(dir, [
        'add',
        '-N',
        'src/ui/button.ts',
        'tests/ui/button.test.ts',
        'docs/login`flow.md',
      ]);

      const output = JSON.parse(
        (await execa(tsxPath, [cliPath, 'prepare-pr', '--json'], { cwd: dir })).stdout,
      );

      expect(output.body).toContain('## Changed Files');
      expect(output.body).toContain('### Risk-Sensitive');
      expect(output.body).toContain('- M `src/auth/callback.ts`');
      expect(output.body).toContain('### Source');
      expect(output.body).toContain('- A `src/ui/button.ts`');
      expect(output.body).toContain('### Tests');
      expect(output.body).toContain('- A `tests/ui/button.test.ts`');
      expect(output.body).toContain('### AgentLoop');
      expect(output.body).toContain('- ?? `.agentloop/reports/2026-06-12-extra.md`');
      expect(output.body).toContain('### Documentation');
      expect(output.body).toContain('- A ``docs/login`flow.md``');
      expect(output.changedFiles).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: 'src/auth/callback.ts' }),
          expect.objectContaining({ path: 'src/ui/button.ts' }),
          expect.objectContaining({ path: 'tests/ui/button.test.ts' }),
          expect.objectContaining({ path: 'docs/login`flow.md' }),
          expect.objectContaining({ path: '.agentloop/reports/2026-06-12-extra.md' }),
        ]),
      );
    },
    CLI_PREPARE_PR_TEST_TIMEOUT_MS,
  );

  test(
    'renders dynamic PR body and GitHub comment values on one markdown line',
    async () => {
      const dir = await createPreparePrFixture();
      await writeJson(path.join(dir, '.agentloop/github/context.json'), {
        issue: {
          number: 42,
          title: 'Fix login redirect',
          state: 'OPEN\nTRIAGE',
          url: 'https://github.com/example/app/issues/42\nutm=agentloop',
          author: 'octocat',
          labels: ['bug\ntriage'],
          bodyExcerpt: 'User loses redirect target.',
        },
        pullRequest: {
          number: 77,
          title: 'Agent fix for login redirect',
          state: 'OPEN',
          url: 'https://github.com/example/app/pull/77',
          author: 'contributor',
          labels: [],
          isDraft: false,
          baseRefName: 'main',
          headRefName: 'fix/login\nredirect',
          changedFiles: 3,
          additions: 42,
          deletions: 9,
          bodyExcerpt: 'Implements the fix.',
        },
      });
      const ship = JSON.parse(
        (await execa(tsxPath, [cliPath, 'ship', '--json'], { cwd: dir })).stdout,
      );
      const runDir = path.join(dir, '.agentloop/runs', ship.run.id);
      const scorePath = path.join(runDir, 'score.json');
      const metadataPath = path.join(runDir, 'metadata.json');
      const score = JSON.parse(await readFile(scorePath, 'utf8'));
      const metadata = JSON.parse(await readFile(metadataPath, 'utf8'));

      score.claims = ['This is a review-readiness score.\nDo not split this list item.'];
      score.blockers = ['Blocker line one\nBlocker line two'];
      score.warnings = ['Warning line one\nWarning line two'];
      score.recommendedNextActions = ['Next action line one\nNext action line two'];
      await writeJson(scorePath, score);

      metadata.shipReportPath = '.agentloop/reports/ship\nreport.md';
      metadata.handoffPath = '.agentloop/handoffs/review\nhandoff.md';
      await writeJson(metadataPath, metadata);
      await writeFile(path.join(dir, '.agentloop/reports/ship\nreport.md'), '# Ship Report\n');
      await writeFile(path.join(dir, '.agentloop/handoffs/review\nhandoff.md'), '# Handoff\n');
      await writeJson(
        path.join(runDir, 'changed-files.json'),
        await parseGitStatus(
          (await git(dir, ['status', '--short', '--untracked-files=all'])).stdout,
        ),
      );

      const output = JSON.parse(
        (await execa(tsxPath, [cliPath, 'prepare-pr', '--json', '--github-comment'], { cwd: dir }))
          .stdout,
      );

      expect(output.shipEvidence).toEqual({
        source: 'reused',
        runId: ship.run.id,
      });
      expect(output.body).toContain(
        '- This is a review-readiness score.\\nDo not split this list item.',
      );
      expect(output.body).toContain('- Ship report: `.agentloop/reports/ship\\nreport.md`');
      expect(output.body).toContain('- Issue labels: `bug\\ntriage`');
      expect(output.body).toContain('`OPEN\\nTRIAGE`');
      expect(output.body).toContain('`fix/login\\nredirect` -> `main`');
      expect(output.body).toContain(
        '`https://github.com/example/app/issues/42\\nutm=agentloop`',
      );
      expect(output.githubComment).toContain('- Ship report: `.agentloop/reports/ship\\nreport.md`');
      expect(output.githubComment).toContain('- Handoff: `.agentloop/handoffs/review\\nhandoff.md`');
      expect(output.githubComment).toContain(
        '- This is a review-readiness score.\\nDo not split this list item.',
      );
      expect(output.githubComment).toContain('- Blocker line one\\nBlocker line two');
      expect(output.githubComment).toContain('- Warning line one\\nWarning line two');
      expect(output.githubComment).toContain('- Next action line one\\nNext action line two');

      expect(output.body).not.toContain('ship\nreport.md`');
      expect(output.body).not.toContain('bug\ntriage`');
      expect(output.body).not.toContain('OPEN\nTRIAGE`');
      expect(output.githubComment).not.toContain('review\nhandoff.md`');
      expect(output.githubComment).not.toContain('Blocker line one\nBlocker line two');
    },
    CLI_PREPARE_PR_TEST_TIMEOUT_MS,
  );

  test(
    'renders written path confirmation on one markdown line',
    async () => {
      const dir = await createPreparePrFixture();
      const config = createDefaultConfig({
        name: 'demo',
        type: 'typescript-package',
        packageManager: 'npm',
      });
      config.paths.handoffsDir = '.agentloop/handoffs\nreview';
      await writeJson(path.join(dir, 'agentloop.config.json'), config);
      await mkdir(path.join(dir, config.paths.handoffsDir), { recursive: true });

      const result = await execa(tsxPath, [cliPath, 'prepare-pr', '--write'], { cwd: dir });

      expect(result.stdout).toContain(
        'PR description written: `.agentloop/handoffs\\nreview/',
      );
      expect(result.stdout).not.toContain('PR description written: `.agentloop/handoffs\nreview/');
    },
    CLI_PREPARE_PR_TEST_TIMEOUT_MS,
  );
});
