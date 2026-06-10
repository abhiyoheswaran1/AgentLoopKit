# Prepare 0.23.0 PowerShell completion release

- Created date: 2026-06-10
- Task type: release
- Status: done

## Problem Statement
main now contains PowerShell completion support after the v0.22.0 GitHub release, so README and release-status tarball guidance would point users at a tarball without the documented PowerShell behavior.

## Desired Outcome
Prepare and publish a verified GitHub release candidate for agentloopkit 0.23.0 while keeping npm catch-up status honest.

## Constraints
- Do not publish to npm unless npm whoami succeeds.
- Do not backfill old npm versions from current main.
- Keep npm/npx as the primary distribution path in docs.
- Use the GitHub tarball fallback only while npm serves 0.1.1.

## Non-Goals
- Do not add new product behavior in the release-prep commit.
- Do not claim npm availability without npm registry proof.

## Assumptions
- 0.23.0 is the normal next minor release after 0.22.0 because PowerShell completion support is a new CLI capability.

## Likely Files or Areas
- package.json
- CHANGELOG.md
- README.md
- docs/release-status.md
- docs/npm-publishing.md
- docs/launch-checklist.md
- FINAL_HANDOFF.md

## Files or Areas Not to Touch
- src/core/completions.ts
- tests/completion.test.ts

## Acceptance Criteria
- package.json reports 0.23.0.
- CHANGELOG.md has a 0.23.0 section for PowerShell completions and an empty Unreleased section.
- Current release-status docs and tarball fallback commands point at v0.23.0 after the GitHub release exists.
- Packed tarball smoke test reports agentloop version 0.23.0 and supports completion powershell.
- npm status remains honest if npm publish is blocked.

## Verification Commands
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build
- npm pack --pack-destination /tmp --silent

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the release metadata/docs changes and delete the v0.23.0 GitHub release/tag if created.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
