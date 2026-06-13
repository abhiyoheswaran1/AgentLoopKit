# Require task context for task command verification

- Created date: 2026-06-13
- Task type: bugfix
- Status: done

## Problem Statement
Dogfooding showed that `agentloop verify --task-commands --write-run` can run after a task has been archived without an explicit task path. In that state the command can produce weak run metadata with no task reference, and later evidence commands may fall back to older task context.

## Desired Outcome
agentloop verify --task-commands refuses to run unless a task contract is explicitly provided or pinned active, so task-command verification and run ledger metadata cannot silently lose task context.

## Constraints
- None recorded yet.

## Non-Goals
- Do not require a task for plain agentloop verify.
- Do not change core runVerification behavior for direct library callers.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/verify.ts
- tests/verification.test.ts
- CHANGELOG.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- CLI verify --task-commands without --task and without an active task exits before running commands.
- JSON error output identifies the missing task requirement.
- Explicit --task and active-task flows still run task verification commands.
- `--only-task-commands` also works with the active task and still refuses to run when no task is available.

## Verification Commands
- npm test -- tests/verification.test.ts -t "task-commands"
- npm test -- tests/verification.test.ts
- npm run typecheck
- npm run build

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- This changes a CLI option contract, so error output must be clear and existing explicit-task flows must remain compatible.

## Rollback Notes
Revert the CLI validation and regression tests if downstream users need taskless --task-commands semantics.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
