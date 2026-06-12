# Stop handoff run folders from causing repeat handoff prompts

- Created date: 2026-06-13
- Task type: bugfix
- Status: done

## Problem Statement
After agentloop handoff --write-run, agentloop status can still recommend another handoff because the handoff run folder itself is new dirty evidence that was not included in the run's changed-file snapshot.

## Desired Outcome
A fresh handoff run can satisfy status next-action logic even when the only unaccounted dirty files are inside that run's own folder.

## Constraints
- Keep status deterministic and local-only.
- Do not hide unrelated dirty files.
- Do not change run ledger metadata format unless necessary.

## Non-Goals
- Do not add commit automation or publish automation.
- Do not suppress genuine dirty work that still needs a handoff.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/status.ts
- tests/status.test.ts
- src/core/run-ledger.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Status does not recommend another handoff only because the latest handoff run folder is dirty.
- Status still recommends handoff when unrelated dirty files are not covered by latest handoff evidence.
- Existing status JSON and brief output remain compatible.

## Verification Commands
- npm test -- tests/status.test.ts
- npm run typecheck
- npm run build
- git diff --check

## Post-Verification Gates
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Over-filtering dirty files could hide work that has not been handed off.

## Rollback Notes
Revert the status filtering change and its tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
