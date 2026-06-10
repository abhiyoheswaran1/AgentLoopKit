# Release 0.26.2 cleanup patch

- Created date: 2026-06-10
- Task type: release
- Status: done

## Problem Statement

Homebrew tap cleanup and AGENTS.md specialist roster work are on main but not published to npm or GitHub Releases.

## Desired Outcome

Publish agentloopkit@0.26.2 with the cleaned README, removed Homebrew tap/formula channel, updated AGENTS.md roster template, and verified release artifacts.

## Constraints

- Keep npm/npx as the primary install path.
- Do not recreate or mention the Homebrew tap as a supported channel.
- Use trusted publishing through GitHub release workflow.

## Non-Goals

- Do not publish to Homebrew or create a tap.
- Do not add new runtime features beyond the cleanup already merged.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- package.json
- server.json
- CHANGELOG.md
- README.md
- docs/distribution-channels.md

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- package.json and server.json report 0.26.2.
- CHANGELOG has a 0.26.2 entry and Unreleased is reset.
- Release checks pass locally before tagging.
- GitHub release v0.26.2 is created and npm latest becomes 0.26.2.

## Verification Commands

- npx --yes pnpm@10.12.1 test
- npx --yes pnpm@10.12.1 typecheck
- npx --yes pnpm@10.12.1 lint
- npx --yes pnpm@10.12.1 build
- npm run smoke:release

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Ship a 0.26.3 patch if release automation publishes bad metadata; do not delete npm versions.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
