# Add task archive command

- Created date: 2026-06-09
- Task type: feature
- Status: done

## Problem Statement

Completed task contracts keep accumulating in .agentloop/tasks and stay in the normal task list after they are done.

## Desired Outcome

Add a local command that archives a task contract into .agentloop/tasks/archive while preserving the Markdown file and keeping normal task list output focused.

## Constraints

- Do not add a task database.
- Do not delete task contract content.
- Do not overwrite an existing archived task file.

## Non-Goals

- No task board, dashboard, or cloud sync.
- No bulk archive in this iteration.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/task-state.ts
- src/cli/commands/task.ts
- tests/task-state.test.ts
- README.md
- docs/getting-started.md
- src/core/completions.ts

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- agentloop task archive <path> moves a task into .agentloop/tasks/archive/.
- Archived tasks no longer appear in agentloop task list.
- Archiving the active task clears .agentloop/state.json.
- Archive refuses to overwrite an existing archive file.

## Verification Commands

- npx pnpm@10.12.1 test tests/task-state.test.ts
- npx pnpm@10.12.1 test tests/completion.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build
- npx projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the archive command, task-state helper, completion update, docs, and tests.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
