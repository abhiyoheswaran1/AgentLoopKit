# Return JSON for unsupported create-task type

- Created date: 2026-06-11
- Task type: feature
- Status: done

## Problem Statement
Automation can request create-task --json, but unsupported task-type validation still emits only the human stderr error path.

## Desired Outcome
When create-task is run with --json and an unsupported --type, it exits non-zero with a parseable JSON error payload and writes no task file.

## Constraints
- Do not change the default human error output
- Do not add dependencies
- Do not bump package version
- Do not publish a release

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/create-task.ts
- tests/create-task.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Unsupported create-task --type with --json prints parseable JSON
- The JSON payload includes an error code, message, and supported task types
- The command exits non-zero and writes no task file

## Verification Commands
- npm test -- create-task
- npm test
- npm run typecheck
- npm run build

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
