import { loadAgentLoopConfig } from '../core/config.js';
import type { AgentLoopConfig } from '../core/config.js';
import { AgentLoopError, ConfigError } from '../core/errors.js';

export class CliOptionError extends AgentLoopError {
  constructor(
    message: string,
    code: string,
    public readonly details: Record<string, unknown> = {},
  ) {
    super(message, code);
    this.name = 'CliOptionError';
  }
}

export function printAgentLoopJsonError(error: AgentLoopError) {
  console.log(
    JSON.stringify(
      {
        error: {
          code: error.code,
          message: error.message,
          ...(error instanceof CliOptionError ? error.details : {}),
        },
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
}

export async function loadConfigForJsonCommand(
  cwd: string,
  json: boolean | undefined,
): Promise<AgentLoopConfig | undefined> {
  try {
    return await loadAgentLoopConfig(cwd);
  } catch (error) {
    if (json && error instanceof ConfigError) {
      printAgentLoopJsonError(error);
      return undefined;
    }
    throw error;
  }
}

export function validateOutRequiresWrite(options: {
  out?: string;
  write?: boolean;
  json?: boolean;
}) {
  if (!options.out || options.write) return true;
  const error = new CliOptionError('--out requires --write.', 'OUT_REQUIRES_WRITE', {
    option: 'out',
    requiredOption: 'write',
    requestedPath: options.out,
  });

  if (options.json) {
    printAgentLoopJsonError(error);
    return false;
  }

  throw error;
}
