# Improve active task detection

- Created date: 2026-06-09
- Task type: bugfix
- Status: done

## Problem Statement
Latest task and summary detection sort Markdown files by filename, so same-day task files can select an older task.

## Desired Outcome
Status and handoff use the most recently modified task or report, ignoring README files and using filename only as a tie-breaker.

## Constraints
- Keep detection local and deterministic
- Do not add a task database

## Non-Goals
- No task lifecycle redesign

## Assumptions
- File modification time is the best lightweight proxy for latest local task/report artifacts.
- Filename order remains useful as a deterministic tie-breaker when mtimes match.

## Likely Files or Areas
- `src/core/status.ts`
- `src/core/pr-summary.ts`
- shared artifact selection helper
- status and PR summary tests

## Files or Areas Not to Touch
- No task database
- No task lifecycle redesign
- No generated file format changes

## Acceptance Criteria
- Status selects the newest modified task when same-day filenames sort differently
- Handoff selects the newest modified task when no task path is provided
- README files are ignored when selecting latest artifacts
- Filename order breaks ties when modification times match

## Verification Commands
- npx pnpm@10.12.1 test tests/status.test.ts tests/pr-summary.test.ts
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
