# Document 0.10.0 release status

- Created date: 2026-06-09
- Task type: docs
- Status: done

## Problem Statement

GitHub release v0.10.0 is public, but the release-triggered Publish workflow failed at npm authorization and npm latest remains 0.1.1.

## Desired Outcome

Update internal and public release-status docs with the exact v0.10.0 GitHub release, Publish workflow, and npm registry state.

## Constraints

- Do not claim npm 0.10.0 availability.
- Use exact GitHub run IDs and registry proof.

## Non-Goals

- Do not retry npm publish from chat.

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

- GitHub release v0.10.0 status is recorded.
- Publish workflow failure is recorded with run ID and E404 result.
- npm registry latest remains documented as 0.1.1.

## Verification Commands

- git diff --check
- npx pnpm@10.12.1 check:links
- node dist/cli/index.js verify --task .agentloop/tasks/2026-06-09-document-0-10-0-release-status.md

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert release-status documentation changes.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
