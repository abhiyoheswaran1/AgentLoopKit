# Archive shipped 0.28.0 review tasks

- Created date: 2026-06-12
- Task type: docs
- Status: done

## Problem Statement
Describe the problem this task should solve.

## Desired Outcome
The active task folder only contains work that still needs attention after the 0.28.0 release.

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
- All review-state tasks shipped in 0.28.0 are archived.
- The deferred Scoop/WinGet task remains visible and unarchived.
- agentloop task doctor reports pass.

## Verification Commands
- node dist/cli/index.js task doctor --json
- node dist/cli/index.js status --brief

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Do not archive deferred future distribution-channel work.

## Rollback Notes
Move any incorrectly archived task file back from .agentloop/tasks/archive/.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
