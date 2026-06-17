# Document check-gates task-done next action

- Created date: 2026-06-16
- Task type: docs
- Status: done

## Problem Statement
check-gates now recommends agentloop task done when active task evidence and handoff coverage are complete, but public check-gates docs do not mention that closeout path.

## Desired Outcome
Public check-gates docs explain when the next action is task done versus create-task or handoff, matching implemented CLI behavior.

## Constraints
- Docs-only update; do not change command behavior.
- Keep wording user-facing and concise.

## Non-Goals
- Do not modify release docs, package metadata, or publishing workflows.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- docs/check-gates.md
- docs/cli-reference.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- docs/check-gates.md describes task done for active covered tasks.
- docs/cli-reference.md check-gates section describes the same next-action behavior.

## Verification Commands
- npm test -- tests/public-docs-hygiene.test.ts tests/cli-docs-drift.test.ts
- npm run lint
- npm test

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Docs must not imply check-gates mutates task state; it only recommends the next command.

## Rollback Notes
Revert the check-gates documentation edits.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
