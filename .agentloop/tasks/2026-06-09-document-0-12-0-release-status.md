# Document 0.12.0 release status

- Created date: 2026-06-09
- Task type: docs
- Status: done

## Problem Statement
GitHub release v0.12.0 is public, but the release-triggered Publish workflow failed at npm authorization.

## Desired Outcome
Record the v0.12.0 GitHub release, tarball digest, CI result, Publish workflow failure, and npm registry proof without claiming npm availability.

## Constraints
- Do not claim npm 0.12.0 availability until registry proof exists.
- Do not modify npm credentials or trusted-publishing settings from the repo.

## Non-Goals
- No code changes.
- No npm publish retry from the local machine.

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
- v0.12.0-release-status-documented
- release-notes-updated
- npm-registry-proof-recorded

## Verification Commands
- npx pnpm@10.12.1 check:links
- npx projscan doctor --format markdown

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
