# Release 0.28.7 public release notes patch

- Created date: 2026-06-12
- Task type: release
- Status: done

## Problem Statement
The logo and dogfood gate work is released in `0.28.6`, but the next release workflow still needs one small patch: concise public release notes for GitHub release pages. The repo also has stale maintainer docs that still mention `0.28.5` as the current published version. We need to ship the public release-notes mode and clean release metadata through the normal GitHub release gate.

## Desired Outcome
Publish a small patch release after the dogfood/logo work, carrying the concise public release-notes mode and fresh release metadata through the normal GitHub trusted-publishing release gate.

## Constraints
- None recorded yet.

## Non-Goals
- Do not add another product feature before this patch release is cut.
- Do not hand-publish npm from the local shell.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- package.json
- server.json
- CHANGELOG.md
- ROADMAP.md
- docs/npm-publishing.md
- docs/release-status.md
- FINAL_HANDOFF.md
- src/core/release-notes.ts
- src/cli/commands/release-notes.ts
- tests/release-notes.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- 0.28.7 package, MCP server metadata, changelog, roadmap, npm publishing docs, release status, and final handoff metadata are consistent.
- agentloop release-notes --public is included in the release and covered by tests.
- Release uses GitHub release and trusted publishing, not manual npm publish.

## Verification Commands
- node scripts/prepublish-check.mjs
- npm test -- tests/release-notes.test.ts tests/release-smoke.test.ts tests/release-check.test.ts
- npm run lint
- npm run typecheck
- npm test
- npm run check:links
- git diff --check
- npm run build
- npm run smoke:release
- npx --yes projscan doctor --format markdown

## Post-Verification Gates
- npm run dogfood:strict
- node dist/cli/index.js release-check
- After committing the release prep, run `node dist/cli/index.js release-check --strict` on the clean tree.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Release docs may drift while the package version is being prepared; smoke and release-check should catch stale metadata.

## Rollback Notes
Delete the v0.28.7 GitHub release/tag before npm publishes; after npm publishes, ship a corrective patch.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
