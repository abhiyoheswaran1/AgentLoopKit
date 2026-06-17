# Close stale completed backlog decisions

- Created date: 2026-06-17
- Task type: docs
- Status: done

## Problem Statement
Backlog rows with clear completion evidence can stay marked do now, causing agents to reselect already implemented work.

## Desired Outcome
Backlog decision guard catches completed-note patterns and verified completed rows are marked implemented without touching release-channel tasks that still need maintainer approval.

## Constraints
- No release, version bump, publishing, protected release-file edits, broad cleanup, or external registry checks.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- .agentloop/backlog.md
- tests/roadmap-channels.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Rows whose notes clearly say implementation/merge/live/catalog evidence are not marked do now
- Release-channel tasks awaiting maintainer approval remain deferred or not selected

## Verification Commands
- npm test -- tests/roadmap-channels.test.ts

## Post-Verification Gates
- npm run dogfood

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Over-classifying future intent as completed; keep marker list evidence-based and conservative.

## Rollback Notes
Revert .agentloop/backlog.md and tests/roadmap-channels.test.ts changes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
