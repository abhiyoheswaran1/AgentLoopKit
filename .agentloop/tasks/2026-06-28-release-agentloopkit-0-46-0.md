# Release AgentLoopKit 0.46.0

- Created date: 2026-06-28
- Task type: release
- Status: in-progress

## Problem Statement
Publish the guarded loop runner, README demo updates, and loop controller guardrails across the usual AgentLoopKit release channels.

## Desired Outcome
AgentLoopKit 0.46.0 is versioned, verified, published, and backed by post-release channel proof.

## Constraints
- Do not modify ProjScan or AgentFlight repositories.
- Do not publish until release-flow, dogfood, release-check, and package smoke evidence are recorded.
- Preserve existing release-channel boundaries and document GitHub Marketplace separately if it remains manually gated.

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
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- package.json and server.json report 0.46.0.
- CHANGELOG.md has a 0.46.0 section with guarded loop runner and README demo changes.
- Release docs describe 0.46.0 channel state without claiming unavailable channels.
- npm, GitHub Release, GHCR, and MCP Registry publish proof is recorded after release workflows complete.

## Verification Commands
- npm run release-flow

## Post-Verification Gates
- npm run dogfood:strict
- npx --no-install tsx src/cli/index.ts release-check --strict
- npx --no-install tsx src/cli/index.ts release-proof

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Public channel publishing can lag after workflows; record gaps honestly and rerun proof before claiming availability.
- Pre-existing dirty non-evidence files before task creation: 21 total; examples: `.agentloop/README.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `AGENTLOOP.md`, `AGENTS.md`. Confirm they belong to this task before implementation.

## Rollback Notes
If 0.46.0 publishing fails, fix forward with 0.46.1 or rerun failed workflows; do not overwrite tags or publish stale artifacts.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
