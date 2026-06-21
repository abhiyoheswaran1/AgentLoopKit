# Document full task contract sections

- Created date: 2026-06-21
- Task type: docs
- Status: done

## Problem Statement
docs/task-contracts.md lists the sections in a task contract but omits post-verification gates and risk notes, even though create-task and generated contracts support both.

## Desired Outcome
Task contract docs list all current review-relevant sections so agents and maintainers know where to place verification, post-verification, risk, and rollback guidance.

## Constraints
- Docs-only change.
- Do not change task contract format or CLI behavior.

## Non-Goals
- No release or publishing work.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- docs/task-contracts.md
- docs/cli-reference.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- docs/task-contracts.md includes post-verification gates and risk notes in the contract section list.
- Docs still distinguish verification commands from post-verification gates.

## Verification Commands
- npm run check:public-docs
- npm run check:links

## Post-Verification Gates
- npx --no-install tsx src/cli/index.ts ship --redact-paths
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Docs-only wording should avoid implying hidden command execution.

## Rollback Notes
Revert the task-contract docs wording and evidence for this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
