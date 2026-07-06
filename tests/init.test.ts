import path from 'node:path';
import { execFile } from 'node:child_process';
import { mkdir, readdir, readFile, realpath, symlink, writeFile } from 'node:fs/promises';
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

function homeDirectoryEnv(homeDirectory: string) {
  return { HOME: homeDirectory, USERPROFILE: homeDirectory };
}

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
    expect(result.created.some((file) => file.endsWith('.agentloop/loops/research.md'))).toBe(
      true,
    );
    expect(result.created.some((file) => file.endsWith('.agentloop/README.md'))).toBe(true);
    expect(result.created.some((file) => file.endsWith('.agentloop/manifest.json'))).toBe(true);
    expect(manifest).toMatchObject({
      version: 1,
      templateVersion: 2,
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
    await expect(readFile(path.join(dir, '.agentloop/tasks/README.md'), 'utf8')).resolves.toContain(
      'research',
    );
  });

  test('generated onboarding includes a risk-aware first task example', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(path.join(dir, 'package.json'), {
      name: 'demo-onboarding',
      scripts: { test: 'vitest', lint: 'eslint .' },
    });

    await initializeAgentLoop({ cwd: dir });

    const workspaceReadme = await readFile(path.join(dir, '.agentloop/README.md'), 'utf8');
    const taskReadme = await readFile(path.join(dir, '.agentloop/tasks/README.md'), 'utf8');
    const commandsGuide = await readFile(path.join(dir, '.agentloop/harness/commands.md'), 'utf8');

    expect(workspaceReadme).toContain('First task to try');
    expect(workspaceReadme).toContain(
      '--risk "Touches user-facing behavior and needs regression coverage"',
    );
    expect(workspaceReadme).toContain('agentloop verify --task <path> --task-commands');
    expect(workspaceReadme).toContain('agentloop artifacts');
    expect(taskReadme).toContain('--risk "Touches account preferences"');
    expect(taskReadme).toContain('dirty non-evidence files');
    expect(taskReadme).toContain('review-critical placeholder sections');
    expect(taskReadme).toContain('does not read dirty file contents, clean files, or block task creation');
    expect(commandsGuide).toContain('agentloop create-task --type feature --title');
    expect(commandsGuide).toContain('agentloop artifacts');
  });

  test('generated guidance includes bounded AgentFlight placeholder recovery', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(path.join(dir, 'package.json'), {
      name: 'demo-agentflight-recovery',
      scripts: { test: 'vitest' },
    });

    await initializeAgentLoop({ cwd: dir });

    const agentsMd = await readFile(path.join(dir, 'AGENTS.md'), 'utf8');
    const agentLoopMd = await readFile(path.join(dir, 'AGENTLOOP.md'), 'utf8');
    const commandsGuide = await readFile(path.join(dir, '.agentloop/harness/commands.md'), 'utf8');

    for (const content of [agentsMd, agentLoopMd, commandsGuide]) {
      expect(content).toContain('agentloop status --redact-paths');
      expect(content).toContain('agentloop task doctor --redact-paths');
      expect(content).toContain('agentloop task clear');
      expect(content).toContain('agentloop task set <path>');
      expect(content).toContain('agentloop create-task');
      expect(content).toContain('preserved session evidence');
    }
  });

  test('generated guidance tells MCP-capable agents how to start from repo context', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(path.join(dir, 'package.json'), {
      name: 'demo-mcp-readiness',
      scripts: { test: 'vitest' },
    });

    await initializeAgentLoop({ cwd: dir });

    const agentsMd = await readFile(path.join(dir, 'AGENTS.md'), 'utf8');
    const agentLoopMd = await readFile(path.join(dir, 'AGENTLOOP.md'), 'utf8');
    const workspaceReadme = await readFile(path.join(dir, '.agentloop/README.md'), 'utf8');
    const commandsGuide = await readFile(path.join(dir, '.agentloop/harness/commands.md'), 'utf8');
    const codexGuide = await readFile(path.join(dir, '.agentloop/agents/codex.md'), 'utf8');

    for (const content of [agentsMd, agentLoopMd, workspaceReadme, commandsGuide]) {
      expect(content).toContain('agentloop doctor --redact-paths');
      expect(content.indexOf('agentloop doctor --redact-paths')).toBeLessThan(
        content.indexOf('agentloop start'),
      );
      expect(content).toContain('agentloop mcp-server');
      expect(content).toContain('agentloop_start');
    }
    expect(codexGuide).toContain('agentloop_start');
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
    expect(output.warnings).toEqual([]);
    await expect(readFile(path.join(dir, 'AGENTLOOP.md'), 'utf8')).rejects.toThrow();
  });

  test('human init output gives post-setup loop next steps', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(path.join(dir, 'package.json'), {
      name: 'demo-next-steps',
      scripts: { test: 'vitest' },
    });

    const result = await execa(tsxPath, [cliPath, 'init'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Next steps:');
    expect(result.stdout).toContain('- Run agentloop doctor');
    expect(result.stdout).toContain('- Create a task with agentloop create-task');
    expect(result.stdout).toContain('- Verify the task with agentloop verify --task <path> --task-commands');
    expect(result.stdout).toContain('- Hand off review evidence with agentloop handoff');
  });

  test('dry-run human init output does not suggest verification before setup is written', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeJson(path.join(dir, 'package.json'), {
      name: 'demo-dry-run-next-steps',
      scripts: { test: 'vitest' },
    });

    const result = await execa(tsxPath, [cliPath, 'init', '--dry-run'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('No files written.');
    expect(result.stdout).not.toContain('agentloop verify');
    expect(result.stdout).not.toContain('agentloop handoff');
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

  test('--redact-paths redacts the absolute target directory and git root in JSON output', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initGitRepository(dir);
    await writeJson(path.join(dir, 'package.json'), { name: 'demo-redact' });

    const result = await execa(
      tsxPath,
      [cliPath, 'init', '--dry-run', '--json', '--redact-paths'],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.targetDirectory).toBe('[git-root]');
    expect(output.git.root).toBe('[git-root]');
  });

  test('--redact-paths redacts the absolute target directory and git root in human output', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initGitRepository(dir);
    await writeJson(path.join(dir, 'package.json'), { name: 'demo-redact-human' });

    const result = await execa(
      tsxPath,
      [cliPath, 'init', '--dry-run', '--redact-paths'],
      { cwd: dir, reject: false },
    );

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Target: [git-root]');
    expect(result.stdout).toContain('Git root: [git-root]');
    expect(result.stdout).not.toContain(await realpath(dir));
  });

  test('rejects init when AGENTS.md resolves outside the repo', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir();
    tempDirs.push(dir, outsideDir);
    const outsideAgents = path.join(outsideDir, 'AGENTS.md');
    await writeFile(outsideAgents, '# Outside instructions\n');
    await symlink(outsideAgents, path.join(dir, 'AGENTS.md'), 'file');

    const result = await execa(tsxPath, [cliPath, 'init', '--json'], {
      cwd: dir,
      reject: false,
    });

    const output = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(output.error).toMatchObject({
      code: 'OUTPUT_PATH_INVALID',
      artifactType: 'agents-md',
      requestedPath: 'AGENTS.md',
      expectedDir: '.',
      expectedExtension: '.md',
      reason: 'outside-directory',
    });
    expect(await readFile(outsideAgents, 'utf8')).toBe('# Outside instructions\n');
    await expect(readFile(path.join(dir, 'AGENTLOOP.md'), 'utf8')).rejects.toThrow();
    await expect(readFile(path.join(dir, '.agentloop/manifest.json'), 'utf8')).rejects.toThrow();
  });

  test('rejects init when the AgentLoop directory resolves outside the repo', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir();
    tempDirs.push(dir, outsideDir);
    await symlink(outsideDir, path.join(dir, '.agentloop'), 'dir');

    const result = await execa(tsxPath, [cliPath, 'init', '--json'], {
      cwd: dir,
      reject: false,
    });

    const output = JSON.parse(result.stdout);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(output.error).toMatchObject({
      code: 'OUTPUT_PATH_INVALID',
      artifactType: 'init-file',
      expectedExtension: '.md',
      reason: 'outside-directory',
    });
    expect(output.error.requestedPath).toMatch(/^\.agentloop\//);
    expect(await readdir(outsideDir)).toEqual([]);
    await expect(readFile(path.join(dir, 'AGENTS.md'), 'utf8')).rejects.toThrow();
    await expect(readFile(path.join(dir, 'agentloop.config.json'), 'utf8')).rejects.toThrow();
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
    expect(result.warnings).toEqual([
      {
        id: 'home-directory-target',
        message:
          'Target directory is your home directory. AgentLoopKit can write repository harness files there when --force is used.',
        targetDirectory: dir,
      },
    ]);
  });

  test('forced home-directory dry-run prints a non-fatal warning without writing files', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);

    const result = await execa(tsxPath, [cliPath, 'init', '--dry-run', '--force'], {
      cwd: dir,
      env: homeDirectoryEnv(dir),
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain(
      'Warning: Target directory is your home directory. AgentLoopKit can write repository harness files there when --force is used.',
    );
    expect(result.stdout).toContain('No files written.');
    await expect(readFile(path.join(dir, 'AGENTLOOP.md'), 'utf8')).rejects.toThrow();
  });

  test('forced home-directory JSON output includes additive warning metadata', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);

    const result = await execa(tsxPath, [cliPath, 'init', '--dry-run', '--force', '--json'], {
      cwd: dir,
      env: homeDirectoryEnv(dir),
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    const output = JSON.parse(result.stdout);
    const expectedTargetDirectory = await realpath(dir);
    expect(output.warnings).toEqual([
      {
        id: 'home-directory-target',
        message:
          'Target directory is your home directory. AgentLoopKit can write repository harness files there when --force is used.',
        targetDirectory: expectedTargetDirectory,
      },
    ]);
    await expect(readFile(path.join(dir, 'AGENTLOOP.md'), 'utf8')).rejects.toThrow();
  });

  test('local-only mode excludes generated harness files from local git tracking', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initGitRepository(dir);
    await writeJson(path.join(dir, 'package.json'), { name: 'demo' });

    const result = await initializeAgentLoop({ cwd: dir, localOnly: true });
    const excludePath = path.join(await realpath(path.join(dir, '.git')), 'info', 'exclude');
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
    const excludePath = path.join(await realpath(path.join(dir, '.git')), 'info', 'exclude');
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

  test('local-only mode does not trust a fake symlinked .git directory', async () => {
    const dir = await makeTempDir();
    const outsideDir = await makeTempDir();
    tempDirs.push(dir, outsideDir);
    await mkdir(path.join(outsideDir, 'info'), { recursive: true });
    const outsideExcludePath = path.join(outsideDir, 'info', 'exclude');
    await writeFile(outsideExcludePath, '# outside exclude\n');
    await symlink(outsideDir, path.join(dir, '.git'), 'dir');

    await expect(initializeAgentLoop({ cwd: dir, localOnly: true })).rejects.toThrow(
      'Local-only mode requires a Git repository',
    );
    await expect(readFile(outsideExcludePath, 'utf8')).resolves.toBe('# outside exclude\n');
    await expect(readFile(path.join(dir, 'AGENTS.md'), 'utf8')).rejects.toThrow();
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
