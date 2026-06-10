# Recommend archiving done active tasks

- Created date: 2026-06-10
- Task type: bugfix
- Status: done

## Problem Statement

When a completed task remains explicitly active, agentloop status still treats it as the active task and only recommends creating a new task. Long autonomous sessions need a clearer cleanup step so stale done tasks do not stay pinned.

## Desired Outcome

When an explicitly active task has status `done`, `agentloop status` and `agentloop next` recommend `agentloop task archive <path>` instead of only recommending a new task.

## Constraints

- Keep the command read-only; status and next must not archive automatically.
- Preserve the existing fallback behavior when there is no explicit active task.

## Non-Goals

- Do not change task status semantics.
- Do not archive old tasks automatically.

## Assumptions

- A completed explicitly active task is usually stale state that should be archived or cleared before a new task starts.

## Likely Files or Areas

- src/core/status.ts
- tests/status.test.ts

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- Status JSON returns `agentloop task archive <path>` when the explicit active task status is `done`.
- Markdown status output shows the archive command and explains that the active task is done.
- Existing clean-repo and failed-verification next-action behavior remains unchanged.

## Verification Commands

- npx --yes pnpm@10.12.1 test tests/status.test.ts
- npx --yes pnpm@10.12.1 typecheck
- npx --yes pnpm@10.12.1 lint
- npx --yes projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the status next-action change and the focused status test.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
