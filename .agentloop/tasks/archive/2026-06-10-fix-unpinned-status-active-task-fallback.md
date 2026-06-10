# Fix unpinned status active task fallback

- Created date: 2026-06-10
- Task type: bugfix
- Status: done

## Problem Statement
When no task is pinned, agentloop task current reports null but agentloop status still labels an older unpinned proposed task as the active task. That can steer agents toward stale backlog work.

## Desired Outcome
agentloop status reports no active task when no task is pinned, while preserving useful latest-task context only if it is clearly named and not treated as active.

## Constraints
- Do not reintroduce terminal task fallback noise.
- Keep output deterministic and backward-compatible where practical.
- Do not mutate task files during status checks.

## Non-Goals
- Do not implement bulk task archiving.
- Do not work on Scoop, WinGet, VS Code, or new distribution channels in this task.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/status.ts
- src/cli/commands/status.ts
- tests/status.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop task current --json and agentloop status --json agree that activeTask is null when no task is pinned.
- status human output does not label an unpinned fallback task as Active task.
- existing pinned task behavior remains unchanged.
- terminal tasks remain ignored as fallback candidates.

## Verification Commands
- npx vitest run tests/status.test.ts
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
Revert the status/task fallback changes and keep the existing task current behavior.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
