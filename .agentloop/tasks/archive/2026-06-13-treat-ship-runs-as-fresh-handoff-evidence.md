# Treat ship runs as fresh handoff evidence

- Created date: 2026-06-13
- Task type: bugfix
- Status: done

## Problem Statement
CLI Smoke fails after the stale-handoff gate change because review-context runs after agentloop ship and check-gates does not treat a ship run with a handoff path as fresh handoff evidence.

## Desired Outcome
A latest ship run that records a handoff path and covers the current dirty files satisfies the handoff freshness gate, so ship remains the one-command review-readiness flow.

## Constraints
- Do not weaken stale handoff warnings for runs that do not cover dirty files.
- Do not cut a release, create tags, publish packages, or change package metadata.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- review-context after ship reports passing gates when the ship run covers the current dirty files and includes handoff evidence.
- Dirty files not covered by the latest review run still produce the stale handoff warning.

## Verification Commands
- npm test -- tests/check-gates.test.ts
- npm run build

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the handoff coverage helper and test changes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
