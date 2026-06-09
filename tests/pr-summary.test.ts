import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
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
    await writeFile(path.join(dir, '.agentloop/tasks/2026-06-09-demo.md'), '# Demo task\n');

    const summary = await summarizeRepository({ cwd: dir, config, timestamp: '2026-06-09-12-05' });

    expect(summary.markdown).toContain('Overall status: pass');
  });
});
