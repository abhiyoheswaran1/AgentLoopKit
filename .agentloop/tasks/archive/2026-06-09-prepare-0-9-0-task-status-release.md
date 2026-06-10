# Prepare 0.9.0 task status release

- Created date: 2026-06-09
- Task type: release
- Status: done

## Problem Statement

Task status transitions are implemented on main, but package metadata and release docs still point at 0.8.0.

## Desired Outcome

Prepare a verified 0.9.0 GitHub release candidate for the task status command while keeping npm availability status honest.

## Constraints

- Do not claim npm 0.9.0 availability until registry proof exists.
- Keep the release local-first and npm-safe: no postinstall, telemetry, or hidden network behavior.

## Non-Goals

- No code feature changes beyond release metadata and docs.
- No bypassing npm authentication.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- package.json
- CHANGELOG.md
- README.md
- docs/assets/readme/agentloopkit-cli.tape
- docs/launch-checklist.md
- docs/npm-publishing.md
- FINAL_HANDOFF.md

## Files or Areas Not to Touch

- src/core/task-state.ts
- src/cli/commands/task.ts

## Acceptance Criteria

- agentloop version reports 0.9.0 from source and packed CLI.
- CHANGELOG has a 0.9.0 entry for task status transitions.
- README source note and VHS tape use 0.9.0.
- Release docs keep npm status explicit and do not claim registry availability.

## Verification Commands

- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 check:links
- npx pnpm@10.12.1 build
- npx projscan doctor --format markdown
- npx pnpm@10.12.1 pack

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the version, changelog, README demo, and release documentation changes.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
