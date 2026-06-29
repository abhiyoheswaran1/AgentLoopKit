# Release AgentLoopKit 0.47.1

- Created date: 2026-06-29
- Task type: release
- Status: in-progress

## Problem Statement
AgentLoopKit has a verified patch for idle ready context-budget output and release-channel docs that is not yet available in the published package.

## Desired Outcome
AgentLoopKit 0.47.1 is versioned, verified, published, and backed by post-release channel proof.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- package.json
- server.json
- CHANGELOG.md
- docs/release-status.md
- docs/npm-publishing.md
- docs/launch-checklist.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- package.json and server.json report 0.47.1.
- CHANGELOG.md has a 0.47.1 section and no real entries left under Unreleased.
- Release docs describe 0.47.1 channel state without claiming unavailable channels.
- npm, GitHub Release, GHCR, and MCP Registry proof is recorded after publish; Marketplace remains explicit if still pending.

## Verification Commands
- node scripts/prepublish-check.mjs
- npm run lint
- npm run typecheck
- npm run test:unit
- npm run test:integration
- npm run build
- npm run check:public-docs
- npm run check:links
- npm run dogfood
- npm run smoke:release
- npx --yes projscan doctor --format markdown

## Post-Verification Gates
- npm run dogfood:strict
- npx --no-install tsx src/cli/index.ts release-check --strict --redact-paths
- npx --no-install tsx src/cli/index.ts check-gates --strict --redact-paths

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Release work can publish irreversible external artifacts; verify every channel before claiming availability.

## Rollback Notes
Fix forward with 0.47.2 or rerun failed workflows; do not overwrite tags or publish stale artifacts.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
