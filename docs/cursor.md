# Cursor

Install Cursor guidance:

```bash
agentloop install-agent cursor
```

Use the generated `.agentloop/agents/cursor.md` as repo guidance. If your workspace has Cursor-specific rules, link to the generated file instead of duplicating stale text.

Cursor agents should follow task contracts, run verification, and produce reviewer summaries.

## Optional MCP Context

AgentLoopKit includes a read-only MCP server for local repo evidence. Cursor supports project `.cursor/mcp.json` and user `~/.cursor/mcp.json`.

See [mcp.md](mcp.md#cursor) for the current AgentLoopKit server entry.
