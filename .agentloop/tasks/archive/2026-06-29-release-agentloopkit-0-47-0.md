# Release AgentLoopKit 0.47.0

- Created date: 2026-06-29
- Task type: release
- Status: done

## Problem Statement
The completed loop scorecard work needs a public release across the maintained channels.

## Desired Outcome
AgentLoopKit 0.47.0 is versioned, verified, tagged, published, and release proof is captured.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- package.json
- package-lock.json
- CHANGELOG.md
- README.md
- .agentloop

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Version metadata and changelog describe 0.47.0.
- Verification, release-check, package dry run, and dogfood gates pass before publishing.
- npm and GitHub release availability are verified after publish.

## Verification Commands
- npm run maintenance:check
- npm run lint
- npm run typecheck
- npm run test:unit
- npm run test:integration
- npm run build
- npm pack --dry-run
- npx --no-install tsx src/cli/index.ts release-check --redact-paths

## Post-Verification Gates
- npx --no-install tsx src/cli/index.ts check-gates --strict --redact-paths

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Release touches package metadata, changelog, tags, npm, and GitHub Release state.
- Pre-existing dirty non-evidence files before task creation: 26 total; examples: `.agentloop/README.md`, `.agentloop/harness/commands.md`, `AGENTLOOP.md`, `AGENTS.md`, `CHANGELOG.md`. Confirm they belong to this task before implementation.

## Rollback Notes
If publishing fails before public release, fix locally and rerun release-check. If a public release ships with a critical defect, follow with a patch release and document affected artifacts.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
