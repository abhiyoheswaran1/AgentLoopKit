# Align release smoke with unpinned README policy

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
Public docs now avoid hardcoded AgentLoopKit version pins, but smoke:release still requires the packed README to contain package.json's exact version.

## Desired Outcome
The release smoke script accepts an unpinned README, still rejects stale exact version pins, and keeps packed CLI smoke checks.

## Constraints
- Do not reintroduce README version pins
- Do not bump package version
- Do not publish a release

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/smoke-packed-release.mjs
- tests/release-smoke.test.ts
- docs/npm-publishing.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- README without exact version pins passes the smoke helper
- README with stale exact pins still fails
- npm run smoke:release passes

## Verification Commands
- npm test -- release-smoke
- npm run smoke:release
- npm test
- npm run typecheck
- npm run build

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
