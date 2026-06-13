#!/usr/bin/env node
/* global console, process */
import { spawn } from 'node:child_process';
import path from 'node:path';
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
    agentloopStep('maintainer reviewability check', [
      'maintainer-check',
      '--json',
      '--redact-paths',
    ]),
    agentloopStep('agent review context', ['review-context', '--json', '--redact-paths']),
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

export function parseArgs(argv) {
  return {
    strict: argv.includes('--strict'),
    json: argv.includes('--json'),
    help: argv.includes('--help') || argv.includes('-h'),
  };
}

function printHelp() {
  console.log(`AgentLoopKit dogfood gate

Usage:
  npm run dogfood
  npm run dogfood:strict
  node scripts/dogfood.mjs --json

Default mode runs read-only AgentLoopKit self-checks and ProjScan. Strict mode treats review-gate warnings as failures.
JSON mode prints a deterministic summary for agents and CI logs.

This script does not publish packages, create tags, create GitHub releases, post comments, read token files, read .env contents, or run verification commands.`);
}

function formatCommand(step) {
  return [step.command, ...step.args].join(' ');
}

function redactWorkspacePath(value, workspaceRoot) {
  if (typeof value !== 'string' || !workspaceRoot) return value;

  const roots = new Set([
    workspaceRoot,
    workspaceRoot.replace(/\\/g, '/'),
    workspaceRoot.replace(/\//g, '\\'),
  ]);

  let redacted = value;
  for (const root of roots) {
    if (!root) continue;
    redacted = redacted.split(root).join('[git-root]');
  }
  return redacted;
}

async function spawnStep(step, env, options = {}) {
  const child = spawn(step.command, step.args, {
    env,
    stdio: options.quiet ? 'ignore' : 'inherit',
  });

  return new Promise((resolve) => {
    let settled = false;
    const settle = (result) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    child.on('error', (error) => {
      settle({ exitCode: 1, errorMessage: error.message });
    });
    child.on('close', (code) => settle({ exitCode: code ?? 1 }));
  });
}

function normalizeProcessResult(result) {
  if (typeof result === 'number') return { exitCode: result };
  return {
    exitCode: Number.isInteger(result?.exitCode) ? result.exitCode : 1,
    errorMessage: result?.errorMessage,
  };
}

function createStepResult(step, processResult, durationMs, workspaceRoot) {
  const exitCode = processResult.exitCode;
  const status = exitCode === 0 ? 'pass' : step.allowFailure ? 'allowed-failure' : 'fail';
  const result = {
    name: step.name,
    command: redactWorkspacePath(step.command, workspaceRoot),
    args: step.args.map((arg) => redactWorkspacePath(arg, workspaceRoot)),
    commandText: redactWorkspacePath(formatCommand(step), workspaceRoot),
    allowFailure: step.allowFailure,
    status,
    exitCode,
    durationMs,
  };

  if (processResult.errorMessage) {
    result.errorMessage = redactWorkspacePath(processResult.errorMessage, workspaceRoot);
  }
  return result;
}

async function runStep(step, env, options) {
  if (!options.json) {
    options.logger.log(`\n## ${step.name}`);
    options.logger.log(`$ ${formatCommand(step)}`);
  }

  const startedAt = options.now();
  let processResult;
  try {
    processResult = normalizeProcessResult(
      await options.runProcess(step, env, { quiet: options.json }),
    );
  } catch (error) {
    processResult = {
      exitCode: 1,
      errorMessage: error instanceof Error ? error.message : String(error),
    };
  }
  const durationMs = Math.max(0, options.now() - startedAt);
  const stepResult = createStepResult(step, processResult, durationMs, options.workspaceRoot);

  if (stepResult.status === 'allowed-failure' && !options.json) {
    options.logger.log(
      `${step.name} reported exit code ${stepResult.exitCode}; continuing in default mode.`,
    );
  }

  return stepResult;
}

export function createDogfoodSafetyNotes() {
  return {
    publishesPackages: false,
    createsTags: false,
    createsGithubReleases: false,
    postsComments: false,
    readsEnvFiles: false,
    readsTokenFiles: false,
    runsVerificationCommands: false,
    changesPackageMetadata: false,
  };
}

function findFailedStep(steps) {
  return steps.find((step) => step.status === 'fail');
}

export async function runDogfood(options = {}) {
  const {
    strict = false,
    cwd = process.cwd(),
    json = false,
    logger = console,
    runProcess = spawnStep,
    now = () => Date.now(),
  } = options;

  const workspaceRoot = path.resolve(cwd);
  process.chdir(cwd);
  const env = buildDogfoodEnv();
  const steps = options.steps ?? createDogfoodSteps({ strict });
  const mode = strict ? 'strict' : 'default';

  if (!json) {
    logger.log('# AgentLoopKit Dogfood Gate');
    logger.log(`Mode: ${mode}`);
  }

  const results = [];
  for (const step of steps) {
    const result = await runStep(step, env, { json, logger, runProcess, now, workspaceRoot });
    results.push(result);
    if (result.status === 'fail') break;
  }

  const failedStep = findFailedStep(results);
  const summary = {
    status: failedStep ? 'fail' : 'pass',
    mode,
    strict,
    steps: results,
    safety: createDogfoodSafetyNotes(),
  };

  if (!json && summary.status === 'pass') {
    logger.log('\nDogfood gate passed.');
  }

  return summary;
}

function failureMessage(summary) {
  const failedStep = findFailedStep(summary.steps);
  if (!failedStep) return 'unknown failure';
  const suffix = failedStep.errorMessage ? `: ${failedStep.errorMessage}` : '';
  return `${failedStep.name} failed with exit code ${failedStep.exitCode}${suffix}`;
}

function printJsonSummary(summary) {
  console.log(JSON.stringify(summary, null, 2));
}

async function runCli(options) {
  const summary = await runDogfood(options);
  if (options.json) printJsonSummary(summary);

  if (summary.status === 'fail') {
    if (!options.json) console.error(`\nDogfood gate failed: ${failureMessage(summary)}`);
    process.exitCode = 1;
    return;
  }
}

export function isDirectRun(metaUrl, argvPath) {
  return fileURLToPath(metaUrl) === argvPath;
}

if (isDirectRun(import.meta.url, process.argv[1])) {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
  } else {
    runCli(options).catch((error) => {
      if (options.json) {
        printJsonSummary({
          status: 'fail',
          mode: options.strict ? 'strict' : 'default',
          strict: options.strict,
          steps: [],
          safety: createDogfoodSafetyNotes(),
          errorMessage: error instanceof Error ? error.message : String(error),
        });
      } else {
        console.error(`\nDogfood gate failed: ${error.message}`);
      }
      process.exitCode = 1;
    });
  }
}
