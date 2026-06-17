# Filter task list by status

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement
Long dogfood repos can have many task contracts and AgentFlight placeholders, but agentloop task list has no status filter, so agents must scan or post-process the full list just to inspect deferred, proposed, in-progress, or done contracts.

## Desired Outcome
agentloop task list supports a read-only --status <status> filter for human and JSON output, preserving the active marker and existing placeholder grouping behavior.

## Constraints
- Keep task list read-only and deterministic.
- Do not archive, delete, mutate, or reclassify tasks while filtering.
- Preserve default task list output when --status is omitted.
- Do not change release, package metadata, dependency, or publishing behavior.

## Non-Goals
- No task search query language, broad scans outside the configured task directory, or cleanup automation.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/task.ts
- src/core/task-state.ts
- src/core/completions.ts
- tests/task-state.test.ts
- tests/completion.test.ts
- docs/cli-reference.md
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop task list --status deferred shows only deferred tasks in human output.
- agentloop task list --json --status deferred returns only deferred tasks in the tasks array and preserves existing JSON fields.
- Unsupported status values fail clearly before listing.
- Default task list output remains unchanged without --status.
- Shell completions offer supported task statuses for `task list --status` while keeping `task archive --status` limited to `done`.

## Verification Commands
- npm test -- tests/task-state.test.ts -t "task list status"
- npm test -- tests/completion.test.ts
- npm test -- tests/task-state.test.ts
- npm run build

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Status filtering touches task discovery output used by agents; keep JSON shape stable and test human plus JSON output.

## Rollback Notes
Revert the task-list status filter code, tests, and docs. Existing task contracts and state files require no migration.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
