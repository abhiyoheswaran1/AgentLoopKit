# Warn maintainers about stale handoff evidence

- Created date: 2026-06-13
- Task type: bugfix
- Status: done

## Problem Statement
maintainer-check currently treats any PR summary file as enough handoff evidence, even when the latest dirty files are not covered by the latest handoff or ship run.

## Desired Outcome
maintainer-check warns maintainers when reviewer handoff evidence is missing or stale for the current dirty files, while preserving pass behavior when the latest handoff or ship run covers the diff.

## Constraints
- Keep the command read-only.
- Do not cut a release or bump package version.
- Reuse existing handoff coverage helpers instead of duplicating evidence logic.

## Non-Goals
- Do not change check-gates scoring semantics.
- Do not add network, telemetry, or GitHub token handling.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/maintainer-check.ts
- tests/maintainer-check.test.ts
- docs/cli-reference.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Dirty files with only an old PR summary produce a handoff-summary warning from maintainer-check.
- Dirty files covered by the latest handoff or ship run keep handoff-summary passing.
- Archived task evidence with run-ledger coverage still works.
- CLI docs mention stale handoff coverage.

## Verification Commands
- npm test -- tests/maintainer-check.test.ts
- npm run typecheck
- npm run build

## Post-Verification Gates
- node dist/cli/index.js maintainer-check --json
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- A stricter maintainer-check may surface warnings in repos that previously had old handoff files.

## Rollback Notes
Revert the maintainer-check freshness check and related tests/docs.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
