# Getting Started

Run AgentLoopKit inside an existing repository:

```bash
npx agentloopkit init --dry-run
npx agentloopkit init
```

Use `--dry-run` first when you want to see the planned file changes without writing them.

Then check the setup:

```bash
npx agentloopkit doctor
```

Create a task:

```bash
npx agentloopkit create-task --type feature --title "Add settings page"
```

Ask your coding agent to read:

- `AGENTS.md`
- `AGENTLOOP.md`
- the new task contract under `.agentloop/tasks/`

After implementation:

```bash
npx agentloopkit verify
npx agentloopkit summarize --write
```
