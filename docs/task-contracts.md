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
agentloop create-task \
  --from-projscan .baseframe/evidence/auth-password-reset-20260626-01/projscan-assessment.json \
  --acceptance "Reset tokens expire"
```

Supported task types are `feature`, `bugfix`, `refactor`, `tests`, `test-generation`, `research`, `docs`, `release`, `security-review`, `dependency-upgrade`, and `migration`.

Use `research` for local research planning and findings tasks. Research task contracts should name the research question, evidence source, privacy or consent boundary, findings, limits, and follow-up task recommendations. Simulated persona notes can support internal decisions, but do not present them as external evidence.

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
- post-verification gates
- risk notes
- rollback notes

`agentloop create-task` sets the new contract as the active task. Switch to another contract when a repo has multiple tasks:

```bash
agentloop task list
agentloop task show .agentloop/tasks/2026-06-09-fix-checkout-redirect.md
agentloop task show .agentloop/tasks/2026-06-09-fix-checkout-redirect.md --redact-paths
agentloop task set .agentloop/tasks/2026-06-09-fix-checkout-redirect.md
agentloop task status .agentloop/tasks/2026-06-09-fix-checkout-redirect.md in-progress
agentloop task done
agentloop task archive .agentloop/tasks/2026-06-09-fix-checkout-redirect.md
agentloop task archive --status done --dry-run
agentloop task archive --status done
agentloop task doctor
```

Use `agentloop task list --json` when an agent needs a machine-readable list of contracts before choosing the active task. The list command is read-only and does not create `.agentloop/state.json`.
Use `agentloop create-task --json` when an agent needs the created task path, Markdown content, active-task metadata, and optional loop guidance without parsing human output. When `.agentloop/loops/<type>.md` exists for the selected task type, JSON output includes an additive `loopGuidance` object with `taskType` and `path`; human output prints the same repo-relative path as `Loop guidance`. AgentLoopKit checks only that one implied loop file and does not run or enforce the loop. If you pass `--out`, the path must be a Markdown file inside the configured task directory. AgentLoopKit resolves existing path ancestors before writing or reading task artifacts, so a symlink inside or at the configured task directory cannot redirect task files outside the repo. Invalid `--out` paths return parseable JSON errors with `requestedOut`, `tasksDir`, and `reason`.
When Git already has dirty non-evidence files before the new task is written, `create-task` keeps creating the contract but prints a warning. JSON output includes `DIRTY_WORKTREE_BEFORE_TASK_CREATION` with a dirty-file count and bounded path examples so agents can confirm the existing work belongs to the new task before implementation. The generated contract also records a bounded Risk Notes bullet with the same count and examples so later ship or handoff evidence keeps the baseline visible. Ship reports render Risk Notes as escaped single-line prose, and PR preparation includes the same task risks. AgentLoopKit does not read dirty file contents, clean files, or block task creation for this warning.
When the generated contract still contains review-critical placeholder sections, `create-task` keeps writing the draft contract but prints a warning. JSON output includes `TASK_CONTRACT_PLACEHOLDER_SECTIONS` with the section names so agents can pause before implementation, run `agentloop task doctor`, or fill in the missing task-specific content. Fully specified contracts do not produce this warning.
When `--from-projscan` is passed, `create-task` consumes a Baseframe ProjScan assessment, creates or updates the native task, writes `.baseframe/evidence/<task-id>/agentloopkit-task.json`, and updates `.baseframe/agent-workflow.json`. ProjScan assessments do not define complete acceptance criteria. Supply `--acceptance` values when a human has defined them; otherwise the JSON contract records an explicit unknown criterion and remains draft.
Use `--include-config-commands` when a task should start with the repo's configured verification commands. AgentLoopKit copies non-empty `test`, `lint`, `typecheck`, and `build` commands into the contract and removes exact duplicates. It does not execute those commands while creating the task.
Use `agentloop verify --task <path> --task-commands --only-task-commands` when the contract already lists the full verification set. If a command appears in both the config and the task contract during a normal verification run, AgentLoopKit runs that exact command string once. If an exact configured command string runs from the task contract during task-only verification, it is omitted from the report's `Not Run` list.
For unsupported `--type` values, `agentloop create-task --json` returns a parseable error with `supportedTaskTypes` and writes no task file.
Use `agentloop task show --json` when an agent needs the selected contract content in a stable schema. Use `agentloop task show --redact-paths` before sharing a task body publicly; it redacts the local Git root from displayed Markdown content without changing the contract file. Invalid task paths on `show`, `set`, `status`, and `archive` return parseable JSON errors with `requestedTask`, `tasksDir`, and `reason`. Existing symlinked ancestors must still resolve inside the configured task directory and the current repo.
Use `agentloop task status --json` when an agent needs to update the contract state without hand-editing Markdown. Supported statuses are `proposed`, `in-progress`, `blocked`, `deferred`, `review`, and `done`. Unsupported status values return a parseable JSON error with `supportedStatuses` and leave the task file unchanged. Use `deferred` for parked work that should remain visible but not become `latestTask` in `status` or `next`.
Use `agentloop task done --json` to mark the active contract `done` without passing its path. Pass a path when the task is not active.
Use `agentloop task archive --json` after verification and handoff when a finished contract should leave the normal task list but remain available as Markdown history. For cleanup batches, run `agentloop task archive --status done --dry-run` first, then `agentloop task archive --status done`. Bulk archive refuses unsupported statuses and parked `deferred` tasks.
Use `--redact-paths` with `task set`, `task status`, `task done`, `task archive`, or `task clear` before sharing lifecycle command output. The flag redacts local roots in displayed path fields only; it does not change the task file, active pointer, archive path, or JSON field shape.
Human `task done` and non-dry-run `task archive` output points back to `agentloop status --redact-paths` before generating another handoff. Follow the status recommendation: if it asks for handoff, run `agentloop handoff --write-run`; otherwise avoid duplicate handoff artifacts and continue with the next loop step.
Use `agentloop task doctor --json` to find task contracts that still need status cleanup, archiving, placeholder cleanup, or post-verification gate cleanup. The command is read-only and ignores files already moved into `.agentloop/tasks/archive/`.
If `task doctor` reports `placeholder-task-section`, replace the named section(s) with task-specific content before an agent starts or continues implementation. The check only warns on open work: `proposed`, `in-progress`, `blocked`, or `review`. Parked `deferred` tasks can keep draft wording without blocking the active queue.
If `task doctor` reports `post-verification-gate-in-verification-commands`, move the listed command from `Verification Commands` to `Post-Verification Gates`. Verification commands should be runnable before a fresh AgentLoop report exists; post-verification gates are for commands such as `npm run dogfood:strict`, `agentloop ship`, `agentloop prepare-pr`, `agentloop check-gates`, `agentloop maintainer-check`, or `agentloop release-check --strict`. Run them through `agentloop verify --post-verification-gates` only after reviewing the task contract.
With `--json`, missing or invalid `agentloop.config.json` files return a `CONFIG_ERROR` object for `create-task` and task subcommands. AgentLoopKit does not create task files, update task status, archive tasks, or clear active-task state when config loading fails.

Agents should use the contract as the boundary for implementation and review.
