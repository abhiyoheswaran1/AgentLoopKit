# Add create-task area flags

- Created date: 2026-06-09
- Task type: feature
- Status: completed

## Problem Statement
Non-interactive create-task cannot capture likely files or files not to touch even though those fields are part of the task contract.

## Desired Outcome
Add repeatable likely-file and forbidden-file flags so scripted task creation can fill every core scoping section.

## Constraints
- Keep the task Markdown format unchanged
- No new dependencies

## Non-Goals
- No interactive prompt redesign

## Assumptions
- The task contract Markdown already supports likely files and forbidden files.
- This change only needs CLI flags and docs.

## Likely Files or Areas
- `src/cli/commands/create-task.ts`
- `tests/create-task.test.ts`
- task contract docs

## Files or Areas Not to Touch
- No task Markdown format change
- No interactive prompt redesign
- No new dependency

## Acceptance Criteria
- Repeated likely-file flags appear under Likely Files or Areas
- Repeated forbidden-file flags appear under Files or Areas Not to Touch
- Existing repeated constraint, non-goal, acceptance, and verification flags still work

## Verification Commands
- npx pnpm@10.12.1 test tests/create-task.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 build

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
