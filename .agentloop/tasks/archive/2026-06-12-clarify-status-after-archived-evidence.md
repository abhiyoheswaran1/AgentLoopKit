# Clarify status after archived evidence

- Created date: 2026-06-12
- Task type: bugfix
- Status: done

## Problem Statement
After a task is verified, shipped, archived, and the working tree still has uncommitted evidence files, agentloop status can recommend creating a new task because there is no active task. That next action is confusing while the current shipped diff still needs handoff, review, or commit attention.

## Desired Outcome
agentloop status gives a clearer next action when the working tree is dirty and the latest run references archived completed task evidence, instead of immediately pointing users to create-task.

## Constraints
- Keep status deterministic and local-only.
- Do not add git commit automation.
- Do not change check-gates decisions.

## Non-Goals
- No release or version bump.
- No new command.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/status.ts
- tests/status.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- When no active/open task exists, the tree is dirty, and the latest run references an archived done task, status recommends refreshing handoff or reviewing the dirty evidence before starting a new task.
- When there is no task evidence and the tree is dirty, status still recommends creating a task contract.
- Brief, JSON, and Markdown status outputs use the same next action.

## Verification Commands
- npm test -- tests/status.test.ts
- npm test
- npm run build

## Post-Verification Gates
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Changing next-action order could affect automation that reads status --json.

## Rollback Notes
Revert status next-action logic and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
