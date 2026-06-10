# Prepare 0.26.5 terminal fallback release

- Created date: 2026-06-10
- Task type: release
- Status: done

## Problem Statement
The terminal fallback bugfix is committed on main but not published to npm, GitHub Releases, GHCR, or MCP Registry.

## Desired Outcome
Publish agentloopkit 0.26.5 with release notes, trusted npm publishing, GitHub release asset, GHCR image, MCP Registry metadata, and post-release verification.

## Constraints
- Keep the release patch-scoped and do not add new features.
- Do not publish from local npm credentials; use GitHub trusted publishing.

## Non-Goals
- Do not change release-channel strategy.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- package.json
- CHANGELOG.md
- server.json
- docs/release-status.md
- docs/npm-publishing.md
- docs/launch-checklist.md
- FINAL_HANDOFF.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- package.json and server.json report 0.26.5.
- CHANGELOG has a 0.26.5 section and no unreleased entries.
- Release checks pass before tagging.
- GitHub release v0.26.5 is published with notes and tarball asset.
- npm latest resolves to 0.26.5 after trusted publishing.

## Verification Commands
- npx --yes pnpm@10.12.1 lint
- npx --yes pnpm@10.12.1 typecheck
- npx --yes pnpm@10.12.1 test
- npx --yes pnpm@10.12.1 build
- npx --yes pnpm@10.12.1 check:links
- npm run smoke:release
- npm publish --access public --dry-run
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Delete draft GitHub release/tag if created before publish; otherwise publish a patch fix.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
