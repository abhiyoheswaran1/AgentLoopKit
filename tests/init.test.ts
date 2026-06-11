import path from 'node:path';
import { execFile } from 'node:child_process';
import { mkdir, readFile, realpath, symlink, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';
import { initializeAgentLoop } from '../src/core/init.js';

let tempDirs: string[] = [];
const execFileAsync = promisify(execFile);
const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');
const originalPath = process.env.PATH;

async function initGitRepository(dir: string) {
  await execFileAsync('git', ['init'], { cwd: dir });
}

describe('init', () => {
  afterEach(async () => {
    process.env.PATH = originalPath;
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

    expect(result.targetDirectory).toBe(dir);
    expect(result.project).toMatchObject({
      name: 'demo',
      type: 'node',
      packageManager: 'npm',
    });
    expect(result.commands.configured).toEqual(['test']);
    expect(result.commands.missing).toEqual(['lint', 'typecheck', 'build', 'format']);
    expect(result.git).toEqual({ isRepository: false, root: '', targetIsRoot: false });
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

  test('dry-run JSON output includes target, project, and command context', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(path.join(dir, 'package.json'), {
      name: 'demo-cli',
      scripts: { test: 'vitest', typecheck: 'tsc --noEmit' },
      devDependencies: { typescript: '^5.0.0' },
    });

    const result = await execa(tsxPath, [cliPath, 'init', '--dry-run', '--json'], {
      cwd: dir,
      reject: false,
    });

    const expectedTargetDirectory = await realpath(dir);
    expect(result.exitCode).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.dryRun).toBe(true);
    expect(output.targetDirectory).toBe(expectedTargetDirectory);
    expect(output.project).toMatchObject({
      name: 'demo-cli',
      type: 'typescript-package',
      packageManager: 'npm',
    });
    expect(output.commands.configured).toEqual(['test', 'typecheck']);
    expect(output.commands.missing).toEqual(['lint', 'build', 'format']);
    expect(output.git).toEqual({ isRepository: false, root: '', targetIsRoot: false });
    await expect(readFile(path.join(dir, 'AGENTLOOP.md'), 'utf8')).rejects.toThrow();
  });

  test('dry-run degrades to no git context when git is missing from PATH', async () => {
    const dir = await makeTempDir();
    const emptyPath = await makeTempDir('agentloopkit-empty-path-');
    tempDirs.push(dir, emptyPath);
    await writeJson(path.join(dir, 'package.json'), { name: 'demo-no-git' });

    process.env.PATH = emptyPath;
    const result = await initializeAgentLoop({ cwd: dir, dryRun: true });

    expect(result.git).toEqual({ isRepository: false, root: '', targetIsRoot: false });
    expect(result.created.some((file) => file.endsWith('AGENTLOOP.md'))).toBe(true);
    await expect(readFile(path.join(dir, 'AGENTLOOP.md'), 'utf8')).rejects.toThrow();
  });

  test('dry-run human output reports git context for repository targets', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initGitRepository(dir);
    await writeJson(path.join(dir, 'package.json'), {
      name: 'demo-git',
      scripts: { test: 'vitest' },
    });

    const result = await execa(tsxPath, [cliPath, 'init', '--dry-run'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Git: detected');
    expect(result.stdout).toContain(`Git root: ${await realpath(dir)}`);
    expect(result.stdout).not.toContain('Warning: target is a Git subdirectory.');
    expect(result.stdout).toContain('No files written.');
    await expect(readFile(path.join(dir, 'AGENTLOOP.md'), 'utf8')).rejects.toThrow();
  });

  test('dry-run human output warns when target is a git repository subdirectory', async () => {
    const dir = await makeTempDir();
    const packageDir = path.join(dir, 'packages', 'web');
    tempDirs.push(dir);
    await initGitRepository(dir);
    await mkdir(packageDir, { recursive: true });
    await writeJson(path.join(packageDir, 'package.json'), { name: 'demo-web' });

    const result = await execa(tsxPath, [cliPath, 'init', '--dry-run'], {
      cwd: packageDir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Git target: subdirectory');
    expect(result.stdout).toContain(
      'Warning: target is a Git subdirectory. Files will be written to the target directory, not the Git root.',
    );
    await expect(readFile(path.join(packageDir, 'AGENTLOOP.md'), 'utf8')).rejects.toThrow();
  });

  test('dry-run JSON output reports git root and whether the target is root', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initGitRepository(dir);
    await writeJson(path.join(dir, 'package.json'), { name: 'demo-root' });

    const result = await execa(tsxPath, [cliPath, 'init', '--dry-run', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.git).toEqual({
      isRepository: true,
      root: await realpath(dir),
      targetIsRoot: true,
    });
  });

  test('dry-run JSON output reports when the target is inside a git repository subdirectory', async () => {
    const dir = await makeTempDir();
    const packageDir = path.join(dir, 'packages', 'web');
    tempDirs.push(dir);
    await initGitRepository(dir);
    await mkdir(packageDir, { recursive: true });
    await writeJson(path.join(packageDir, 'package.json'), { name: 'demo-web' });

    const result = await execa(tsxPath, [cliPath, 'init', '--dry-run', '--json'], {
      cwd: packageDir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.targetDirectory).toBe(await realpath(packageDir));
    expect(output.git).toEqual({
      isRepository: true,
      root: await realpath(dir),
      targetIsRoot: false,
    });
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
    expect(result.git).toMatchObject({ isRepository: true, root: await realpath(dir) });
    expect(result.git.targetIsRoot).toBe(true);
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

  test('local-only CLI setup errors are JSON when requested', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);

    const result = await execa(tsxPath, [cliPath, 'init', '--local-only', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'INIT_SETUP_ERROR',
        message:
          'Local-only mode requires a Git repository because it writes to .git/info/exclude. Run git init first, or run agentloop init without --local-only.',
        mode: 'local-only',
        reason: 'git-repository-required',
        nextCommand: 'git init',
      },
    });
    await expect(readFile(path.join(dir, 'AGENTS.md'), 'utf8')).rejects.toThrow();
  });

  test('local-only CLI setup errors stay human-readable by default', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);

    const result = await execa(tsxPath, [cliPath, 'init', '--local-only'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('agentloop: Local-only mode requires a Git repository');
  });
});
