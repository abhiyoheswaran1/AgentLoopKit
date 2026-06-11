import { AgentLoopError } from '../core/errors.js';

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
