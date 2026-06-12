# Add config verification command suggestions

- Created date: 2026-06-12
- Task type: feature
- Status: done

## Problem Statement
Dogfooding showed TypeScript changes can accidentally omit typecheck from task-level verification evidence.

## Desired Outcome
Task creators can explicitly copy configured repo verification commands into new task contracts without running them during creation.

## Constraints
- Opt-in only
- Do not execute commands from create-task
- Keep existing explicit verification flags working

## Non-Goals
- No automatic command inference from git diff
- No policy engine or LLM prompt generation

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/create-task.ts
- tests/create-task.test.ts
- docs/task-contracts.md
- docs/cli-reference.md
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- create-task exposes an explicit flag for including configured verification commands
- Configured commands are added to the Verification Commands section in deterministic order
- Explicit verification commands and configured commands are de-duplicated without being executed
- Exact duplicate configured and task commands are run once during verification
- JSON and human outputs remain compatible

## Verification Commands
- npm test -- tests/create-task.test.ts
- npm test -- tests/verification.test.ts
- npm run typecheck
- npm run build

## Post-Verification Gates
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- A vague flag name could make users think commands were executed

## Rollback Notes
Revert the CLI flag, tests, and docs update.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
