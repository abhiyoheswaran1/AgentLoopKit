# Align check-gates next action after fresh handoff evidence

- Created date: 2026-06-13
- Task type: bugfix
- Status: done

## Problem Statement
After a fresh handoff run, agentloop status correctly points to the next task, but agentloop check-gates still prints a generic agentloop handoff next action even when the latest handoff covers the dirty evidence.

## Desired Outcome
check-gates uses the same completed-task handoff coverage decision as status, so strict dogfood no longer shows contradictory next actions after a fresh handoff.

## Constraints
- Keep gate pass/fail semantics unchanged.
- Do not hide changed files or remove gate evidence.
- Avoid duplicating complex status logic if a shared helper is practical.

## Non-Goals
- Do not add commit automation, release automation, or task scheduling.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/check-gates.ts
- src/core/status.ts
- tests/check-gates.test.ts
- tests/status.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- check-gates does not recommend another handoff when the latest handoff run covers current dirty evidence.
- check-gates still recommends handoff when unrelated dirty files are not covered by handoff evidence.
- Gate statuses and strict-mode exit behavior remain unchanged.

## Verification Commands
- npm test -- tests/check-gates.test.ts tests/status.test.ts
- npm run typecheck
- npm run build
- git diff --check

## Post-Verification Gates
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Sharing status coverage logic incorrectly could change check-gates behavior beyond next-action copy.

## Rollback Notes
Revert the check-gates next-action change and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
