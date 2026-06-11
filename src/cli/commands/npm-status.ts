import { readFile } from 'node:fs/promises';
import { Command } from 'commander';
import {
  checkNpmStatus,
  parseNpmViewJson,
  shouldFailNpmStatusExpectation,
} from '../../core/npm-status.js';
import { AgentLoopError } from '../../core/errors.js';

type NpmRegistryJsonErrorReason = 'missing' | 'unreadable' | 'invalid-json';
type NpmTimeoutErrorReason = 'not-positive-integer';

class NpmRegistryJsonError extends Error {
  public readonly code = 'NPM_STATUS_REGISTRY_JSON_INVALID';

  constructor(
    message: string,
    public readonly registryJson: string,
    public readonly reason: NpmRegistryJsonErrorReason,
  ) {
    super(message);
    this.name = 'NpmRegistryJsonError';
  }
}

class NpmTimeoutError extends Error {
  public readonly code = 'NPM_STATUS_TIMEOUT_INVALID';
  public readonly reason: NpmTimeoutErrorReason = 'not-positive-integer';

  constructor(public readonly requestedTimeout: string) {
    super('Timeout must be a positive integer.');
    this.name = 'NpmTimeoutError';
  }
}

function printRegistryJsonError(error: NpmRegistryJsonError) {
  console.log(
    JSON.stringify(
      {
        error: {
          code: error.code,
          message: error.message,
          registryJson: error.registryJson,
          reason: error.reason,
        },
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
}

function printTimeoutError(error: NpmTimeoutError) {
  console.log(
    JSON.stringify(
      {
        error: {
          code: error.code,
          message: error.message,
          requestedTimeout: error.requestedTimeout,
          reason: error.reason,
        },
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
}

function parseTimeout(value: unknown) {
  const rawValue = typeof value === 'string' ? value : '15000';
  const parsed = Number(rawValue);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new NpmTimeoutError(rawValue);
  }
  return parsed;
}

function registryJsonReadReason(error: unknown): NpmRegistryJsonErrorReason {
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    (error as { code?: unknown }).code === 'ENOENT'
  ) {
    return 'missing';
  }
  return 'unreadable';
}

async function readRegistryJsonFile(filePath: string) {
  try {
    const content = await readFile(filePath, 'utf8');
    parseNpmViewJson(content);
    return content;
  } catch (error) {
    const reason =
      error instanceof SyntaxError || error instanceof AgentLoopError
        ? 'invalid-json'
        : registryJsonReadReason(error);
    const message =
      reason === 'missing'
        ? `Captured npm registry JSON file was not found: ${filePath}`
        : reason === 'invalid-json'
          ? `Captured npm registry JSON file could not be parsed: ${filePath}`
          : `Captured npm registry JSON file could not be read: ${filePath}`;
    throw new NpmRegistryJsonError(message, filePath, reason);
  }
}

export function npmStatusCommand() {
  return new Command('npm-status')
    .description('Check npm registry catch-up status')
    .option('--agentloopkit', 'check the published agentloopkit package from any directory')
    .option('--package-name <name>', 'package name; defaults to package.json name')
    .option('--local-version <version>', 'local version; defaults to package.json version')
    .option(
      '--registry-json <path>',
      'read captured `npm view <package> version versions --json` output instead of running npm',
    )
    .option('--timeout-ms <ms>', 'npm view timeout in milliseconds', '15000')
    .option('--expect-current', 'exit 1 unless npm latest matches the local version')
    .option('--json', 'print machine-readable output')
    .action(
      async (options: {
        agentloopkit?: boolean;
        packageName?: string;
        localVersion?: string;
        registryJson?: string;
        timeoutMs: string;
        expectCurrent?: boolean;
        json?: boolean;
      }) => {
        let registryJson: string | undefined;
        let timeoutMs: number;
        try {
          timeoutMs = parseTimeout(options.timeoutMs);
          registryJson = options.registryJson
            ? await readRegistryJsonFile(options.registryJson)
            : undefined;
        } catch (error) {
          if (options.json && error instanceof NpmTimeoutError) {
            printTimeoutError(error);
            return;
          }
          if (options.json && error instanceof NpmRegistryJsonError) {
            printRegistryJsonError(error);
            return;
          }
          throw error;
        }
        const result = await checkNpmStatus({
          cwd: process.cwd(),
          agentloopkit: options.agentloopkit,
          packageName: options.packageName,
          localVersion: options.localVersion,
          registryJson,
          timeoutMs,
        });

        if (options.json) {
          console.log(JSON.stringify(result, null, 2));
        } else {
          console.log(result.markdown);
        }

        if (options.expectCurrent && shouldFailNpmStatusExpectation(result)) {
          process.exitCode = 1;
        }
      },
    );
}
