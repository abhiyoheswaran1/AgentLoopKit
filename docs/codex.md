# Codex

Install Codex-specific repo instructions:

```bash
agentloop install-agent codex
```

To install all bundled agent instruction files:

```bash
agentloop install-agent all
```

Codex should:

- read `AGENTS.md`
- read `AGENTLOOP.md`
- inspect the active task contract
- keep changes small
- run verification
- update `DECISIONS.md` for architecture changes
- produce a handoff summary before stopping

AgentLoopKit does not replace Codex. It gives Codex a repo-local engineering loop.

## Optional MCP Context

AgentLoopKit includes a read-only MCP server for task, verification, ship, run-ledger, and handoff context. Codex MCP setup uses Codex `config.toml` entries under `mcp_servers`.

See [mcp.md](mcp.md#codex) for the current AgentLoopKit server entry.
