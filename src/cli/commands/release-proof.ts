import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Command } from 'commander';
import {
  checkReleaseProof,
  releaseProofChannelIds,
  type ReleaseProofChannelId,
} from '../../core/release-proof.js';
import { resolveAgentLoopWorkspaceCwd } from '../../core/config.js';
import { AgentLoopError } from '../../core/errors.js';
import { printAgentLoopJsonError } from '../json-errors.js';

type ReleaseProofCapture =
  | 'npm-registry'
  | 'github-release'
  | 'github-marketplace'
  | 'ghcr'
  | 'mcp-registry';
type ReleaseProofCaptureErrorReason = 'missing' | 'unreadable' | 'invalid-json' | 'env-file';
type ReleaseProofTimeoutErrorReason = 'not-positive-integer';

class ReleaseProofOnlyError extends Error {
  public readonly code = 'RELEASE_PROOF_ONLY_INVALID';
  public readonly allowed = [...releaseProofChannelIds];

  constructor(public readonly requestedOnly: string) {
    super(`Release proof --only must be one of: ${releaseProofChannelIds.join(', ')}.`);
    this.name = 'ReleaseProofOnlyError';
  }
}

class ReleaseProofCaptureError extends Error {
  public readonly code = 'RELEASE_PROOF_CAPTURE_INVALID';

  constructor(
    message: string,
    public readonly proof: ReleaseProofCapture,
    public readonly filePath: string,
    public readonly reason: ReleaseProofCaptureErrorReason,
  ) {
    super(message);
    this.name = 'ReleaseProofCaptureError';
  }
}

class ReleaseProofTimeoutError extends Error {
  public readonly code = 'RELEASE_PROOF_TIMEOUT_INVALID';
  public readonly reason: ReleaseProofTimeoutErrorReason = 'not-positive-integer';

  constructor(public readonly requestedTimeout: string) {
    super('Timeout must be a positive integer.');
    this.name = 'ReleaseProofTimeoutError';
  }
}

function parseTimeout(value: unknown) {
  const rawValue = typeof value === 'string' ? value : '15000';
  const parsed = Number(rawValue);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ReleaseProofTimeoutError(rawValue);
  }
  return parsed;
}

function parseOnly(value: unknown): ReleaseProofChannelId | undefined {
  if (value === undefined) return undefined;
  const requestedOnly = typeof value === 'string' ? value : String(value);
  if ((releaseProofChannelIds as readonly string[]).includes(requestedOnly)) {
    return requestedOnly as ReleaseProofChannelId;
  }
  throw new ReleaseProofOnlyError(requestedOnly);
}

function captureMatchesOnly(proof: ReleaseProofCapture, only: ReleaseProofChannelId | undefined) {
  if (!only) return true;
  if (proof === 'npm-registry') return only === 'npm';
  if (proof === 'github-marketplace') return only === 'github-marketplace';
  return proof === only;
}

function captureLabel(proof: ReleaseProofCapture) {
  switch (proof) {
    case 'npm-registry':
      return 'npm registry';
    case 'github-release':
      return 'GitHub release';
    case 'github-marketplace':
      return 'GitHub Marketplace';
    case 'ghcr':
      return 'GHCR tag';
    case 'mcp-registry':
      return 'MCP Registry';
  }
}

function captureJsonReadReason(error: unknown): ReleaseProofCaptureErrorReason {
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

function isEnvFilePath(filePath: string) {
  const basename = path.basename(filePath.replace(/\\/g, '/')).toLowerCase();
  return basename === '.env' || basename.startsWith('.env.');
}

async function readCaptureJsonFile(proof: ReleaseProofCapture, filePath: string) {
  const label = captureLabel(proof);
  if (isEnvFilePath(filePath)) {
    throw new ReleaseProofCaptureError(
      `Captured ${label} JSON file must not be an env file: ${filePath}`,
      proof,
      filePath,
      'env-file',
    );
  }

  try {
    const content = await readFile(filePath, 'utf8');
    JSON.parse(content);
    return content;
  } catch (error) {
    const reason = error instanceof SyntaxError ? 'invalid-json' : captureJsonReadReason(error);
    const message =
      reason === 'missing'
        ? `Captured ${label} JSON file was not found: ${filePath}`
        : reason === 'invalid-json'
          ? `Captured ${label} JSON file could not be parsed: ${filePath}`
          : `Captured ${label} JSON file could not be read: ${filePath}`;
    throw new ReleaseProofCaptureError(message, proof, filePath, reason);
  }
}

function printCaptureError(error: ReleaseProofCaptureError) {
  console.log(
    JSON.stringify(
      {
        error: {
          code: error.code,
          message: error.message,
          path: error.filePath,
          proof: error.proof,
          reason: error.reason,
        },
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
}

function printTimeoutError(error: ReleaseProofTimeoutError) {
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

function printOnlyError(error: ReleaseProofOnlyError) {
  console.log(
    JSON.stringify(
      {
        error: {
          code: error.code,
          message: error.message,
          requestedOnly: error.requestedOnly,
          allowed: error.allowed,
        },
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
}

export function releaseProofCommand() {
  return new Command('release-proof')
    .description('Check post-release evidence across public release channels')
    .option('--json', 'print machine-readable output')
    .option('--strict', 'treat warning checks as failures')
    .option(
      '--redact-paths',
      'accepted for output consistency; release proof prints no local roots',
    )
    .option('--only <channel>', `check one channel only (${releaseProofChannelIds.join(', ')})`)
    .option('--timeout-ms <ms>', 'public metadata check timeout in milliseconds', '15000')
    .option(
      '--npm-registry-json <path>',
      'read captured `npm view <package> version versions --json` output instead of running npm',
    )
    .option('--github-release-json <path>', 'read captured GitHub release JSON')
    .option('--github-marketplace-json <path>', 'read captured GitHub Marketplace JSON')
    .option('--ghcr-tags-json <path>', 'read captured GHCR tag-list JSON')
    .option('--mcp-registry-json <path>', 'read captured MCP Registry server JSON')
    .action(
      async (options: {
        json?: boolean;
        strict?: boolean;
        redactPaths?: boolean;
        only?: string;
        timeoutMs: string;
        npmRegistryJson?: string;
        githubReleaseJson?: string;
        githubMarketplaceJson?: string;
        ghcrTagsJson?: string;
        mcpRegistryJson?: string;
      }) => {
        let timeoutMs: number;
        let npmRegistryJson: string | undefined;
        let githubReleaseJson: string | undefined;
        let githubMarketplaceJson: string | undefined;
        let ghcrTagsJson: string | undefined;
        let mcpRegistryJson: string | undefined;
        let only: ReleaseProofChannelId | undefined;

        try {
          only = parseOnly(options.only);
          timeoutMs = parseTimeout(options.timeoutMs);
          npmRegistryJson =
            options.npmRegistryJson && captureMatchesOnly('npm-registry', only)
              ? await readCaptureJsonFile('npm-registry', options.npmRegistryJson)
              : undefined;
          githubReleaseJson =
            options.githubReleaseJson && captureMatchesOnly('github-release', only)
              ? await readCaptureJsonFile('github-release', options.githubReleaseJson)
              : undefined;
          githubMarketplaceJson =
            options.githubMarketplaceJson && captureMatchesOnly('github-marketplace', only)
              ? await readCaptureJsonFile('github-marketplace', options.githubMarketplaceJson)
              : undefined;
          ghcrTagsJson =
            options.ghcrTagsJson && captureMatchesOnly('ghcr', only)
              ? await readCaptureJsonFile('ghcr', options.ghcrTagsJson)
              : undefined;
          mcpRegistryJson =
            options.mcpRegistryJson && captureMatchesOnly('mcp-registry', only)
              ? await readCaptureJsonFile('mcp-registry', options.mcpRegistryJson)
              : undefined;
        } catch (error) {
          if (options.json && error instanceof ReleaseProofOnlyError) {
            printOnlyError(error);
            return;
          }
          if (options.json && error instanceof ReleaseProofTimeoutError) {
            printTimeoutError(error);
            return;
          }
          if (options.json && error instanceof ReleaseProofCaptureError) {
            printCaptureError(error);
            return;
          }
          throw error;
        }

        let result: Awaited<ReturnType<typeof checkReleaseProof>>;
        try {
          result = await checkReleaseProof({
            cwd: await resolveAgentLoopWorkspaceCwd(process.cwd()),
            strict: options.strict,
            only,
            timeoutMs,
            npmRegistryJson,
            githubReleaseJson,
            githubMarketplaceJson,
            ghcrTagsJson,
            mcpRegistryJson,
          });
        } catch (error) {
          if (options.json && error instanceof AgentLoopError) {
            printAgentLoopJsonError(error);
            return;
          }
          throw error;
        }

        if (options.json) {
          console.log(JSON.stringify(result, null, 2));
        } else {
          console.log(result.markdown);
        }

        if (result.overallStatus === 'fail') process.exitCode = 1;
      },
    );
}
