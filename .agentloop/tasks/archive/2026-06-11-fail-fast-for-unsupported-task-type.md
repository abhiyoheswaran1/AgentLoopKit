# Fail fast for unsupported task type

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
When create-task receives a title and an unsupported --type, it falls into the interactive picker and can hang non-interactive agent sessions.

## Desired Outcome
Unsupported non-interactive task types exit quickly with a clear error listing supported values, without writing a task file.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/create-task.ts
- tests/create-task.test.ts
- CHANGELOG.md
- .agentloop/backlog.md

## Files or Areas Not to Touch
- package.json

## Acceptance Criteria
- Invalid --type exits non-zero without timing out
- Error message names the unsupported type and supported values
- Valid interactive and non-interactive create-task paths still pass

## Verification Commands
- npx --yes pnpm@10.12.1 test tests/create-task.test.ts
- npx --yes pnpm@10.12.1 test
- npx --yes projscan doctor --format markdown
- git diff --check

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the unsupported-type guard and regression test

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
