# Interview Cycle 25

Internal simulated feedback. Do not present this as real user research.

## Context

AgentLoopKit has `agentloop task list` for task discovery and `agentloop task set/current/clear` for active-task selection. The remaining friction is reading a chosen task contract. Users can open the Markdown file by hand, but agents need a deterministic read-only command that works the same way across shells and environments.

## Personas interviewed

- Claude Code Power User
- Open Source Maintainer
- AI-Skeptical Senior Engineer
- Developer Experience Designer
- Security Reviewer

## Feedback summary

The strongest signal is task-contract readability without workflow bloat. `agentloop task show <path>` gives humans and agents a safe way to inspect a contract after `task list`, while avoiding task editing, boards, assignment, or lifecycle state.

## Raw simulated feedback

### Claude Code Power User

- Liked: `task list` gives agents a stable preflight command.
- Confused: agents still need shell-specific file reads to inspect the selected task.
- Needs before using it: JSON output with content and metadata.
- Would recommend/star it if: agents can run list, show, set, status, verify, handoff.
- Would abandon it if: showing a task modifies active state.

### Open Source Maintainer

- Liked: task contracts make PR review easier.
- Confused: contributors may reference a task path without showing its contents.
- Needs before using it: copy-pasteable command output.
- Would recommend/star it if: reviewers can ask for `agentloop task show`.
- Would abandon it if: the command hides or rewrites the Markdown.

### AI-Skeptical Senior Engineer

- Liked: read-only commands are concrete and inspectable.
- Confused: why a CLI needs to do more than `cat`.
- Needs before using it: path safety and no mutation.
- Would recommend/star it if: the command rejects files outside `.agentloop/tasks`.
- Would abandon it if: it becomes a task manager.

### Developer Experience Designer

- Liked: list then show is an obvious CLI sequence.
- Confused: `task current` only helps after a task is pinned.
- Needs before using it: helpful empty and error states.
- Would recommend/star it if: text output is just the contract, not wrapper noise.
- Would abandon it if: output is too chatty for agent prompts.

### Security Reviewer

- Liked: the command can reuse existing task path validation.
- Confused: path traversal needs explicit coverage.
- Needs before using it: tests for outside-task rejection.
- Would recommend/star it if: show does not read `.env` or arbitrary files.
- Would abandon it if: the command accepts absolute paths outside the tasks directory.

## Product council debate

- Abhi: This strengthens task contracts without changing the product wedge.
- Maya: Reuse the existing task path resolver and metadata parsing.
- Elias: Document it as a read-only companion to `task list`.
- Nora: Default output should be the Markdown contract, so users can pipe or paste it.
- Samir: Reject outside paths and do not write `.agentloop/state.json`.
- Lina: Agents get a clean sequence: list, show, set, status.
- Tom: Keep it boring; no task editing.
- Rachel: Teams can standardize preflight prompts around list/show/status.

## Decision

Add `agentloop task show <path>` with:

- Markdown output by default.
- `--json` output with metadata and content.
- Existing task path safety rules.
- No state writes.

## Non-decisions

- Do not add task editing.
- Do not add task archive or status transitions.
- Do not open an editor.
- Do not sync or index task contents outside the repo.

## Resulting tasks

- Add failing tests for core task content reading and CLI JSON output.
- Implement a read-only task contract reader in `src/core/task-state.ts`.
- Add `agentloop task show <path>` in `src/cli/commands/task.ts`.
- Update README, task docs, status docs, generated harness templates, and final handoff.
- Dogfood the command in this repo.

## Success criteria

- `agentloop task show <path>` prints the task Markdown.
- `agentloop task show <path> --json` includes path, title, status, and content.
- The command rejects paths outside `.agentloop/tasks`.
- The command does not create or update `.agentloop/state.json`.
