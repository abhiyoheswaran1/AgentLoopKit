# Prepare 0.28.2 patch release

- Created date: 2026-06-12
- Task type: release
- Status: done

## Problem Statement
The task-only verification shortcut is implemented and verified, but package metadata and release docs still point at 0.28.1.

## Desired Outcome
Publish a small 0.28.2 patch release with verified package metadata, changelog, release docs, GitHub release, npm proof, and follow-on channel checks.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- package.json
- pnpm-lock.yaml
- CHANGELOG.md
- docs/release-status.md
- docs/npm-publishing.md
- FINAL_HANDOFF.md
- .agentloop/tasks
- .agentloop/reports
- .agentloop/handoffs

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- package.json version is 0.28.2 and lockfile metadata has no stale package version entry
- CHANGELOG.md has a 0.28.2 section and no real unreleased entries
- release-status, npm publishing docs, and final handoff mention the current 0.28.2 release
- release gate, packed smoke, published smoke, ProjScan, and dogfood evidence pass
- GitHub release v0.28.2 is created after push

## Verification Commands
- npm run lint
- npm run typecheck
- npm test
- npm run check:links
- npm run build
- npm run smoke:release
- npx --yes projscan doctor --format markdown
- npm run dogfood:strict
- npm publish --access public --dry-run
- npm pack --pack-destination /tmp --silent
- npm run smoke:published -- --version 0.28.2

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Release metadata drift can confuse npm and GitHub users.

## Rollback Notes
Delete the v0.28.2 GitHub release/tag only if publish workflow fails before npm publishes; otherwise follow forward with a patch release.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
