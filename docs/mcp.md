# MCP Server

AgentLoopKit includes a read-only MCP stdio server for MCP clients that need local AgentLoopKit context.

Start it from a repository that already has AgentLoopKit initialized:

```bash
npx --yes agentloopkit@latest mcp-server
```

Example MCP client configuration:

```json
{
  "mcpServers": {
    "agentloopkit": {
      "command": "npx",
      "args": ["--yes", "agentloopkit@latest", "mcp-server"]
    }
  }
}
```

## Tools

| Tool                                   | Reads                                                                                                                                                    |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `agentloop_status`                     | Pinned active task, latest open task, parked deferred tasks, latest verification, newest run evidence, dirty state, configured commands, and next action |
| `agentloop_next`                       | Next recommended AgentLoopKit command and reason                                                                                                         |
| `agentloop_list_tasks`                 | Task contracts under the configured task directory                                                                                                       |
| `agentloop_show_active_task`           | Active task contract content                                                                                                                             |
| `agentloop_list_policies`              | Repo-local safety policy files                                                                                                                           |
| `agentloop_read_policy`                | One repo-local safety policy by name                                                                                                                     |
| `agentloop_policy_status`              | Repo-local policy template status: `current`, `modified`, `missing`, and `extra` files                                                                   |
| `agentloop_latest_verification_report` | Latest verification report metadata and Markdown content                                                                                                 |
| `agentloop_latest_ship_report`         | Latest ship/readiness report metadata and Markdown content                                                                                               |
| `agentloop_list_runs`                  | Recent local run ledger entries with bounded `limit` input                                                                                               |
| `agentloop_show_run`                   | One local run ledger entry by run id, including metadata, score JSON, changed files, and diffstat                                                        |
| `agentloop_file_intent`                | Local run ledger matches for one repo-relative file path                                                                                                 |
| `agentloop_maintainer_check`           | Local maintainer reviewability checks for AI-assisted changes                                                                                            |
| `agentloop_check_gates`                | Local review gate status for task, verification, handoff, harness, policy, and git evidence                                                              |
| `agentloop_artifacts`                  | Local artifact inventory metadata, with optional `type` and `latest` filters                                                                             |
| `agentloop_review_context`             | One reviewability snapshot that combines status, gates, policy status, artifact inventory, recent runs, and latest ship evidence                         |
| `agentloop_list_handoffs`              | Recent reviewer handoff summaries                                                                                                                        |
| `agentloop_latest_handoff`             | Latest reviewer handoff Markdown content                                                                                                                 |

## Safety

The MCP server is read-only.

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

It reads the same local AgentLoopKit files that CLI commands such as `status`, `policy`, `ship`, `runs`, and `handoff` already use.
Run ledger paths exposed through MCP use the same display-safe paths as the CLI: `.agentloop/...` for AgentLoopKit artifacts, repo-relative paths for repo files, and basenames for older outside absolute paths.
`agentloop_file_intent` reads run ledger metadata and does not read the target file contents.
`agentloop_review_context` returns metadata and scores only; it does not include full report, handoff, task, or policy Markdown bodies.

## Registry

The package includes MCP Registry metadata:

- `server.json`
- `package.json` `mcpName`
- `.github/workflows/publish-mcp.yml`

The MCP Registry publish workflow runs only after the npm publish workflow succeeds for the same version, or when a maintainer starts it manually. It verifies that the matching `agentloopkit` version exists on npm before submitting server metadata.

The workflow downloads a pinned `mcp-publisher` release and checks its SHA-256 before OIDC authentication.

MCP Registry support depends on the public registry accepting the package metadata. npm and GitHub Releases remain the primary install channels.
