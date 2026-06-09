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
npx agentloopkit create-task --type feature --title "Add settings page" \
  --problem-statement "Users cannot manage account preferences" \
  --desired-outcome "Users can update settings from the app" \
  --likely-file src/settings \
  --forbidden-file migrations/ \
  --acceptance "Settings can be saved" \
  --verification "pnpm test" \
  --rollback "Remove the settings route"
```

Pin it as the active task when the repo has multiple contracts:

```bash
npx agentloopkit task set .agentloop/tasks/2026-06-09-add-settings-page.md
npx agentloopkit task current
```

Check the current loop state:

```bash
npx agentloopkit status
npx agentloopkit status --json
```

Ask your coding agent to read:

- `AGENTS.md`
- `AGENTLOOP.md`
- the new task contract under `.agentloop/tasks/`

After implementation:

```bash
npx agentloopkit verify
npx agentloopkit status
npx agentloopkit handoff
```
