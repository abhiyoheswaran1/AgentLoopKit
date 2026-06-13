# Flag post-verification gate mismatches in task doctor

- Created date: 2026-06-13
- Task type: bugfix
- Status: done

## Problem Statement
Existing task contracts can still place post-verification gates such as dogfood:strict, check-gates --strict, or release-check --strict under Verification Commands, where agentloop verify runs them before fresh evidence exists.

## Desired Outcome
agentloop task doctor reports a read-only diagnostic for task contracts that put likely post-verification gates in Verification Commands instead of Post-Verification Gates.

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
- task doctor JSON includes a post-verification-gate-in-verification-commands diagnostic with flagged commands
- task doctor human output names the diagnostic and recommends moving commands to Post-Verification Gates
- existing task doctor status/count behavior remains stable

## Verification Commands
- npm test -- tests/task-state.test.ts -t "post-verification gates"
- npm test -- tests/task-state.test.ts
- npm run typecheck
- npm run build

## Post-Verification Gates
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
