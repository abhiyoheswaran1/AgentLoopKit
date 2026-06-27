# Release AgentLoopKit 0.44.0

- Created date: 2026-06-27
- Task type: release
- Status: done

## Problem Statement
AgentLoopKit has unreleased Baseframe Suite Integration v1 work that needs a normal public release across the established channels.

## Desired Outcome
Version 0.44.0 is prepared, verified, committed, tagged, pushed, released through GitHub release automation, and proven across npm, GitHub Releases, GHCR, and MCP Registry.

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
- docs/distribution-channels.md
- .agentloop/handoffs
- .agentloop/reports

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- package.json, server.json, and CHANGELOG.md agree on 0.44.0
- Full local release-flow, strict dogfood, release-check, and ProjScan preflight pass before publishing
- Release commit and annotated v0.44.0 tag are pushed to origin/main
- GitHub release v0.44.0 is public with the packed tarball asset
- npm latest, GitHub Release, GHCR, and MCP Registry prove 0.44.0 after workflows finish

## Verification Commands
- npm run release-flow
- npx --yes projscan doctor --format markdown
- npm run smoke:published -- --version 0.44.0
- node dist/cli/index.js npm-status --agentloopkit --expect-current
- node dist/cli/index.js release-proof --redact-paths

## Post-Verification Gates
- npm run dogfood:strict
- node dist/cli/index.js release-check --strict --redact-paths

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Pre-existing dirty non-evidence files before task creation: 16 total; examples: `DECISIONS.md`, `README.md`, `docs/check-gates.md`, `docs/cli-reference.md`, `docs/task-contracts.md`. Confirm they belong to this task before implementation.

## Rollback Notes
If publishing has not happened, delete the local tag and revert the release metadata commit. If public channels have published, ship a corrective patch release.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
