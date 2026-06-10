# Ignore completed tasks in status fallback

- Created date: 2026-06-10
- Task type: bugfix
- Status: done

## Problem Statement
When no active task is pinned, agentloop status can select an old completed task as the active fallback, causing agents to chase archived or finished work instead of starting a new task.

## Desired Outcome
Status, next-action, and local evidence commands should prefer non-terminal fallback tasks. Status and next-action should recommend create-task when only terminal tasks remain.

## Constraints
- Do not hide explicit active done tasks; those should still recommend archive.
- Keep task list ordering unchanged.

## Non-Goals
- Do not bulk archive historical task files.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/status.ts
- src/core/task-state.ts
- src/core/check-gates.ts
- src/core/pr-summary.ts
- src/core/html-report.ts
- src/core/ci-summary.ts
- src/core/release-notes.ts
- tests/status.test.ts
- tests/next.test.ts
- tests/check-gates.test.ts
- tests/pr-summary.test.ts
- docs/status.md
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- `agentloop status` fallback ignores terminal task statuses when no active task is pinned.
- Terminal fallback statuses include at least `done`, `completed`, and `verified`.
- If only terminal task contracts exist, `status` reports no active task and recommends `agentloop create-task`.
- Handoff, gate, HTML report, CI summary, and release-note fallback paths use the same newest-open-task rule.
- Explicitly pinned `done` tasks still recommend `agentloop task archive <path>`.
- Regression tests cover the fallback behavior.

## Verification Commands
- npx --yes pnpm@10.12.1 test tests/status.test.ts
- npx --yes pnpm@10.12.1 test tests/next.test.ts tests/status.test.ts tests/pr-summary.test.ts tests/check-gates.test.ts
- npx --yes pnpm@10.12.1 test
- npx --yes pnpm@10.12.1 typecheck
- npx --yes pnpm@10.12.1 lint
- npx --yes pnpm@10.12.1 build

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the status fallback change and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
