# Explain release delta readiness

- Created date: 2026-06-16
- Task type: feature
- Status: done

## Problem Statement
After a release, agentloop release-check only reports that the current version tag already exists. Maintainers need to know whether commits since the tag affect npm package contents or are only repo-local proof/docs.

## Desired Outcome
release-check reports an explainable release delta when the current version tag exists, including whether package-impacting files changed and what next action is appropriate.

## Constraints
- Keep release-check read-only.
- Do not publish, tag, or bump a version.
- Prefer existing git/package metadata helpers.

## Non-Goals
- Do not add a new release command.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/release-check.ts
- tests/release-check.test.ts
- docs/cli-reference.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Existing-version release-check output distinguishes no package-impacting changes since the tag from package-impacting changes that need a version bump.
- JSON output exposes the delta classification for agents and CI.
- Human output gives a clear next action.

## Verification Commands
- npm test -- tests/release-check.test.ts
- npm test -- tests/release-check.test.ts tests/cli-docs-drift.test.ts

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Release automation depends on release-check strict behavior, so keep the existing fail-on-existing-tag semantics for release-flow.

## Rollback Notes
Revert the release-check delta changes and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
