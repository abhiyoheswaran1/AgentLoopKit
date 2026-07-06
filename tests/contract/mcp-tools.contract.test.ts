import { describe, expect, test } from 'vitest';
import { listMcpTools } from '../../src/core/mcp-tools.js';

describe('MCP tool contract', () => {
  test('MCP tool definitions are locked', () => {
    expect(listMcpTools()).toMatchSnapshot();
  });
});
