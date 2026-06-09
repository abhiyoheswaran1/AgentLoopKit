# AgentLoopKit Workspace

This directory contains repo-local engineering loop artifacts for coding agents and reviewers.

## Start Here

1. Read `../AGENTS.md`.
2. Read `../AGENTLOOP.md`.
3. Create or inspect a task contract:

```bash
agentloop create-task --title "Describe the next focused change" --type feature
agentloop task list
agentloop task show .agentloop/tasks/<task-file>.md
agentloop task set .agentloop/tasks/<task-file>.md
```

4. Check current loop state:

```bash
agentloop status
```

5. Run verification when work is ready:

```bash
agentloop verify
```

6. Generate a reviewer handoff:

```bash
agentloop handoff
```

## Directories

- `loops/`: task-specific workflows
- `gates/`: pass/fail checklists
- `policies/`: safety rules
- `tasks/`: task contracts
- `reports/`: verification reports
- `handoffs/`: PR summaries and reviewer briefs
- `agents/`: agent-specific instructions
- `harness/`: repo working agreement and commands
