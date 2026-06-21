# Interview Cycle 156

## Context

After completing and archiving a task during a long autonomous session, AgentLoopKit correctly recommended creating the next non-release task while the working tree still contained prior source, test, docs, and evidence changes. That is acceptable for an unreleased batch, but it can make the next task's scope ambiguous if the agent forgets what is already dirty.

This is simulated internal product-panel feedback plus dogfood observation. It is not real user research.

## Personas Interviewed

- Agentic Engineer Power User
- AI-Skeptical Senior Engineer
- Security Reviewer
- Dogfood Steward

## Feedback Summary

The panel preferred an advisory warning at task creation over blocking or cleanup automation. A warning is the right moment because it catches scope contamination before implementation, while preserving maintainers' ability to batch unreleased work intentionally.

## Product Council Debate

- Lina: Agents need to know when a new task starts with existing dirty files so handoff evidence stays honest.
- Tom: Do not invent process friction; a clear warning is enough.
- Samir: Do not read file contents or offer stash/reset behavior from task creation.
- Maya: Reuse the existing warning channel and keep the Git helper small.
- Dogfood Steward: Exclude AgentLoop and AgentFlight evidence churn so normal verification artifacts do not create false positives.

## Decision

Warn from `create-task` when Git status already contains dirty non-evidence files before the task file is written. Include a bounded count and path examples in human and JSON output.

## Non-Decisions

- Do not block task creation.
- Do not read dirty file contents.
- Do not clean, stash, commit, reset, archive, or delete files.
- Do not warn for generated AgentLoop or AgentFlight evidence-only dirt.
- Do not add release or publishing work.

## Success Criteria

- Human `create-task` output warns when dirty non-evidence files predate task creation.
- JSON `create-task` output includes `DIRTY_WORKTREE_BEFORE_TASK_CREATION`.
- AgentLoop evidence-only dirty work does not trigger the warning.
- Focused create-task tests and typecheck pass.
