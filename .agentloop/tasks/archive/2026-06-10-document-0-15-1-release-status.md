# Document 0.15.1 release status

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement

GitHub release v0.15.1 is public, but the release-triggered npm publish failed at npm authorization and the repo needs exact release-status records.

## Desired Outcome

Record the v0.15.1 GitHub release URL, attached tarball digest, Publish workflow result, npm registry state, and next publishing action without claiming npm availability.

## Constraints

- Do not claim npm 0.15.1 availability.
- Keep the skipped-version explanation clear: the next successful npm publish may jump from 0.1.1 to 0.15.1 once authorization is fixed.

## Non-Goals

- Do not cut a new version for a documentation-only release-status update.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- docs/npm-publishing.md
- docs/launch-checklist.md
- FINAL_HANDOFF.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch

- .env

## Acceptance Criteria

- Docs show GitHub release v0.15.1 as public with tarball asset and SHA-256.
- Docs show Publish workflow 27239176000 passed package checks and failed at npm publish with E404.
- Docs show npm latest remains 0.1.1 unless registry proof changes.

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

Revert the release-status docs commit if the recorded status is wrong.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
