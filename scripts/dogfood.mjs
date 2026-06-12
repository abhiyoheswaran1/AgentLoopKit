#!/usr/bin/env node
/* global console, process */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

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

function agentloopStep(name, args) {
  return {
    name,
    command: 'npx',
    args: ['--no-install', 'tsx', 'src/cli/index.ts', ...args],
    allowFailure: false,
  };
}

export function createDogfoodSteps({ strict = false } = {}) {
  const gateArgs = ['check-gates', '--redact-paths'];
  if (strict) gateArgs.push('--strict');

  const steps = [
    agentloopStep('task folder hygiene', ['task', 'doctor', '--json']),
    agentloopStep('current loop status', ['status', '--brief', '--redact-paths']),
    {
      name: 'public docs hygiene',
      command: 'node',
      args: ['scripts/public-docs-hygiene.mjs'],
      allowFailure: false,
    },
    agentloopStep('review evidence gates', gateArgs),
    agentloopStep('artifact inventory', ['artifacts', '--json']),
    agentloopStep('maintainer reviewability check', ['maintainer-check', '--json']),
    agentloopStep('agent review context', ['review-context', '--json']),
    {
      name: 'projscan project health',
      command: 'npx',
      args: ['--yes', 'projscan', 'doctor', '--format', 'markdown'],
      allowFailure: false,
    },
  ];
  steps[3].allowFailure = !strict;
  steps[5].allowFailure = !strict;
  return steps;
}

export function buildDogfoodEnv(sourceEnv = process.env) {
  const env = {
    AGENTLOOPKIT_DOGFOOD: '1',
    FORCE_COLOR: '0',
  };

  for (const key of SAFE_ENV_KEYS) {
    const value = sourceEnv[key];
    if (value) env[key] = value;
  }

  return env;
}

function parseArgs(argv) {
  return {
    strict: argv.includes('--strict'),
    help: argv.includes('--help') || argv.includes('-h'),
  };
}

function printHelp() {
  console.log(`AgentLoopKit dogfood gate

Usage:
  npm run dogfood
  npm run dogfood:strict

Default mode runs read-only AgentLoopKit self-checks and ProjScan. Strict mode treats review-gate warnings as failures.

This script does not publish packages, create tags, create GitHub releases, post comments, read token files, read .env contents, or run verification commands.`);
}

function formatCommand(step) {
  return [step.command, ...step.args].join(' ');
}

async function runStep(step, env) {
  console.log(`\n## ${step.name}`);
  console.log(`$ ${formatCommand(step)}`);

  const child = spawn(step.command, step.args, {
    env,
    stdio: 'inherit',
  });

  const exitCode = await new Promise((resolve) => {
    child.on('error', (error) => {
      console.error(`Failed to start ${step.name}: ${error.message}`);
      resolve(1);
    });
    child.on('close', (code) => resolve(code ?? 1));
  });

  if (exitCode !== 0 && step.allowFailure) {
    console.log(`${step.name} reported exit code ${exitCode}; continuing in default mode.`);
    return;
  }

  if (exitCode !== 0) {
    throw new Error(`${step.name} failed with exit code ${exitCode}`);
  }
}

export async function runDogfood({ strict = false, cwd = process.cwd() } = {}) {
  process.chdir(cwd);
  const env = buildDogfoodEnv();
  const steps = createDogfoodSteps({ strict });

  console.log('# AgentLoopKit Dogfood Gate');
  console.log(strict ? 'Mode: strict' : 'Mode: default');

  for (const step of steps) {
    await runStep(step, env);
  }

  console.log('\nDogfood gate passed.');
}

export function isDirectRun(metaUrl, argvPath) {
  return fileURLToPath(metaUrl) === argvPath;
}

if (isDirectRun(import.meta.url, process.argv[1])) {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
  } else {
    runDogfood(options).catch((error) => {
      console.error(`\nDogfood gate failed: ${error.message}`);
      process.exitCode = 1;
    });
  }
}
