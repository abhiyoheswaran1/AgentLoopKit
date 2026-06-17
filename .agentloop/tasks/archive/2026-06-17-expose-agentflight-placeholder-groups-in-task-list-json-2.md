# Expose AgentFlight placeholder groups in task list JSON

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement
`agentloop task list --json` kept AgentFlight placeholders visible only inside the mixed `tasks` array. Even with real contracts sorted first, automation and agents still have to remember to filter by `source` before choosing actionable work.

## Desired Outcome
JSON task-list output remains backward-compatible through the complete `tasks` array, and additionally exposes grouped `taskContracts` and `agentFlightPlaceholders` arrays with the same task object shape.

## Constraints
- Keep the existing task list JSON tasks array complete and backward-compatible.
- Add grouping metadata without hiding placeholders from JSON.
- Keep human task-list output unchanged.

## Non-Goals
- No task file cleanup, placeholder archiving, AgentFlight behavior changes, release, version bump, or publish work.

## Assumptions
- Existing JSON consumers should keep reading `tasks` without changes.
- New automation can use the grouped arrays to avoid mistaking AgentFlight placeholders for roadmap work.

## Likely Files or Areas
- `src/cli/commands/task.ts`
- `tests/task-state.test.ts`
- `docs/cli-reference.md`
- `docs/status.md`

## Files or Areas Not to Touch
- Task-file cleanup, placeholder archiving, AgentFlight session behavior, package metadata, release workflows, marketplace/channel docs, or versioning.

## Acceptance Criteria
- task list --json includes ordinary task contracts and AgentFlight placeholder task groups in addition to the existing tasks array.
- The grouped arrays preserve the same task object shape used by tasks.
- Existing task list JSON consumers can continue reading tasks without changes.

## Verification Commands
- npm test -- tests/task-state.test.ts

## Post-Verification Gates
- npx --yes agentflight verify -- npm test -- tests/task-state.test.ts
- npx --yes projscan doctor --format markdown
- npx --yes agentflight doctor

## Implementation Plan
- Add a failing CLI JSON regression test for grouped task-list arrays.
- Add grouped arrays in the task-list JSON renderer while preserving the existing complete `tasks` array.
- Update public docs that describe task-list JSON output.
- Run focused, adjacent, and dogfood verification.

## Risk Notes
- Low runtime risk; this adds JSON fields without removing `tasks`. Scripts with exact top-level object equality assertions may need to accept the additive fields.

## Rollback Notes
Revert the task-list JSON renderer additions, the grouped-output regression tests, and the docs wording for grouped JSON fields.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
