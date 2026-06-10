# Add task status transitions

- Created date: 2026-06-09
- Task type: feature
- Status: done

## Problem Statement

Agents can pin, list, and inspect task contracts, but they cannot update task status through the CLI. That makes the task loop harder to maintain during autonomous work.

## Desired Outcome

Add a narrow CLI command that updates the Status line in an existing task contract, validates accepted statuses, preserves the rest of the Markdown, and supports JSON output.

## Constraints

- Keep the feature local-first and Markdown-based.
- Do not introduce a task database, scheduler, or project-management surface.
- Only write inside the configured tasks directory.

## Non-Goals

- No kanban board or dashboard.
- No automatic status transitions from verify or handoff.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/task-state.ts
- src/cli/commands/task.ts
- tests/task-state.test.ts
- README.md
- docs/getting-started.md

## Files or Areas Not to Touch

- package.json

## Acceptance Criteria

- agentloop task status <path> <status> updates an existing task contract.
- Invalid statuses fail with a clear error.
- The command preserves unrelated Markdown content.
- JSON output includes the updated task metadata.

## Verification Commands

- npx pnpm@10.12.1 test tests/task-state.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the task-state and task command changes; generated task Markdown remains harmless.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
