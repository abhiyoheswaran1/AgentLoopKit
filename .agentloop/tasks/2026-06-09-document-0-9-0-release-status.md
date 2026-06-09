# Document 0.9.0 release status

- Created date: 2026-06-09
- Task type: release
- Status: done

## Problem Statement

GitHub release v0.9.0 is public, but the release-triggered Publish workflow failed at npm authorization and npm latest remains 0.1.1.

## Desired Outcome

Update internal and public release-status docs with the exact v0.9.0 GitHub release, Publish workflow, and npm registry state.

## Constraints

- Do not claim npm 0.9.0 availability.
- Do not paste secrets, tokens, or OTPs.

## Non-Goals

- No code changes.
- No npm auth bypass.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- docs/launch-checklist.md
- docs/npm-publishing.md
- FINAL_HANDOFF.md
- .agentloop/dogfood-log.md
- .agentloop/backlog.md

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- GitHub release v0.9.0 status is recorded.
- Publish workflow E404 is recorded.
- npm latest remains 0.1.1 in docs.

## Verification Commands

- npx pnpm@10.12.1 check:links
- git diff --check

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the release-status documentation update.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
