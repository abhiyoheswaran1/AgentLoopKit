# Harden task command Markdown output

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
The agentloop task human output prints task titles, statuses, paths, and task doctor diagnostics raw, so backticks in user-controlled values can break Markdown rendering.

## Desired Outcome
Task subcommand human output uses the shared Markdown inline-code formatter for user-controlled values while JSON output remains unchanged.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/task.ts
- tests/task-state.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- task list/current/status/archive human output wraps task titles, statuses, and paths safely
- task doctor human output wraps status, diagnostic identifiers, titles, paths, messages, and recommendations safely
- JSON output for task commands is unchanged
- Regression tests cover a task title/path/status containing backticks

## Verification Commands
- npm test -- tests/task-state.test.ts
- npm run lint
- npm run typecheck
- npm test
- npm run build

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Changing CLI text can break tests and user expectations; keep labels stable and only wrap values.

## Rollback Notes
Revert the task command output formatter change and the matching tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
