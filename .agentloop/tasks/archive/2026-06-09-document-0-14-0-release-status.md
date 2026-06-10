# Document 0.14.0 release status

- Created date: 2026-06-09
- Task type: docs
- Status: done

## Problem Statement
GitHub release v0.14.0 is public, but npm publish failed at authorization and docs need the exact result.

## Desired Outcome
Record the v0.14.0 GitHub release URL, attached tarball digest, Publish workflow result, npm registry state, and next publishing action without claiming npm availability.

## Constraints
- Do not claim npm 0.14.0 availability
- Do not paste npm tokens, OTPs, or auth URLs
- Keep the explanation short and factual

## Non-Goals
- No npm publish retry in this task
- No new CLI behavior

## Assumptions
- npm trusted publishing or browser/OTP auth still needs to be repaired outside this repo.

## Likely Files or Areas
- docs/npm-publishing.md
- docs/launch-checklist.md
- FINAL_HANDOFF.md
- .agentloop/dogfood-log.md
- .agentloop/backlog.md

## Files or Areas Not to Touch
- src/
- tests/
- docs/assets/readme/

## Acceptance Criteria
- release-url-recorded
- publish-workflow-result-recorded
- npm-registry-state-recorded
- npm-availability-not-overclaimed

## Verification Commands
- npx pnpm@10.12.1 check:links
- npx projscan doctor --format markdown

## Implementation Plan
- Inspect release and workflow outputs.
- Update release-status docs and internal records.
- Run link and health checks.

## Risk Notes
- Main risk is overstating npm availability.

## Rollback Notes
Revert the release-status docs if the release is deleted or npm status changes before merge.

## Handoff Requirements
- Summarize docs changed.
- Include registry proof.
- Include workflow failure details.
