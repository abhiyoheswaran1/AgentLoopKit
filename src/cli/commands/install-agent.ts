import { Command } from 'commander';
import { OutputPathError } from '../../core/artifacts.js';
import {
  installAgentInstructions,
  installAllAgentInstructions,
  isSupportedAgent,
} from '../../core/agent-installation.js';
import { resolveAgentLoopWorkspaceCwd } from '../../core/config.js';
import { SUPPORTED_AGENTS } from '../../core/constants.js';
import { singleLineInlineCode as inlineCode } from '../../core/markdown-format.js';
import { redactLocalRoots } from '../../core/redaction.js';
import { printOutputPathJsonError } from '../json-errors.js';

function redactText(value: string, cwd: string, redactPaths: boolean | undefined) {
  return redactPaths ? redactLocalRoots(value, [cwd]) : value;
}

function redactInstallResult<T extends { agentFilePath: string; agentsPath: string }>(
  result: T,
  cwd: string,
  redactPaths: boolean | undefined,
): T {
  return {
    ...result,
    agentFilePath: redactText(result.agentFilePath, cwd, redactPaths),
    agentsPath: redactText(result.agentsPath, cwd, redactPaths),
  };
}

export function installAgentCommand() {
  return new Command('install-agent')
    .description('Install agent-specific instruction files')
    .argument('<agent>', `one of: ${SUPPORTED_AGENTS.join(', ')}, all`)
    .option('--json', 'print machine-readable output')
    .option('--redact-paths', 'redact local absolute paths in public output')
    .action(async (agent: string, options: { json?: boolean; redactPaths?: boolean }) => {
      const requestedAgent = agent.trim();
      const cwd = await resolveAgentLoopWorkspaceCwd(process.cwd());
      if (requestedAgent === 'all') {
        let results: Awaited<ReturnType<typeof installAllAgentInstructions>>;
        try {
          results = await installAllAgentInstructions({ cwd });
        } catch (error) {
          if (options.json && error instanceof OutputPathError) {
            printOutputPathJsonError(error);
            return;
          }
          throw error;
        }
        if (options.json) {
          console.log(
            JSON.stringify(
              {
                agents: results.map((result, index) => ({
                  name: SUPPORTED_AGENTS[index],
                  ...redactInstallResult(result, cwd, options.redactPaths),
                })),
              },
              null,
              2,
            ),
          );
          return;
        }
        const createdCount = results.filter(
          (result) => result.agentFileStatus === 'created',
        ).length;
        const skippedCount = results.filter(
          (result) => result.agentFileStatus === 'skipped',
        ).length;
        console.log(
          `Agent instructions processed: ${inlineCode(String(results.length))} (${inlineCode(
            `${createdCount} created`,
          )}, ${inlineCode(`${skippedCount} skipped`)})`,
        );
        console.log('AGENTS.md now references all bundled agent instructions.');
        return;
      }
      if (!isSupportedAgent(requestedAgent)) {
        if (options.json) {
          console.log(
            JSON.stringify(
              {
                error: {
                  code: 'UNSUPPORTED_AGENT',
                  message: `Unsupported agent "${requestedAgent}".`,
                  requestedAgent,
                  supportedAgents: [...SUPPORTED_AGENTS, 'all'],
                },
              },
              null,
              2,
            ),
          );
          process.exitCode = 1;
          return;
        }
        throw new Error(
          `Unsupported agent "${requestedAgent}". Supported agents: ${SUPPORTED_AGENTS.join(', ')}, all`,
        );
      }
      let result: Awaited<ReturnType<typeof installAgentInstructions>>;
      try {
        result = await installAgentInstructions({ cwd, agent: requestedAgent });
      } catch (error) {
        if (options.json && error instanceof OutputPathError) {
          printOutputPathJsonError(error);
          return;
        }
        throw error;
      }
      if (options.json) {
        console.log(
          JSON.stringify(
            {
              agent: {
                name: requestedAgent,
                ...redactInstallResult(result, cwd, options.redactPaths),
              },
            },
            null,
            2,
          ),
        );
        return;
      }
      const agentFilePath = redactText(result.agentFilePath, cwd, options.redactPaths);
      if (result.agentFileStatus === 'created') {
        console.log(`Agent instructions written: ${inlineCode(agentFilePath)}`);
      } else {
        console.log(`Agent instructions skipped: ${inlineCode(agentFilePath)}`);
      }
      console.log('AGENTS.md now references the agent instructions.');
    });
}
