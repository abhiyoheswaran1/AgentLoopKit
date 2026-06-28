import path from 'node:path';
import { execa } from 'execa';
import { AgentLoopError } from './errors.js';
import { getGitStatus, parseGitStatus } from './git.js';

export type LoopRunnerConfig = {
  name: string;
  command: string;
  timeoutMs: number;
  maxOutputChars: number;
  shell: false;
};

export type LoopRunnerExecution = {
  name: string;
  command: string;
  executable: string;
  args: string[];
  shell: false;
  exitCode: number;
  status: 'passed' | 'failed' | 'timeout';
  durationMs: number;
  timedOut?: boolean;
  outputExcerpt: string;
  changedFilesAfter: string[];
};

export const DEFAULT_LOOP_RUNNER_TIMEOUT_MS = 10 * 60 * 1000;
export const DEFAULT_LOOP_RUNNER_OUTPUT_CHARS = 8000;
export const BLOCKED_LOOP_RUNNER_COMMANDS = [
  'shell interpreters',
  'rm/rmdir',
  'git add/commit/push/reset/clean/checkout/switch/rebase/merge/tag/stash/restore',
  'npm/pnpm/yarn/bun publish/version',
  'gh release',
  'docker push/login',
];

function containsShellMetacharacter(command: string) {
  return /[\0\r\n`<>]|&&|\|\||[;|]|\$\(|\$\{/.test(command);
}

function commandBaseName(executable: string) {
  return path.basename(executable).toLowerCase();
}

function assertRunnerCommandAllowed(tokens: string[], command: string) {
  const executable = commandBaseName(tokens[0] ?? '');
  const subcommand = tokens[1]?.toLowerCase();
  const blockedShells = new Set([
    'sh',
    'bash',
    'zsh',
    'fish',
    'cmd',
    'cmd.exe',
    'powershell',
    'powershell.exe',
    'pwsh',
    'pwsh.exe',
  ]);

  if (blockedShells.has(executable)) {
    throw new AgentLoopError(
      `Loop runner command is blocked because it invokes a shell: ${command}`,
      'LOOP_RUNNER_COMMAND_BLOCKED',
    );
  }
  if (executable === 'rm' || executable === 'rmdir') {
    throw new AgentLoopError(
      `Loop runner command is blocked because it deletes files directly: ${command}`,
      'LOOP_RUNNER_COMMAND_BLOCKED',
    );
  }
  if (
    executable === 'git' &&
    subcommand &&
    [
      'add',
      'commit',
      'push',
      'reset',
      'clean',
      'checkout',
      'switch',
      'rebase',
      'merge',
      'tag',
      'stash',
      'restore',
    ].includes(subcommand)
  ) {
    throw new AgentLoopError(
      `Loop runner command is blocked because it changes repository state outside the task loop: ${command}`,
      'LOOP_RUNNER_COMMAND_BLOCKED',
    );
  }
  if (
    ['npm', 'pnpm', 'yarn', 'bun'].includes(executable) &&
    subcommand &&
    ['publish', 'version'].includes(subcommand)
  ) {
    throw new AgentLoopError(
      `Loop runner command is blocked because it can publish or change package versions: ${command}`,
      'LOOP_RUNNER_COMMAND_BLOCKED',
    );
  }
  if (executable === 'gh' && subcommand === 'release') {
    throw new AgentLoopError(
      `Loop runner command is blocked because it can publish GitHub releases: ${command}`,
      'LOOP_RUNNER_COMMAND_BLOCKED',
    );
  }
  if (executable === 'docker' && subcommand && ['push', 'login'].includes(subcommand)) {
    throw new AgentLoopError(
      `Loop runner command is blocked because it can publish images or use credentials: ${command}`,
      'LOOP_RUNNER_COMMAND_BLOCKED',
    );
  }
}

export function parseLoopRunnerCommand(command: string) {
  const clean = command.trim();
  if (!clean) {
    throw new AgentLoopError('Loop runner command is required.', 'LOOP_RUNNER_COMMAND_INVALID');
  }
  if (containsShellMetacharacter(clean)) {
    throw new AgentLoopError(
      'Loop runner commands must not contain shell metacharacters. Put complex logic in a checked-in script and run that script directly.',
      'LOOP_RUNNER_COMMAND_UNSAFE',
    );
  }

  const tokens: string[] = [];
  let current = '';
  let quote: '"' | "'" | undefined;
  let escaped = false;
  for (const char of clean) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }
    if (char === '\\' && quote !== "'") {
      escaped = true;
      continue;
    }
    if (quote) {
      if (char === quote) {
        quote = undefined;
      } else {
        current += char;
      }
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (/\s/.test(char)) {
      if (current) {
        tokens.push(current);
        current = '';
      }
      continue;
    }
    current += char;
  }
  if (escaped || quote) {
    throw new AgentLoopError(
      'Loop runner command has an unfinished quote or escape.',
      'LOOP_RUNNER_COMMAND_UNSAFE',
    );
  }
  if (current) tokens.push(current);
  if (!tokens.length) {
    throw new AgentLoopError('Loop runner command is required.', 'LOOP_RUNNER_COMMAND_INVALID');
  }
  assertRunnerCommandAllowed(tokens, clean);
  return tokens;
}

export function createRunnerConfig(options: {
  command?: string;
  name?: string;
  timeoutMs?: number;
}): LoopRunnerConfig | undefined {
  const command = options.command?.trim();
  if (!command) return undefined;
  parseLoopRunnerCommand(command);
  const timeoutMs = options.timeoutMs ?? DEFAULT_LOOP_RUNNER_TIMEOUT_MS;
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
    throw new AgentLoopError(
      'Loop runner timeout must be a positive integer in milliseconds.',
      'LOOP_RUNNER_TIMEOUT_INVALID',
    );
  }
  return {
    name: options.name?.trim() || 'default',
    command,
    timeoutMs,
    maxOutputChars: DEFAULT_LOOP_RUNNER_OUTPUT_CHARS,
    shell: false,
  };
}

function outputExcerpt(output: string, limit: number) {
  if (output.length <= limit) return output;
  const headLimit = Math.ceil(limit / 2);
  const tailLimit = Math.floor(limit / 2);
  return `${output.slice(0, headLimit)}

[runner output truncated: showing first ${headLimit} and last ${tailLimit} characters of ${output.length} total]

${output.slice(-tailLimit)}`;
}

function isTimeoutError(error: unknown) {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'timedOut' in error &&
      (error as { timedOut?: unknown }).timedOut === true,
  );
}

async function changedFilePaths(cwd: string) {
  return (await parseGitStatus(await getGitStatus(cwd))).map((file) => file.path);
}

export async function executeLoopRunner(options: {
  cwd: string;
  runner: LoopRunnerConfig;
}): Promise<LoopRunnerExecution> {
  const tokens = parseLoopRunnerCommand(options.runner.command);
  const executable = tokens[0];
  if (!executable) {
    throw new AgentLoopError('Loop runner command is required.', 'LOOP_RUNNER_COMMAND_INVALID');
  }
  const args = tokens.slice(1);
  const startedAt = Date.now();
  try {
    const result = await execa(executable, args, {
      cwd: options.cwd,
      shell: false,
      all: true,
      reject: false,
      env: { ...process.env, FORCE_COLOR: '0' },
      timeout: options.runner.timeoutMs,
    });
    const timedOut = 'timedOut' in result && (result as { timedOut?: unknown }).timedOut === true;
    const rawOutput = result.all ?? result.stdout ?? result.stderr ?? '';
    return {
      name: options.runner.name,
      command: options.runner.command,
      executable,
      args,
      shell: false,
      exitCode: result.exitCode ?? 1,
      status: result.exitCode === 0 && !timedOut ? 'passed' : timedOut ? 'timeout' : 'failed',
      durationMs: Date.now() - startedAt,
      ...(timedOut ? { timedOut: true } : {}),
      outputExcerpt: outputExcerpt(
        timedOut
          ? `${rawOutput}${rawOutput ? '\n' : ''}Command timed out after ${options.runner.timeoutMs}ms.`
          : rawOutput,
        options.runner.maxOutputChars,
      ),
      changedFilesAfter: await changedFilePaths(options.cwd),
    };
  } catch (error) {
    if (!isTimeoutError(error)) throw error;
    const rawOutput =
      error && typeof error === 'object' && 'all' in error && typeof error.all === 'string'
        ? error.all
        : '';
    return {
      name: options.runner.name,
      command: options.runner.command,
      executable,
      args,
      shell: false,
      exitCode: 1,
      status: 'timeout',
      durationMs: Date.now() - startedAt,
      timedOut: true,
      outputExcerpt: outputExcerpt(
        `${rawOutput}${rawOutput ? '\n' : ''}Command timed out after ${options.runner.timeoutMs}ms.`,
        options.runner.maxOutputChars,
      ),
      changedFilesAfter: await changedFilePaths(options.cwd),
    };
  }
}
