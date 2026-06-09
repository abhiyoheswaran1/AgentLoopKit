# Interview Cycle 21

Internal simulated feedback. Do not present this as real user research.

## Context

AgentLoopKit now has `status`, `handoff`, better task selection by modification time, and fuller non-interactive task creation. Dogfooding still shows one weak spot: "active task" is inferred from file modification time. That works for simple sessions, but it can pick the wrong task when agents edit older contracts, create multiple tasks in one day, or run handoffs after writing notes.

## Personas interviewed

- Claude Code Power User
- Open Source Maintainer
- AI-Skeptical Senior Engineer
- Small Team CTO
- Platform Engineer

## Feedback summary

The strongest signal is that users need a cheap way to name the active task. They do not need a task manager. A local pointer file with `set`, `current`, and `clear` is enough.

## Raw simulated feedback

### Claude Code Power User

- Liked: `status` and `handoff` already reduce session drift.
- Confused: the active task can change after editing task notes.
- Needs before using it: a command agents can run before starting work.
- Would recommend/star it if: autonomous sessions can lock onto the right task.
- Would abandon it if: AgentLoopKit becomes a task board.

### Open Source Maintainer

- Liked: reviewer handoffs cite a task contract.
- Confused: "latest task" can mean newest file, not the task a contributor meant.
- Needs before using it: a deterministic active task signal reviewers can inspect.
- Would recommend/star it if: PR summaries reference the intended task.
- Would abandon it if: hidden state makes reviews harder.

### AI-Skeptical Senior Engineer

- Liked: a transparent state file is inspectable.
- Confused: heuristics can look like magic when they pick the wrong task.
- Needs before using it: plain commands and no background service.
- Would recommend/star it if: task selection stays deterministic.
- Would abandon it if: the tool grows into project management.

### Small Team CTO

- Liked: teams can standardize on "set task, verify, handoff."
- Confused: unclear task selection weakens team process.
- Needs before using it: a short command people can teach juniors and agents.
- Would recommend/star it if: it improves review consistency without ceremonies.
- Would abandon it if: it requires accounts or dashboards.

### Platform Engineer

- Liked: a repo-local state file can be audited and templated.
- Confused: status fallback is useful, but teams need override control.
- Needs before using it: JSON output for automation.
- Would recommend/star it if: task selection is scriptable.
- Would abandon it if: state writes outside `.agentloop/`.

## Product council debate

- Abhi: Keep the wedge. This is a loop command, not a project management feature.
- Maya: Put state in one small core module. Keep fallback behavior.
- Elias: Make the state file boring and document it.
- Nora: The command should read like `agentloop task set`, `current`, `clear`.
- Samir: Validate paths and avoid writing outside `.agentloop`.
- Lina: Agents need this before long autonomous runs.
- Tom: Explicit beats heuristic. Make it visible in `status --json`.
- Rachel: Teams can teach this without buying process software.

## Decision

Add a minimal `agentloop task` command:

- `agentloop task set <path>`
- `agentloop task current`
- `agentloop task clear`
- `--json` for machine-readable output

Store the pointer in `.agentloop/state.json`. Use the explicit task in `status` and deterministic summaries when it exists and points to a real file. Fall back to the newest task Markdown file when no active task is set.

## Non-decisions

- Do not add task lists or boards.
- Do not add assignment, due dates, or owners.
- Do not add a daemon or watcher.
- Do not sync state to a service.
- Do not change the task contract Markdown format.

## Resulting tasks

- Add failing tests for task state helpers and CLI behavior.
- Update status and PR summary task selection to prefer explicit active task.
- Document the command in README, getting-started, status, and task-contract docs.
- Record dogfood results and verification.

## Success criteria

- `agentloop task set <path>` records a relative active task path.
- `agentloop task current --json` returns the active task.
- `agentloop task clear` removes the pointer.
- `status --json` and `handoff --json` prefer the explicit active task.
- No external service, telemetry, or database is introduced.
