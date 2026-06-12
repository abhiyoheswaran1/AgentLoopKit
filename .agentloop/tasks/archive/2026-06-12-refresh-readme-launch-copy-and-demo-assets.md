# Refresh README launch copy and demo assets

- Created date: 2026-06-12
- Task type: docs
- Status: done

## Problem Statement
The README positioning is current, but the committed terminal demo still shows the older init/doctor/verify/handoff/report/badge flow and does not show the new review-readiness layer.

## Desired Outcome
README copy and committed demo assets present AgentLoopKit as a local acceptance layer with task contracts, verification, ship, prepare-pr, review-context, and safe run evidence.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- README public copy remains user-facing and avoids internal release history, simulated feedback, Homebrew, and adoption claims.
- The terminal demo source exercises the current review-readiness loop with ship and prepare-pr.
- Generated README assets render from committed sources.
- Public CLI JSON and human write-confirmation output for generated AgentLoop artifacts does not expose absolute local filesystem paths.

## Verification Commands
- npm run check:links
- npm run build
- npm test -- tests/cli-docs-drift.test.ts tests/release-smoke.test.ts

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Regenerating GIF assets can create noisy binary diffs.
- Public docs can drift into internal release commentary if release-state notes are copied into README.
- Path-output changes must keep internal write paths usable for tests and implementation code that reads generated files.

## Rollback Notes
Revert README/docs asset changes and keep the existing generated screenshots.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
