# Document create-task supported types in help

- Created date: 2026-06-11
- Task type: docs
- Status: done

## Problem Statement
Users should not need to trigger an unsupported type error to learn valid create-task --type values.

## Desired Outcome
The create-task help output names the supported task types directly.

## Constraints
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
- agentloop create-task --help includes the supported task type list
- Existing create-task behavior remains unchanged

## Verification Commands
- pnpm test -- create-task
- pnpm test
- pnpm typecheck
- pnpm build

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
