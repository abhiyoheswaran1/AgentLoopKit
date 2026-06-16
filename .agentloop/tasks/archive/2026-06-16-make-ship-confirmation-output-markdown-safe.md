# Make ship confirmation output Markdown-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
Human-readable ship output ends with a written report path that agents paste into PRs, CI logs, and handoffs; that path should not split Markdown if a configured reports directory contains line breaks.

## Desired Outcome
Ship human confirmation output keeps the written report path on one Markdown line while JSON output preserves raw paths for scripts.

## Constraints
- None recorded yet.

## Non-Goals
- Do not change ship scoring, gate checks, report generation, run ledger schema, JSON shape, package version, publish, or release.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/ship.ts
- tests/ship.test.ts
- docs/cli-reference.md
- CHANGELOG.md
- .agentloop/backlog.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Human ship output renders the written ship report path on one Markdown line
- JSON ship output preserves raw ship report paths
- Focused regression tests cover newline-containing configured report directories

## Verification Commands
- npm test -- tests/ship.test.ts

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Could accidentally change ship report rendering or JSON values if formatting is applied before createShipReport returns.

## Rollback Notes
Revert the ship command formatter change and remove the focused regression/docs/internal notes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
