import { Command } from 'commander';
import { resolveAgentLoopWorkspaceCwd } from '../../core/config.js';
import { startAgentLoopMcpServer } from '../../mcp/server.js';

export function mcpServerCommand() {
  return new Command('mcp-server')
    .description('Start the read-only AgentLoopKit MCP stdio server')
    .action(async () => {
      await startAgentLoopMcpServer({ cwd: await resolveAgentLoopWorkspaceCwd(process.cwd()) });
    });
}
