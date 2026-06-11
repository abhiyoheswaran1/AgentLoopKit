#!/usr/bin/env node
/* global console, process */
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const VERSION_PATTERN = /^(latest|\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?)$/;
const SHELL_METACHAR_PATTERN = /[;&|<>`$\\\n\r\0]/;

export function validateAgentLoopKitVersion(version) {
  const value = String(version || '').trim();
  if (!VERSION_PATTERN.test(value)) {
    throw new Error(
      'Unsupported agentloopkit-version. Use "latest" or an exact semver version such as "0.27.0".',
    );
  }
  return value;
}

function validateInstallMode(mode) {
  const value = String(mode || 'npm').trim();
  if (value !== 'npm' && value !== 'local') {
    throw new Error(`Unsupported install-mode: ${value}`);
  }
  return value;
}

export function parseCommandInput(input) {
  const value = String(input || '').trim();
  if (!value) throw new Error('AgentLoopKit action command is required.');
  if (SHELL_METACHAR_PATTERN.test(value)) {
    throw new Error('Command input contains unsupported shell metacharacters.');
  }

  const args = [];
  let token = '';
  let quote = '';

  for (const char of value) {
    if (quote) {
      if (char === quote) {
        quote = '';
      } else {
        token += char;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (/\s/.test(char)) {
      if (token) {
        args.push(token);
        token = '';
      }
      continue;
    }

    token += char;
  }

  if (quote) throw new Error('Command input has an unterminated quoted argument.');
  if (token) args.push(token);
  if (!args.length) throw new Error('AgentLoopKit action command is required.');
  return args;
}

export function createActionPlan(env) {
  const installMode = validateInstallMode(env.AGENTLOOPKIT_INSTALL_MODE);
  const version = validateAgentLoopKitVersion(env.AGENTLOOPKIT_VERSION || 'latest');
  const commandArgs = parseCommandInput(env.AGENTLOOPKIT_COMMAND);

  return {
    installMode,
    packageSpec: `agentloopkit@${version}`,
    commandArgs,
  };
}

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: false,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

export function main(env = process.env) {
  const plan = createActionPlan(env);

  if (plan.installMode === 'npm') {
    run('npm', ['install', '--no-save', '--package-lock=false', plan.packageSpec]);
  } else {
    run('npx', ['--no-install', 'agentloop', 'version']);
  }

  run('npx', ['--no-install', 'agentloop', ...plan.commandArgs]);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`agentloop action: ${message}`);
    process.exitCode = 1;
  }
}
