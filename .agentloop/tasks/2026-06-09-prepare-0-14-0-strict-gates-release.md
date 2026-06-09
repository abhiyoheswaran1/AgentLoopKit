# Prepare 0.14.0 strict gates release

- Created date: 2026-06-09
- Task type: release
- Status: done

## Problem Statement
check-gates strict mode is on main, but package metadata, changelog, README visuals, and release notes still point at 0.13.0.

## Desired Outcome
Prepare a verified 0.14.0 GitHub release candidate for check-gates strict mode while keeping npm availability status honest.

## Constraints
- Do not claim npm 0.14.0 availability until registry proof exists
- Do not publish old intermediate versions
- Keep release focused on metadata, docs, visuals, pack verification, and GitHub release notes

## Non-Goals
- No new strict-mode behavior
- No dashboard, cloud, login, telemetry, or API calls

## Assumptions
- None recorded yet.

## Likely Files or Areas
- package.json
- CHANGELOG.md
- README.md
- docs/assets/readme
- docs/npm-publishing.md
- docs/launch-checklist.md
- FINAL_HANDOFF.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- package-version-0.14.0
- readme-visuals-refreshed-for-71-tests-and-strict-mode
- release-notes-updated

## Verification Commands
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 check:links
- npx pnpm@10.12.1 build
- npx projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the 0.14.0 metadata bump, changelog entry, README/doc changes, regenerated README assets, and release-status records.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
