import path from 'node:path';
import { mkdir, readFile, utimes, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { generatePrSummary, summarizeRepository } from '../src/core/pr-summary.js';
import { createDefaultConfig } from '../src/core/config.js';
import { fencedCodeBlock, inlineCode } from '../src/core/markdown-format.js';
import { CLI_PROCESS_TIMEOUT_MS, makeTempDir, removeTempDir } from './helpers.js';

let tempDirs: string[] = [];
const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

describe('PR summary generation', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('creates deterministic reviewer summary', () => {
    const summary = generatePrSummary({
      timestamp: '2026-06-09-12-30',
      status: ' M src/index.ts\n?? tests/index.test.ts',
      changedFiles: [
        { status: 'M', path: 'src/index.ts' },
        { status: 'A', path: 'tests/index.test.ts' },
      ],
      taskMarkdown: '# Add settings page\n\nRollback: revert files.',
      verificationMarkdown: '# Verification Report\n\nOverall status: pass',
      diffStat: '2 files changed',
    });

    expect(summary.markdown).toContain('## Changed Files');
    expect(summary.markdown).toContain('- M `src/index.ts`');
    expect(summary.markdown).toContain('Overall status: pass');
    expect(summary.markdown).toContain('2 files changed');
  });

  test('formats task context metadata as safe inline Markdown', () => {
    const summary = generatePrSummary({
      timestamp: '2026-06-11-21-40',
      status: '',
      changedFiles: [],
      taskMarkdown: '# Add `settings` page\n\n- Status: in-progress\n',
      verificationMarkdown: '# Verification Report\n\nOverall status: pass',
      diffStat: '',
    });

    expect(summary.markdown).toContain(
      `- Task context: ${inlineCode('Add `settings` page')}`,
    );
    expect(summary.markdown).toContain('- Verification status: Overall status: pass');
  });

  test('classifies changed files by review area and adds focus hints', () => {
    const summary = generatePrSummary({
      timestamp: '2026-06-10-00-30',
      status: '',
      changedFiles: [
        { status: 'M', path: 'src/core/pr-summary.ts' },
        { status: 'M', path: 'tests/pr-summary.test.ts' },
        { status: 'M', path: 'README.md' },
        { status: 'M', path: '.github/workflows/ci.yml' },
        { status: 'M', path: 'package.json' },
        { status: 'A', path: '.agentloop/tasks/2026-06-10-demo.md' },
        { status: 'A', path: 'db/migrations/001-create-users.sql' },
      ],
      taskMarkdown: '# Improve PR summary reviewability',
      verificationMarkdown: '# Verification Report\n\nOverall status: pass',
      diffStat: '7 files changed',
    });

    expect(summary.markdown).toContain('## Change Areas');
    expect(summary.markdown).toContain('### Source');
    expect(summary.markdown).toContain('- M `src/core/pr-summary.ts`');
    expect(summary.markdown).toContain('### Tests');
    expect(summary.markdown).toContain('- M `tests/pr-summary.test.ts`');
    expect(summary.markdown).toContain('### Documentation');
    expect(summary.markdown).toContain('- M `README.md`');
    expect(summary.markdown).toContain('### CI / Automation');
    expect(summary.markdown).toContain('- M `.github/workflows/ci.yml`');
    expect(summary.markdown).toContain('### Config / Package');
    expect(summary.markdown).toContain('- M `package.json`');
    expect(summary.markdown).toContain('### AgentLoop');
    expect(summary.markdown).toContain('- A `.agentloop/tasks/2026-06-10-demo.md`');
    expect(summary.markdown).toContain('### Risk-Sensitive');
    expect(summary.markdown).toContain('- A `db/migrations/001-create-users.sql`');
    expect(summary.markdown).toContain('## Review Focus');
    expect(summary.markdown).toContain(
      '- Review source changes for behavior and public API impact.',
    );
    expect(summary.markdown).toContain('- Check tests cover the changed behavior.');
    expect(summary.markdown).toContain(
      '- Review CI or automation changes for permissions and secret handling.',
    );
    expect(summary.markdown).toContain(
      '- Review risk-sensitive paths such as migrations, auth, security, billing, env, deployment, and lockfiles with extra care.',
    );
  });

  test('escapes changed file paths when paths contain backticks', () => {
    const trickyPath = 'src/weird`path.ts';
    const summary = generatePrSummary({
      timestamp: '2026-06-11-15-00',
      status: '',
      changedFiles: [{ status: 'M', path: trickyPath }],
      taskMarkdown: '# Harden PR summary paths',
      verificationMarkdown: '# Verification Report\n\nOverall status: pass',
      diffStat: '1 file changed',
    });
    const safePathLine = `- M \`\`${trickyPath}\`\``;

    expect(summary.markdown.split(safePathLine).length - 1).toBe(2);
    expect(summary.markdown).toContain('## Changed Files');
    expect(summary.markdown).toContain('## Change Areas');
  });

  test('formats diff stats as safe fenced Markdown when stat text contains backticks', () => {
    const diffStat = ' src/weird`path.ts | 2 +-\n docs/notes.md | 1 ```';
    const summary = generatePrSummary({
      timestamp: '2026-06-11-22-00',
      status: '',
      changedFiles: [],
      taskMarkdown: '# Harden diff stats',
      verificationMarkdown: '# Verification Report\n\nOverall status: pass',
      diffStat,
    });

    expect(summary.markdown).toContain(fencedCodeBlock('text', diffStat.trim()));
    expect(summary.markdown).not.toContain('No diff stats available.');
  });

  test('uses latest timestamped verification report instead of reports README', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    await writeFile(path.join(dir, '.agentloop/reports/README.md'), '# Verification Reports\n');
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-09-12-00-verification-report.md'),
      '# Verification Report\n\n- Overall status: pass\n',
    );
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-09-demo.md'),
      '# Demo task\n\n- Status: in-progress\n',
    );
    await utimes(
      path.join(dir, '.agentloop/tasks/2026-06-09-demo.md'),
      new Date('2026-06-09T10:00:00Z'),
      new Date('2026-06-09T10:00:00Z'),
    );
    await utimes(
      path.join(dir, '.agentloop/reports/2026-06-09-12-00-verification-report.md'),
      new Date('2026-06-09T11:00:00Z'),
      new Date('2026-06-09T11:00:00Z'),
    );

    const summary = await summarizeRepository({ cwd: dir, config, timestamp: '2026-06-09-12-05' });

    expect(summary.markdown).toContain('Overall status: pass');
  });

  test('does not use a stale verification report that predates the task', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    const taskPath = path.join(dir, '.agentloop/tasks/2026-06-09-demo.md');
    const reportPath = path.join(dir, '.agentloop/reports/2026-06-09-12-00-verification-report.md');
    await writeFile(taskPath, '# Demo task\n\n- Status: in-progress\n');
    await writeFile(reportPath, '# Verification Report\n\nOverall status: pass\n');
    await utimes(reportPath, new Date('2026-06-09T10:00:00Z'), new Date('2026-06-09T10:00:00Z'));
    await utimes(taskPath, new Date('2026-06-09T11:00:00Z'), new Date('2026-06-09T11:00:00Z'));

    const summary = await summarizeRepository({ cwd: dir, config, timestamp: '2026-06-09-12-05' });

    expect(summary.markdown).toContain('Verification status: No verification report found.');
    expect(summary.markdown).not.toContain('Overall status: pass');
  });

  test('uses newest open task instead of a newer finished task for fallback context', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    const openPath = path.join(dir, '.agentloop/tasks/2026-06-09-open-task.md');
    const donePath = path.join(dir, '.agentloop/tasks/2026-06-09-done-task.md');
    await writeFile(openPath, '# Open task\n\n- Status: in-progress\n');
    await writeFile(donePath, '# Done task\n\n- Status: done\n');
    await utimes(openPath, new Date('2026-06-09T10:00:00Z'), new Date('2026-06-09T10:00:00Z'));
    await utimes(donePath, new Date('2026-06-09T11:00:00Z'), new Date('2026-06-09T11:00:00Z'));

    const summary = await summarizeRepository({ cwd: dir, config, timestamp: '2026-06-09-12-05' });

    expect(summary.markdown).toContain(`Task context: ${inlineCode('Open task')}`);
    expect(summary.markdown).not.toContain('Task context: Done task');
  });

  test('uses modified time instead of filename sort for the latest task context', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    const olderPath = path.join(dir, '.agentloop/tasks/2026-06-09-z-old-task.md');
    const newerPath = path.join(dir, '.agentloop/tasks/2026-06-09-a-new-task.md');
    await writeFile(olderPath, '# Older task\n\n- Status: proposed\n');
    await writeFile(newerPath, '# Newer task\n\n- Status: in-progress\n');
    await utimes(olderPath, new Date('2026-06-09T10:00:00Z'), new Date('2026-06-09T10:00:00Z'));
    await utimes(newerPath, new Date('2026-06-09T11:00:00Z'), new Date('2026-06-09T11:00:00Z'));

    const summary = await summarizeRepository({ cwd: dir, config, timestamp: '2026-06-09-12-05' });

    expect(summary.markdown).toContain(`Task context: ${inlineCode('Newer task')}`);
  });

  test('uses explicit active task state before latest task fallback', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    const explicitPath = path.join(dir, '.agentloop/tasks/2026-06-09-explicit-task.md');
    const newerPath = path.join(dir, '.agentloop/tasks/2026-06-09-newer-task.md');
    await writeFile(explicitPath, '# Explicit task\n\n- Status: proposed\n');
    await writeFile(newerPath, '# Newer task\n\n- Status: in-progress\n');
    await utimes(explicitPath, new Date('2026-06-09T10:00:00Z'), new Date('2026-06-09T10:00:00Z'));
    await utimes(newerPath, new Date('2026-06-09T11:00:00Z'), new Date('2026-06-09T11:00:00Z'));
    await writeFile(
      path.join(dir, '.agentloop/state.json'),
      JSON.stringify({
        version: 1,
        activeTaskPath: '.agentloop/tasks/2026-06-09-explicit-task.md',
      }),
    );

    const summary = await summarizeRepository({ cwd: dir, config, timestamp: '2026-06-09-12-05' });

    expect(summary.markdown).toContain(`Task context: ${inlineCode('Explicit task')}`);
  });

  test('redacts local root paths from written handoff Markdown when requested', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
    await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
    await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-15-demo.md'),
      `# Demo ${dir}/src/index.ts\n\n- Status: proposed\n`,
    );
    await writeFile(
      path.join(dir, '.agentloop/reports/2026-06-15-12-00-verification-report.md'),
      '# Verification Report\n\nOverall status: pass\n',
    );

    const summary = await summarizeRepository({
      cwd: dir,
      config,
      timestamp: '2026-06-15-12-05',
      write: true,
      redactPaths: true,
    });
    const written = await readFile(summary.outPath, 'utf8');

    expect(written).not.toContain(dir);
    expect(written).toContain('[git-root]/src/index.ts');
  });

  test('accepts --redact-paths on handoff and summarize commands', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await execa('git', ['init', '-q'], { cwd: dir });
    await execa(tsxPath, [cliPath, 'init'], { cwd: dir, timeout: CLI_PROCESS_TIMEOUT_MS });

    const handoff = await execa(tsxPath, [cliPath, 'handoff', '--redact-paths', '--no-write'], {
      cwd: dir,
      timeout: CLI_PROCESS_TIMEOUT_MS,
    });
    const summarize = await execa(tsxPath, [cliPath, 'summarize', '--redact-paths'], {
      cwd: dir,
      timeout: CLI_PROCESS_TIMEOUT_MS,
    });

    expect(handoff.exitCode).toBe(0);
    expect(handoff.stdout).toContain('# PR Summary');
    expect(summarize.exitCode).toBe(0);
    expect(summarize.stdout).toContain('# PR Summary');
  });
});
