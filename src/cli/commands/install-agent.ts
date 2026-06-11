import { Command } from 'commander';
import { OutputPathError } from '../../core/artifacts.js';
import {
  installAgentInstructions,
  installAllAgentInstructions,
  isSupportedAgent,
} from '../../core/agent-installation.js';
import { resolveAgentLoopWorkspaceCwd } from '../../core/config.js';
import { SUPPORTED_AGENTS } from '../../core/constants.js';
import { inlineCode } from '../../core/markdown-format.js';
import { printOutputPathJsonError } from '../json-errors.js';

export function installAgentCommand() {
  return new Command('install-agent')
    .description('Install agent-specific instruction files')
    .argument('<agent>', `one of: ${SUPPORTED_AGENTS.join(', ')}, all`)
    .option('--json', 'print machine-readable output')
    .action(async (agent: string, options: { json?: boolean }) => {
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
                  ...result,
                })),
              },
              null,
              2,
            ),
          );
          return;
        }
        console.log(`Agent instructions written: ${inlineCode(String(results.length))}`);
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
        console.log(JSON.stringify({ agent: { name: requestedAgent, ...result } }, null, 2));
        return;
      }
      console.log(`Agent instructions written: ${inlineCode(result.agentFilePath)}`);
      console.log('AGENTS.md now references the agent instructions.');
    });
}
