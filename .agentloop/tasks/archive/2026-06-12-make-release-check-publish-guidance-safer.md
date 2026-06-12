# Make release-check publish guidance safer

- Created date: 2026-06-12
- Task type: bugfix
- Status: done

## Problem Statement
Dogfooding 0.28.4 showed release-check can recommend npm publish from a clean post-release tree even when npm already has the current version, because release-check is local-only and cannot know registry state.

## Desired Outcome
Release-check should keep its local-only behavior but route maintainers through npm-status before any publish step so post-release runs do not give unsafe direct publish guidance.

## Constraints
- Do not add network calls to release-check.
- Keep release-check read-only.

## Non-Goals
- Do not create tags, publish packages, or call GitHub APIs.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/release-check.ts
- tests/release-check.test.ts
- docs/npm-publishing.md
- docs/release-status.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- release-check next action does not directly tell users to run npm publish without an npm-status check.
- strict release-check still passes when local release evidence is complete.
- tests cover the safer next action.

## Verification Commands
- npm test -- tests/release-check.test.ts
- npm run typecheck
- npm run build

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Release guidance is maintainer-facing and bad copy can cause duplicate publish attempts.

## Rollback Notes
Revert the release-check next-action copy and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
