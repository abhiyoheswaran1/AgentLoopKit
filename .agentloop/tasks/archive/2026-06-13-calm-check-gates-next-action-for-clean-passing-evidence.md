# Calm check-gates next action for clean passing evidence

- Created date: 2026-06-13
- Task type: bugfix
- Status: done

## Problem Statement
When check-gates passes in a clean repo with task, verification, and handoff evidence, it still recommends agentloop handoff even though there is no diff to refresh.

## Desired Outcome
check-gates reports no required command for a clean repo with passing evidence, while dirty evidence states keep their current guidance.

## Constraints
- Keep gate pass/warn/fail semantics unchanged.
- Keep dirty uncovered evidence pointed at agentloop handoff.
- Keep dirty covered evidence behavior unchanged unless tests prove it is wrong.
- No package version bump or release.

## Non-Goals
- Do not change status or next behavior.
- Do not change evidence selection.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/check-gates.ts
- tests/check-gates.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- check-gates --json returns nextAction.command none when all gates pass and changedFileCount is zero.
- check-gates human output prints No command required for that state.
- Dirty passing evidence still recommends agentloop handoff unless covered by latest handoff run.

## Verification Commands
- npm test -- tests/check-gates.test.ts
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
- Changing check-gates next-action ordering could weaken review guidance for dirty work.

## Rollback Notes
Revert the check-gates next-action branch and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
