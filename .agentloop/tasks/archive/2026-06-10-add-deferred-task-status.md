# Add deferred task status

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement
Proposed task contracts can mean ready-to-start work or parked later work, so status and next can surface stale release-channel tasks as the next action.

## Desired Outcome
AgentLoopKit supports a deferred task status that remains visible in task lists but is ignored by status/next fallback selection and task doctor warnings.

## Constraints
- Keep the status model simple and local-file based.
- Do not build priority queues, scheduling, or project management features.
- Keep deferred tasks visible in task list and task show.

## Non-Goals
- Do not implement automatic backlog prioritization.
- Do not work on Scoop, WinGet, VS Code, or other release channels.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/task-state.ts
- src/core/completions.ts
- src/cli/commands/task.ts
- tests/task-state.test.ts
- tests/status.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop task status accepts deferred.
- Unpinned deferred tasks do not become latestTask for status or next.
- task doctor does not warn on deferred tasks.
- Docs list deferred as a supported parked-work status.

## Verification Commands
- npx vitest run tests/task-state.test.ts tests/status.test.ts tests/next.test.ts tests/completion.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Remove deferred from supported statuses and revert affected task files.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
