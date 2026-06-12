import path from 'node:path';
import { rm, symlink, writeFile } from 'node:fs/promises';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { afterEach, describe, expect, test } from 'vitest';
import { initializeAgentLoop } from '../src/core/init.js';
import { callMcpTool } from '../src/core/mcp-tools.js';
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

  test('does not expose report or handoff content from symlinked roots outside the repo', async () => {
    const dir = await makeTempDir();
    const outsideReports = await makeTempDir();
    const outsideHandoffs = await makeTempDir();
    tempDirs.push(dir, outsideReports, outsideHandoffs);
    await initializeAgentLoop({ cwd: dir });
    await writeFile(
      path.join(outsideReports, '2026-06-10-11-00-verification-report.md'),
      '# Outside Verification\n\noutside-secret-report-content\n',
    );
    await writeFile(
      path.join(outsideReports, '2026-06-10-11-01-ship-report.md'),
      '# Outside Ship\n\noutside-secret-ship-content\n',
    );
    await writeFile(
      path.join(outsideHandoffs, '2026-06-10-11-05-pr-summary.md'),
      '# Outside Handoff\n\noutside-secret-handoff-content\n',
    );
    await rm(path.join(dir, '.agentloop/reports'), { recursive: true, force: true });
    await rm(path.join(dir, '.agentloop/handoffs'), { recursive: true, force: true });
    await symlink(outsideReports, path.join(dir, '.agentloop/reports'), 'dir');
    await symlink(outsideHandoffs, path.join(dir, '.agentloop/handoffs'), 'dir');

    const report = await callMcpTool({
      cwd: dir,
      name: 'agentloop_latest_verification_report',
    });
    const handoffs = await callMcpTool({
      cwd: dir,
      name: 'agentloop_list_handoffs',
      arguments: { limit: 10 },
    });
    const shipReport = await callMcpTool({
      cwd: dir,
      name: 'agentloop_latest_ship_report',
    });
    const handoff = await callMcpTool({
      cwd: dir,
      name: 'agentloop_latest_handoff',
    });

    expect(report.payload).toEqual({ report: null });
    expect(shipReport.payload).toEqual({ shipReport: null });
    expect(handoffs.payload).toEqual({ handoffs: [] });
    expect(handoff.payload).toEqual({ handoff: null });
    expect(JSON.stringify([report, shipReport, handoffs, handoff])).not.toContain('outside-secret');
  });
});
