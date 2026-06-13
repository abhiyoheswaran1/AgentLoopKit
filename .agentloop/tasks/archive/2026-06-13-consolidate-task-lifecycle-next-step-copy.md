# Consolidate task lifecycle next-step copy

- Created date: 2026-06-13
- Task type: refactor
- Status: done

## Problem Statement
Task lifecycle commands now print several related next-step messages, and keeping those strings inline increases the chance that future changes drift.

## Desired Outcome
Task lifecycle next-step strings are defined once and reused by human CLI output paths without changing JSON output or user-visible text.

## Constraints
- No behavior change.
- No package version bump or release.

## Non-Goals
- Do not change task archive, bulk archive, or task done output text.
- Do not change JSON output.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/task.ts
- tests/task-state.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Human task done output remains unchanged.
- Human task archive output remains unchanged.
- Human bulk archive output remains unchanged.
- JSON task output remains unchanged.

## Verification Commands
- npm test -- tests/task-state.test.ts
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
- Refactor could accidentally change exact CLI copy that tests and docs rely on.

## Rollback Notes
Revert the shared constant extraction.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
