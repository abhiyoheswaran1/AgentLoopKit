# Align check-gates active task next action

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
When an active in-progress or review task has passing verification and fresh handoff evidence covering dirty files, status recommends agentloop task done but check-gates still recommends agentloop create-task.

## Desired Outcome
check-gates recommends agentloop task done for covered dirty files on an active non-terminal task, while preserving create-task guidance for archived or completed task evidence.

## Constraints
- Do not change gate pass/warn/fail semantics or strict-mode exit codes.
- Preserve existing create-task guidance when dirty evidence belongs to archived or done task context.
- Keep JSON shape stable except for the existing nextAction values.

## Non-Goals
- Do not automatically mark tasks done or archive tasks.
- Do not change status or next command semantics.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/check-gates.ts
- tests/check-gates.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- check-gates --json returns nextAction.command agentloop task done when an active in-progress task has fresh handoff coverage for dirty files.
- Human check-gates output renders `Run agentloop task done.` for the same state.
- Archived or done task evidence that covers dirty files still recommends agentloop create-task.

## Verification Commands
- npm test -- tests/check-gates.test.ts
- npm test -- tests/check-gates.test.ts tests/status.test.ts
- npm run typecheck
- npm run lint
- npm run build
- npm test

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- This changes public next-action copy and JSON nextAction values, so tests should cover both active and archived contexts.

## Rollback Notes
Revert the check-gates next-action selection change and associated tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
