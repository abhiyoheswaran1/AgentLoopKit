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

In monorepos, include package-specific verification commands when root commands do not prove the touched package. Examples include `pnpm --filter <package> test`, `npm --workspace <package> test`, or a package-local command from inside `packages/<name>`.

When several task contracts exist, pin the one in progress:

```bash
agentloop task list
agentloop task show .agentloop/tasks/<task-file>.md
agentloop task set .agentloop/tasks/<task-file>.md
agentloop task status .agentloop/tasks/<task-file>.md in-progress
agentloop task archive .agentloop/tasks/<task-file>.md
```

`agentloop task list --json` is safe for agents and scripts. It reads task files and does not create or update `.agentloop/state.json`.
`agentloop task show --json` returns one task contract's metadata and Markdown content without changing active state.
`agentloop task status --json` updates only the task contract's `- Status:` line. Supported statuses are `proposed`, `in-progress`, `blocked`, `review`, and `done`.
`agentloop task archive --json` moves one named task contract into `.agentloop/tasks/archive/` after verification and handoff. It preserves the Markdown file and refuses to overwrite an existing archive file.
