# Reject task archive symlink escapes

- Created date: 2026-06-11
- Task type: security-review
- Status: done

## Problem Statement
task archive can move a task into .agentloop/tasks/archive without resolving a pre-existing archive directory symlink, so the destination can land outside the repo.

## Desired Outcome
Archiving a task refuses unsafe archive destinations before moving files and returns structured JSON errors for automation.

## Constraints
- Do not change package version or publish a release.
- Use Vitest regression tests before production code changes.
- Keep normal task archive behavior unchanged.

## Non-Goals
- Do not change the task contract format.
- Do not add archive cleanup or migration behavior.

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
- task archive rejects a symlinked archive directory that resolves outside the repo.
- The source task remains in place when archive destination validation fails.
- No outside archive file is created or overwritten.
- task archive --json returns a parseable safety error for unsafe archive destinations.

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
