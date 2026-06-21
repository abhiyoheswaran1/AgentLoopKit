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

## Client Setup Examples

Use the same stdio server command in clients that support MCP. Run the client from a repository that already has `agentloop.config.json`, or configure the client to start the server with that repository as its working directory.

### Claude Code

Claude Code supports project-scoped MCP configuration in `.mcp.json` at the project root, plus CLI setup through `claude mcp add`.

Project `.mcp.json`:

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

Or add it with Claude Code:

```bash
claude mcp add --scope project --transport stdio agentloopkit -- npx --yes agentloopkit@latest mcp-server
```

Use project scope when you want the repo to share this read-only AgentLoopKit context. Use Claude Code local or user scope when the MCP setup should stay private to your machine.

### Cursor

Cursor supports project MCP configuration in `.cursor/mcp.json` and user-wide MCP configuration in `~/.cursor/mcp.json`.

Project `.cursor/mcp.json`:

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

### Gemini CLI

Gemini CLI stores user settings in `~/.gemini/settings.json` and workspace settings in `.gemini/settings.json`. Its MCP docs also include `gemini mcp add`; use the current Gemini CLI help when you prefer command-based setup.

Workspace `.gemini/settings.json`:

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

### OpenCode

OpenCode config uses an `mcp` object in `opencode.json` or `opencode.jsonc`.

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "agentloopkit": {
      "type": "local",
      "command": ["npx", "--yes", "agentloopkit@latest", "mcp-server"],
      "enabled": true,
    },
  },
}
```

### Codex

Codex configuration uses `config.toml` and MCP server entries under `mcp_servers`. Use the official Codex config reference for the current user and project config locations.

Example TOML:

```toml
[mcp_servers.agentloopkit]
command = "npx"
args = ["--yes", "agentloopkit@latest", "mcp-server"]
```

### Repo-Pinned Install

If the repo installs AgentLoopKit as a dev dependency, use the local binary shape when your client resolves commands from the repository:

```json
{
  "mcpServers": {
    "agentloopkit": {
      "command": "agentloop",
      "args": ["mcp-server"]
    }
  }
}
```

### Client Docs Checked

- Claude Code: <https://docs.anthropic.com/en/docs/claude-code/mcp>
- Cursor: <https://cursor.com/docs/mcp>
- Gemini CLI: <https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md>
- Gemini CLI settings: <https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/settings.md>
- OpenCode: <https://opencode.ai/docs/mcp-servers/>
- Codex config reference: <https://developers.openai.com/codex/config-reference>

Run the MCP server from a repository that already has `agentloop.config.json`. The server reads that repo's local AgentLoopKit evidence and returns display-safe paths. It does not initialize the repo for you.

Ask the agent to call read-only tools such as `agentloop_review_context`, `agentloop_status`, `agentloop_latest_ship_report`, `agentloop_list_runs`, `agentloop_file_intent`, or `agentloop_maintainer_check` before reviewing an agent-assisted change.

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
| `agentloop_maintainer_check`           | Local maintainer reviewability checks for agent-assisted changes                                                                                            |
| `agentloop_check_gates`                | Local review gate status for task, verification, handoff, harness, policy, and git evidence                                                              |
| `agentloop_artifacts`                  | Local artifact and run-ledger inventory metadata, with optional `type` and `latest` filters                                                              |
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
