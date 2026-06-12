# Task Contracts

Task contracts turn fuzzy requests into scoped work.

After root setup, `create-task` and `task` subcommands can run from nested folders. They search upward for the nearest `agentloop.config.json` and use that root's configured task directory.

Create one with:

```bash
agentloop create-task --type bugfix --title "Fix checkout redirect" \
  --problem-statement "Checkout loses the return path after login" \
  --desired-outcome "Users return to checkout after authentication" \
  --constraint "Keep route names stable" \
  --assumption "Auth callback already receives a return URL" \
  --likely-file src/auth \
  --forbidden-file migrations/ \
  --acceptance "Redirect returns users to checkout" \
  --include-config-commands \
  --verification "pnpm test" \
  --rollback "Revert the auth callback change"
```

Supported task types are `feature`, `bugfix`, `refactor`, `tests`, `test-generation`, `docs`, `release`, `security-review`, `dependency-upgrade`, and `migration`.

A contract includes:

- problem statement
- desired outcome
- constraints
- non-goals
- assumptions
- likely files
- files not to touch
- acceptance criteria
- verification commands
- rollback notes

`agentloop create-task` sets the new contract as the active task. Switch to another contract when a repo has multiple tasks:

```bash
agentloop task list
agentloop task show .agentloop/tasks/2026-06-09-fix-checkout-redirect.md
agentloop task set .agentloop/tasks/2026-06-09-fix-checkout-redirect.md
agentloop task status .agentloop/tasks/2026-06-09-fix-checkout-redirect.md in-progress
agentloop task done
agentloop task archive .agentloop/tasks/2026-06-09-fix-checkout-redirect.md
agentloop task archive --status done --dry-run
agentloop task archive --status done
agentloop task doctor
```

Use `agentloop task list --json` when an agent needs a machine-readable list of contracts before choosing the active task. The list command is read-only and does not create `.agentloop/state.json`.
Use `agentloop create-task --json` when an agent needs the created task path, Markdown content, and active-task metadata without parsing human output. If you pass `--out`, the path must be a Markdown file inside the configured task directory. AgentLoopKit resolves existing path ancestors before writing or reading task artifacts, so a symlink inside or at the configured task directory cannot redirect task files outside the repo. Invalid `--out` paths return parseable JSON errors with `requestedOut`, `tasksDir`, and `reason`.
Use `--include-config-commands` when a task should start with the repo's configured verification commands. AgentLoopKit copies non-empty `test`, `lint`, `typecheck`, and `build` commands into the contract and removes exact duplicates. It does not execute those commands while creating the task.
Use `agentloop verify --task <path> --task-commands --only-task-commands` when the contract already lists the full verification set. If a command appears in both the config and the task contract during a normal verification run, AgentLoopKit runs that exact command string once.
For unsupported `--type` values, `agentloop create-task --json` returns a parseable error with `supportedTaskTypes` and writes no task file.
Use `agentloop task show --json` when an agent needs the selected contract content in a stable schema. Invalid task paths on `show`, `set`, `status`, and `archive` return parseable JSON errors with `requestedTask`, `tasksDir`, and `reason`. Existing symlinked ancestors must still resolve inside the configured task directory and the current repo.
Use `agentloop task status --json` when an agent needs to update the contract state without hand-editing Markdown. Supported statuses are `proposed`, `in-progress`, `blocked`, `deferred`, `review`, and `done`. Unsupported status values return a parseable JSON error with `supportedStatuses` and leave the task file unchanged. Use `deferred` for parked work that should remain visible but not become `latestTask` in `status` or `next`.
Use `agentloop task done --json` to mark the active contract `done` without passing its path. Pass a path when the task is not active.
Use `agentloop task archive --json` after verification and handoff when a finished contract should leave the normal task list but remain available as Markdown history. For cleanup batches, run `agentloop task archive --status done --dry-run` first, then `agentloop task archive --status done`. Bulk archive refuses unsupported statuses and parked `deferred` tasks.
Use `agentloop task doctor --json` to find task contracts that still need status cleanup or archiving. The command is read-only and ignores files already moved into `.agentloop/tasks/archive/`.
With `--json`, missing or invalid `agentloop.config.json` files return a `CONFIG_ERROR` object for `create-task` and task subcommands. AgentLoopKit does not create task files, update task status, archive tasks, or clear active-task state when config loading fails.

Agents should use the contract as the boundary for implementation and review.
