# Group AgentFlight placeholders in task list

- Created date: 2026-06-16
- Task type: feature
- Status: done

## Problem Statement
agentloop task list currently prints preserved AgentFlight placeholder contracts inline with real roadmap task contracts, so long autonomous sessions can obscure the actual deferred/open work.

## Desired Outcome
Human task list output prints ordinary task contracts first and AgentFlight placeholders in a separate preserved section, while JSON output and placeholder preservation remain unchanged.

## Constraints
- Do not delete, archive, mutate, or hide AgentFlight placeholder task files.
- Keep JSON output compatible: task entries still include source for exact AgentFlight placeholders.
- Do not change status, next, artifacts, review-context, fallback task selection, or active task semantics.
- No release, version bump, tag, publish, registry calls, token reads, or network behavior.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/task.ts
- tests/task-state.test.ts
- docs/cli-reference.md
- docs/status.md

## Files or Areas Not to Touch
- package.json
- package-lock.json
- pnpm-lock.yaml

## Acceptance Criteria
- Human task list output shows ordinary task contracts before AgentFlight placeholders.
- Human task list output labels the separate AgentFlight placeholder section and preserves placeholder paths.
- task list --json remains the same flat tasks array with source on placeholder entries.
- Existing task list behavior for no tasks and ordinary tasks is preserved.

## Verification Commands
- npm test -- tests/task-state.test.ts
- npm run typecheck
- npm run lint
- npm test

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the task-list renderer, tests, and docs if the grouped output is confusing or breaks automation expectations.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
