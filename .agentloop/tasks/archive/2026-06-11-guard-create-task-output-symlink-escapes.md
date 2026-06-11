# Guard create-task output symlink escapes

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
Task path validation checked lexical paths but did not consistently resolve existing symlinked ancestors, so a symlink inside the task directory could redirect a task write or task artifact read outside the configured task directory.

## Desired Outcome
create-task and explicit task artifact reads refuse paths whose resolved existing ancestors escape the configured task directory, without writing outside files, reading outside task content, or running outside task commands.

## Constraints
- Do not bump package version or cut a release
- Keep the command local-only and deterministic
- Preserve existing JSON error fields for invalid task output paths

## Non-Goals
- No task directory migration
- No symlink deletion or repair

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/task-contract.ts
- src/core/artifacts.ts
- src/core/verification.ts
- tests/create-task.test.ts
- tests/verification.test.ts
- CHANGELOG.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- create-task --out rejects a path under a symlinked task subdirectory that resolves outside the configured tasks directory
- JSON output includes TASK_OUTPUT_PATH_OUTSIDE_TASKS_DIR and no outside task file is written
- verify --task --json rejects a path under a symlinked task subdirectory that resolves outside the configured tasks directory
- verification task-command execution does not read or run commands from symlink-escaped task files
- Existing outside-path and non-Markdown tests continue to pass

## Verification Commands
- npm test -- tests/create-task.test.ts
- npm test -- tests/verification.test.ts
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
Revert the task output path validation change, regression test, and docs updates

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
