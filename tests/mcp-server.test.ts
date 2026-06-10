import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { afterEach, describe, expect, test } from 'vitest';
import { initializeAgentLoop } from '../src/core/init.js';
import { makeTempDir, removeTempDir } from './helpers.js';

let tempDirs: string[] = [];

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

describe('mcp-server command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('serves read-only AgentLoopKit tools over stdio', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await initializeAgentLoop({ cwd: dir });
    await writeFile(
      path.join(dir, '.agentloop/tasks/2026-06-10-check-mcp.md'),
      '# Check MCP\n\n- Status: proposed\n',
    );

    const transport = new StdioClientTransport({
      command: tsxPath,
      args: [cliPath, 'mcp-server'],
      cwd: dir,
      stderr: 'pipe',
    });
    const client = new Client({ name: 'agentloopkit-test', version: '1.0.0' });

    try {
      await client.connect(transport);
      const tools = await client.listTools();
      const status = await client.callTool({ name: 'agentloop_status', arguments: {} });

      expect(tools.tools.map((tool) => tool.name)).toContain('agentloop_status');
      expect(JSON.stringify(status.content)).toContain('Check MCP');
    } finally {
      await client.close();
    }
  });
});
