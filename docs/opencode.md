# OpenCode

Install OpenCode guidance:

```bash
agentloop install-agent opencode
```

OpenCode should read `AGENTS.md`, `AGENTLOOP.md`, and the active task contract before editing.

When exact local config conventions differ, keep the generated Markdown file as the source of truth and link it from your OpenCode setup.

## Optional MCP Context

AgentLoopKit includes a read-only MCP server for local repo evidence. OpenCode config uses an `mcp` object in `opencode.json` or `opencode.jsonc`.

See [mcp.md](mcp.md#opencode) for the current AgentLoopKit server entry.
