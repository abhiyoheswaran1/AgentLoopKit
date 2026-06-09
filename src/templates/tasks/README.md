# Task Contracts

Create task contracts with:

```bash
agentloop create-task
agentloop create-task --type feature --title "Add settings page" \
  --problem-statement "Users cannot manage account preferences" \
  --desired-outcome "Users can update settings from the app" \
  --likely-file src/settings \
  --forbidden-file migrations/ \
  --acceptance "Settings can be saved" \
  --verification "pnpm test" \
  --rollback "Remove the settings route"
```

Task contracts turn fuzzy requests into scoped engineering work. A good contract names the desired outcome, constraints, non-goals, likely files, files not to touch, acceptance criteria, verification commands, and rollback notes.

When several task contracts exist, pin the one in progress:

```bash
agentloop task list
agentloop task set .agentloop/tasks/<task-file>.md
```

`agentloop task list --json` is safe for agents and scripts. It reads task files and does not create or update `.agentloop/state.json`.
