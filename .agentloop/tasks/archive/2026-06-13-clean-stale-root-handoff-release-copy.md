# Clean stale root handoff release copy

- Created date: 2026-06-13
- Task type: docs
- Status: done

## Problem Statement
`FINAL_HANDOFF.md` is public in the repository. Its top release summary was current, but a later current publish-state block still named `0.28.3`, and the user install example still pinned `agentloopkit@0.24.5`. That makes release guidance look untrustworthy before the next larger release.

## Desired Outcome
FINAL_HANDOFF.md no longer presents old npm catch-up or release-state instructions as current guidance, and public docs hygiene catches stale root handoff version examples before release.

## Constraints
- None recorded yet.

## Non-Goals
- Do not rewrite historical changelog entries or release archaeology that is clearly historical.
- Do not bump package version, create tags, publish npm, or create a GitHub release.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- FINAL_HANDOFF.md
- scripts/public-docs-hygiene.mjs
- scripts/smoke-packed-release.mjs
- tests/release-smoke.test.ts
- CHANGELOG.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- FINAL_HANDOFF.md current publish state names 0.28.7, not 0.28.3.
- FINAL_HANDOFF.md install examples use normal npx/latest/current examples, not old 0.24.x pins.
- public docs hygiene fails if root handoff current sections reintroduce old current-release copy.

## Verification Commands
- npm run check:public-docs
- npm test -- tests/release-smoke.test.ts -t "final handoff|publish-state|public docs hygiene"
- npm run typecheck

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Root handoff is public and long; avoid deleting legitimate historical evidence while fixing current guidance.

## Rollback Notes
Revert the docs cleanup and hygiene guard if maintainers want FINAL_HANDOFF.md to remain purely chronological history.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
