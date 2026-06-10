# Prepare 0.6.0 task show release

- Created date: 2026-06-09
- Task type: release
- Status: done

## Problem Statement
The task show command is implemented on main after the v0.5.0 tag, but package metadata still reports 0.5.0.

## Desired Outcome
Prepare a 0.6.0 release candidate with changelog, docs, verification evidence, GitHub release, and clear npm-pending notes.

## Constraints
- Do not publish to npm unless the registry accepts the authenticated publish.
- Keep release metadata aligned with the committed source.

## Non-Goals
- No new product behavior beyond release metadata and release notes.

## Assumptions
- `0.6.0` is the correct semver target because `task show` is a new CLI command.
- npm publishing may still fail until trusted publishing or local browser/OTP authentication is repaired.

## Likely Files or Areas
- package.json
- CHANGELOG.md
- README.md
- docs/launch-checklist.md
- docs/npm-publishing.md
- FINAL_HANDOFF.md
- .agentloop/backlog.md
- .agentloop/research/interview-cycle-026.md

## Files or Areas Not to Touch
- src/ CLI behavior files, unless verification exposes a release-blocking bug.

## Acceptance Criteria
- package.json reports 0.6.0
- CHANGELOG.md has a 0.6.0 entry for task show
- GitHub release v0.6.0 is created after verification

## Verification Commands
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 build
- npx pnpm@10.12.1 pack

## Implementation Plan
- Added Cycle 26 product-panel release record.
- Bumped package metadata to `0.6.0`.
- Moved task-show changelog notes into `0.6.0`.
- Updated README, launch checklist, npm publishing docs, final handoff, and backlog.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Delete v0.6.0 release/tag before npm publish if release metadata is wrong

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
