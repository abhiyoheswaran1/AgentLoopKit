import { existsSync } from 'node:fs';
import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

async function git(cwd: string, args: string[]) {
  return execa('git', args, { cwd });
}

async function createReleaseFixture(options: { withPreviousTag: boolean }) {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await git(dir, ['init', '-q']);
  await git(dir, ['config', 'user.email', 'agentloopkit@example.com']);
  await git(dir, ['config', 'user.name', 'AgentLoopKit Test']);

  const config = createDefaultConfig({ name: 'demo', type: 'generic', packageManager: 'npm' });
  await writeJson(path.join(dir, 'agentloop.config.json'), config);
  await writeJson(path.join(dir, 'package.json'), {
    name: 'demo',
    version: '1.2.3',
    scripts: { test: 'echo ok' },
  });
  await writeFile(
    path.join(dir, 'CHANGELOG.md'),
    '# Changelog\n\n## 1.2.3\n\n- Added release-note generation.\n- Improved release evidence.\n\n## 1.2.2\n\n- Previous release.\n',
  );
  await mkdir(path.join(dir, 'src'), { recursive: true });
  await writeFile(path.join(dir, 'src/index.ts'), 'export const previous = true;\n');
  await git(dir, ['add', '.']);
  await git(dir, ['commit', '-m', 'Initial release']);
  if (options.withPreviousTag) await git(dir, ['tag', 'v1.2.2']);

  await writeFile(path.join(dir, 'src/index.ts'), 'export const releaseNotes = true;\n');
  await git(dir, ['add', 'src/index.ts']);
  await git(dir, ['commit', '-m', 'Add release note behavior']);

  await mkdir(path.join(dir, '.agentloop/tasks'), { recursive: true });
  await mkdir(path.join(dir, '.agentloop/reports'), { recursive: true });
  await mkdir(path.join(dir, '.agentloop/handoffs'), { recursive: true });
  await writeFile(
    path.join(dir, '.agentloop/tasks/2026-06-10-release-notes.md'),
    '# Prepare release notes\n\n- Status: review\n',
  );
  await writeFile(
    path.join(dir, '.agentloop/reports/2026-06-10-12-00-verification-report.md'),
    '# Verification Report\n\n- Overall status: pass\n',
  );
  await writeFile(
    path.join(dir, '.agentloop/reports/2026-06-10-12-05-ci-summary.md'),
    '# AgentLoopKit CI Summary\n\n- Overall status: pass\n',
  );

  return dir;
}

describe('release-notes command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('writes deterministic release notes as JSON from local evidence', async () => {
    const dir = await createReleaseFixture({ withPreviousTag: true });

    const result = await execa(
      tsxPath,
      [cliPath, 'release-notes', '--from', 'v1.2.2', '--to', 'HEAD', '--json', '--write'],
      { cwd: dir },
    );

    const output = JSON.parse(result.stdout);
    expect(output.version).toBe('1.2.3');
    expect(output.gitRange.from).toBe('v1.2.2');
    expect(output.gitRange.to).toBe('HEAD');
    expect(output.writtenPath).toMatch(/release-notes\.md$/);
    expect(existsSync(output.writtenPath)).toBe(true);
    expect(output.markdown).toContain('# Release Notes');
    expect(output.markdown).toContain('- Version: 1.2.3');
    expect(output.markdown).toContain('- Range: v1.2.2..HEAD');
    expect(output.markdown).toContain('- Added release-note generation.');
    expect(output.markdown).toContain('Add release note behavior');
    expect(output.markdown).toContain('src/index.ts');
    expect(output.markdown).toContain('Uncommitted changes detected');
    expect(output.markdown).toContain('.agentloop/tasks/2026-06-10-release-notes.md');
    expect(output.markdown).toContain('Prepare release notes');
    expect(output.markdown).toContain('Overall status: pass');
    expect(output.markdown).toContain('Does not create tags, publish packages, call external APIs');

    const written = await readFile(output.writtenPath, 'utf8');
    expect(written).toBe(output.markdown);
  });

  test('handles missing previous tags honestly in markdown output', async () => {
    const dir = await createReleaseFixture({ withPreviousTag: false });

    const result = await execa(tsxPath, [cliPath, 'release-notes'], { cwd: dir });

    expect(result.stdout).toContain('# Release Notes');
    expect(result.stdout).toContain('- Version: 1.2.3');
    expect(result.stdout).toContain('No previous version tag was found');
    expect(result.stdout).toContain('No release notes file was written.');
  });

  test('accepts an explicit release version without colliding with the CLI version flag', async () => {
    const dir = await createReleaseFixture({ withPreviousTag: true });

    const result = await execa(
      tsxPath,
      [cliPath, 'release-notes', '--release-version', '9.9.9', '--json'],
      { cwd: dir },
    );

    const output = JSON.parse(result.stdout);
    expect(output.version).toBe('9.9.9');
    expect(output.markdown).toContain('- Version: 9.9.9');
  });

  test('handles an explicit missing from ref without pretending the range was read', async () => {
    const dir = await createReleaseFixture({ withPreviousTag: true });

    const result = await execa(tsxPath, [cliPath, 'release-notes', '--from', 'v9.9.9'], {
      cwd: dir,
    });

    expect(result.stdout).toContain('Git ref "v9.9.9" was not found');
    expect(result.stdout).toContain('- Range: HEAD (missing from: v9.9.9)');
    expect(result.stdout).toContain('Add release note behavior');
    expect(result.stdout).toContain('No changed files detected for the selected range');
  });
});
