# Warn when created tasks keep review placeholders

- Created date: 2026-06-20
- Task type: feature
- Status: done

## Problem Statement
Thin task contracts can be created with review-critical placeholder sections and agents may start implementation before task doctor or status calls out the weak contract.

## Desired Outcome
create-task keeps permissive task creation but reports a clear human and JSON warning when the generated contract still contains review-critical placeholder sections.

## Constraints
- Keep task creation read-only beyond the existing task file and active-state writes.
- Do not make missing fields fatal.
- Reuse existing CLI output style and Markdown-safe formatting.

## Non-Goals
- No interactive prompt redesign.
- No change to task doctor placeholder semantics.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/create-task.ts
- tests/create-task.test.ts
- docs/task-contracts.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Human create-task output names review-critical placeholder sections when generated content is incomplete.
- JSON create-task output includes a structured warning for placeholder sections without hiding the created task or active-task fields.
- Fully specified task creation produces no placeholder warning.

## Verification Commands
- npm test -- tests/create-task.test.ts
- npm run typecheck

## Post-Verification Gates
- agentloop verify --task-commands --write-run --redact-paths
- agentloop ship --redact-paths

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Touches task creation output consumed by agents and scripts; preserve JSON task and activeTask shape.

## Rollback Notes
Revert the create-task warning, tests, docs, and task evidence for this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
