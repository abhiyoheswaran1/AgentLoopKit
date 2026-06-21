# Interview Cycle 162

## Context

After several dogfood tasks, `agentloop next` recommended creating a new task and said existing dirty `non-AgentLoop` files would be present. The examples included local `.agentloop` product and harness files, which are not generated evidence but are still AgentLoopKit-owned files.

This is simulated internal product-panel feedback plus dogfood observation. It is not real user research.

## Personas Interviewed

- Developer Experience Designer
- Security Reviewer
- AI-Skeptical Senior Engineer
- Dogfood Steward

## Feedback Summary

The panel wanted the terminology to match the actual classifier. The command excludes generated AgentLoop/AgentFlight evidence churn, not every file under `.agentloop/`, so `non-evidence` is the precise user-facing label.

## Product Council Debate

- Nora: The wording should not contradict the examples a user can see on the next line.
- Samir: Keep the warning bounded and advisory; do not expand it into content reads or cleanup.
- Tom: Do not rename the warning code just for copy. Scripts should keep working.
- Dogfood Steward: The same term already appears in working-tree summaries, ship, gates, and maintainer-check.

## Decision

Rename dirty-work human/docs guidance from `non-AgentLoop` to `non-evidence` while preserving classification, warning codes, JSON field names, counts, path examples, and safety behavior.

## Non-Decisions

- Do not change dirty-file classification.
- Do not rename `DIRTY_WORKTREE_BEFORE_TASK_CREATION`.
- Do not add cleanup, stash, reset, archive, commit, or deletion behavior.
- Do not read dirty file contents.
- Do not release or publish.

## Success Criteria

- Human `create-task` dirty-work warnings say dirty non-evidence files.
- `status` and `next` reasons say existing dirty non-evidence files.
- Generated task README guidance uses the same terminology.
- Existing JSON warning codes and counts remain compatible.
