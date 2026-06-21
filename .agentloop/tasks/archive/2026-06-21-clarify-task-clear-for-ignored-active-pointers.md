# Clarify task clear for ignored active pointers

- Created date: 2026-06-21
- Task type: bugfix
- Status: done

## Problem Statement
Dogfooding direct AgentFlight recovery showed task doctor can recommend task clear for an ignored AgentFlight placeholder active pointer, but task clear may print No active task set while removing or reconciling that pointer. The recovery path works, but the human output makes it look ineffective.

## Desired Outcome
task clear reports when it clears a persisted active-task pointer even if that pointer is ignored by normal active-task selection, while preserving no-op output when no pointer exists.

## Constraints
- Do not change status/next placeholder filtering or task-doctor diagnostics.
- Do not delete AgentFlight placeholder task files or broad-clean task state.

## Non-Goals
- Do not add cleanup automation or mutate task Markdown.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/task.ts
- src/core/task-state.ts
- tests/task-state.test.ts

## Files or Areas Not to Touch
- package.json
- package-lock.json
- pnpm-lock.yaml

## Acceptance Criteria
- When state points at an ignored AgentFlight placeholder, task clear removes the pointer and reports that it cleared active task state.
- When no state file exists, task clear still reports the existing no-active-task no-op.
- JSON task clear output distinguishes cleared versus no-op state without reading or deleting task files.

## Verification Commands
- npm test -- tests/task-state.test.ts
- npm run check:public-docs
- npm run check:links

## Post-Verification Gates
- npx --no-install tsx src/cli/index.ts task doctor --redact-paths
- npx --no-install tsx src/cli/index.ts ship
- npx --no-install tsx src/cli/index.ts prepare-pr --write --redact-paths
- npm run dogfood:strict
- npm run maintenance:check

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Task-clear messaging affects agent recovery from stale or placeholder state.

## Rollback Notes
Revert the task clear output/test changes; existing state-file behavior remains the fallback.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
