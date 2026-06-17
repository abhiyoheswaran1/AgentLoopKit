# Mark completed backlog decisions before next task selection

- Created date: 2026-06-17
- Task type: docs
- Status: done

## Problem Statement
The internal backlog still labels several already archived current decisions as do-now work, which can cause autonomous task selection to re-pick completed implementation slices.

## Desired Outcome
Completed current backlog decisions are explicitly marked as implemented with archive evidence, while release-channel deferred tasks remain parked and no package or release metadata changes are made.

## Constraints
- Internal decision-support docs only; do not edit public release files, package metadata, workflows, lockfiles, action metadata, or release channels.

## Non-Goals
- Do not cut a release, prepare a version bump, publish, retag, or reopen Marketplace/Scoop/WinGet work.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- .agentloop/backlog.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Top current backlog decisions that already have archived task evidence are marked implemented or completed so they are not ambiguous next-task candidates.
- Deferred release-channel tasks remain deferred and are not represented as ready for implementation.

## Verification Commands
- npx --no-install tsx src/cli/index.ts task doctor --redact-paths
- npx --no-install tsx src/cli/index.ts status --brief --redact-paths

## Post-Verification Gates
- npm run dogfood:strict
- npm run maintenance:check

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Backlog wording is internal decision support; avoid presenting simulated research as real user feedback.

## Rollback Notes
Revert the .agentloop/backlog.md wording changes and remove generated evidence for this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
