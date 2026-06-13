# Claude Code

Install Claude Code guidance:

```bash
agentloop install-agent claude-code
```

Multi-agent repos can install every bundled guidance file:

```bash
agentloop install-agent all
```

Claude Code should use:

- task contracts in `.agentloop/tasks/`
- harness files in `.agentloop/harness/`
- verification reports in `.agentloop/reports/`
- handoffs in `.agentloop/handoffs/`

If your Claude Code setup uses a separate instruction file, link or paste `.agentloop/agents/claude-code.md` there.

## Optional MCP Context

AgentLoopKit includes a read-only MCP server for local repo evidence. Claude Code supports project `.mcp.json` files and `claude mcp add`.

See [mcp.md](mcp.md#claude-code) for the current AgentLoopKit server entry.
