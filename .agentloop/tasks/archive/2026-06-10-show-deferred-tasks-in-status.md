# Show deferred tasks in status

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement
agentloop status says no task contract was found when the repo only has deferred task contracts, which hides parked roadmap work and confuses maintainers after cleanup.

## Desired Outcome
agentloop status keeps deferred tasks out of active/latest work selection, but reports them clearly in JSON and Markdown with a helpful next action.

## Constraints
- Do not treat deferred tasks as active or latest open work.
- Keep output deterministic and concise.

## Non-Goals
- Do not build task scheduling or prioritization.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/status.ts
- src/core/task-state.ts
- tests/status.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- JSON status includes deferred task contracts separately.
- Markdown status reports parked deferred tasks instead of saying no task contract exists when only deferred tasks are present.
- Open proposed/in-progress tasks still take priority over deferred tasks for next action.
- Tests cover deferred-only and open-plus-deferred states.

## Verification Commands
- npx pnpm@10.12.1 test tests/status.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build

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
