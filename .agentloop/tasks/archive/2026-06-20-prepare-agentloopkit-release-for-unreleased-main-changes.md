# Prepare AgentLoopKit 0.37.0 release

- Created date: 2026-06-20
- Task type: release
- Status: done

## Problem Statement
`main` contains unreleased package-impacting improvements after `v0.36.2`: status/next placeholder-task routing and `agentloop doctor --advisory`. Maintainers approved addressing the release metadata and cutting the next release so users can install those changes.

## Desired Outcome
`0.37.0` release metadata is prepared, verified, committed, tagged, pushed, published through the usual GitHub release workflow, and backed by local and public-channel proof. Deferred owner-only channels stay explicit and unclaimed unless their proof passes.

## Constraints
- Use npm and GitHub Releases as the source of truth.
- Keep GitHub Marketplace publication separate unless `agentloop release-proof --strict --only github-marketplace --redact-paths` passes.
- Do not read or print secrets, npm tokens, or `.env` contents.
- Keep release edits scoped to metadata, changelog, release docs, and AgentLoop evidence.
- Preserve existing deferred Marketplace and Windows package-manager task contracts.

## Non-Goals
- Do not implement new product behavior during release prep.
- Do not create a second release today after `0.37.0`.
- Do not claim GitHub Marketplace availability without owner-side UI proof.

## Assumptions
- `0.37.0` is the appropriate next version because `doctor --advisory` adds a public CLI flag.
- GitHub trusted publishing remains configured for npm.
- GitHub release workflows publish npm, GHCR, and MCP Registry metadata after the release is created.

## Likely Files or Areas
- `package.json`
- `server.json`
- `CHANGELOG.md`
- `docs/release-status.md`
- `docs/npm-publishing.md`
- `FINAL_HANDOFF.md`
- `.agentloop/reports/`
- `.agentloop/handoffs/`
- `.agentloop/runs/`

## Files or Areas Not to Touch
- `README.md`
- Runtime source changes outside release metadata unless a verification failure requires a focused fix.
- Dependency manifests except for version metadata already tracked by the package manager.

## Acceptance Criteria
- `agentloop npm-status --agentloopkit --expect-current` is recorded before bumping from `0.36.2`.
- `package.json`, `server.json`, and `CHANGELOG.md` agree on `0.37.0`.
- `CHANGELOG.md` has no real entries left under `## Unreleased`.
- `npm run release-flow` passes after release metadata is ready.
- ProjScan and AgentFlight evidence is recorded for the release session.
- Release commit and `v0.37.0` tag are pushed.
- Post-publish npm, GitHub Release, GHCR, and MCP Registry proof is recorded before availability is claimed.
- Marketplace state is reported honestly if it remains unavailable.

## Verification Commands
- `node scripts/prepublish-check.mjs`
- `npm run release-flow`
- `npx --yes projscan doctor --format markdown`
- `npx --yes agentflight doctor`

## Post-Verification Gates
- `node dist/cli/index.js release-notes --write`
- `node dist/cli/index.js ship --redact-paths`
- `node dist/cli/index.js prepare-pr --write --redact-paths`
- `npm run dogfood:strict`

## Implementation Plan
- Confirm current npm state while local metadata is still `0.36.2`.
- Move Unreleased changelog entries into `0.37.0`.
- Bump package and MCP server metadata to `0.37.0`.
- Refresh release status, npm publishing, and final handoff current-release notes.
- Run the full local release gate and fix any release-prep bugs.
- Commit, tag, push, create the GitHub release, and collect post-publish proof.

## Risk Notes
- Version metadata drift can publish a package whose release notes do not match package contents.
- Trusted publishing and downstream GHCR/MCP workflows can lag the GitHub release.
- Marketplace publication still needs the owner-only GitHub release UI checkbox and may remain 404.

## Rollback Notes
Before publishing, revert the release metadata commit. After publishing, publish a corrective patch and document the superseded release if channel proof exposes a release-blocking issue.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
