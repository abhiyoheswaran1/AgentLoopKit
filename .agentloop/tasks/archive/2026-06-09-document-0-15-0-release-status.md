# Document 0.15.0 release status

- Created date: 2026-06-09
- Task type: docs
- Status: done

## Problem Statement
GitHub release v0.15.0 is public, but npm publish failed at authorization and docs need the exact result.

## Desired Outcome
Record the v0.15.0 GitHub release URL, attached tarball digest, Publish workflow result, npm registry state, and next publishing action without claiming npm availability.

## Constraints
- Do not claim npm 0.15.0 availability.
- Record exact dates, run IDs, and registry proof.

## Non-Goals
- Do not retry npm publish without changed auth state.

## Assumptions
- The publish failure is the same npm authorization/trusted-publishing blocker seen in prior release workflows.

## Likely Files or Areas
- docs/npm-publishing.md
- docs/launch-checklist.md
- FINAL_HANDOFF.md
- .agentloop/dogfood-log.md
- .agentloop/backlog.md

## Files or Areas Not to Touch
- .env

## Acceptance Criteria
- Docs show GitHub release v0.15.0 as public with tarball asset.
- Docs show Publish workflow run 27237034367 passed package checks and failed at npm publish with E404.
- Docs show npm latest remains 0.1.1 with versions 0.1.0 and 0.1.1.

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
Revert the release-status documentation updates.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
