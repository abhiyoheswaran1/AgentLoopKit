#!/usr/bin/env node
/* global console, process */
import { mkdtemp, mkdir, rm, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout, clearTimeout } from 'node:timers';
import { fileURLToPath, URL } from 'node:url';

const SAFE_ENV_KEYS = [
  'APPDATA',
  'CI',
  'HOME',
  'LOCALAPPDATA',
  'NO_COLOR',
  'PATH',
  'PATHEXT',
  'Path',
  'SystemRoot',
  'TEMP',
  'TMP',
  'USERPROFILE',
  'WINDIR',
];

function packageSpec(packageName, version) {
  return `${packageName}@${version}`;
}

export function createPublishedSmokeSteps({ packageName, version }) {
  const spec = packageSpec(packageName, version);
  return [
    {
      name: 'registry version lookup',
      command: 'npm',
      args: ['view', spec, 'version'],
      cwdMode: 'base',
      expectedStdout: version,
    },
    {
      name: 'npx package binary version',
      command: 'npx',
      args: ['--yes', spec, 'version'],
      cwdMode: 'npx-temp',
      expectedStdout: version,
    },
    {
      name: 'npx init dry-run',
      command: 'npx',
      args: ['--yes', spec, 'init', '--dry-run', '--json'],
      cwdMode: 'npx-temp',
      expectDryRunJson: true,
    },
    {
      name: 'install published package',
      command: 'npm',
      args: ['install', spec, '--ignore-scripts', '--no-audit', '--no-fund'],
      cwdMode: 'install-temp',
    },
    {
      name: 'installed agentloop bin version',
      command: 'agentloop',
      args: ['version'],
      cwdMode: 'install-temp',
      installedBin: 'agentloop',
      expectedStdout: version,
    },
    {
      name: 'installed agentloopkit bin version',
      command: 'agentloopkit',
      args: ['version'],
      cwdMode: 'install-temp',
      installedBin: 'agentloopkit',
      expectedStdout: version,
    },
  ];
}

export function createInstalledBinCommand({ cwd, binName, platform = process.platform }) {
  const pathApi = platform === 'win32' ? path.win32 : path.posix;
  const extension = platform === 'win32' ? '.cmd' : '';
  return {
    command: pathApi.join(cwd, 'node_modules', '.bin', `${binName}${extension}`),
    args: ['version'],
  };
}

export function buildPublishedSmokeEnv(sourceEnv = process.env) {
  const env = {
    AGENTLOOPKIT_PUBLISHED_SMOKE: '1',
    FORCE_COLOR: '0',
  };

  for (const key of SAFE_ENV_KEYS) {
    const value = sourceEnv[key];
    if (value) env[key] = value;
  }

  return env;
}

async function readPackageMetadata() {
  const packageUrl = new URL('../package.json', import.meta.url);
  return JSON.parse(await readFile(packageUrl, 'utf8'));
}

function parseArgs(argv, defaults) {
  const options = {
    packageName: defaults.packageName,
    version: defaults.version,
    timeoutMs: 120_000,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--package') {
      options.packageName = argv[++index];
    } else if (arg === '--version') {
      options.version = argv[++index];
    } else if (arg === '--timeout-ms') {
      options.timeoutMs = Number(argv[++index]);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (!options.packageName || !options.version) {
    throw new Error('Package name and version are required.');
  }
  if (!Number.isInteger(options.timeoutMs) || options.timeoutMs <= 0) {
    throw new Error('--timeout-ms must be a positive integer.');
  }

  return options;
}

function printHelp(defaults) {
  console.log(`AgentLoopKit published package smoke

Usage:
  npm run smoke:published
  npm run smoke:published -- --version ${defaults.version}

This script verifies a published npm package from clean temporary directories. It checks npm view, npx version, npx init --dry-run, and installed bin aliases.

It does not publish packages, create tags, create GitHub releases, call GitHub APIs, read token files, read .env contents, or change package metadata.`);
}

function cwdForStep(step, dirs) {
  if (step.cwdMode === 'base') return dirs.base;
  if (step.cwdMode === 'npx-temp') return dirs.npxTemp;
  if (step.cwdMode === 'install-temp') return dirs.installTemp;
  throw new Error(`Unsupported cwd mode: ${step.cwdMode}`);
}

function commandForStep(step, cwd) {
  if (!step.installedBin) return { command: step.command, args: step.args };
  return createInstalledBinCommand({ cwd, binName: step.installedBin });
}

export function formatStepCommandForDisplay({ command, args, installedBin }) {
  if (installedBin) return [`<installed ${installedBin} bin>`, ...args].join(' ');
  return [command, ...args].join(' ');
}

export function summarizeDryRunJson(stdout) {
  const parsed = JSON.parse(stdout);
  if (parsed.dryRun !== true) {
    throw new Error('dryRun JSON did not report dryRun: true.');
  }
  return [
    'dryRun=true',
    `created=${Array.isArray(parsed.created) ? parsed.created.length : 0}`,
    `updated=${Array.isArray(parsed.updated) ? parsed.updated.length : 0}`,
    `skipped=${Array.isArray(parsed.skipped) ? parsed.skipped.length : 0}`,
  ].join('; ');
}

async function runStep(step, dirs, env, timeoutMs) {
  const cwd = cwdForStep(step, dirs);
  const { command, args } = commandForStep(step, cwd);
  console.log(`\n## ${step.name}`);
  console.log(`$ ${formatStepCommandForDisplay({ command, args, installedBin: step.installedBin })}`);

  const result = await new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      resolve({ exitCode: 1, stdout, stderr: `${stderr}\nTimed out after ${timeoutMs}ms.` });
    }, timeoutMs);

    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('error', (error) => {
      clearTimeout(timer);
      resolve({ exitCode: 1, stdout, stderr: `${stderr}\n${error.message}` });
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ exitCode: code ?? 1, stdout, stderr });
    });
  });

  if (step.expectDryRunJson) {
    console.log(summarizeDryRunJson(result.stdout));
  } else if (result.stdout.trim()) {
    console.log(result.stdout.trim());
  }
  if (result.stderr.trim()) console.error(result.stderr.trim());
  if (result.exitCode !== 0) {
    throw new Error(`${step.name} failed with exit code ${result.exitCode}`);
  }
  if (step.expectedStdout && result.stdout.trim() !== step.expectedStdout) {
    throw new Error(
      `${step.name} expected stdout ${step.expectedStdout}, got ${result.stdout.trim() || '(empty)'}.`,
    );
  }
  if (step.expectDryRunJson) {
    summarizeDryRunJson(result.stdout);
  }
}

export async function runPublishedSmoke(options = {}) {
  const metadata = await readPackageMetadata();
  const packageName = options.packageName ?? metadata.name;
  const version = options.version ?? metadata.version;
  const timeoutMs = options.timeoutMs ?? 120_000;
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'agentloopkit-published-smoke-'));
  const dirs = {
    base: process.cwd(),
    npxTemp: path.join(tempRoot, 'npx'),
    installTemp: path.join(tempRoot, 'install'),
  };

  console.log('# AgentLoopKit Published Package Smoke');
  console.log(`Package: ${packageSpec(packageName, version)}`);

  try {
    await mkdir(dirs.npxTemp, { recursive: true });
    await mkdir(dirs.installTemp, { recursive: true });
    const env = buildPublishedSmokeEnv();
    for (const step of createPublishedSmokeSteps({ packageName, version })) {
      await runStep(step, dirs, env, timeoutMs);
    }
    console.log('\nPublished package smoke passed.');
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

export function isDirectRun(metaUrl, argvPath) {
  return fileURLToPath(metaUrl) === argvPath;
}

if (isDirectRun(import.meta.url, process.argv[1])) {
  const metadata = await readPackageMetadata();
  let options;
  try {
    options = parseArgs(process.argv.slice(2), {
      packageName: metadata.name,
      version: metadata.version,
    });
  } catch (error) {
    console.error(`Published package smoke failed: ${error.message}`);
    process.exit(1);
  }

  if (options.help) {
    printHelp({ packageName: metadata.name, version: metadata.version });
  } else {
    runPublishedSmoke(options).catch((error) => {
      console.error(`\nPublished package smoke failed: ${error.message}`);
      process.exitCode = 1;
    });
  }
}
