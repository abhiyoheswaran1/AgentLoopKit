# Prepare 0.7.0 monorepo doctor release

- Created date: 2026-06-09
- Task type: release
- Status: completed

## Problem Statement

Monorepo doctor awareness has landed after the v0.6.0 tag, but package metadata still reports 0.6.0.

## Desired Outcome

Package metadata, changelog, README, launch docs, npm docs, final handoff, and product records identify 0.7.0 as the monorepo doctor release candidate.

## Constraints

- Do not change CLI behavior in this release metadata task.
- Keep npm status honest until the registry shows 0.7.0.

## Non-Goals

- Do not publish to npm without successful trusted publishing or browser/OTP auth.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- package.json
- CHANGELOG.md
- README.md
- docs/launch-checklist.md
- docs/npm-publishing.md
- FINAL_HANDOFF.md
- .agentloop/research/
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch

- src/
- tests/

## Acceptance Criteria

- agentloop version reports 0.7.0 from source and packed tarball.
- CHANGELOG has a 0.7.0 entry for monorepo doctor awareness.
- GitHub release can be created with npm-pending notes after verification.

## Verification Commands

- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 build
- npx projscan doctor --format markdown
- npx pnpm@10.12.1 pack

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the release metadata commit if the release is not cut; if released, supersede with the next version.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
