# Release AgentLoopKit 0.28.6 patch

- Created date: 2026-06-12
- Task type: release
- Status: in-progress

## Problem Statement
The current source includes a release-check safety fix that should ship as a small patch release after the dogfood pass.

## Desired Outcome
agentloopkit@0.28.6 is prepared, verified, tagged, released through GitHub, and published through the configured npm trusted-publishing workflow.

## Constraints
- Keep the release local-first and transparent.
- Do not use manual npm publish from this shell.

## Non-Goals
- Do not add new product features during the release task.
- Do not change release channels or distribution strategy.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- package.json
- server.json
- CHANGELOG.md
- ROADMAP.md
- docs/release-status.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- package.json and server.json both declare 0.28.6.
- CHANGELOG.md has a 0.28.6 section and no pending Unreleased entries for this release.
- Release smoke, release-check strict, dogfood strict, ProjScan, and published-package smoke pass at the appropriate stages.
- GitHub release v0.28.6 exists with notes and the npm package reports 0.28.6 latest.

## Verification Commands
- node scripts/prepublish-check.mjs
- npm test -- tests/release-check.test.ts tests/release-smoke.test.ts
- npm run typecheck
- npm run build
- npm run smoke:release

## Post-Verification Gates
- npm run dogfood:strict
- node dist/cli/index.js release-check --strict
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Release metadata can drift between package.json, server.json, changelog, roadmap, and release-status docs.

## Rollback Notes
Delete the local tag if it has not been pushed. If the GitHub release or npm package is published, follow forward with a patch rather than rewriting public history.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
