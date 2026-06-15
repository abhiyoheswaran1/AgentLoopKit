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

const FORWARDED_CREATE_TASK_FLAGS = new Set([
  '--problem',
  '--outcome',
  '--constraint',
  '--non-goal',
  '--assumption',
  '--likely-file',
  '--forbidden-file',
  '--acceptance',
  '--verification',
  '--post-verification',
  '--risk',
  '--rollback',
]);

const AGENTLOOP_SOURCE_CLI = ['--no-install', 'tsx', 'src/cli/index.ts'];

function formatCommand(step) {
  return [step.command, ...step.args].join(' ');
}

function readValue(argv, index, errors, flag) {
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) {
    errors.push(`Missing value for ${flag}.`);
    return { value: '', nextIndex: index };
  }
  return { value, nextIndex: index + 1 };
}

export function parseArgs(argv) {
  const options = {
    title: '',
    type: 'feature',
    dryRun: false,
    help: false,
    taskFields: [],
    errors: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }

    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (arg === '--title' || arg === '--task') {
      const result = readValue(argv, index, options.errors, arg);
      options.title = result.value;
      index = result.nextIndex;
      continue;
    }

    if (arg === '--type') {
      const result = readValue(argv, index, options.errors, arg);
      options.type = result.value || options.type;
      index = result.nextIndex;
      continue;
    }

    if (FORWARDED_CREATE_TASK_FLAGS.has(arg)) {
      const result = readValue(argv, index, options.errors, arg);
      if (result.value) options.taskFields.push(arg, result.value);
      index = result.nextIndex;
      continue;
    }

    options.errors.push(`Unsupported argument: ${arg}.`);
  }

  if (!options.help && !options.title) {
    options.errors.push('Missing required --title value.');
  }

  return options;
}

export function createDogfoodStartSteps(options) {
  const title = options.title;
  const type = options.type || 'feature';
  const taskFields = options.taskFields ?? [];

  return [
    {
      name: 'agentflight session start',
      command: 'npx',
      args: ['--yes', 'agentflight', 'start', '--task', title, '--yes'],
    },
    {
      name: 'agentloop task contract',
      command: 'npx',
      args: [
        ...AGENTLOOP_SOURCE_CLI,
        'create-task',
        '--type',
        type,
        '--title',
        title,
        ...taskFields,
      ],
    },
    {
      name: 'agentloop status',
      command: 'npx',
      args: [...AGENTLOOP_SOURCE_CLI, 'status', '--brief', '--redact-paths'],
    },
    {
      name: 'projscan project scan',
      command: 'npx',
      args: ['--yes', 'projscan', 'start'],
    },
  ];
}

export function buildDogfoodStartEnv(sourceEnv = process.env) {
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

export function createDogfoodStartSafetyNotes() {
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

async function spawnStep(step, env) {
  const child = spawn(step.command, step.args, {
    env,
    stdio: 'inherit',
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

async function runStep(step, env, options) {
  const commandText = formatCommand(step);

  if (options.dryRun) {
    options.logger.log(`- ${commandText}`);
    return {
      name: step.name,
      command: step.command,
      args: step.args,
      commandText,
      status: 'planned',
      exitCode: 0,
    };
  }

  options.logger.log(`\n## ${step.name}`);
  options.logger.log(`$ ${commandText}`);

  let processResult;
  try {
    processResult = normalizeProcessResult(await options.runProcess(step, env));
  } catch (error) {
    processResult = {
      exitCode: 1,
      errorMessage: error instanceof Error ? error.message : String(error),
    };
  }

  const status = processResult.exitCode === 0 ? 'pass' : 'fail';
  return {
    name: step.name,
    command: step.command,
    args: step.args,
    commandText,
    status,
    exitCode: processResult.exitCode,
    ...(processResult.errorMessage ? { errorMessage: processResult.errorMessage } : {}),
  };
}

export async function runDogfoodStart(options = {}) {
  const {
    cwd = process.cwd(),
    dryRun = false,
    logger = console,
    runProcess = spawnStep,
  } = options;

  if (!options.title) {
    throw new Error('Missing required --title value.');
  }

  process.chdir(path.resolve(cwd));
  const env = buildDogfoodStartEnv();
  const steps = createDogfoodStartSteps(options);

  if (dryRun) {
    logger.log('# AgentLoopKit Dogfood Start Plan');
  } else {
    logger.log('# AgentLoopKit Dogfood Start');
  }

  const results = [];
  for (const step of steps) {
    const result = await runStep(step, env, { dryRun, logger, runProcess });
    results.push(result);
    if (result.status === 'fail') break;
  }

  const failedStep = results.find((step) => step.status === 'fail');
  return {
    status: failedStep ? 'fail' : 'pass',
    dryRun,
    steps: results,
    safety: createDogfoodStartSafetyNotes(),
  };
}

function printHelp() {
  console.log(`AgentLoopKit dogfood start

Usage:
  npm run dogfood:start -- --title "Describe the change" --type feature --problem "..." --outcome "..."
  npm run dogfood:start -- --title "Describe the change" --dry-run

Starts this repo's local dogfood companions in sequence:
1. AgentFlight session recorder
2. AgentLoopKit task contract
3. AgentLoopKit status
4. ProjScan project scan

This script does not publish packages, create tags, create GitHub releases, post comments, read token files, read .env contents, or run verification commands.`);
}

function failureMessage(summary) {
  const failedStep = summary.steps.find((step) => step.status === 'fail');
  if (!failedStep) return 'unknown failure';
  const suffix = failedStep.errorMessage ? `: ${failedStep.errorMessage}` : '';
  return `${failedStep.name} failed with exit code ${failedStep.exitCode}${suffix}`;
}

export function isDirectRun(metaUrl, argvPath) {
  return fileURLToPath(metaUrl) === argvPath;
}

if (isDirectRun(import.meta.url, process.argv[1])) {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
  } else if (options.errors.length > 0) {
    for (const error of options.errors) console.error(error);
    process.exitCode = 1;
  } else {
    runDogfoodStart(options)
      .then((summary) => {
        if (summary.status === 'fail') {
          console.error(`\nDogfood start failed: ${failureMessage(summary)}`);
          process.exitCode = 1;
        }
      })
      .catch((error) => {
        console.error(`\nDogfood start failed: ${error.message}`);
        process.exitCode = 1;
      });
  }
}
