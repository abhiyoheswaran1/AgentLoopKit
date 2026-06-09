import { Command } from 'commander';
import { installAgentInstructions, isSupportedAgent } from '../../core/agent-installation.js';
import { SUPPORTED_AGENTS } from '../../core/constants.js';

export function installAgentCommand() {
  return new Command('install-agent')
    .description('Install agent-specific instruction files')
    .argument('<agent>', `one of: ${SUPPORTED_AGENTS.join(', ')}`)
    .action(async (agent: string) => {
      if (!isSupportedAgent(agent)) {
        throw new Error(
          `Unsupported agent "${agent}". Supported agents: ${SUPPORTED_AGENTS.join(', ')}`,
        );
      }
      const result = await installAgentInstructions({ cwd: process.cwd(), agent });
      console.log(`Agent instructions written: ${result.agentFilePath}`);
      console.log('AGENTS.md now references the agent instructions.');
    });
}
