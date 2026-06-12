# Release AgentLoopKit 0.28.3

- Created date: 2026-06-12
- Task type: release
- Status: in-progress

## Problem Statement
Archived-task ship and prepare-pr fixes are implemented and need a small patch release after the dogfood and logo work.

## Desired Outcome
Version 0.28.3 is tagged, published through GitHub release automation, and verified on npm with published-package smoke checks.

## Constraints
- Use npm/npx, GitHub Releases, GHCR, and MCP Registry release automation only.

## Non-Goals
- Do not add new product features during release prep.
- Do not reintroduce Homebrew release copy.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- package.json
- server.json
- CHANGELOG.md
- docs/release-status.md
- docs/npm-publishing.md
- docs/launch-checklist.md
- FINAL_HANDOFF.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- package.json, server.json, CHANGELOG.md, and release docs name 0.28.3 consistently.
- Local release gate passes before commit and tag.
- GitHub release v0.28.3 is created with release notes and tarball.
- npm latest reports 0.28.3 after trusted publishing.

## Verification Commands
- npm run lint
- npm run typecheck
- npm test
- npm run check:links
- node scripts/prepublish-check.mjs
- git diff --check
- npm run build
- npm run smoke:release
- node scripts/smoke-cli.mjs
- npx --yes projscan doctor --format markdown

## Post-Verification Gates
- npm run dogfood:strict
- npm publish --access public --dry-run
- npm pack --pack-destination /tmp --silent

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
