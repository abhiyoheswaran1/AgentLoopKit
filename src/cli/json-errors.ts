import { loadAgentLoopConfig } from '../core/config.js';
import type { AgentLoopConfig } from '../core/config.js';
import { AgentLoopError, ConfigError } from '../core/errors.js';

export function printAgentLoopJsonError(error: AgentLoopError) {
  console.log(
    JSON.stringify(
      {
        error: {
          code: error.code,
          message: error.message,
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
