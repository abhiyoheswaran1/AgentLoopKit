# Clean stale 0.28.0 harness release guidance

- Created date: 2026-06-12
- Task type: docs
- Status: done

## Problem Statement
The repository-local AGENTS.md and AGENTLOOP.md still tell future agents to accumulate work for the planned 0.28.0 batch even though 0.28.0 has shipped.

## Desired Outcome
Repo-local harness guidance says not to release unless the maintainer explicitly asks, without naming a stale planned version.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- AGENTS.md
- AGENTLOOP.md
- tests/release-smoke.test.ts
- scripts/smoke-packed-release.mjs

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- AGENTS.md no longer mentions a planned 0.28.0 batch
- AGENTLOOP.md no longer mentions development after 0.27.0 or planned 0.28.0
- A regression test rejects stale planned-release batch wording in repo harness files

## Verification Commands
- npm test -- tests/release-smoke.test.ts
- npm run lint
- npm run typecheck
- npm test
- npm run build

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Repo-local agent guidance affects future autonomous sessions

## Rollback Notes
Revert the harness copy and release-smoke helper changes

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
