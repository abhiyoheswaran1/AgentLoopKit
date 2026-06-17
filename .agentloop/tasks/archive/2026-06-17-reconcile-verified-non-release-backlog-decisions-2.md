# Reconcile verified non-release backlog decisions

- Created date: 2026-06-17
- Task type: docs
- Status: done

## Problem Statement
Verified non-release backlog work remains marked do now, causing autonomous agents to reselect completed tasks before real remaining roadmap work.

## Desired Outcome
A roadmap guard asserts verified non-release completed items stay implemented, and the backlog marks those verified rows implemented while release-channel rows remain untouched.

## Constraints
- Do not edit package versions, release files, workflows, publishing metadata, or deferred release-channel tasks.

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
- Verified non-release implemented backlog rows are not marked do now
- Publishing and release-channel rows remain outside this task

## Verification Commands
- npm test -- tests/roadmap-channels.test.ts

## Post-Verification Gates
- npm run dogfood

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Over-marking a future item as implemented; use only rows with direct code/docs/test evidence.

## Rollback Notes
Revert .agentloop/backlog.md and tests/roadmap-channels.test.ts changes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
