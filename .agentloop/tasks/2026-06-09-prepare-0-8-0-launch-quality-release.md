# Prepare 0.8.0 launch-quality release

- Created date: 2026-06-09
- Task type: release
- Status: proposed

## Problem Statement

Unreleased launch-quality improvements have landed after v0.7.0: monorepo guidance, actionable doctor warnings, and markdown link checking.

## Desired Outcome

Package metadata, changelog, README demo assets, launch docs, and final handoff are aligned for a v0.8.0 GitHub release while npm status remains honest.

## Constraints

- Do not claim npm 0.8.0 availability until registry proves it.
- Do not publish to npm without authentication completing.
- Keep release docs clear about the npm authorization blocker.

## Non-Goals

- Change product scope.
- Add new runtime features during the release bump.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- package.json
- CHANGELOG.md
- README.md
- docs/assets/readme/agentloopkit-cli.tape
- docs/assets/readme/agentloopkit-cli.gif
- docs/launch-checklist.md
- docs/npm-publishing.md
- FINAL_HANDOFF.md

## Files or Areas Not to Touch

- src/core/verification.ts

## Acceptance Criteria

- agentloop version reports 0.8.0 from source and packed CLI.
- CHANGELOG has a 0.8.0 entry.
- README source note and VHS tape use 0.8.0.
- Package checks, pack, and dry-run publish pass.

## Verification Commands

- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 check:links
- npx pnpm@10.12.1 build
- npm publish --access public --dry-run
- npx projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the release metadata commit and do not create the tag/release.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
