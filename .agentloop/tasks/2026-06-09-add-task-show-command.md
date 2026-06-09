# Add task show command

- Created date: 2026-06-09
- Task type: feature
- Status: verified

## Problem Statement
Users and agents can list task contracts, but they still need to open files manually to inspect a selected task contract.

## Desired Outcome
agentloop task show prints a selected task contract, supports JSON output, and remains read-only.

## Constraints
- Keep the command local and read-only.
- Do not add task editing, archive, assignment, due dates, or board features.
- Do not write .agentloop/state.json from show.

## Non-Goals
- No task lifecycle state beyond existing active pointer.

## Assumptions
- Existing task path validation can be reused for read-only task inspection.
- Raw Markdown output is the most useful default for humans and agents.

## Likely Files or Areas
- src/core/task-state.ts
- src/cli/commands/task.ts
- tests/task-state.test.ts

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml

## Acceptance Criteria
- agentloop task show <path> prints the task Markdown
- agentloop task show --json includes metadata and content
- agentloop task show rejects paths outside the tasks directory
- agentloop task show does not create or modify .agentloop/state.json

## Verification Commands
- npx pnpm@10.12.1 test tests/task-state.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 build

## Implementation Plan
- Added failing tests for core task-contract reading and CLI `task show`.
- Added `readTaskContract` with existing `.agentloop/tasks` path safety rules.
- Added `agentloop task show <path>` with Markdown and JSON output.
- Updated README, docs, generated harness templates, and agent templates.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert task show code and docs; task list/set/current/clear remain unchanged

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
