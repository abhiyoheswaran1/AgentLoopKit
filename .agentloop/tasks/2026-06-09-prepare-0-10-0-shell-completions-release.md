# Prepare 0.10.0 shell completions release

- Created date: 2026-06-09
- Task type: release
- Status: done

## Problem Statement

Shell completions landed on main after the v0.9.0 task-status release.

## Desired Outcome

Prepare a verified 0.10.0 GitHub release candidate for shell completions while keeping npm availability status honest.

## Constraints

- Do not claim npm 0.10.0 availability until registry proof exists.
- Refresh README VHS and Playwright assets from committed sources.

## Non-Goals

- Do not publish to npm automatically.
- Do not change runtime dependencies.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- package.json
- CHANGELOG.md
- README.md
- docs/assets/readme/agentloopkit-cli.tape
- docs/assets/readme/agentloopkit-cli.gif
- docs/assets/readme/showcase.html
- docs/assets/readme/verification.html
- docs/launch-checklist.md
- docs/npm-publishing.md

## Files or Areas Not to Touch

- src/core/completions.ts

## Acceptance Criteria

- agentloop version reports 0.10.0 from source and packed CLI.
- CHANGELOG has a 0.10.0 entry for shell completions.
- README source note and VHS tape use 0.10.0.
- Playwright screenshots and VHS GIF are regenerated.

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

Revert release metadata, README asset updates, changelog entry, and generated release records.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
