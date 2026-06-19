# Status Command

`agentloop status` shows the current repo-level engineering loop state without running checks.

You can run it from a nested folder after root setup. AgentLoopKit searches upward for `agentloop.config.json` and reports status for that initialized root.

It reads:

- `agentloop.config.json`
- active task pointer in `.agentloop/state.json`, when present
- newest open task contract in `.agentloop/tasks/` as `latestTask` when no task is pinned
- deferred task contracts in `.agentloop/tasks/` as parked `deferredTasks`
- exact AgentFlight placeholder task contracts as preserved `agentFlightPlaceholderTasks`
- current `*-verification-report.md` in `.agentloop/reports/`
- newest local run ledger entry in `.agentloop/runs/`
- git branch, commit, root, target, and working tree status
- configured verification commands

Run:

```bash
agentloop status
```

Use JSON for scripts and agents:

```bash
agentloop status --json
```

Full JSON includes complete changed-file and task arrays for scripts that need exact local state. When an agent needs compact machine-readable status instead, combine JSON with brief mode:

```bash
agentloop status --json --brief
```

Compact JSON keeps the project, git, working-tree counts, active/latest task summary, deferred and AgentFlight placeholder counts with a small preview, latest verification and run summary, configured command names, next action, and brief text. It omits full changed-file arrays, full task arrays, and Markdown output. Use plain `agentloop status --json` when you need those complete arrays.

Use redacted path output when you plan to paste status into a public issue, PR, or CI log:

```bash
agentloop status --redact-paths
agentloop status --json --redact-paths
agentloop status --json --brief --redact-paths
agentloop next --redact-paths
agentloop next --json --redact-paths
```

`--redact-paths` replaces the absolute Git root with `[git-root]`. It keeps repo-relative AgentLoop artifact paths such as `.agentloop/reports/...`.
The default JSON output still returns the absolute Git root for scripts that need it.
Human-readable `status` and `next` output keep dynamic values inside single-line inline code. Task titles, task paths, branch names, and report paths with unusual characters stay on one Markdown line. JSON output keeps raw values for scripts.

Use brief output when an agent prompt, shell script, or status line does not need the full Markdown block:

```bash
agentloop status --brief
agentloop status --json --brief
```

Brief output includes the task, task status, verification state, newest run evidence, working tree state, next command, and reason.
When the working tree is dirty, status keeps the total changed-file count and also separates non-evidence files from generated AgentLoop and AgentFlight evidence files. This is informational only; it does not delete, archive, or hide files from JSON.

Use the smaller next-action command when you do not need the full status block:

```bash
agentloop next
agentloop next --json
agentloop next --redact-paths
```

`agentloop next` reads the same local evidence and returns the same recommended command as `status`. Dirty working-tree output also separates non-evidence files from generated AgentLoop evidence without hiding, deleting, or archiving either group. It does not run project checks, write `.agentloop/state.json`, read `.env` contents, call an LLM, or make network requests.
With `--json`, `status` and `next` return a `CONFIG_ERROR` object when `agentloop.config.json` is missing or invalid.

`agentloop create-task` sets the new task as active. Switch the active task manually when needed:

```bash
agentloop task list
agentloop task show .agentloop/tasks/2026-06-09-add-settings-page.md
agentloop task show .agentloop/tasks/2026-06-09-add-settings-page.md --redact-paths
agentloop task set .agentloop/tasks/2026-06-09-add-settings-page.md
agentloop task status .agentloop/tasks/2026-06-09-add-settings-page.md in-progress
agentloop task done
agentloop task archive .agentloop/tasks/2026-06-09-add-settings-page.md
agentloop task archive --status done --dry-run
agentloop task archive --status done
agentloop task doctor
agentloop task doctor --redact-paths
agentloop task current --json
agentloop task clear
```

Human `agentloop task list` output prints ordinary task contracts first and then a bounded preview of exact AgentFlight placeholder contracts in a separate preserved section. When more than five placeholders exist, the human output reports the hidden count and points to `agentloop task list --json`. JSON returns the complete flat `tasks` array plus grouped `taskContracts` and `agentFlightPlaceholders` arrays with the same task object shape. Use `agentloop task list --json --brief` when an agent needs compact counts and bounded previews instead of full arrays. Task objects include paths, titles, statuses, active markers, modification times, and `source` for exact AgentFlight placeholder contracts without changing repo state.
`agentloop task show --json` returns one task contract's metadata and Markdown content without changing repo state. Use `agentloop task show --redact-paths` before sharing a contract body publicly; it redacts the local Git root from displayed content only.
`agentloop task status --json` updates only the task contract's `- Status:` line. Status is not verification evidence.
`agentloop task done --json` marks the active task `done`. Pass a path when you need to finish a task that is not active.
`agentloop task archive --json` moves one named contract into `.agentloop/tasks/archive/`, preserves Markdown content, refuses collisions, and clears the active pointer if needed. `agentloop task archive --status done --dry-run` previews a batch cleanup; `agentloop task archive --status done` archives finished contracts and leaves parked or active tasks alone.
`agentloop task doctor --json` checks for stale active task pointers, missing, legacy, unsupported, and terminal statuses in the active task directory without writing state. It also warns when a task contract lists likely post-verification gates under `Verification Commands`, or when an open task contract still contains placeholder text in review-critical sections. Exact AgentFlight placeholder contracts are preserved as session evidence and do not trigger ordinary placeholder-section diagnostics. `deferred` tasks stay parked and do not trigger placeholder warnings unless `.agentloop/state.json` still points at one as active work. After a task is verified, handed off, marked done, and archived, doctor accepts the latest run ledger entry as closed-task evidence when it still points to that archived terminal task and no open task is waiting. `--redact-paths` is accepted in human and JSON modes for consistency with other shareable evidence commands; task-doctor paths are already repo-relative.

## Recovering Stale Task State

Run `agentloop task doctor` when an agent reports old task context, when `.agentloop/state.json` points at a missing or archived task, when it still points at a deferred task, or when recent reports exist without a current active or archived task contract.

AgentLoopKit keeps this recovery check bounded. It reads the active task pointer, a capped set of current task files, recent run metadata, and recent verification report filenames. It does not scan the whole repository, read `.env` files, call external services, or infer task history from arbitrary prose.

When `status` or `next` detects a stale active pointer, it recommends `agentloop task doctor` before normal loop progression. The doctor output prints compact recovery commands such as `agentloop task clear`, `agentloop task set <path>`, and `agentloop create-task` with repo-relative evidence paths only.

The command suggests one next action:

- `agentloop create-task` when no task contract exists
- `agentloop create-task` when only deferred task contracts are parked
- no required command when only deferred `release` task contracts are parked in a clean repo awaiting maintainer release approval
- `agentloop create-task` for current non-release work when only deferred `release` task contracts are parked, release work is awaiting maintainer approval, and the working tree is dirty
- `agentloop task doctor` when the active task pointer is stale or mismatched with recent AgentLoop evidence
- `agentloop task set <path>` when no active task is pinned but an open task contract exists
- `agentloop task archive <path>` when the pinned active task is already `done`
- `agentloop verify` when an in-progress task exists without verification evidence that is at least as new as the task contract
- `agentloop verify` when the latest verification report failed
- `agentloop handoff` when task evidence exists and the working tree has changes that are not covered by the latest handoff or ship run
- `agentloop task done` when task evidence, passing verification, and handoff evidence cover the current dirty files
- `agentloop task done` when the pinned active task is `review`, verification passed, and the working tree is clean

`status` and `next` do not execute project commands, read `.env` contents, call an LLM, or make network requests.
When `.agentloop/runs/` exists, `status` includes the newest run entry in Markdown, JSON, and brief output. This is local ledger metadata only. It can point to the latest `ship`, `verify --write-run`, `summarize --write-run`, or `handoff --write-run` evidence, but it does not change the next-action decision rules.
Older verification reports remain on disk, but `status` and `next` ignore them as current evidence for a newer in-progress task. Moving a task to `review` or `done` after verification does not erase the latest report from the loop state.
If a task stays pinned in `review` after verification passes and the repo becomes clean, `status` and `next` point you at `agentloop task done`. If a task stays pinned after it reaches `done`, they point you at `agentloop task archive <path>` so the next session starts clean.
After `task done` or a non-dry-run archive, the human task command output points back to `agentloop status --redact-paths`. Use that status recommendation to decide whether another handoff is needed instead of creating duplicate handoff artifacts by default.
When no active task is pinned, `status` and `next` report the newest open contract as `latestTask`, leave `activeTask` null, and recommend `agentloop task set <path>` before continuing. They keep tasks marked `deferred`, `done`, `completed`, or `verified` out of `latestTask`. Deferred tasks stay visible as parked work in `deferredTasks`. When every real deferred task contract is task type `release`, the next action names the maintainer release-approval boundary instead of presenting release work as ordinary current work. That check reads only the deferred task contracts already listed from `.agentloop/tasks/`; it does not scan the backlog or prepare a release. Exact AgentFlight placeholder contracts stay visible as preserved `agentFlightPlaceholderTasks` and do not count as parked roadmap work or fallback tasks; if one is accidentally pinned active, `status` and `next` ignore it as active work and continue to recommend setting or creating a real task. Run `agentloop task doctor --redact-paths` for the bounded recovery checklist: clear the placeholder pointer, then pin a real task or create one, while leaving the placeholder file as session evidence. If every task contract is terminal, deferred, or an AgentFlight placeholder, they recommend `agentloop create-task` instead of resurfacing old work.
Run `agentloop task doctor` when a repo has many old task files, stale status lines, placeholder contracts, or misplaced post-verification gates and you need a cleanup checklist before choosing the next task.
