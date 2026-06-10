#!/usr/bin/env node
/* global console, process */
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function unique(values) {
  return [...new Set(values)];
}

export function assertReadmePins(readme, version) {
  const pinnedVersions = unique(
    [...readme.matchAll(/agentloopkit@(\d+\.\d+\.\d+)/g)].map((match) => match[1]),
  );
  const staleVersion = pinnedVersions.find((pinnedVersion) => pinnedVersion !== version);

  if (staleVersion) {
    throw new Error(`README contains stale pinned version ${staleVersion}.`);
  }
  if (!pinnedVersions.includes(version)) {
    throw new Error(`README does not contain pinned version ${version}.`);
  }
}

export function createSmokeSteps({ version, tarballPath }) {
  const npxArgs = ['--yes', '--package', tarballPath, 'agentloop'];
  return [
    {
      name: 'packed binary prints package version',
      command: 'npx',
      args: [...npxArgs, 'version'],
      cwd: 'temp',
      env: {},
      expectStdout: version,
    },
    {
      name: 'packed init writes AgentLoopKit files in a project directory',
      command: 'npx',
      args: [...npxArgs, 'init'],
      cwd: 'temp',
      env: {},
    },
    {
      name: 'packed local-only init excludes AgentLoopKit files from local git tracking',
      command: 'npx',
      args: [...npxArgs, 'init', '--local-only'],
      cwd: 'temp',
      env: {},
    },
    {
      name: 'packed create-task rejects output outside the task directory',
      command: 'npx',
      args: [...npxArgs, 'create-task'],
      cwd: 'temp',
      env: {},
    },
    {
      name: 'packed verify reports outside task paths as unavailable',
      command: 'npx',
      args: [...npxArgs, 'verify'],
      cwd: 'temp',
      env: {},
    },
    {
      name: 'packed init dry-run refuses the home directory',
      command: 'npx',
      args: [...npxArgs, 'init', '--dry-run'],
      cwd: 'temp',
      env: {},
    },
  ];
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: { ...process.env, ...options.env },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('close', (exitCode) => {
      resolve({ exitCode: exitCode ?? 1, stdout, stderr });
    });
  });
}

async function runRequired(command, args, options = {}) {
  const result = await runCommand(command, args, options);
  if (result.exitCode !== 0) {
    throw new Error(
      `${command} ${args.join(' ')} failed with exit code ${result.exitCode}\n${result.stderr || result.stdout}`,
    );
  }
  return result;
}

async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function makeTempDir(root, name) {
  const dir = path.join(root, name);
  await mkdir(dir, { recursive: true });
  return dir;
}

async function runPackedAgentLoop(tarballPath, args, options) {
  return runCommand('npx', ['--yes', '--package', tarballPath, 'agentloop', ...args], options);
}

async function packProject({ cwd, packDir }) {
  const result = await runRequired('npm', ['pack', '--pack-destination', packDir, '--silent'], {
    cwd,
  });
  const tarballName = result.stdout.trim().split(/\r?\n/).at(-1);
  if (!tarballName) {
    throw new Error('npm pack did not print a tarball name.');
  }
  return path.join(packDir, tarballName);
}

async function readPackedReadme({ tarballPath, extractDir }) {
  await mkdir(extractDir, { recursive: true });
  await runRequired('tar', ['-xzf', tarballPath, '-C', extractDir]);
  return readFile(path.join(extractDir, 'package', 'README.md'), 'utf8');
}

async function assertPackedVersion({ tarballPath, version, tempRoot }) {
  const cwd = await makeTempDir(tempRoot, 'version-smoke');
  const result = await runPackedAgentLoop(tarballPath, ['version'], { cwd });
  if (result.exitCode !== 0 || result.stdout.trim() !== version) {
    throw new Error(`packed version smoke failed: ${result.stderr || result.stdout}`);
  }
}

async function assertPackedInit({ tarballPath, tempRoot }) {
  const cwd = await makeTempDir(tempRoot, 'init-smoke');
  await runRequired('npm', ['init', '-y'], { cwd });
  const result = await runPackedAgentLoop(tarballPath, ['init'], { cwd });
  if (result.exitCode !== 0) {
    throw new Error(`packed init smoke failed: ${result.stderr || result.stdout}`);
  }

  for (const filePath of ['.agentloop/README.md', 'AGENTS.md', 'AGENTLOOP.md', 'agentloop.config.json']) {
    if (!(await pathExists(path.join(cwd, filePath)))) {
      throw new Error(`packed init smoke did not create ${filePath}.`);
    }
  }
}

async function assertPackedLocalOnlyInit({ tarballPath, tempRoot }) {
  const cwd = await makeTempDir(tempRoot, 'local-only-init-smoke');
  await runRequired('git', ['init', '-q'], { cwd });
  await runRequired('npm', ['init', '-y'], { cwd });
  const result = await runPackedAgentLoop(tarballPath, ['init', '--local-only'], { cwd });
  if (result.exitCode !== 0) {
    throw new Error(`packed local-only init smoke failed: ${result.stderr || result.stdout}`);
  }

  const exclude = await readFile(path.join(cwd, '.git/info/exclude'), 'utf8');
  for (const expected of [
    '# agentloopkit:local-only:start',
    '.agentloop/',
    'AGENTS.md',
    'AGENTLOOP.md',
    'agentloop.config.json',
  ]) {
    if (!exclude.includes(expected)) {
      throw new Error(`packed local-only init exclude file is missing ${expected}.`);
    }
  }

  const agents = await readFile(path.join(cwd, 'AGENTS.md'), 'utf8');
  if (!agents.includes('Local-only AgentLoopKit harness')) {
    throw new Error('packed local-only init did not write local-only agent guidance.');
  }

  const status = await runRequired('git', ['status', '--short'], { cwd });
  for (const excludedPath of ['.agentloop', 'AGENTS.md', 'AGENTLOOP.md', 'agentloop.config.json']) {
    if (status.stdout.includes(excludedPath)) {
      throw new Error(`packed local-only init left ${excludedPath} visible in git status.`);
    }
  }
}

async function assertCreateTaskGuard({ tarballPath, tempRoot }) {
  const cwd = await makeTempDir(tempRoot, 'create-task-smoke');
  const outsideDir = await makeTempDir(tempRoot, 'outside-create-task');
  await runRequired('npm', ['init', '-y'], { cwd });
  await runRequired('npx', ['--yes', '--package', tarballPath, 'agentloop', 'init'], { cwd });

  const outsidePath = path.join(outsideDir, 'outside-task.md');
  const result = await runPackedAgentLoop(
    tarballPath,
    ['create-task', '--title', 'Outside write', '--type', 'bugfix', '--out', outsidePath],
    { cwd },
  );
  if (result.exitCode === 0) {
    throw new Error('packed create-task outside write unexpectedly succeeded.');
  }
  if (await pathExists(outsidePath)) {
    throw new Error('packed create-task wrote outside the configured task directory.');
  }
}

async function assertVerifyTaskGuard({ tarballPath, tempRoot }) {
  const cwd = await makeTempDir(tempRoot, 'verify-smoke');
  const outsideDir = await makeTempDir(tempRoot, 'outside-verify');
  await runRequired('npm', ['init', '-y'], { cwd });
  await runRequired('npx', ['--yes', '--package', tarballPath, 'agentloop', 'init'], { cwd });

  const outsidePath = path.join(outsideDir, 'outside-task.md');
  await writeFile(outsidePath, '# Outside Secret Task\n- Task type: feature\n- Status: leaked\n');
  const result = await runPackedAgentLoop(
    tarballPath,
    [
      'verify',
      '--task',
      outsidePath,
      '--command',
      'node -e "console.log(\\"ok\\")"',
      '--no-test',
      '--no-lint',
      '--no-typecheck',
      '--no-build',
      '--json',
    ],
    { cwd },
  );
  if (result.exitCode !== 0) {
    throw new Error(`packed verify outside-task smoke failed: ${result.stderr || result.stdout}`);
  }

  const payload = JSON.parse(result.stdout);
  if (payload.markdown.includes('Outside Secret Task') || payload.markdown.includes('leaked')) {
    throw new Error('packed verify leaked outside task file contents.');
  }
  if (!payload.markdown.includes('Status: unavailable')) {
    throw new Error('packed verify did not report outside task context as unavailable.');
  }
}

async function assertHomeDryRunGuard({ tarballPath, tempRoot }) {
  const fakeHome = await makeTempDir(tempRoot, 'fake-home');
  const result = await runPackedAgentLoop(tarballPath, ['init', '--dry-run'], {
    cwd: fakeHome,
    env: { HOME: fakeHome },
  });
  if (result.exitCode === 0) {
    throw new Error('packed init dry-run unexpectedly allowed the home directory.');
  }
  if (!result.stderr.includes('Refusing to initialize your home directory')) {
    throw new Error(`packed init dry-run returned unexpected output: ${result.stderr || result.stdout}`);
  }
}

export async function runReleaseSmoke(options = {}) {
  const cwd = options.cwd ?? process.cwd();
  const keep = Boolean(options.keep);
  const metadata = JSON.parse(await readFile(path.join(cwd, 'package.json'), 'utf8'));
  const tempRoot = await mkdtemp(path.join(tmpdir(), 'agentloopkit-release-smoke-'));
  const packDir = await makeTempDir(tempRoot, 'pack');
  const extractDir = await makeTempDir(tempRoot, 'extract');

  try {
    console.log(`Release smoke for ${metadata.name}@${metadata.version}`);
    await runRequired('npm', ['run', 'build'], { cwd });
    const tarballPath = await packProject({ cwd, packDir });
    console.log(`Packed ${tarballPath}`);

    const readme = await readPackedReadme({ tarballPath, extractDir });
    assertReadmePins(readme, metadata.version);
    console.log('README pins match package version.');

    await assertPackedVersion({ tarballPath, version: metadata.version, tempRoot });
    console.log('Packed binary version smoke passed.');
    await assertPackedInit({ tarballPath, tempRoot });
    console.log('Packed init smoke passed.');
    await assertPackedLocalOnlyInit({ tarballPath, tempRoot });
    console.log('Packed local-only init smoke passed.');
    await assertCreateTaskGuard({ tarballPath, tempRoot });
    console.log('Packed create-task path guard smoke passed.');
    await assertVerifyTaskGuard({ tarballPath, tempRoot });
    console.log('Packed verify task path guard smoke passed.');
    await assertHomeDryRunGuard({ tarballPath, tempRoot });
    console.log('Packed home-directory dry-run guard smoke passed.');
    console.log('Release smoke passed.');
    return { tarballPath };
  } finally {
    if (keep) {
      console.log(`Kept smoke directory: ${tempRoot}`);
    } else {
      await rm(tempRoot, { recursive: true, force: true });
    }
  }
}

export function isDirectRun(importMetaUrl, argvPath) {
  return fileURLToPath(importMetaUrl) === path.resolve(argvPath);
}

if (isDirectRun(import.meta.url, process.argv[1])) {
  runReleaseSmoke({ keep: process.argv.includes('--keep') }).catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Release smoke failed: ${message}`);
    process.exitCode = 1;
  });
}
