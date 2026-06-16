# Make schemastore output Markdown-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
Human-readable schemastore output is pasted into docs and contribution notes; dynamic catalog values should not split Markdown when they contain line breaks.

## Desired Outcome
SchemaStore human output keeps catalog values on one Markdown line while JSON output preserves raw values for scripts.

## Constraints
- None recorded yet.

## Non-Goals
- Do not change the catalog helper, committed schema entry, schema URL, JSON shape, package version, publish, or release.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/schemastore.ts
- tests/schemastore.test.ts
- docs/cli-reference.md
- CHANGELOG.md
- .agentloop/backlog.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Human schemastore output renders name, file match, and schema URL values on one Markdown line
- JSON schemastore output preserves raw catalog values
- Focused regression tests cover newline-containing SchemaStore catalog values

## Verification Commands
- npm test -- tests/schemastore.test.ts

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Could accidentally alter the JSON catalog entry if formatting is applied before JSON rendering.

## Rollback Notes
Revert the schemastore formatter change and remove the focused regression/docs/internal notes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
