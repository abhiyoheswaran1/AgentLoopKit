# Interview Cycle 23

Internal simulated feedback. Do not present this as real user research.

## Context

AgentLoopKit now supports `agentloop task set/current/clear`, and `status` plus handoffs use the pinned task. The next friction point is choosing the task to pin. Users can inspect `.agentloop/tasks/` manually, but agents and scripts need a deterministic command.

## Personas interviewed

- Claude Code Power User
- Cursor Developer
- Open Source Maintainer
- AI-Skeptical Senior Engineer
- Platform Engineer

## Feedback summary

The strongest signal is discoverability without project management. A read-only `agentloop task list` command helps users choose an active task while keeping AgentLoopKit focused on engineering loop artifacts.

## Raw simulated feedback

### Claude Code Power User

- Liked: `task set` makes long sessions stable.
- Confused: agents still need to inspect task filenames by hand.
- Needs before using it: JSON task list output.
- Would recommend/star it if: agents can choose from tasks without parsing directory listings.
- Would abandon it if: the command grows into a task board.

### Cursor Developer

- Liked: a list command fits IDE-agent workflows.
- Confused: no obvious way to see task statuses from the CLI.
- Needs before using it: compact terminal output.
- Would recommend/star it if: task state is easy to scan.
- Would abandon it if: it adds modal workflow outside the IDE.

### Open Source Maintainer

- Liked: task contracts make PR review clearer.
- Confused: contributors may pin the wrong task if several exist.
- Needs before using it: active task marker.
- Would recommend/star it if: reviewers can ask for `agentloop task list --json`.
- Would abandon it if: output hides stale or proposed tasks.

### AI-Skeptical Senior Engineer

- Liked: deterministic list output beats vague methodology.
- Confused: why task selection required filesystem browsing.
- Needs before using it: no mutation during list.
- Would recommend/star it if: the command stays boring.
- Would abandon it if: state changes when listing tasks.

### Platform Engineer

- Liked: JSON output can be used in scripts.
- Confused: task discovery was not part of the command surface.
- Needs before using it: stable schema with paths, titles, statuses, and active marker.
- Would recommend/star it if: teams can standardize agent preflight checks.
- Would abandon it if: it requires a service or database.

## Product council debate

- Abhi: This strengthens the active-task wedge without becoming project management.
- Maya: Implement it as a read-only helper in the task-state module.
- Elias: Document the command in README and status docs.
- Nora: Active task should appear first; users care about what is selected.
- Samir: Listing must not write `.agentloop/state.json`.
- Lina: Agents can run list, set, status, verify, handoff as a clean loop.
- Tom: Keep the output inspectable and deterministic.
- Rachel: Teams can use JSON output in lightweight policy checks later.

## Decision

Add `agentloop task list` with:

- Markdown-like terminal output by default.
- `--json` output with `tasks`.
- path, title, status, modified timestamp, and active boolean.
- active task first, then newest modified task files.
- read-only behavior.

## Non-decisions

- Do not add task assignment, due dates, owners, or labels.
- Do not add archive/list filters yet.
- Do not add a task board.
- Do not sync tasks outside the repo.

## Resulting tasks

- Add failing tests for core task listing and CLI JSON output.
- Implement list logic in `src/core/task-state.ts`.
- Add `agentloop task list` in `src/cli/commands/task.ts`.
- Update README, status docs, generated task README, and final handoff.
- Dogfood the command in this repo.

## Success criteria

- `agentloop task list --json` includes all task Markdown files except `README.md`.
- The active task is marked and appears first.
- Listing tasks does not create or modify `.agentloop/state.json`.
- Full local verification and CI pass.
