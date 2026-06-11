# Reject task state symlink escapes

- Created date: 2026-06-11
- Task type: security-review
- Status: done

## Problem Statement
Task state writes and clears use .agentloop/state.json directly, so a symlinked .agentloop directory can redirect active-task state outside the current repo.

## Desired Outcome
Task state reads, writes, and clears keep .agentloop/state.json inside the current repo and return structured JSON errors when unsafe.

## Constraints
- Do not change package version or publish a release.
- Use Vitest regression tests before production code changes.
- Keep normal task set/current/clear behavior unchanged.

## Non-Goals
- Do not change the task contract format.
- Do not add a task database or task manager scope.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/task-state.ts
- src/cli/commands/task.ts
- src/core/artifacts.ts
- tests/task-state.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- task set rejects a symlinked .agentloop state root and leaves outside state files untouched.
- task clear rejects a symlinked .agentloop state root and does not delete outside files.
- task current ignores unsafe state paths without reading outside repo contents.
- JSON task commands return a parseable safety error for unsafe state paths.

## Verification Commands
- npx pnpm@10.12.1 test tests/task-state.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 check:links
- npx pnpm@10.12.1 build
- git diff --check
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
