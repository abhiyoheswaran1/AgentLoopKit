# Print task done handoff next step

- Created date: 2026-06-13
- Task type: feature
- Status: done

## Problem Statement
After a task is marked done, the CLI confirms the status update but does not tell the user to capture reviewer evidence before archiving.

## Desired Outcome
Human-readable task done output includes a concise next step that points to agentloop handoff --write-run before archiving.

## Constraints
- Keep task status behavior unchanged.
- Keep JSON task done output unchanged and parseable.

## Non-Goals
- Do not change archive or handoff generation.
- Do not cut a release or bump package version.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/task.ts
- tests/task-state.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop task done human output includes the handoff-before-archive next step.
- agentloop task done --json output remains unchanged.

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
- Extra human output could be too noisy if added to JSON output.

## Rollback Notes
Revert the task done output copy and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
