# Accept archived task evidence in gates

- Created date: 2026-06-12
- Task type: bugfix
- Status: done

## Problem Statement
After a task is verified, shipped, and archived, dogfood strict fails because check-gates no longer sees a task contract even though the latest run has task evidence.

## Desired Outcome
check-gates and dogfood strict can accept recent run task evidence when no active task remains.

## Constraints
- Do not weaken gates when there is no task evidence anywhere.
- Do not move archived task files back to the active task folder.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- check-gates passes when the latest run references an archived task and verification evidence exists.
- check-gates still fails when no active, open, or run task evidence exists.

## Verification Commands
- npm test -- tests/check-gates.test.ts
- npm run dogfood:strict
- npm run lint
- npm run typecheck
- npm run build

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Gate behavior affects release and CI confidence.

## Rollback Notes
Revert the archived run task fallback and keep active task requirement.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
