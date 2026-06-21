# Release AgentLoopKit 0.38.0

- Created date: 2026-06-21
- Task type: release
- Status: in-progress

## Problem Statement
Unreleased AgentLoopKit improvements after 0.37.0 are verified and approved for release.

## Desired Outcome
Version 0.38.0 is prepared, verified, committed, tagged, pushed, published through the usual release flow, and public channel proof is captured.

## Constraints
- Do not change product behavior beyond release metadata unless verification exposes a release blocker.
- Do not include unsupported AI coding assistant positioning.
- Verify npm, GitHub release/tag, GHCR/MCP/Marketplace proof as applicable before claiming availability.

## Non-Goals
- Do not revive deferred Marketplace or package-manager backlog tasks unless the release process requires it.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- package.json
- CHANGELOG.md
- .agentloop/handoffs
- .agentloop/reports

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- package.json reports 0.38.0
- CHANGELOG.md has a 0.38.0 section and no pending Unreleased release notes for this cut
- Release verification and release-proof evidence are recorded

## Verification Commands
- npm run maintenance:check
- npx --no-install tsx src/cli/index.ts npm-status --agentloopkit

## Post-Verification Gates
- npm run dogfood:strict
- npx --no-install tsx src/cli/index.ts release-check --strict --redact-paths

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Touches package metadata, changelog, git tags, npm/GitHub release channels, and public release proof.
- Pre-existing dirty non-evidence files before task creation: 149 total; examples: `.agentloop/README.md`, `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/product-panel.md`. Confirm they belong to this task before implementation.

## Rollback Notes
If publication fails before a public release, revert release metadata and delete local tag; if publication succeeds with defects, ship a patch release.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
