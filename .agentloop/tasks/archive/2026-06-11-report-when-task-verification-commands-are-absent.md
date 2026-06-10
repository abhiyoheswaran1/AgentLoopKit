# Report when task verification commands are absent

- Created date: 2026-06-11
- Task type: feature
- Status: done

## Problem Statement
agentloop verify --task <path> --task-commands silently behaves like no task commands were requested when the task contract has no runnable Verification Commands entries.

## Desired Outcome
Verification reports clearly state when --task-commands was requested but no task verification commands were found or readable, without changing exit behavior.

## Constraints
- Do not execute task Markdown commands unless --task-commands is present.
- Do not change default --task behavior.
- Do not bump version or publish anything.

## Non-Goals
- Do not add interactive confirmation prompts.
- Do not add command policy parsing.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/verification.ts
- tests/verification.test.ts
- README.md
- docs/verification-reports.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- When --task-commands is used with a safe task that has no commands, the report includes a clear note.
- When --task-commands is used with a task that has commands, the report does not include the no-task-commands note.
- The command remains read-safe for invalid or outside task paths.

## Verification Commands
- npx --yes pnpm@10.12.1 test tests/verification.test.ts
- npx --yes pnpm@10.12.1 typecheck

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the note rendering, tests, and docs for this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
