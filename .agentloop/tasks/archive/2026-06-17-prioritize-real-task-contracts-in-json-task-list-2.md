# Prioritize real task contracts in JSON task list

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement
`agentloop task list --json` exposed AgentFlight placeholder task contracts before real roadmap/task contracts when placeholders had newer mtimes. Human task-list output already groups placeholders after ordinary tasks, but JSON consumers could still see placeholder work first and choose the wrong next task.

## Desired Outcome
JSON task-list output keeps the same task objects and source markers, while sorting real task contracts before AgentFlight placeholders. Ordering remains deterministic within each group.

## Constraints
- Preserve the existing task list JSON object fields and source marker values.
- Keep human task-list output behavior unchanged unless tests show a mismatch.
- Do not mutate task files, archive placeholders, or change AgentFlight session behavior.

## Non-Goals
- No release, version bump, publish, registry, or marketplace work.
- No broad cleanup of existing AgentFlight placeholder files.

## Assumptions
- AgentFlight placeholder task files should remain visible in JSON for tools that intentionally inspect them.
- Human task-list output already has the intended grouping and should not need behavior changes.

## Likely Files or Areas
- `src/core/task-state.ts`
- `tests/task-state.test.ts`

## Files or Areas Not to Touch
- Release metadata, publishing workflows, package versions, marketplace/channel docs, and existing AgentFlight placeholder task files.

## Acceptance Criteria
- task list --json returns real task contracts before AgentFlight placeholders even when placeholders are newer.
- JSON task ordering remains deterministic within real tasks and placeholder groups.

## Verification Commands
- npm test -- tests/task-state.test.ts

## Post-Verification Gates
- npx --yes agentflight verify -- npm test -- tests/task-state.test.ts
- npx --yes projscan doctor --format markdown
- npx --yes agentflight doctor

## Implementation Plan
- Add a failing regression test for `task list --json` with a newer AgentFlight placeholder and older real task contracts.
- Sort task inventory by source group before active/mtime/path ordering.
- Run focused and adjacent task/status/next/gate tests, then AgentLoop/AgentFlight/ProjScan gates.

## Risk Notes
- Low runtime risk; this changes task-list ordering only. JSON object fields are preserved, but scripts that assumed pure mtime ordering may observe real tasks before placeholders.

## Rollback Notes
Revert the `listTasks` source-group ordering change and the JSON ordering regression test.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
