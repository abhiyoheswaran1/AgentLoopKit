#!/usr/bin/env node
/* global console, process */
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

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

function sourceCliStep(name, args) {
  return {
    name,
    command: 'npx',
    args: ['--no-install', 'tsx', 'src/cli/index.ts', ...args],
    allowFailure: false,
  };
}

export function createMaintenanceCheckSteps() {
  return [
    {
      name: 'unit tests',
      command: 'npm',
      args: ['run', 'test:unit'],
      allowFailure: false,
    },
    {
      name: 'typecheck',
      command: 'npm',
      args: ['run', 'typecheck'],
      allowFailure: false,
    },
    {
      name: 'public docs hygiene',
      command: 'npm',
      args: ['run', 'check:public-docs'],
      allowFailure: false,
    },
    {
      name: 'markdown links',
      command: 'npm',
      args: ['run', 'check:links'],
      allowFailure: false,
    },
    sourceCliStep('release proof smoke', ['release-proof', '--only', 'npm', '--redact-paths']),
    {
      name: 'npm status safety tests',
      command: 'npm',
      args: ['test', '--', 'tests/npm-status.test.ts'],
      allowFailure: false,
    },
    sourceCliStep('schemastore entry', ['schemastore', '--json']),
    {
      name: 'schemastore consistency tests',
      command: 'npm',
      args: ['test', '--', 'tests/schemastore.test.ts'],
      allowFailure: false,
    },
    sourceCliStep('policy pack inventory', ['policy', 'packs', '--json']),
    {
      name: 'policy pack safety tests',
      command: 'npm',
      args: ['test', '--', 'tests/policy-packs.test.ts'],
      allowFailure: false,
    },
    sourceCliStep('github metadata import surface', ['github', 'import', '--help']),
    {
      name: 'github metadata safety tests',
      command: 'npm',
      args: ['test', '--', 'tests/github-metadata.test.ts'],
      allowFailure: false,
    },
    {
      name: 'github metadata ship-score neutrality tests',
      command: 'npm',
      args: [
        'test',
        '--',
        'tests/ship.test.ts',
        '-t',
        'keeps imported GitHub metadata neutral for ship scoring',
      ],
      allowFailure: false,
    },
    {
      name: 'agentflight version',
      command: 'npx',
      args: ['--yes', 'agentflight@latest', '--version'],
      allowFailure: false,
    },
    {
      name: 'projscan project health',
      command: 'npx',
      args: ['--yes', 'projscan', '--format', 'json', 'doctor'],
      allowFailure: false,
    },
    {
      name: 'dogfood self-check',
      command: 'npm',
      args: ['run', 'dogfood'],
      allowFailure: false,
    },
  ];
}

export function buildMaintenanceEnv(sourceEnv = process.env) {
  const env = {
    AGENTLOOPKIT_MAINTENANCE_CHECK: '1',
    FORCE_COLOR: '0',
  };

  for (const key of SAFE_ENV_KEYS) {
    const value = sourceEnv[key];
    if (value) env[key] = value;
  }

  return env;
}

function formatCommand(step) {
  return [step.command, ...step.args].join(' ');
}

function parseArgs(argv) {
  return {
    json: argv.includes('--json'),
    help: argv.includes('--help') || argv.includes('-h'),
  };
}

function printHelp() {
  console.log(`AgentLoopKit maintenance check

Usage:
  npm run maintenance:check
  node scripts/maintenance-check.mjs --json

Runs the near-term roadmap health gate: unit tests, typecheck, public docs hygiene, link checking, release-proof smoke coverage, npm-status safety tests, SchemaStore output and consistency tests, policy-pack inventory and safety tests, read-only GitHub metadata import help, GitHub metadata safety tests, ship-score neutrality coverage, AgentFlight version, ProjScan health, and the dogfood self-check.

This script does not publish packages, create tags, create GitHub releases, require strict public release proof, upload files, post comments, read .env contents, or pass token-like environment variables to child processes.`);
}

function spawnStep(step, env, { quiet = false } = {}) {
  const child = spawn(step.command, step.args, {
    env,
    stdio: quiet ? 'ignore' : 'inherit',
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

export async function runMaintenanceCheck(options = {}) {
  const steps = options.steps ?? createMaintenanceCheckSteps();
  const env = options.env ?? buildMaintenanceEnv();
  const logger = options.logger ?? console;
  const now = options.now ?? (() => Date.now());
  const runProcess = options.runProcess ?? spawnStep;
  const json = Boolean(options.json);
  const results = [];
  let status = 'pass';

  for (const step of steps) {
    if (!json) {
      logger.log(`\n## ${step.name}`);
      logger.log(`$ ${formatCommand(step)}`);
    }

    const startedAt = now();
    let processResult;
    try {
      processResult = await runProcess(step, env, { quiet: json });
    } catch (error) {
      processResult = {
        exitCode: 1,
        errorMessage: error instanceof Error ? error.message : String(error),
      };
    }
    const exitCode = Number.isInteger(processResult?.exitCode) ? processResult.exitCode : 1;
    const durationMs = Math.max(0, now() - startedAt);
    const stepStatus = exitCode === 0 ? 'pass' : step.allowFailure ? 'allowed-failure' : 'fail';
    const result = {
      name: step.name,
      commandText: formatCommand(step),
      allowFailure: step.allowFailure,
      status: stepStatus,
      exitCode,
      durationMs,
    };
    if (processResult?.errorMessage) result.errorMessage = processResult.errorMessage;
    results.push(result);

    if (stepStatus === 'fail') {
      status = 'fail';
      break;
    }
  }

  return {
    status,
    steps: results,
    safety: {
      publishesPackages: false,
      createsTags: false,
      createsGitHubReleases: false,
      uploadsFiles: false,
      postsComments: false,
      readsEnvFiles: false,
      passesTokenEnvironment: false,
    },
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const summary = await runMaintenanceCheck({ json: args.json });
  if (args.json) {
    console.log(JSON.stringify(summary, null, 2));
  }

  if (summary.status !== 'pass') {
    process.exitCode = 1;
  } else if (!args.json) {
    console.log('\nMaintenance check passed.');
  }
}

const entrypoint = process.argv[1] ? pathToFileURL(process.argv[1]).href : '';
if (import.meta.url === entrypoint) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Maintenance check failed: ${message}`);
    process.exitCode = 1;
  });
}
