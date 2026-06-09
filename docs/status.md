# Status Command

`agentloop status` shows the current repo-level engineering loop state without running checks.

It reads:

- `agentloop.config.json`
- active task pointer in `.agentloop/state.json`, when present
- newest task contract in `.agentloop/tasks/` when no active task is pinned
- latest verification report in `.agentloop/reports/`
- git branch, commit, and working tree status
- configured verification commands

Run:

```bash
agentloop status
```

Use JSON for scripts and agents:

```bash
agentloop status --json
```

Pin the active task:

```bash
agentloop task list
agentloop task show .agentloop/tasks/2026-06-09-add-settings-page.md
agentloop task set .agentloop/tasks/2026-06-09-add-settings-page.md
agentloop task status .agentloop/tasks/2026-06-09-add-settings-page.md in-progress
agentloop task archive .agentloop/tasks/2026-06-09-add-settings-page.md
agentloop task current --json
agentloop task clear
```

`agentloop task list --json` returns task paths, titles, statuses, active markers, and modification times without changing repo state.
`agentloop task show --json` returns one task contract's metadata and Markdown content without changing repo state.
`agentloop task status --json` updates only the task contract's `- Status:` line. Status is not verification evidence.
`agentloop task archive --json` moves one named contract into `.agentloop/tasks/archive/`, preserves Markdown content, refuses collisions, and clears the active pointer if needed.

The command suggests one next action:

- `agentloop create-task` when no task contract exists
- `agentloop verify` when a task exists without verification evidence
- `agentloop verify` when the latest verification report failed
- `agentloop handoff` when task evidence exists and the working tree has changes

`status` does not execute project commands, read `.env` contents, call an LLM, or make network requests.
