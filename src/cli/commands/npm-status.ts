import { readFile } from 'node:fs/promises';
import { Command } from 'commander';
import {
  checkNpmStatus,
  parseNpmViewJson,
  shouldFailNpmStatusExpectation,
} from '../../core/npm-status.js';
import { AgentLoopError } from '../../core/errors.js';

type NpmRegistryJsonErrorReason = 'missing' | 'unreadable' | 'invalid-json';

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

function parseTimeout(value: string) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error('timeout must be a positive integer');
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
    .option('--timeout-ms <ms>', 'npm view timeout in milliseconds', parseTimeout, 15000)
    .option('--expect-current', 'exit 1 unless npm latest matches the local version')
    .option('--json', 'print machine-readable output')
    .action(
      async (options: {
        agentloopkit?: boolean;
        packageName?: string;
        localVersion?: string;
        registryJson?: string;
        timeoutMs: number;
        expectCurrent?: boolean;
        json?: boolean;
      }) => {
        let registryJson: string | undefined;
        try {
          registryJson = options.registryJson
            ? await readRegistryJsonFile(options.registryJson)
            : undefined;
        } catch (error) {
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
          timeoutMs: options.timeoutMs,
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
