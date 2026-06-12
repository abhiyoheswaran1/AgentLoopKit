import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { callMcpTool, listMcpTools } from '../core/mcp-tools.js';
import { getPackageVersion } from '../core/version.js';

export async function startAgentLoopMcpServer(options: { cwd: string }) {
  const server = new Server(
    {
      name: 'agentloopkit',
      version: getPackageVersion(),
    },
    {
      capabilities: {
        tools: {},
      },
      instructions:
        'Read-only AgentLoopKit server. Exposes local task contracts, policies, policy template status, verification reports, ship reports, run ledger summaries and details, file intent matches, maintainer reviewability checks, handoffs, status, and next action. It does not run verification commands, read env file contents, call external APIs, upload files, or mutate repository files.',
    },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: listMcpTools(),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) =>
    callMcpTool({
      cwd: options.cwd,
      name: request.params.name,
      arguments: request.params.arguments,
    }),
  );

  await server.connect(new StdioServerTransport());
}
