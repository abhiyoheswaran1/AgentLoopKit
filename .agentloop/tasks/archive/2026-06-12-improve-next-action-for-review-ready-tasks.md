# Improve next action for review-ready tasks

- Created date: 2026-06-12
- Task type: bugfix
- Status: review

## Problem Statement
Dogfooding showed status can tell agents to start a new task while the active task is still in review with clean ship evidence.

## Desired Outcome
status and next guide agents to finish or archive the active review task before starting unrelated work.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Clean repos with an active review task recommend finishing the task instead of create-task.
- Docs explain the review-ready next action.

## Verification Commands
- npm test -- tests/status.test.ts tests/task-state.test.ts
- npm run typecheck
- npm test

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Changing next-action priority can affect scripts that rely on status recommendations.

## Rollback Notes
Restore the previous clean-tree next-action branch.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
