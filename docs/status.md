# Status Command

`agentloop status` shows the current repo-level engineering loop state without running checks.

It reads:

- `agentloop.config.json`
- latest task contract in `.agentloop/tasks/`
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

The command suggests one next action:

- `agentloop create-task` when no task contract exists
- `agentloop verify` when a task exists without verification evidence
- `agentloop verify` when the latest verification report failed
- `agentloop handoff` when task evidence exists and the working tree has changes

`status` does not execute project commands, read `.env` contents, call an LLM, or make network requests.
