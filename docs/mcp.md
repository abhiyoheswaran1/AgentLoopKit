# MCP Server

AgentLoopKit includes a read-only MCP stdio server for MCP clients that need local AgentLoopKit context.

Start it from a repository that already has AgentLoopKit initialized:

```bash
npx --yes agentloopkit@0.26.0 mcp-server
```

Example MCP client configuration:

```json
{
  "mcpServers": {
    "agentloopkit": {
      "command": "npx",
      "args": ["--yes", "agentloopkit@0.26.0", "mcp-server"]
    }
  }
}
```

## Tools

| Tool | Reads |
| --- | --- |
| `agentloop_status` | Active task, latest verification, dirty state, configured commands, and next action |
| `agentloop_next` | Next recommended AgentLoopKit command and reason |
| `agentloop_list_tasks` | Task contracts under the configured task directory |
| `agentloop_show_active_task` | Active task contract content |
| `agentloop_list_policies` | Repo-local safety policy files |
| `agentloop_read_policy` | One repo-local safety policy by name |
| `agentloop_latest_verification_report` | Latest verification report metadata and Markdown content |
| `agentloop_list_handoffs` | Recent reviewer handoff summaries |
| `agentloop_latest_handoff` | Latest reviewer handoff Markdown content |

## Safety

The MCP server is read-only in `0.26.0`.

It does not:

- run verification commands
- edit files
- create tasks
- change task status
- archive tasks
- call external APIs
- read `.env` contents
- upload data
- publish packages or create releases

It reads the same local AgentLoopKit files that CLI commands such as `status`, `policy`, and `handoff` already use.

## Registry

The package includes MCP Registry metadata:

- `server.json`
- `package.json` `mcpName`
- `.github/workflows/publish-mcp.yml`

The MCP Registry publish workflow runs only after the npm publish workflow succeeds for the same version, or when a maintainer starts it manually. It verifies that `agentloopkit@0.26.0` exists on npm before submitting server metadata.

MCP Registry support depends on the public registry accepting the package metadata. npm and GitHub Releases remain the primary install channels.
