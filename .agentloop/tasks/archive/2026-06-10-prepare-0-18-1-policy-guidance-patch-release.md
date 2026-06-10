# Prepare 0.18.1 policy guidance patch release

- Created date: 2026-06-10
- Task type: release
- Status: done

## Problem Statement
Main now contains package-template and generated guidance changes after GitHub release v0.18.0, but package metadata still says 0.18.0. Publishing current main as 0.18.0 would diverge from the existing v0.18.0 release tarball.

## Desired Outcome
Package metadata, changelog, README, publishing docs, and release notes target 0.18.1 as a patch release for policy customization guidance, with verification evidence and a matching GitHub release asset.

## Constraints
- Do not add runtime behavior.
- Do not claim npm 0.18.1 is published until npm registry proof confirms it.

## Non-Goals
- Do not backfill old npm versions.
- Do not retry local npm publish without working npm auth.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- package.json
- CHANGELOG.md
- README.md
- docs/npm-publishing.md
- docs/launch-checklist.md
- docs/github-actions.md
- examples/github-actions/README.md
- FINAL_HANDOFF.md
- ROADMAP.md

## Files or Areas Not to Touch
- src/core
- src/cli

## Acceptance Criteria
- package.json reports 0.18.1.
- Release docs explain 0.18.1 as a patch for policy customization guidance.
- Verification, pack, and smoke checks pass before GitHub release.

## Verification Commands
- git diff --check
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 check:links
- npx pnpm@10.12.1 build
- npx projscan doctor --format markdown
- npm pack
- npm publish --access public --dry-run

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the patch-release commit and delete the GitHub release/tag if release verification fails before public use.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
