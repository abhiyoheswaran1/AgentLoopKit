# Suppress task doctor warning after clean archived evidence

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
After a verified task is marked done and archived, there is intentionally no active task. task doctor still reports recent-evidence-without-active-task even when the latest recent run points at an existing archived terminal task and there are no real open tasks, which creates noise in long autonomous dogfood sessions.

## Desired Outcome
task doctor keeps warning for genuinely missing active task state, but does not warn after a clean archived-task evidence handoff when the latest recent run still resolves to that archived terminal task.

## Constraints
- Preserve recent-evidence-without-active-task for reports or runs that do not resolve to an existing archived terminal task.
- Do not hide warnings when any real open task exists without an active pointer.
- Do not mutate state, archive files, delete evidence, or change check-gates filtering.

## Non-Goals
- Do not change run metadata format.
- Do not change status or next behavior.
- Do not add cleanup automation.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/task-state.ts
- tests/task-state.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- task doctor does not report recent-evidence-without-active-task when latest recent evidence is a run whose task path resolves to an archived done task and there are no open real tasks.
- task doctor still reports recent-evidence-without-active-task when recent evidence is only a verification report and no active task exists.
- task doctor still reports recent-evidence-without-active-task when a real open task exists but no active task is pinned.

## Verification Commands
- npm test -- tests/task-state.test.ts
- npm test -- tests/status.test.ts tests/check-gates.test.ts
- npm run typecheck
- npm run lint
- npm run build
- npm test

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Could accidentally suppress stale-state warnings that should guide agents to pin active work.

## Rollback Notes
Revert the task-state suppression helper and regression tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
