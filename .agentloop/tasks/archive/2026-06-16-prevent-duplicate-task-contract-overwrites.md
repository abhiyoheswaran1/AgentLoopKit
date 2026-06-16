# Prevent duplicate task contract overwrites

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
Dogfooding showed that starting another tool with the same task title can rewrite an existing AgentLoopKit task contract for the same date and slug. That destroys acceptance criteria and verification commands.

## Desired Outcome
create-task allocates a unique task filename when the default date-and-slug path already exists, preserving existing task contracts without requiring users or tools to pass a custom --out path.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/task-contract.ts
- src/cli/commands/create-task.ts
- tests/create-task.test.ts
- docs/cli-reference.md
- CHANGELOG.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Creating two task contracts with the same title on the same day preserves the first file.
- The second default task path receives a deterministic suffix instead of overwriting.
- Explicit --out paths keep existing explicit-path behavior and safety checks.
- Docs explain that default generated paths avoid collisions.

## Verification Commands
- npm test -- tests/create-task.test.ts
- npm test -- tests/create-task.test.ts tests/task-contract.test.ts tests/cli-docs-drift.test.ts
- npm run check:public-docs
- npm run typecheck
- npm run lint
- npm run build

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Task creation is an entry command used by agents and integrations; path allocation must not weaken explicit output path safety.

## Rollback Notes
Revert the task path allocation change and regression tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
