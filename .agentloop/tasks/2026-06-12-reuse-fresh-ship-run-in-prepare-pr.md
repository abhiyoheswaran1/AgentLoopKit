# Reuse fresh ship run in prepare-pr

- Created date: 2026-06-12
- Task type: refactor
- Status: review

## Problem Statement
prepare-pr can create an extra same-minute ship run even when a fresh ship report and run already exist.

## Desired Outcome
prepare-pr reuses current fresh ship evidence when possible, keeping the run ledger cleaner without weakening review-readiness output.

## Constraints
- Keep prepare-pr local-only and deterministic.
- Do not skip readiness generation when no current ship evidence exists.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- prepare-pr --write does not create a duplicate ship run when the latest ship run already matches the active task, current verification report, and ship report.
- prepare-pr still creates or refreshes ship evidence when no usable ship report exists.

## Verification Commands
- npm test -- tests/prepare-pr.test.ts tests/runs.test.ts
- npm run typecheck
- npm test

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Changes prepare-pr evidence reuse and run-ledger behavior.

## Rollback Notes
Revert prepare-pr reuse logic and restore always-refresh behavior.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
