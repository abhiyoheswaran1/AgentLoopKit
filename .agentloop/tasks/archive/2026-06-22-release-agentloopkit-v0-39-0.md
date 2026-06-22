# Release AgentLoopKit v0.39.0

- Created date: 2026-06-22
- Task type: release
- Status: done

## Problem Statement
Unreleased Evidence Map, Guard, resume-pack, context-budget, research-task, doctor monorepo, stabilization, and README visual improvements are verified locally but not public.

## Desired Outcome
AgentLoopKit v0.39.0 is released through the usual public channels, with public docs reviewed for direct wording, CHANGELOG updated, package metadata aligned, and post-release proof captured.

## Constraints
- Run public-doc stop-slop review before release.
- Use npm/GitHub Releases as source of truth and trusted publishing for npm.
- Do not claim GitHub Marketplace is live unless release-proof verifies the Marketplace channel.
- Do not read or print secrets, npm tokens, GitHub tokens, or .env contents.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- README.md
- CHANGELOG.md
- package.json
- server.json
- docs/release-status.md
- docs/launch-checklist.md
- .agentloop/reports
- .agentloop/handoffs
- .agentloop/runs

## Files or Areas Not to Touch
- pnpm-lock.yaml

## Acceptance Criteria
- README and related public docs pass stop-slop review and include the demo GIF plus context-budget visual.
- CHANGELOG.md has v0.39.0 release notes and an empty Unreleased section.
- package.json and server.json versions match v0.39.0.
- Local release-flow and AgentLoop release evidence pass before tag/push.
- GitHub Release, npm, GHCR, and MCP Registry are verified after release workflows finish, or any unavailable channel is reported with exact proof.

## Verification Commands
- npm run release-flow
- git diff --check

## Post-Verification Gates
- npx --no-install tsx src/cli/index.ts release-check --strict --redact-paths
- npx --yes projscan doctor --format markdown
- npx --yes agentflight doctor
- npx --yes agentflight status

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Release touches package metadata and public channels; verify before push and after workflows.
- Pre-existing dirty non-evidence files before task creation: 41 total; examples: `DECISIONS.md`, `README.md`, `ROADMAP.md`, `docs/assets/readme/README.md`, `docs/assets/readme/agentloopkit-cli.gif`. Confirm they belong to this task before implementation.

## Rollback Notes
If a post-release channel fails, prefer a follow-up patch release or rerun the failed workflow. Delete tags/releases only if the maintainer explicitly chooses a rollback.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
