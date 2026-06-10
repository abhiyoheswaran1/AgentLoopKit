# Record 0.23.0 release status

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
GitHub release v0.23.0 is public and verified, but the repo docs still have pre-release checklist entries for the release and need the publish workflow failure recorded.

## Desired Outcome
Record v0.23.0 release URL, asset digest, publish workflow result, npm registry proof, and tarball smoke evidence without claiming npm availability.

## Constraints
- Do not publish to npm while npm whoami fails.
- Do not claim npm availability without registry proof.

## Non-Goals
- Do not change package code or version.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- docs/release-status.md
- docs/npm-publishing.md
- docs/launch-checklist.md
- FINAL_HANDOFF.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Release-status docs name v0.23.0 as public with the verified asset digest.
- Publishing docs record workflow 27253066701 and npm E404 failure.
- Launch checklist marks the GitHub release as published and publish workflow as failed at npm auth.
- npm registry proof remains 0.1.1.

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
Revert the status documentation and dogfood updates.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
