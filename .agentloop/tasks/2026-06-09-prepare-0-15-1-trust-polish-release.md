# Prepare 0.15.1 trust polish release

- Created date: 2026-06-09
- Task type: release
- Status: done

## Problem Statement

Main now includes doctor risk-file detail reporting and real config schema URL fixes after the v0.15.0 GitHub release, but package metadata still reports 0.15.0.

## Desired Outcome

Prepare a verified 0.15.1 patch release candidate and GitHub release with npm-pending status documented honestly.

## Constraints

- Use patch version 0.15.1 because this is trust polish and bug/docs work after 0.15.0.
- Do not claim npm 0.15.1 availability until npm view proves it.
- Do not retry npm publish manually without changed auth state.
- Keep npm version-jump messaging honest.

## Non-Goals

- No new product feature in this release task.
- No npm publish unless existing release workflow handles it.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- package.json
- CHANGELOG.md
- README.md
- docs/npm-publishing.md
- docs/launch-checklist.md
- FINAL_HANDOFF.md
- docs/assets/readme/agentloopkit-cli.tape

## Files or Areas Not to Touch

- .env

## Acceptance Criteria

- Source and built CLI report 0.15.1.
- Changelog documents doctor risk details and schema URL trust fix.
- GitHub release v0.15.1 exists with an attached tarball after verification passes.
- npm docs continue to say npm latest is 0.1.1 unless registry proof changes.

## Verification Commands

- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 check:links
- npx pnpm@10.12.1 build
- npx projscan doctor --format markdown
- npx pnpm@10.12.1 pack
- npm publish --access public --dry-run

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Delete GitHub release v0.15.1 if created, revert release metadata/docs commit, and leave npm untouched.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
