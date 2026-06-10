import path from 'node:path';
import { execFile } from 'node:child_process';
import { readFile, symlink, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { afterEach, describe, expect, test } from 'vitest';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';
import { initializeAgentLoop } from '../src/core/init.js';

let tempDirs: string[] = [];
const execFileAsync = promisify(execFile);

async function initGitRepository(dir: string) {
  await execFileAsync('git', ['init'], { cwd: dir });
}

describe('init', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('generates AgentLoopKit files in a project directory', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(path.join(dir, 'package.json'), { name: 'demo', scripts: { test: 'vitest' } });

    const result = await initializeAgentLoop({ cwd: dir });
    const config = await readFile(path.join(dir, 'agentloop.config.json'), 'utf8');
    const manifest = JSON.parse(await readFile(path.join(dir, '.agentloop/manifest.json'), 'utf8'));

    expect(result.created.some((file) => file.endsWith('.agentloop/loops/feature.md'))).toBe(true);
    expect(result.created.some((file) => file.endsWith('.agentloop/README.md'))).toBe(true);
    expect(result.created.some((file) => file.endsWith('.agentloop/manifest.json'))).toBe(true);
    expect(manifest).toMatchObject({
      version: 1,
      templateVersion: 1,
      generatedBy: 'agentloopkit',
    });
    expect(config).toContain(
      '"$schema": "https://raw.githubusercontent.com/abhiyoheswaran1/AgentLoopKit/main/schema/agentloop.config.schema.json"',
    );
    expect(config).toContain('"name": "demo"');
    await expect(readFile(path.join(dir, 'AGENTLOOP.md'), 'utf8')).resolves.toContain('Specify');
    await expect(readFile(path.join(dir, 'AGENTS.md'), 'utf8')).resolves.toContain('Agent roster:');
    await expect(readFile(path.join(dir, 'AGENTS.md'), 'utf8')).resolves.toContain(
      'Release Engineer',
    );
    await expect(readFile(path.join(dir, 'AGENTS.md'), 'utf8')).resolves.toContain(
      'Agent Compatibility Engineer',
    );
    await expect(readFile(path.join(dir, '.agentloop/README.md'), 'utf8')).resolves.toContain(
      'agentloop create-task',
    );
    await expect(
      readFile(path.join(dir, '.agentloop/harness/commands.md'), 'utf8'),
    ).resolves.toContain('package-specific verification');
    await expect(readFile(path.join(dir, '.agentloop/README.md'), 'utf8')).resolves.toContain(
      'root and package-level checks',
    );
    await expect(readFile(path.join(dir, '.agentloop/tasks/README.md'), 'utf8')).resolves.toContain(
      'package-specific verification commands',
    );
  });

  test('safely appends to an existing AGENTS.md', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeFile(path.join(dir, 'AGENTS.md'), '# Existing Instructions\n\nDo not remove.');

    await initializeAgentLoop({ cwd: dir });
    const agents = await readFile(path.join(dir, 'AGENTS.md'), 'utf8');

    expect(agents).toContain('Do not remove.');
    expect(agents).toContain('AgentLoopKit');
  });

  test('dry-run reports planned files without writing them', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);

    const result = await initializeAgentLoop({ cwd: dir, dryRun: true });

    expect(result.created.some((file) => file.endsWith('AGENTLOOP.md'))).toBe(true);
    expect(result.created.some((file) => file.endsWith('.agentloop/README.md'))).toBe(true);
    expect(result.created.some((file) => file.endsWith('.agentloop/manifest.json'))).toBe(true);
    await expect(readFile(path.join(dir, 'AGENTLOOP.md'), 'utf8')).rejects.toThrow();
    await expect(readFile(path.join(dir, '.agentloop/manifest.json'), 'utf8')).rejects.toThrow();
    await expect(
      readFile(path.join(dir, '.agentloop/harness/repo-map.md'), 'utf8'),
    ).rejects.toThrow();
    await expect(readFile(path.join(dir, '.agentloop/README.md'), 'utf8')).rejects.toThrow();
  });

  test('refuses to initialize a home directory without force', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);

    await expect(initializeAgentLoop({ cwd: dir, homeDirectory: dir })).rejects.toThrow(
      'Refusing to initialize your home directory',
    );
  });

  test('refuses dry-run initialization in a home directory without force', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);

    await expect(
      initializeAgentLoop({ cwd: dir, homeDirectory: dir, dryRun: true }),
    ).rejects.toThrow('Refusing to initialize your home directory');
  });

  test('refuses home initialization through a symlinked path', async () => {
    const dir = await makeTempDir();
    const linkParent = await makeTempDir();
    tempDirs.push(dir, linkParent);
    const linkedHome = path.join(linkParent, 'linked-home');
    await symlink(dir, linkedHome, 'dir');

    await expect(
      initializeAgentLoop({ cwd: linkedHome, homeDirectory: dir, dryRun: true }),
    ).rejects.toThrow('Refusing to initialize your home directory');
  });

  test('allows forced initialization in a home directory', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);

    const result = await initializeAgentLoop({ cwd: dir, homeDirectory: dir, force: true });

    expect(result.created.some((file) => file.endsWith('AGENTLOOP.md'))).toBe(true);
  });

  test('local-only mode excludes generated harness files from local git tracking', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initGitRepository(dir);
    await writeJson(path.join(dir, 'package.json'), { name: 'demo' });

    const result = await initializeAgentLoop({ cwd: dir, localOnly: true });
    const excludePath = path.join(dir, '.git/info/exclude');
    const exclude = await readFile(excludePath, 'utf8');
    const agents = await readFile(path.join(dir, 'AGENTS.md'), 'utf8');
    const agentloop = await readFile(path.join(dir, 'AGENTLOOP.md'), 'utf8');

    expect(result.localOnly).toMatchObject({
      excludePath,
      patterns: ['.agentloop/', 'AGENTS.md', 'AGENTLOOP.md', 'agentloop.config.json'],
    });
    expect(exclude).toContain('# agentloopkit:local-only:start');
    expect(exclude).toContain('.agentloop/');
    expect(exclude).toContain('AGENTS.md');
    expect(exclude).toContain('AGENTLOOP.md');
    expect(exclude).toContain('agentloop.config.json');
    expect(agents).toContain('Local-only AgentLoopKit harness');
    expect(agents).toContain('Do not commit these AgentLoopKit files');
    expect(agentloop).toContain('Local-only AgentLoopKit harness');
  });

  test('local-only mode is idempotent', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initGitRepository(dir);

    await initializeAgentLoop({ cwd: dir, localOnly: true });
    const excludePath = path.join(dir, '.git/info/exclude');
    const firstExclude = await readFile(excludePath, 'utf8');

    await initializeAgentLoop({ cwd: dir, localOnly: true });
    const secondExclude = await readFile(excludePath, 'utf8');

    expect(secondExclude).toBe(firstExclude);
    expect(secondExclude.match(/agentloopkit:local-only:start/g)).toHaveLength(1);
  });

  test('local-only dry-run reports the exclude update without writing it', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initGitRepository(dir);
    const excludePath = path.join(dir, '.git/info/exclude');
    const before = await readFile(excludePath, 'utf8');

    const result = await initializeAgentLoop({ cwd: dir, dryRun: true, localOnly: true });
    const after = await readFile(excludePath, 'utf8');

    expect(after).toBe(before);
    expect(result.updated).toContain(excludePath);
    expect(result.localOnly).toMatchObject({
      excludePath,
      patterns: ['.agentloop/', 'AGENTS.md', 'AGENTLOOP.md', 'agentloop.config.json'],
    });
  });

  test('local-only mode requires a git repository', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);

    await expect(initializeAgentLoop({ cwd: dir, localOnly: true })).rejects.toThrow(
      'Local-only mode requires a Git repository',
    );
  });
});
