# Release AgentLoopKit 0.42.0

- Created date: 2026-06-24
- Task type: release
- Status: in-progress

## Problem Statement
AgentLoopKit has user-facing Start/Context current-work fixes, agent guidance readiness checks, and template version 2 ready to publish.

## Desired Outcome
Release v0.42.0 from main through GitHub Releases, npm trusted publishing, GHCR, and MCP Registry, with post-release proof captured.

## Constraints
- Do not publish unsupported Marketplace availability; owner UI publication remains deferred unless separately completed.
- Keep release metadata, changelog, server metadata, package version, and public docs aligned to 0.42.0.
- Do not read token files or .env contents; use trusted GitHub release workflows for registry publication.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- package.json
- server.json
- CHANGELOG.md
- changelog.md
- ROADMAP.md
- docs/release-status.md
- docs/npm-publishing.md
- docs/launch-checklist.md
- FINAL_HANDOFF.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- package.json and server.json report 0.42.0.
- CHANGELOG.md has 0.42.0 entries and no real Unreleased entries.
- Local release gates pass from the release tree.
- Release commit, v0.42.0 tag, GitHub release, npm, GHCR, and MCP Registry proof are created or any channel blocker is reported.

## Verification Commands
- npm run release-flow
- npx --yes projscan doctor --format markdown

## Post-Verification Gates
- npm run dogfood:strict
- node dist/cli/index.js release-check --strict --redact-paths

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Pre-existing dirty non-evidence files before task creation: 40 total; examples: `.agentloop/README.md`, `.agentloop/harness/commands.md`, `.agentloop/manifest.json`, `AGENTLOOP.md`, `AGENTS.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Delete the v0.42.0 GitHub release/tag if publication fails before npm publish; otherwise publish a follow-up patch release.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
