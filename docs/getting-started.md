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

`doctor` also checks `.agentloop/manifest.json`, which records the template generation used by `init`. Missing, stale, invalid, or newer manifests are warnings, not failures. See `template-migrations.md` before copying newer generated guidance into an existing repo.

`doctor` also reports potential risk files by category. For example, it can warn that migrations, auth files, deployment config, lockfiles, or env files exist and show a few path examples. Env files appear only as paths. AgentLoopKit does not read `.env` contents or scan secrets.

In monorepos, root checks do not always prove that one package was tested. Add package-specific commands to the task contract when the change lives under one workspace:

```bash
--verification "pnpm --filter web test"
--verification "npm --workspace api test"
--verification "cd packages/api && npm test"
```

AgentLoopKit records and runs the commands you configure. It does not infer package graphs or run workspace commands on its own.

For stack-specific command examples, see `stack-recipes.md`.

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

Use `--json` when an agent or script needs the created task path and Markdown content.

Pin it as the active task when the repo has multiple contracts:

```bash
npx agentloopkit task list
npx agentloopkit task show .agentloop/tasks/2026-06-09-add-settings-page.md
npx agentloopkit task set .agentloop/tasks/2026-06-09-add-settings-page.md
npx agentloopkit task status .agentloop/tasks/2026-06-09-add-settings-page.md in-progress
npx agentloopkit task current
```

Use `task status` to keep the task contract current during the loop. Supported statuses are `proposed`, `in-progress`, `blocked`, `review`, and `done`.
After verification and handoff, use `npx agentloopkit task archive <path>` to move a finished contract into `.agentloop/tasks/archive/` without deleting it.

Check the current loop state:

```bash
npx agentloopkit status
npx agentloopkit status --json
npx agentloopkit next
npx agentloopkit next --json
```

Use `next` when an agent or script only needs the next recommended command. It reads the same local evidence as `status` and does not run checks or write state.

Inspect the generated safety policies:

```bash
npx agentloopkit policy list
npx agentloopkit policy show security
npx agentloopkit policy status
```

`policy` is read-only. It prints Markdown guidance from `.agentloop/policies/` and can compare local policy files with bundled templates. It does not enforce policy, mutate policy files, or scan source code.

Optional shell completions:

```bash
npx agentloopkit completion zsh
npx agentloopkit completion bash
npx agentloopkit completion fish
npx agentloopkit completion powershell
```

These commands print scripts to stdout. AgentLoopKit does not edit shell profile files.

Ask your coding agent to read:

- `AGENTS.md`
- `AGENTLOOP.md`
- the new task contract under `.agentloop/tasks/`

After implementation:

```bash
npx agentloopkit verify
npx agentloopkit status
npx agentloopkit next
npx agentloopkit handoff
npx agentloopkit check-gates
npx agentloopkit check-gates --strict
npx agentloopkit report
npx agentloopkit badge
npx agentloopkit ci-summary
npx agentloopkit release-notes
```

`check-gates` does not run tests. It checks whether task, verification, handoff, harness, policy, and git evidence exists before review.
Use `--strict` in CI when warning gates should fail.
`report` writes a local static HTML evidence page after `verify` and `handoff`.
`badge` writes a local SVG status badge from existing verification or gate evidence.
`ci-summary` writes or prints a small CI provenance and evidence summary without running checks.
`release-notes` drafts local release notes from package metadata, changelog, git history, task, verification, and CI summary evidence without creating tags or publishing packages.

For pull request CI recipes, see `github-actions.md`.
