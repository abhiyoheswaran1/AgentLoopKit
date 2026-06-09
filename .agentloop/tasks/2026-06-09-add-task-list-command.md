# Add task list command

- Created date: 2026-06-09
- Task type: feature
- Status: verified

## Problem Statement
Users can pin a task with agentloop task set, but they need a quick deterministic list of available task contracts before choosing one.

## Desired Outcome
agentloop task list shows task contracts with active-task marking, statuses, and JSON output for agents.

## Constraints
- Keep it local and read-only.
- Do not add a task database, board, owner field, due date, archive workflow, or cloud sync.
- Preserve task set/current/clear behavior.

## Non-Goals
- No project management features.

## Assumptions
- Sorting newest modified tasks first is useful for humans while active marking resolves ambiguity.

## Likely Files or Areas
- src/core/task-state.ts
- src/cli/commands/task.ts
- tests/task-state.test.ts
- README.md
- docs/status.md

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml

## Acceptance Criteria
- agentloop task list prints all Markdown task contracts except README.md.
- agentloop task list --json includes active boolean markers.
- The active task appears first when one is pinned.
- No state is written by task list.

## Verification Commands
- npx pnpm@10.12.1 test tests/task-state.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 build

## Implementation Plan
- Added failing Vitest coverage for core listing and CLI JSON output.
- Implemented `listTasks` in the task-state core module.
- Added `agentloop task list` with human-readable and JSON output.
- Updated README, docs, generated harness templates, and agent templates.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert task list code and docs; task set/current/clear should remain unchanged.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
