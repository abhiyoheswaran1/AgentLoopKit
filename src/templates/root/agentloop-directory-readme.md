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
agentloop task status .agentloop/tasks/<task-file>.md in-progress
agentloop task archive .agentloop/tasks/<task-file>.md
```

Archive only after verification and handoff. The archive command moves one named Markdown file into `.agentloop/tasks/archive/` and keeps normal task lists focused.

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

## Monorepo Notes

When this repository has workspace markers, use both root and package-level checks as needed. Put package-specific verification commands in the task contract so agents and reviewers can see what the change requires.

Examples:

```bash
pnpm --filter <package> test
npm --workspace <package> test
cd packages/<name> && npm test
```

Root checks are useful when they cover the touched package. If they do not, say what was not verified in the handoff.
