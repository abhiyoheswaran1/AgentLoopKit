# Hydrate archived run task status

- Created date: 2026-06-12
- Task type: bugfix
- Status: done

## Problem Statement
The latest run ledger and status output can show stale task metadata after a task is marked done and archived. The run still reports the original in-progress snapshot even though the archived task file contains the final status.

## Desired Outcome
Run ledger and status output resolve archived task evidence when available, so task title and status reflect the archived task contract while preserving historical run metadata when the file cannot be found.

## Constraints
- Keep the run ledger local-first and deterministic.
- Do not mutate existing run metadata during reads.
- Do not change command execution, scoring, verification, or archive semantics.

## Non-Goals
- No release or version bump.
- No migration of historical run folders.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/runs.ts
- src/core/status.ts
- tests/runs.test.ts
- tests/status.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop runs --json reports archived latest-run task status as done when the archived task file exists.
- agentloop status --json latestRun task metadata reflects archived task status when the latest run references an archived task.
- If the task file is missing, run ledger output still uses the stored run snapshot.

## Verification Commands
- npm test -- tests/runs.test.ts tests/status.test.ts
- npm test
- npm run build

## Post-Verification Gates
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Changing run summary hydration could affect JSON shape used by scripts.

## Rollback Notes
Revert the run/status hydration changes and keep stored run metadata as the source of truth.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
