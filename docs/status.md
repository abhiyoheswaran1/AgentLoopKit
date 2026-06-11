# Status Command

`agentloop status` shows the current repo-level engineering loop state without running checks.

You can run it from a nested folder after root setup. AgentLoopKit searches upward for `agentloop.config.json` and reports status for that initialized root.

It reads:

- `agentloop.config.json`
- active task pointer in `.agentloop/state.json`, when present
- newest open task contract in `.agentloop/tasks/` as `latestTask` when no task is pinned
- deferred task contracts in `.agentloop/tasks/` as parked `deferredTasks`
- current `*-verification-report.md` in `.agentloop/reports/`
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

Use brief output when an agent prompt, shell script, or status line does not need the full Markdown block:

```bash
agentloop status --brief
```

Brief output includes the task, task status, verification state, working tree state, next command, and reason.

Use the smaller next-action command when you do not need the full status block:

```bash
agentloop next
agentloop next --json
```

`agentloop next` reads the same local evidence and returns the same recommended command as `status`. It does not run project checks, write `.agentloop/state.json`, read `.env` contents, call an LLM, or make network requests.
With `--json`, `status` and `next` return a `CONFIG_ERROR` object when `agentloop.config.json` is invalid.

Pin the active task:

```bash
agentloop task list
agentloop task show .agentloop/tasks/2026-06-09-add-settings-page.md
agentloop task set .agentloop/tasks/2026-06-09-add-settings-page.md
agentloop task status .agentloop/tasks/2026-06-09-add-settings-page.md in-progress
agentloop task archive .agentloop/tasks/2026-06-09-add-settings-page.md
agentloop task doctor
agentloop task current --json
agentloop task clear
```

`agentloop task list --json` returns task paths, titles, statuses, active markers, and modification times without changing repo state.
`agentloop task show --json` returns one task contract's metadata and Markdown content without changing repo state.
`agentloop task status --json` updates only the task contract's `- Status:` line. Status is not verification evidence.
`agentloop task archive --json` moves one named contract into `.agentloop/tasks/archive/`, preserves Markdown content, refuses collisions, and clears the active pointer if needed.
`agentloop task doctor --json` checks for missing, legacy, unsupported, and terminal statuses in the active task directory without writing state.

The command suggests one next action:

- `agentloop create-task` when no task contract exists
- `agentloop create-task` when only deferred task contracts are parked
- `agentloop task set <path>` when no active task is pinned but an open task contract exists
- `agentloop task archive <path>` when the pinned active task is already `done`
- `agentloop verify` when an in-progress task exists without verification evidence that is at least as new as the task contract
- `agentloop verify` when the latest verification report failed
- `agentloop handoff` when task evidence exists and the working tree has changes

`status` and `next` do not execute project commands, read `.env` contents, call an LLM, or make network requests.
Older verification reports remain on disk, but `status` and `next` ignore them as current evidence for a newer in-progress task. Moving a task to `review` or `done` after verification does not erase the latest report from the loop state.
If a task stays pinned after it reaches `done`, `status` and `next` point you at `agentloop task archive <path>` so the next session starts clean.
When no active task is pinned, `status` and `next` report the newest open contract as `latestTask`, leave `activeTask` null, and recommend `agentloop task set <path>` before continuing. They keep tasks marked `deferred`, `done`, `completed`, or `verified` out of `latestTask`. Deferred tasks stay visible as parked work in `deferredTasks`. If every task contract is terminal or deferred, they recommend `agentloop create-task` instead of resurfacing old work.
Run `agentloop task doctor` when a repo has many old task files and you need a cleanup checklist before choosing the next task.
