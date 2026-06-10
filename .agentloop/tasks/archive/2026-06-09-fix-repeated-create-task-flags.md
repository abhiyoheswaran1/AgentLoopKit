# Fix repeated create-task flags

- Created date: 2026-06-09
- Task type: bugfix
- Status: done

## Problem Statement
Repeated create-task flags such as --constraint and --acceptance keep only the last value.

## Desired Outcome
Repeated non-interactive create-task flags append all provided values to the task contract.

## Constraints
- Reuse Commander parser behavior

## Non-Goals
- No interactive prompt redesign

## Assumptions
- Commander passes the previous aggregate value to custom option parsers.
- The bug lives in CLI parsing, not task contract rendering.

## Likely Files or Areas
- `src/cli/commands/create-task.ts`
- `tests/create-task.test.ts`
- Changelog and product-panel records

## Files or Areas Not to Touch
- No interactive prompt redesign
- No task contract format changes
- No new dependencies

## Acceptance Criteria
- Repeated constraint flags are preserved
- Repeated non-goal flags are preserved
- Repeated acceptance flags are preserved
- Repeated verification command flags are preserved

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
