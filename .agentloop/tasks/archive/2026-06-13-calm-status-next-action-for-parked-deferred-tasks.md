# Calm status next action for parked deferred tasks

- Created date: 2026-06-13
- Task type: bugfix
- Status: done

## Problem Statement
When the repo is clean and only deferred task contracts exist, agentloop status still recommends agentloop create-task. That is noisy for parked future work and makes the clean state look actionable.

## Desired Outcome
A clean repo with no active or open task and only deferred tasks reports no required next command while still showing the deferred tasks in status output.

## Constraints
- Keep deferred task visibility in status output.
- Do not hide dirty work or missing-task guidance when a repo has changes.
- No package version bump or release.

## Non-Goals
- Do not change task selection, task list, or deferred status semantics.
- Do not change check-gates behavior unless tests prove it is coupled.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/status.ts
- src/cli/commands/next.ts
- tests/status.test.ts
- tests/next.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- status --json returns nextAction.command none for a clean repo with only deferred tasks.
- status human output still reports deferred tasks as parked.
- next --json returns command none for the same state.
- dirty repos without active/open tasks still recommend agentloop create-task.

## Verification Commands
- npm test -- tests/status.test.ts tests/next.test.ts
- npm run typecheck
- npm run build
- git diff --check

## Post-Verification Gates
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Changing next-action ordering could weaken guidance for agents starting real work.

## Rollback Notes
Revert status next-action selection and related tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
