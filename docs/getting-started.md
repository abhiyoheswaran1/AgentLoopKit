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

`doctor` detects common monorepo markers such as `pnpm-workspace.yaml`, package `workspaces`, Turbo, Nx, Lerna, and Rush config files. It reports them as warnings and suggests package-specific verification commands so you can confirm whether root-level checks are enough for the task.

In monorepos, root checks do not always prove that one package was tested. Add package-specific commands to the task contract when the change lives under one workspace:

```bash
--verification "pnpm --filter web test"
--verification "npm --workspace api test"
--verification "cd packages/api && npm test"
```

AgentLoopKit records and runs the commands you configure. It does not infer package graphs or run workspace commands on its own.

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
npx agentloopkit task list
npx agentloopkit task show .agentloop/tasks/2026-06-09-add-settings-page.md
npx agentloopkit task set .agentloop/tasks/2026-06-09-add-settings-page.md
npx agentloopkit task status .agentloop/tasks/2026-06-09-add-settings-page.md in-progress
npx agentloopkit task current
```

Use `task status` to keep the task contract current during the loop. Supported statuses are `proposed`, `in-progress`, `blocked`, `review`, and `done`.

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
