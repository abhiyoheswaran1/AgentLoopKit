# Clarify task archive next step after existing evidence

- Created date: 2026-06-17
- Task type: bugfix
- Status: done

## Problem Statement

task archive always tells users to run handoff after archival, even when fresh handoff or ship evidence already covers the archived task.

## Desired Outcome

Task done and archive output point users to status to decide whether another handoff is needed, avoiding duplicate handoff guidance without changing task lifecycle behavior.

## Constraints

- Keep the change limited to task done/archive human next-step guidance and tests.
- Preserve archive file moves, active-task clearing, JSON output, bulk dry-run behavior, and path safety.
- Do not add filesystem scans, status execution, command execution, prompts, or hidden mutation to `task archive`.
- Do not bump versions, tag, publish, edit release workflows, or touch package metadata.

## Non-Goals

- Do not make `task archive` inspect handoff freshness dynamically.
- Do not change `handoff`, `ship`, `status`, `next`, `check-gates`, or `maintainer-check` semantics.
- Do not alter AgentFlight placeholder handling or generated evidence retention.

## Assumptions

- `agentloop status --redact-paths` is the existing source of truth for whether another handoff is needed after archival.
- A static next step that points at status avoids duplicate handoffs while still helping users who archived before generating review evidence.

## Likely Files or Areas

- `src/cli/commands/task.ts`
- `tests/task-state.test.ts`
- `docs/status.md`
- `docs/task-contracts.md`

## Files or Areas Not to Touch

- `package.json`
- `pnpm-lock.yaml`
- `CHANGELOG.md`
- `.github/workflows/`
- `action.yml`
- release, registry, Marketplace, Scoop, or WinGet docs

## Acceptance Criteria

- `task done` output no longer unconditionally tells users to run `agentloop handoff --write-run`.
- Single-task archive output no longer unconditionally tells users to run `agentloop handoff --write-run`.
- Bulk archive non-dry-run output uses the same status-first next-step guidance.
- The new guidance points users to `agentloop status --redact-paths` and says to run handoff only if status asks for it.
- JSON archive output remains data-only and unchanged.
- Focused tests cover single archive, bulk archive, and bulk dry-run output.

## Verification Commands

- npm test -- tests/task-state.test.ts -t "archive"
- npx prettier --check src/cli/commands/task.ts tests/task-state.test.ts docs/status.md docs/task-contracts.md

## Post-Verification Gates

- npx --yes agentflight verify -- npm test -- tests/task-state.test.ts -t "archive"
- npx --yes projscan doctor --format markdown
- npx --yes agentflight doctor

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Low runtime risk; copy-only for human output.
- Main risk is weakening the archive-to-handoff workflow. Keep wording explicit that handoff still runs when status asks for it.

## Rollback Notes

Revert the task archive next-step constants, focused tests, docs wording, and this task contract update.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
