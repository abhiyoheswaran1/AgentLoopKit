# Prepare 0.5.0 task list release

- Created date: 2026-06-09
- Task type: release
- Status: done

## Problem Statement
The task list command is implemented on main but package metadata still says 0.4.0, which already has a GitHub release tag.

## Desired Outcome
Prepare a 0.5.0 release candidate with changelog, docs, verification evidence, GitHub release, and clear npm-pending notes.

## Constraints
- Do not publish to npm unless the registry accepts the authenticated publish.
- Keep release metadata aligned with the committed source.

## Non-Goals
- No new product behavior beyond release metadata and release notes.

## Assumptions
- `0.5.0` is the correct semver target because `task list` is a new CLI command.
- npm publishing may still fail until trusted publishing or local browser/OTP authentication is repaired.

## Likely Files or Areas
- package.json
- CHANGELOG.md
- README.md
- docs/launch-checklist.md
- docs/npm-publishing.md
- FINAL_HANDOFF.md
- .agentloop/backlog.md
- .agentloop/research/interview-cycle-024.md

## Files or Areas Not to Touch
- src/ CLI behavior files, unless verification exposes a release-blocking bug.

## Acceptance Criteria
- package.json reports 0.5.0
- CHANGELOG.md has a 0.5.0 entry for task list
- GitHub release v0.5.0 is created after verification

## Verification Commands
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 build
- npx pnpm@10.12.1 pack

## Implementation Plan
- Added Cycle 24 product-panel release record.
- Bumped package metadata to `0.5.0`.
- Moved task-list changelog notes into `0.5.0`.
- Updated README, launch checklist, npm publishing docs, final handoff, and backlog.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Delete v0.5.0 release/tag before npm publish if release metadata is wrong

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
