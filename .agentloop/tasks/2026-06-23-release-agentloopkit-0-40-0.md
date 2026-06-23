# Release AgentLoopKit 0.40.0

- Created date: 2026-06-23
- Task type: release
- Status: in-progress

## Problem Statement
The Context Contract and README demo work is verified locally but unreleased. Users need it on npm, GitHub Releases, GHCR, MCP Registry, and main.

## Desired Outcome
Release AgentLoopKit 0.40.0 across the configured channels, keep main updated, and capture release proof plus website update guidance.

## Constraints
- Use the existing release workflow and do not skip release gates.
- Keep package, server metadata, changelog, and lockfile versions aligned.
- Do not claim a channel is live until current output proves it.
- Keep GitHub Marketplace publication deferred unless the existing release flow publishes or proves it.

## Non-Goals
- No unrelated product implementation beyond release prep fixes required by gates.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- package.json
- pnpm-lock.yaml
- server.json
- CHANGELOG.md
- changelog.md
- .agentloop/tasks
- .agentloop/reports
- .agentloop/handoffs

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- package.json, lockfile, server.json, CHANGELOG.md, and changelog.md reflect 0.40.0.
- Release gates pass before tagging.
- Main is pushed before tag/release publication.
- GitHub Release, npm, GHCR, and MCP Registry proof is captured after release workflows complete.
- Website update prompt is based on current live landing/docs pages.

## Verification Commands
- npm run release-flow

## Post-Verification Gates
- node dist/cli/index.js release-notes --write --redact-paths
- node dist/cli/index.js ship --redact-paths
- node dist/cli/index.js handoff --write-run --redact-paths
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Release workflows publish public artifacts. Verify channels from current command output before claiming success.
- Pre-existing dirty non-evidence files before task creation: 26 total; examples: `README.md`, `docs/assets/readme/README.md`, `docs/cli-reference.md`, `docs/mcp.md`, `src/cli/index.ts`. Confirm they belong to this task before implementation.

## Rollback Notes
If a critical release issue appears after publish, make a patch release rather than deleting public artifacts unless the maintainer explicitly approves rollback.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
