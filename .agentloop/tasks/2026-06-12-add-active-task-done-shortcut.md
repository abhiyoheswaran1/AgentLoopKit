# Add active task done shortcut

- Created date: 2026-06-12
- Task type: feature
- Status: review

## Problem Statement
The review-ready next action is correct but path-heavy: agents must run task status with a full task path just to mark the active task done.

## Desired Outcome
Agents can mark the active task done with a short deterministic command while existing task status behavior remains available.

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
- agentloop task done marks the active task done when no path is supplied.
- agentloop task done <path> marks an explicit task done.
- status and next can recommend the short command for clean review tasks.
- Docs describe the shortcut and keep archive as a separate action.

## Verification Commands
- npm test -- tests/task-state.test.ts tests/status.test.ts tests/next.test.ts
- npm run typecheck
- npm test

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- A shortcut command can obscure which file changed if output is not explicit.

## Rollback Notes
Remove the task done subcommand and restore status/next to the path-based task status recommendation.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
