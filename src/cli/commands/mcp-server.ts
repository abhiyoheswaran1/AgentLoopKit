import { Command } from 'commander';
import { startAgentLoopMcpServer } from '../../mcp/server.js';

export function mcpServerCommand() {
  return new Command('mcp-server')
    .description('Start the read-only AgentLoopKit MCP stdio server')
    .action(async () => {
      await startAgentLoopMcpServer({ cwd: process.cwd() });
    });
}
