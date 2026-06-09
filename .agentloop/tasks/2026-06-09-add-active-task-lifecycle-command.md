# Add active task lifecycle command

- Created date: 2026-06-09
- Task type: feature
- Status: proposed

## Problem Statement
AgentLoopKit infers the active task from newest task file modification time, which makes long sessions and multiple same-day tasks ambiguous.

## Desired Outcome
Users can set, inspect, and clear the active task with a lightweight local command, and status/handoff use that explicit task when present.

## Constraints
- Keep state repo-local and transparent.
- Do not add a database, daemon, cloud sync, or project-management workflow.
- Preserve modified-time fallback when no active task is set.

## Non-Goals
- No task board, archive system, assignment workflow, or hosted dashboard.

## Assumptions
- A small JSON state file under .agentloop is acceptable because generated content is already transparent.

## Likely Files or Areas
- src/core/status.ts
- src/core/pr-summary.ts
- src/core/artifacts.ts
- src/cli/index.ts
- tests/status.test.ts

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml

## Acceptance Criteria
- agentloop task set <path> records the active task.
- agentloop task current reports the active task.
- agentloop task clear removes the active task pointer.
- agentloop status --json uses the explicit active task when set.
- agentloop handoff uses the explicit active task when no --task is passed.

## Verification Commands
- npx pnpm@10.12.1 test tests/task-state.test.ts tests/status.test.ts tests/pr-summary.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 build

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Remove the task command and state helper files; status and summaries should fall back to latestMarkdownFile.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
