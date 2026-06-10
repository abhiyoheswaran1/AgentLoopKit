# Prepare 0.16.0 badge release

- Created date: 2026-06-10
- Task type: release
- Status: done

## Problem Statement

AgentLoopKit has new badge behavior on main after v0.15.1, while npm currently serves 0.1.1 and public docs still describe a catch-up publish to 0.15.1.

## Desired Outcome

Prepare a verified 0.16.0 release for local evidence badges, keep the npm version jump explanation honest, publish npm if authentication succeeds, and create a GitHub release with notes.

## Constraints

- Do not reuse existing GitHub tags or publish a version whose source does not match its release tag.
- Do not claim npm availability until npm view proves it.
- Keep the release local-first, transparent, and free of telemetry/postinstall behavior.

## Non-Goals

- Do not delete or rewrite existing public GitHub releases.
- Do not backfill every npm version between 0.2.0 and 0.15.1.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- package.json
- CHANGELOG.md
- README.md
- docs/npm-publishing.md
- docs/launch-checklist.md
- docs/assets/readme/agentloopkit-cli.tape
- .agentloop/research/interview-cycle-067.md

## Files or Areas Not to Touch

- src/core/\* except if release verification exposes a bug
- tests/\* except if release verification exposes a bug

## Acceptance Criteria

- package-version-0.16.0
- changelog-0.16.0
- npm-jump-explanation-honest
- pack-and-smoke-pass
- github-release-created
- npm-publish-attempt-recorded

## Verification Commands

- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 check:links
- npx pnpm@10.12.1 build
- npx projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the release metadata/docs commit, delete GitHub release v0.16.0 if created, and do not touch already-published npm versions.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
