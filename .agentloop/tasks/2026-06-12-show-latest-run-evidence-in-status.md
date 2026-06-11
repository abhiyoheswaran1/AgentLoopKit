# Show latest run evidence in status

- Created date: 2026-06-12
- Task type: feature
- Status: review

## Problem Statement
The acceptance-layer commands write run ledger records, but status does not surface the latest run or review-readiness score.

## Desired Outcome
Agents and maintainers can see the latest local run evidence from agentloop status without remembering to run agentloop runs first.

## Constraints
- Keep this read-only and local-only.
- Do not change default next-action decisions in this slice.
- Do not add cloud, telemetry, token handling, or release/version changes.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop status --json includes latestRun when run records exist.
- agentloop status human output shows the latest run command, score or status, and path.
- agentloop status --brief includes concise latest-run evidence.

## Verification Commands
- npm test -- tests/status.test.ts
- npm run typecheck
- npm test
- npm run build

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Changes status JSON and human output for repos with run ledger evidence.

## Rollback Notes
Remove latestRun from status output and revert docs/tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
