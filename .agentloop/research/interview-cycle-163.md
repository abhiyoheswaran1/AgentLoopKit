# Interview Cycle 163

## Context

Dogfooding several autonomous tasks in one unreleased batch showed that `create-task` warns about pre-existing dirty non-evidence files, but the warning can be lost once the task moves into verification, ship, and handoff evidence. Reviewers then see a broad dirty set without a durable record of which files were already dirty when the task started.

This is simulated internal product-panel feedback plus dogfood observation. It is not real user research.

## Personas Interviewed

- Agentic Engineer Power User
- Open Source Maintainer
- Developer Experience Designer
- AI-Skeptical Senior Engineer

## Feedback Summary

The panel wanted the dirty-work baseline preserved in the task contract without adding a new schema, database, cleanup flow, or scoring model. Risk Notes are already visible in ship and PR-prep evidence, so they are the lowest-friction place to keep bounded context.

## Product Council Debate

- Lina: Long autonomous sessions need durable scope context, not only terminal warnings.
- Elias: Reviewers should see the inherited dirty-work risk in the same task evidence they already review.
- Nora: Reuse Risk Notes rather than inventing another section users must learn.
- Tom: Keep it deterministic and path-only. Do not pretend to attribute ownership.

## Decision

When `create-task` emits `DIRTY_WORKTREE_BEFORE_TASK_CREATION`, append a Risk Notes bullet with the pre-existing dirty non-evidence count and bounded path examples to the generated task contract.

## Non-Decisions

- Do not change dirty-file classification.
- Do not rename warning codes or JSON fields.
- Do not read dirty file contents.
- Do not add a task schema section or baseline database.
- Do not change ship scoring or changed-file attribution.
- Do not clean, stash, reset, archive, commit, delete, release, or publish.

## Success Criteria

- Dirty create-task JSON output keeps the existing warning and includes the baseline risk note in `task.markdown`.
- Dirty create-task human output writes the same baseline risk note into the task file.
- Clean create-task output keeps the default risk-note fallback unchanged.
- Docs say the persisted baseline is advisory and content-free.
