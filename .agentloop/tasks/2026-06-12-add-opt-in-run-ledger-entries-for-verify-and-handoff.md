# Add opt-in run ledger entries for verify and handoff

- Created date: 2026-06-12
- Task type: feature
- Status: done

## Problem Statement
Ship writes local run records, but verify and handoff cannot create ledger entries on their own.

## Desired Outcome
Verification and handoff flows can write repo-local run ledger records when explicitly requested.

## Constraints
- Do not change default verify or handoff behavior.
- Do not add network calls, token reads, telemetry, or release/version changes.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop verify --write-run --json writes a verify run under .agentloop/runs.
- agentloop handoff --write-run --json writes a handoff run under .agentloop/runs.
- agentloop intent can explain file references from verify and handoff run records.

## Verification Commands
- npm test -- tests/runs.test.ts
- npm run typecheck
- npm test
- npm run build

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Touches CLI JSON shape when --write-run is used and run ledger metadata types.

## Rollback Notes
Remove the --write-run flags and revert run ledger type changes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
