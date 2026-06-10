# Prepare v0.21.0 release

- Created date: 2026-06-10
- Task type: release
- Status: done

## Problem Statement

Current main has unreleased next-action and publish-guard work after v0.20.0.
During release prep, `agentloop release-notes --version <version>` was also found to collide with the CLI's global `--version` flag.

## Desired Outcome

Release metadata, docs, assets, and GitHub release notes describe v0.21.0 accurately.

## Constraints

- Do not publish to npm automatically from this shell because npm auth is unavailable.
- Use normal semver: 0.21.0 follows 0.20.0.

## Non-Goals

- Do not backfill old npm versions.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- package.json
- CHANGELOG.md
- README.md
- docs/npm-publishing.md
- docs/launch-checklist.md
- docs/assets/readme/agentloopkit-cli.tape

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- package.json version is 0.21.0
- CHANGELOG has 0.21.0 section and empty Unreleased
- prepublish guard passes
- release notes support an explicit release version without colliding with the CLI version flag

## Verification Commands

- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 test tests/release-notes.test.ts
- npm publish --access public --dry-run
- npx projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert release metadata and tag if created

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
