import { Command } from 'commander';
import {
  installAgentInstructions,
  installAllAgentInstructions,
  isSupportedAgent,
} from '../../core/agent-installation.js';
import { SUPPORTED_AGENTS } from '../../core/constants.js';

export function installAgentCommand() {
  return new Command('install-agent')
    .description('Install agent-specific instruction files')
    .argument('<agent>', `one of: ${SUPPORTED_AGENTS.join(', ')}, all`)
    .action(async (agent: string) => {
      if (agent === 'all') {
        const results = await installAllAgentInstructions({ cwd: process.cwd() });
        console.log(`Agent instructions written: ${results.length}`);
        console.log('AGENTS.md now references all bundled agent instructions.');
        return;
      }
      if (!isSupportedAgent(agent)) {
        throw new Error(
          `Unsupported agent "${agent}". Supported agents: ${SUPPORTED_AGENTS.join(', ')}, all`,
        );
      }
      const result = await installAgentInstructions({ cwd: process.cwd(), agent });
      console.log(`Agent instructions written: ${result.agentFilePath}`);
      console.log('AGENTS.md now references the agent instructions.');
    });
}
