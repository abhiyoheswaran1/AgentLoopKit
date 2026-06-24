# Release AgentLoopKit 0.41.0

- Created date: 2026-06-24
- Task type: release
- Status: done

## Problem Statement
The Start Preflight and Context Contract polish is verified locally but unreleased. Users need the new start briefing, context-budget proof, docs, and generated agent guidance through the configured public channels.

## Desired Outcome
Release AgentLoopKit 0.41.0 through the usual npm, GitHub Release, GHCR, and MCP Registry path, keep main updated, capture public proof, and provide website update guidance based on the live landing and docs pages.

## Constraints
- Use the existing release workflow and do not skip release gates.
- Review README and public docs with stop-slop before release metadata changes.
- Keep package, server metadata, changelog files, release-status docs, and lockfile versions aligned.
- Do not claim a channel is live until current output proves it.
- Keep GitHub Marketplace publication separate if the owner-side release UI checkbox remains unavailable.

## Non-Goals
- No new product implementation beyond release-prep fixes required by gates.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- package.json
- pnpm-lock.yaml
- server.json
- CHANGELOG.md
- changelog.md
- docs/npm-publishing.md
- docs/release-status.md
- docs/launch-checklist.md
- FINAL_HANDOFF.md
- AGENTLOOP.md
- AGENTS.md
- DECISIONS.md
- README.md
- ROADMAP.md
- docs/assets/readme
- docs/cli-reference.md
- docs/context.md
- docs/getting-started.md
- docs/mcp.md
- docs/policy-examples.md
- src/cli
- src/core
- src/mcp
- src/templates
- tests
- docs/superpowers/plans/2026-06-23-agentloop-start-context-router.md
- docs/superpowers/plans/2026-06-23-agentloop-start-preflight-polish.md
- docs/superpowers/specs/2026-06-23-agentloop-start-context-router-design.md
- docs/superpowers/specs/2026-06-23-agentloop-start-preflight-polish-design.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- README and public docs pass hygiene checks after stop-slop review.
- package.json, lockfile, server.json, CHANGELOG.md, and changelog.md reflect 0.41.0.
- Full local release gate passes before tagging.
- Main is committed and pushed before the release tag and GitHub Release publication.
- GitHub Release, npm, GHCR, and MCP Registry proof is captured after workflows complete, with Marketplace status recorded honestly.
- Website update prompt covers the live landing page and docs page state.

## Verification Commands
- npm run release-flow

## Post-Verification Gates
- node dist/cli/index.js release-notes --write --redact-paths
- node dist/cli/index.js release-check --strict --redact-paths
- node dist/cli/index.js ship --redact-paths
- node dist/cli/index.js handoff --write-run --redact-paths
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Release workflows publish public artifacts. Verify each channel from current command output before claiming success.
- The GitHub Marketplace listing may still require owner-side UI publication.
- Pre-existing dirty non-evidence files before task creation: 34 total; examples: `AGENTLOOP.md`, `AGENTS.md`, `DECISIONS.md`, `README.md`, `docs/assets/readme/README.md`. Confirm they belong to this task before implementation.

## Rollback Notes
If a critical issue appears after publish, ship a patch release. Do not delete public artifacts unless the maintainer explicitly approves rollback.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
