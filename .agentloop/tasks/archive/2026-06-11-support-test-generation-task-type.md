# Support test-generation task type

- Created date: 2026-06-11
- Task type: test-generation
- Status: done

## Problem Statement
AgentLoopKit ships a test-generation loop template, but create-task --type test-generation previously fell into the interactive picker instead of working non-interactively.

## Desired Outcome
test-generation is a supported task type in the CLI and docs, with regression coverage proving non-interactive task creation works.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/constants.ts
- src/core/task-contract.ts
- tests/create-task.test.ts
- README.md
- docs/task-contracts.md
- src/templates/tasks/README.md

## Files or Areas Not to Touch
- package.json

## Acceptance Criteria
- create-task --type test-generation writes a task contract without prompting
- Supported task type docs mention test-generation
- Existing create-task behavior still passes

## Verification Commands
- npx --yes pnpm@10.12.1 test tests/create-task.test.ts
- npx --yes pnpm@10.12.1 test
- npx --yes pnpm@10.12.1 check:links
- npx --yes projscan doctor --format markdown
- git diff --check

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Remove test-generation from supported task types and revert docs/tests

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
