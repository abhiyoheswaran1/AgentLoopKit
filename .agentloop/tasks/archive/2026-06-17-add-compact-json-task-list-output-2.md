# Add compact JSON task list output

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement

task list --json emits every preserved AgentFlight placeholder, which is noisy for long dogfood sessions and just as large when filtered to deferred tasks.

## Desired Outcome

task list --json --brief returns a compact machine-readable task inventory with counts and bounded previews, while default task list --json remains complete.

## Constraints

- Preserve default task list --json output and existing task list human output.
- Scope compact output to --json --brief only.
- Keep task list read-only and do not mutate task contracts, state, runs, reports, package metadata, or release files.

## Non-Goals

- Do not archive, delete, hide, or reclassify AgentFlight placeholder task contracts.
- Do not change task selection, status, next, or doctor semantics.

## Assumptions

- Agents combining --json with --brief want a compact inventory, similar to status --json --brief.

## Likely Files or Areas

- src/cli/commands/task.ts
- tests/task-state.test.ts
- docs/cli-reference.md
- docs/status.md

## Files or Areas Not to Touch

- package.json
- pnpm-lock.yaml
- CHANGELOG.md
- .github/workflows/
- action.yml

## Acceptance Criteria

- task list --json remains the complete flat and grouped task payload.
- task list --json --brief returns ordinary task counts and previews plus AgentFlight placeholder counts and bounded previews.
- task list --json --brief --status deferred respects the status filter in counts and previews without emitting full task arrays.
- Human task list output is unchanged.
- Public CLI docs describe compact task-list JSON and point users to full JSON for complete arrays.

## Verification Commands

- npm test -- tests/task-state.test.ts -t 'compact task list JSON'
- npm test -- tests/task-state.test.ts
- npm run typecheck
- npm run check:public-docs

## Post-Verification Gates

- npm run dogfood:strict
- npm run maintenance:check

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Existing scripts that combine task list --json --brief may see a new compact shape; full JSON remains available without --brief.

## Rollback Notes

Revert the task list brief JSON renderer, CLI flag handling, tests, docs, and this task contract.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
