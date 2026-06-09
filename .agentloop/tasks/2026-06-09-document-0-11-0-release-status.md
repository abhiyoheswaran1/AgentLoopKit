# Document 0.11.0 release status

- Created date: 2026-06-09
- Task type: docs
- Status: done

## Problem Statement

GitHub release `v0.11.0` is public, but the release-triggered Publish workflow failed at npm authorization and npm latest remains `0.1.1`.

## Desired Outcome

Update internal and public release-status docs with the exact `v0.11.0` GitHub release, Publish workflow, tarball digest, npm failure, and registry state.

## Constraints

- Do not claim npm `0.11.0` availability.
- Do not retry npm publish in this documentation cycle.
- Do not add or expose npm tokens.

## Non-Goals

- No code changes.
- No release deletion or rollback.
- No npm trusted-publishing settings change from the repo.

## Assumptions

- The next action remains npm trusted-publishing configuration or local browser/OTP auth.

## Likely Files or Areas

- docs/launch-checklist.md
- docs/npm-publishing.md
- FINAL_HANDOFF.md
- .agentloop/dogfood-log.md
- GitHub release notes for v0.11.0

## Files or Areas Not to Touch

- package.json
- Runtime source files
- npm credentials or environment files

## Acceptance Criteria

- github-release-recorded
- npm-failure-recorded
- registry-proof-recorded

## Verification Commands

- npx pnpm@10.12.1 check:links
- npx pnpm@10.12.1 test
- npx projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the release-status documentation changes and GitHub release-note edit.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
