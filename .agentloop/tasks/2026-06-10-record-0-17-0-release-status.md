# Record 0.17.0 release status

- Created date: 2026-06-10
- Task type: release
- Status: done

## Problem Statement
GitHub release v0.17.0 is public but npm publish failed at authorization.

## Desired Outcome
Docs and internal handoff state accurately report the GitHub release, tarball digest, CI success, Publish workflow failure, and npm latest state.

## Constraints
- Do not claim npm availability until npm view proves it.
- Do not retry real npm publish without user-controlled auth.

## Non-Goals
- No workflow redesign in this task.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- docs/npm-publishing.md
- docs/launch-checklist.md
- README.md
- ROADMAP.md
- FINAL_HANDOFF.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Docs name v0.17.0 as the current GitHub release
- Docs state npm latest remains 0.1.1
- Docs record Publish workflow run 27243165066 failure at npm authorization

## Verification Commands
- npx pnpm@10.12.1 check:links
- git diff --check
- npx projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the release-status documentation updates.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
