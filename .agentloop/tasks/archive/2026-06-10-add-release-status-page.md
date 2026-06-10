# Add concise release status page

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
Release and npm recovery state is repeated across README, npm publishing docs, launch checklist, and final handoff. Repetition has already caused stale current-version guidance.

## Desired Outcome
A concise docs/release-status.md page records the current GitHub release, npm registry state, tarball fallback, publish blocker, and next update rules; README and release docs link to it instead of making users hunt through long histories.

## Constraints
- Do not publish to npm.
- Do not change runtime CLI behavior.
- Keep the page factual and timestamped; do not claim adoption or real user feedback.

## Non-Goals
- No release bump.
- No workflow changes.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- docs/release-status.md
- README.md
- docs/npm-publishing.md
- FINAL_HANDOFF.md
- .agentloop/backlog.md
- .agentloop/dogfood-log.md
- .agentloop/research/interview-cycle-089.md

## Files or Areas Not to Touch
- src/
- package.json
- CHANGELOG.md

## Acceptance Criteria
- docs/release-status.md states GitHub v0.22.0 is current and npm latest is 0.1.1.
- The page includes tested GitHub tarball commands and says they are temporary.
- README and npm publishing docs link to the release status page.
- Final handoff next improvements no longer lists release-status compaction as future work.

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
Revert the docs commit if npm publishes 0.22.0 and the page needs a different current state.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
