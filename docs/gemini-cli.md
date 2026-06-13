# Gemini CLI

Install Gemini CLI guidance:

```bash
agentloop install-agent gemini-cli
```

Gemini CLI should:

- read repo instructions
- follow the Specify, Constrain, Plan, Implement, Verify, Review, Handoff loop
- avoid destructive commands
- run configured verification
- summarize risks and rollback notes

## Optional MCP Context

AgentLoopKit includes a read-only MCP server for local task, verification, ship, run-ledger, and handoff context. Gemini CLI stores workspace MCP settings in `.gemini/settings.json`.

See [mcp.md](mcp.md#gemini-cli) for the current AgentLoopKit server entry.
