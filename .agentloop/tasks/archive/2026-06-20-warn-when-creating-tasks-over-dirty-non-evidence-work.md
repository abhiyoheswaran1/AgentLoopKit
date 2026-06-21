# Warn when creating tasks over dirty non-evidence work

- Created date: 2026-06-20
- Task type: feature
- Status: done

## Problem Statement
After a task is archived, agents can start another task while previous non-evidence source, docs, or test changes remain dirty. That makes the next task evidence harder to trust because changed files can belong to earlier work.

## Desired Outcome
create-task warns in human and JSON output when a new task is created while Git reports existing dirty non-evidence files, including a bounded count and examples, without blocking the task or reading file contents.

## Constraints
- Do not block task creation.
- Do not read dirty file contents.
- Exclude generated AgentLoop evidence churn from the warning count.

## Non-Goals
- No automatic cleanup, commit, archive, stash, or reset behavior.
- No release or publishing work.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/create-task.ts
- src/core/git.ts
- tests/create-task.test.ts
- docs/task-contracts.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- create-task human output warns when dirty non-evidence files exist before task creation.
- create-task JSON output includes a structured warning for dirty non-evidence pre-existing work.
- Clean repositories and AgentLoop-evidence-only dirty repositories do not emit the dirty-work warning.

## Verification Commands
- npm test -- tests/create-task.test.ts
- npm run typecheck

## Post-Verification Gates
- npx --no-install tsx src/cli/index.ts ship --redact-paths
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Touches task creation output and Git status handling; preserve existing JSON fields and placeholder warnings.

## Rollback Notes
Revert the create-task dirty-work warning, tests, docs, and product evidence for this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
