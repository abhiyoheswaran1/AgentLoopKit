import path from 'node:path';
import { mkdir, utimes, writeFile } from 'node:fs/promises';
import { afterEach, describe, expect, test } from 'vitest';
import { generatePrSummary, summarizeRepository } from '../src/core/pr-summary.js';
import { createDefaultConfig } from '../src/core/config.js';
import { makeTempDir, removeTempDir } from './helpers.js';

let tempDirs: string[] = [];

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

    const summary = await summarizeRepository({ cwd: dir, config, timestamp: '2026-06-09-12-05' });

    expect(summary.markdown).toContain('Overall status: pass');
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

    expect(summary.markdown).toContain('Task context: Open task');
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

    expect(summary.markdown).toContain('Task context: Newer task');
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

    expect(summary.markdown).toContain('Task context: Explicit task');
  });
});
