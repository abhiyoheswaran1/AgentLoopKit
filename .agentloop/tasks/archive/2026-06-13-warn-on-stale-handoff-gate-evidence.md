# Warn on stale handoff gate evidence

- Created date: 2026-06-13
- Task type: bugfix
- Status: done

## Problem Statement
check-gates can pass the handoff gate when any handoff file exists, even if the latest handoff run does not cover the current dirty files. That lets stale reviewer handoffs look review-ready until a human notices the next-action text.

## Desired Outcome
check-gates reports stale or uncovered handoff evidence as a warning, and strict gates fail until the current dirty files are covered by a fresh handoff run.

## Constraints
- Keep the check read-only; do not run handoff automatically.
- Do not change task, verification, or git gate semantics beyond handoff freshness.
- Do not publish, bump versions, tag, or release.

## Non-Goals
- Do not require a handoff run when the repo is clean and a handoff file exists.
- Do not parse handoff Markdown content.
- Do not add a new database or ledger format.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/check-gates.ts
- src/core/handoff-coverage.ts
- tests/check-gates.test.ts
- docs/check-gates.md
- docs/cli-reference.md
- CHANGELOG.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- With dirty files not covered by the latest handoff run, check-gates returns a handoff-summary warning.
- Strict check-gates fails for uncovered dirty handoff evidence.
- With dirty files covered by the latest handoff run, handoff-summary still passes and next action can move on.
- Clean repos with existing task, verification, and handoff evidence still pass.

## Verification Commands
- npm test -- tests/check-gates.test.ts
- npm run typecheck
- npm run build

## Post-Verification Gates
- npm run dogfood:strict
- agentloop ship --redact-paths

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- The gate is used in CI, so warnings must be precise and avoid forcing duplicate handoffs for clean repos.

## Rollback Notes
Revert the check-gates and test changes; existing handoff-found behavior returns.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
