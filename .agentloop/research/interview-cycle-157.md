# Interview Cycle 157

## Context

After adding a `create-task` warning for pre-existing dirty non-evidence files, dogfooding showed that `agentloop status` and `agentloop next` could still recommend `agentloop create-task` without mentioning the same scope risk. Users would only see the warning after running the next command.

This is simulated internal product-panel feedback plus dogfood observation. It is not real user research.

## Personas Interviewed

- Developer Experience Designer
- Agentic Engineer Power User
- AI-Skeptical Senior Engineer
- Dogfood Steward

## Feedback Summary

The panel wanted `status` and `next` to prepare the user for the warning without changing the command. The right behavior is clearer next-action copy, not a new gate or a cleanup workflow.

## Product Council Debate

- Nora: Next-action reasons should explain why the next command matters, especially in dirty repos.
- Lina: Agents read `next` before acting; this is where scope contamination should be visible.
- Tom: Keep the deterministic command unchanged. Do not create a second workflow just for dirty files.
- Samir: Do not read file contents or imply cleanup is automatic.
- Dogfood Steward: AgentLoop evidence-only dirt should stay excluded so verification artifacts do not create noise.

## Decision

Append dirty non-evidence guidance to `status` and `next` reasons when they recommend `agentloop create-task` in a dirty repo with no active/open task.

## Non-Decisions

- Do not change the recommended command.
- Do not block task creation.
- Do not read dirty file contents.
- Do not clean, stash, commit, reset, archive, or delete files.
- Do not warn for generated AgentLoop or AgentFlight evidence-only dirt.
- Do not add release or publishing work.

## Success Criteria

- Status JSON create-task reasons mention existing dirty non-evidence files.
- Next JSON create-task reasons mention existing dirty non-evidence files.
- Dirty release-boundary create-task guidance keeps the maintainer-approval wording.
- Clean deferred-only states still require no command.
