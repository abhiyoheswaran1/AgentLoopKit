# Getting Started

Run AgentLoopKit from the root of the repository you want to configure:

```bash
cd /path/to/your/repo
npx agentloopkit init --dry-run
npx agentloopkit init
```

`init` writes files into the current directory. The output shows the target folder, detected project type, package manager, Git status, Git root, configured commands, and file counts. When the target is a Git subdirectory, `init` warns that files will be written there instead of the Git root. Use `--dry-run` first when you want to see the same plan without writing files.

After setup, repo commands search upward for the nearest `agentloop.config.json`. You can run `status`, `create-task`, `verify`, and `handoff` from nested folders, and AgentLoopKit still uses the initialized root.

Do not run non-dry `init` from `~` unless you intentionally want AgentLoopKit files in your home directory. AgentLoopKit refuses that by default; pass `--force` only when you mean it.

Use local-only mode when you want the harness in your clone but do not want to commit it:

```bash
npx agentloopkit init --local-only
```

This writes the same AgentLoopKit files and adds a marked block to this clone's `.git/info/exclude`. Git ignores `.agentloop/`, `AGENTS.md`, `AGENTLOOP.md`, and `agentloop.config.json` in that clone. AgentLoopKit does not edit `.gitignore` or global Git config.
Run local-only mode inside a Git repository. If `--json` is passed and setup cannot continue, AgentLoopKit returns an error object with `mode`, `reason`, and `nextCommand`.

Then check the setup:

```bash
npx agentloopkit doctor
```

`doctor` detects common monorepo markers such as `pnpm-workspace.yaml`, package `workspaces`, Turbo, Nx, Lerna, and Rush config files. It reports them as warnings and suggests package-specific verification commands so you can confirm whether root-level checks are enough for the task.

`doctor` reports the Git root and whether the AgentLoop target is the Git root. If a parent AgentLoop config exists, `doctor` uses that initialized root even when your shell is in a nested folder.

`doctor` also checks `.agentloop/manifest.json`, which records the template generation used by `init`. Missing, stale, invalid, or newer manifests are warnings, not failures. See `template-migrations.md` before copying newer generated guidance into an existing repo.

`doctor` also reports potential risk files by category. For example, it can warn that migrations, auth files, deployment config, lockfiles, or env files exist and show a few path examples. Env files appear only as paths. AgentLoopKit does not read `.env` contents or scan secrets.
See `doctor-risk-files.md` for the exact category meanings, limits, and reviewer actions.

In monorepos, root checks do not always prove that one package was tested. Add package-specific commands to the task contract when the change lives under one workspace:

```bash
--verification "pnpm --filter web test"
--verification "npm --workspace api test"
--verification "cd packages/api && npm test"
```

AgentLoopKit records and runs the commands you configure. It does not infer package graphs or run workspace commands on its own.

For stack-specific command examples, see `stack-recipes.md`, including Next.js, React/Vite, Remix, SvelteKit, Node API, Django, FastAPI, Python, docs-only, empty-repo, and monorepo recipes.
For sensitive changes, see `security-review.md` and `../examples/security-review/README.md` for a scoped security-review task, verification report, and PR summary. AgentLoopKit records review evidence; it does not prove code is secure.
For package and lockfile changes, see `dependency-upgrades.md` and `../examples/dependency-upgrade/README.md`.

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

`create-task` sets the new contract as the active task. Use `--json` when an agent or script needs the created task path, Markdown content, and active-task metadata.

Switch to another task when the repo has multiple contracts:

```bash
npx agentloopkit task list
npx agentloopkit task show .agentloop/tasks/2026-06-09-add-settings-page.md
npx agentloopkit task set .agentloop/tasks/2026-06-09-add-settings-page.md
npx agentloopkit task status .agentloop/tasks/2026-06-09-add-settings-page.md in-progress
npx agentloopkit task doctor
npx agentloopkit task current
```

Use `task status` to keep the task contract current during the loop. Supported statuses are `proposed`, `in-progress`, `blocked`, `deferred`, `review`, and `done`. Use `deferred` for parked work that should stay in the task folder without becoming the next unpinned task.
After verification and handoff, use `npx agentloopkit task archive <path>` to move a finished contract into `.agentloop/tasks/archive/` without deleting it.
Use `task doctor` when a repo has old task files and you need a read-only cleanup checklist before choosing the next active task.

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
npx agentloopkit npm-status
```

`check-gates` does not run tests. It checks whether task, verification, handoff, task-folder hygiene, harness, policy, and git evidence exists before review.
Use `--strict` in CI when warning gates should fail.
`report` writes a local static HTML evidence page after `verify` and `handoff`.
`badge` writes a local SVG status badge from existing verification or gate evidence.
`ci-summary` writes or prints a small CI provenance and evidence summary without running checks.
`release-notes` drafts local release notes from package metadata, changelog, git history, task, verification, and CI summary evidence without creating tags or publishing packages.
`npm-status` compares local package metadata with npm registry metadata. Use it after release attempts to check whether npm latest has caught up before updating public docs.

For pull request CI recipes, see `github-actions.md`, `../examples/gitlab-ci/README.md`, and `../examples/buildkite/README.md`.
