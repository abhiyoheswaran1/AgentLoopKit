# Activate newly created task contracts

- Created date: 2026-06-12
- Task type: bugfix
- Status: review

## Problem Statement
Dogfooding showed create-task can write a new contract while the active task pointer still references an older task, causing ship and prepare-pr to use stale task context.

## Desired Outcome
create-task makes the newly created contract the active task so the main loop continues from the task the user just created.

## Constraints
- Keep task set/current commands for explicit selection.
- Do not change task archive or status validation semantics.
- Do not add prompts, telemetry, network calls, or AI calls.

## Non-Goals
- Do not remove the task set command.
- Do not infer active tasks from filenames when an explicit pointer exists.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/create-task.ts
- tests/create-task.test.ts
- docs/task-contracts.md
- docs/getting-started.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- create-task --json returns the created task and activeTask metadata.
- After create-task, task current reports the new task even when an older active task existed.
- Human create-task output names the created task and active task state.
- Docs explain that create-task activates the new task and task set can switch tasks.

## Verification Commands
- npm test -- tests/create-task.test.ts tests/task-state.test.ts
- npm run typecheck
- npm test

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Changing create-task output and JSON shape can affect scripts that parse strict output.

## Rollback Notes
Remove automatic setActiveTask call from create-task and restore the previous output shape.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
