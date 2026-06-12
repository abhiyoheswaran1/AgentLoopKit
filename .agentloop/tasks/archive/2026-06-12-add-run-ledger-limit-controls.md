# Add run ledger limit controls

- Created date: 2026-06-12
- Task type: feature
- Status: done

## Problem Statement
agentloop runs prints every local run ledger entry. In a dogfooded repo with many runs, that is noisy for humans and agents who usually need the latest run or a bounded recent list.

## Desired Outcome
agentloop runs supports --limit <n> and --latest so users can inspect recent evidence without piping or parsing the full ledger.

## Constraints
- Keep output deterministic and local-only.
- Do not change listRuns ordering or stored run metadata.
- Reject invalid limits with a clear error.

## Non-Goals
- No release or version bump.
- No deletion or pruning of runs.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/runs.ts
- tests/runs.test.ts
- docs/cli-reference.md
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop runs --latest shows only the newest run.
- agentloop runs --limit 2 shows only two newest runs in JSON and human output.
- Invalid limits fail with a clear message and do not read or write run metadata.

## Verification Commands
- npm test -- tests/runs.test.ts
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
- Changing CLI output options could affect scripts that invoke runs --json.

## Rollback Notes
Revert runs command option parsing and docs/tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
