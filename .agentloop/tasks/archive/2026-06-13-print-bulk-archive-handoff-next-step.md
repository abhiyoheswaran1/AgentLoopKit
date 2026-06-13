# Print bulk archive handoff next step

- Created date: 2026-06-13
- Task type: feature
- Status: done

## Problem Statement
Bulk archiving done tasks confirms the moved contracts but does not tell users how to capture final reviewer evidence afterward.

## Desired Outcome
Successful non-dry-run bulk archive output includes the same handoff next step as single-task archive output.

## Constraints
- Do not change dry-run output semantics beyond preview text.
- Do not change JSON output shape.

## Non-Goals
- Do not change archive selection or task status rules.
- Do not cut a release or bump package version.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/task.ts
- tests/task-state.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop task archive --status done prints a next step for agentloop handoff --write-run after moving tasks.
- agentloop task archive --status done --dry-run does not imply reviewer evidence was captured.
- JSON bulk archive output remains unchanged and parseable.

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
- Extra human output on dry-run or JSON paths could confuse scripts.

## Rollback Notes
Revert the bulk archive output copy and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
