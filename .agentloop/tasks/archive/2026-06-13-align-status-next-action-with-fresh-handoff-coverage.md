# Align status next action with fresh handoff coverage

- Created date: 2026-06-13
- Task type: bugfix
- Status: done

## Problem Statement
status and next can recommend another handoff when dirty files are already covered by the latest handoff or ship run, while check-gates correctly reports that evidence covers the current dirty files.

## Desired Outcome
status and next use the same dirty-file handoff coverage signal as check-gates so agents get consistent next steps after a fresh handoff or ship run.

## Constraints
- Keep status and next read-only.
- Do not change check-gates semantics.
- Do not cut a release or bump package version.

## Non-Goals
- Do not redesign task selection or deferred task handling.
- Do not add new commands.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/status.ts
- tests/status.test.ts
- tests/next.test.ts
- docs/status.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- When dirty files are covered by the latest handoff or ship run, status does not ask for another handoff.
- next returns the same command and reason as status for the covered-dirty state.
- Dirty files without fresh handoff coverage still recommend agentloop handoff.
- Docs explain the covered-dirty next action.

## Verification Commands
- npm test -- tests/status.test.ts tests/next.test.ts
- npm run typecheck
- npm run build

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Changing next-action wording can affect scripts that inspect human output instead of JSON.

## Rollback Notes
Revert the status next-action change and related tests/docs.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
