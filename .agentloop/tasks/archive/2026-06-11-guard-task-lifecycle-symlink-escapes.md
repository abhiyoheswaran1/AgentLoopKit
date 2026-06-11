# Guard task lifecycle symlink escapes

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
Task lifecycle commands use lexical path containment for selected task paths, so a symlinked task subdirectory can redirect task reads, active-task state, status updates, or archive operations outside the configured task directory.

## Desired Outcome
Task lifecycle operations reject paths whose resolved existing ancestors escape the configured task directory, without reading, mutating, archiving, or pinning outside files.

## Constraints
- Do not bump package version or cut a release
- Keep existing JSON error fields for invalid task paths
- Do not delete, repair, or rewrite symlinks

## Non-Goals
- No task directory migration
- No task database

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/task-state.ts
- tests/task-state.test.ts
- README.md
- docs/task-contracts.md
- CHANGELOG.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- task set rejects a path under a symlinked task subdirectory that resolves outside the configured tasks directory
- task status and archive do not mutate or move outside task files through symlinked task paths
- stale active-task state pointing through a symlinked task path is ignored
- JSON task path errors preserve TASK_PATH_OUTSIDE_TASKS_DIR, requestedTask, tasksDir, and reason

## Verification Commands
- npm test -- tests/task-state.test.ts
- npm test
- npm run lint
- npm run typecheck
- npm run check:links
- npm run build
- git diff --check
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert task-state path validation, regression tests, and docs updates

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
