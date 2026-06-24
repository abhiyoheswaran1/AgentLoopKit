import path from 'node:path';
import { mkdir, readFile, realpath, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { initializeAgentLoop } from '../src/core/init.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');
let tempDirs: string[] = [];

async function writeOldHarness(dir: string) {
  await writeJson(path.join(dir, 'package.json'), { name: 'old-harness' });
  await initializeAgentLoop({ cwd: dir });
  await writeFile(
    path.join(dir, 'AGENTS.md'),
    '# AGENTS\n\nUse `agentloop verify` and `agentloop handoff` before review.\n',
  );
  await writeFile(
    path.join(dir, 'AGENTLOOP.md'),
    '# AGENTLOOP\n\nRun `agentloop create-task`, `agentloop verify`, and `agentloop handoff`.\n',
  );
  await writeFile(
    path.join(dir, '.agentloop', 'harness', 'commands.md'),
    '# Commands\n\nUse `agentloop check-gates` before handing off work.\n',
  );
}

describe('upgrade-harness command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('warns about older harness guidance without writing files', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeOldHarness(dir);
    const before = await readFile(path.join(dir, 'AGENTS.md'), 'utf8');

    const result = await execa(tsxPath, [cliPath, 'upgrade-harness', '--dry-run', '--json'], {
      cwd: dir,
    });

    const output = JSON.parse(result.stdout);
    expect(output.status).toBe('warn');
    expect(output.dryRun).toBe(true);
    expect(output.writesFiles).toBe(false);
    expect(output.files).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'AGENTS.md',
          status: 'review',
          missingTopics: expect.arrayContaining(['ship', 'prepare-pr', 'run-ledger', 'agent-start']),
        }),
      ]),
    );
    expect(output.nextSteps).toEqual(
      expect.arrayContaining([
        'Run `agentloop upgrade-harness` after updating the CLI to inspect existing harness guidance.',
        'Manually copy the relevant guidance into AGENTS.md, AGENTLOOP.md, or .agentloop/harness/*; AgentLoopKit will not overwrite local edits.',
      ]),
    );
    await expect(readFile(path.join(dir, 'AGENTS.md'), 'utf8')).resolves.toBe(before);
  });

  test('prints copyable suggestions for missing current-loop topics', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeOldHarness(dir);
    const before = await readFile(path.join(dir, 'AGENTS.md'), 'utf8');

    const jsonResult = await execa(
      tsxPath,
      [cliPath, 'upgrade-harness', '--suggestions', '--json'],
      {
        cwd: dir,
      },
    );
    const humanResult = await execa(tsxPath, [cliPath, 'upgrade-harness', '--details'], {
      cwd: dir,
    });

    const output = JSON.parse(jsonResult.stdout);
    expect(output.suggestions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          topic: 'ship',
          targetFiles: expect.arrayContaining(['AGENTS.md', 'AGENTLOOP.md']),
          copyMarkdown: expect.stringContaining('agentloop ship'),
        }),
        expect.objectContaining({
          topic: 'prepare-pr',
          copyMarkdown: expect.stringContaining('agentloop prepare-pr'),
        }),
        expect.objectContaining({
          topic: 'agent-start',
          copyMarkdown: expect.stringContaining(
            'agentloop start --for generic --goal implement --redact-paths',
          ),
        }),
      ]),
    );
    expect(humanResult.stdout).toContain('## Copyable Guidance');
    expect(humanResult.stdout).toContain('### ship');
    expect(humanResult.stdout).toContain('agentloop ship');
    expect(humanResult.stdout).toContain('agentloop prepare-pr');
    expect(humanResult.stdout).toContain('agentloop context show <handle>');
    await expect(readFile(path.join(dir, 'AGENTS.md'), 'utf8')).resolves.toBe(before);
  });

  test('requires source-handle expansion guidance for agent-start readiness', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeOldHarness(dir);
    await writeFile(
      path.join(dir, 'AGENTS.md'),
      '# AGENTS\n\nBefore broad repo reads, run `agentloop start --for generic --goal implement --redact-paths`.\n',
    );

    const result = await execa(tsxPath, [cliPath, 'upgrade-harness', '--json'], { cwd: dir });

    const output = JSON.parse(result.stdout);
    expect(output.files).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'AGENTS.md',
          missingTopics: expect.arrayContaining(['agent-start']),
        }),
      ]),
    );
  });

  test('passes for a freshly initialized current harness', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(path.join(dir, 'package.json'), {
      name: 'current-harness',
      scripts: { test: 'vitest' },
    });
    await initializeAgentLoop({ cwd: dir });

    const result = await execa(tsxPath, [cliPath, 'upgrade-harness', '--json'], { cwd: dir });

    const output = JSON.parse(result.stdout);
    expect(output.status).toBe('pass');
    expect(output.writesFiles).toBe(false);
    expect(output.files).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'AGENTS.md', status: 'current', missingTopics: [] }),
        expect.objectContaining({ path: 'AGENTLOOP.md', status: 'current', missingTopics: [] }),
      ]),
    );
  });

  test('uses the discovered AgentLoop root from nested directories', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(path.join(dir, 'package.json'), {
      name: 'nested-harness',
      scripts: { test: 'vitest' },
    });
    await initializeAgentLoop({ cwd: dir });
    const nestedDir = path.join(dir, 'src', 'feature');
    await mkdir(nestedDir, { recursive: true });

    const result = await execa(tsxPath, [cliPath, 'upgrade-harness', '--json'], {
      cwd: nestedDir,
    });

    const output = JSON.parse(result.stdout);
    expect(output.status).toBe('pass');
    expect(output.targetDirectory).toBe(await realpath(dir));
  });

  test('redacts the target directory for shareable JSON output', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeOldHarness(dir);

    const result = await execa(tsxPath, [cliPath, 'upgrade-harness', '--json', '--redact-paths'], {
      cwd: dir,
    });

    const output = JSON.parse(result.stdout);
    expect(output.targetDirectory).toBe('[agentloop-root]');
    expect(result.stdout).not.toContain(dir);
  });

  test('keeps unusual target paths on one line in human output while preserving JSON values', async () => {
    const baseDir = await makeTempDir();
    tempDirs.push(baseDir);
    const dir = path.join(baseDir, 'repo\nwith-break');
    await mkdir(dir, { recursive: true });
    await writeOldHarness(dir);
    const resolvedDir = await realpath(dir);

    const humanResult = await execa(tsxPath, [cliPath, 'upgrade-harness'], { cwd: dir });
    const jsonResult = await execa(tsxPath, [cliPath, 'upgrade-harness', '--json'], { cwd: dir });

    const targetLine = humanResult.stdout
      .split('\n')
      .find((line) => line.startsWith('- Target:'));
    expect(targetLine).toContain('repo\\nwith-break');
    expect(humanResult.stdout).not.toContain(resolvedDir);

    const output = JSON.parse(jsonResult.stdout);
    expect(output.targetDirectory).toBe(resolvedDir);
  });
});
