# Release AgentLoopKit 0.35.0

- Created date: 2026-06-16
- Task type: release
- Status: in-progress

## Problem Statement
AgentLoopKit has completed committed maintenance, release-proof, artifact-ordering, and verification-flow work after v0.34.1. We need a fresh bug pass, release metadata, full release gate, and public release through the configured channels.

## Desired Outcome
Publish v0.35.0 through GitHub Release, npm trusted publishing, GHCR, and MCP Registry, then verify all public proof without taking on unrelated product work.

## Constraints
- Use the configured GitHub Release -> npm trusted publishing -> GHCR -> MCP Registry path.
- Do not manually publish npm unless trusted publishing fails and maintainer approval is explicit.
- Keep README and public docs user-facing; do not add internal release chatter.
- Do not add new product features during this release task.

## Non-Goals
- Do not implement deferred roadmap items.
- Do not change release channels or trusted-publishing configuration unless verification exposes a bug.

## Assumptions
- `npm run maintenance:check -- --json` must run before the version bump because it includes live `release-proof --strict` for the current public package version.

## Likely Files or Areas
- package.json
- server.json
- CHANGELOG.md
- docs/npm-publishing.md
- docs/release-status.md
- FINAL_HANDOFF.md
- .agentloop/handoffs
- .agentloop/reports

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Bug pass and release-readiness audit complete.
- package.json, server.json, CHANGELOG.md, and release docs agree on 0.35.0.
- npm run release-flow passes before publishing.
- GitHub release v0.35.0 is created with release notes and tarball asset.
- npm latest, GHCR tags, and MCP Registry metadata verify for 0.35.0.

## Verification Commands
- node scripts/prepublish-check.mjs
- npm run check:public-docs
- npm run check:links
- npm run smoke:release

## Post-Verification Gates
- npm run dogfood:strict
- npm run release-flow
- npm run smoke:published -- --version 0.35.0
- npx --no-install tsx src/cli/index.ts release-proof --strict --redact-paths

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Release automation can fail after GitHub release if npm trusted publishing, GHCR, or MCP Registry credentials/OIDC settings regress.
- Publishing a wrong version requires a corrective patch because npm versions are immutable.
- Running live release proof after the version bump but before publication is expected to fail because the new package version is not public yet.

## Rollback Notes
Before publishing, revert the release metadata commit and delete the local tag. After publishing, issue a corrective patch release rather than mutating published artifacts.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
