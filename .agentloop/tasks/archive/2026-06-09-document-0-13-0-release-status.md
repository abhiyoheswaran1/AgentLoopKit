# Document 0.13.0 release status

- Created date: 2026-06-09
- Task type: docs
- Status: done

## Problem Statement
GitHub release v0.13.0 is public, but npm publish failed at authorization and docs need the exact result.

## Desired Outcome
Release docs, dogfood log, backlog, and final handoff record the GitHub release, workflow result, npm registry proof, and catch-up version explanation.

## Constraints
- Do not claim npm 0.13.0 availability
- Keep release status factual

## Non-Goals
- No source behavior changes

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
- GitHub release URL documented
- Publish workflow failure documented
- npm latest remains 0.1.1 documented

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
Revert release-status documentation changes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
