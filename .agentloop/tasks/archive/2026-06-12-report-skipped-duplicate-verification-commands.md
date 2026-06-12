# Report skipped duplicate verification commands

- Created date: 2026-06-12
- Task type: feature
- Status: done

## Problem Statement
Verification now skips exact duplicate command strings, but the report does not tell users which task commands were found and skipped as duplicates.

## Desired Outcome
Verification reports and JSON output explain duplicate command skips so agents can account for task commands that do not appear as separate command results.

## Constraints
- Keep duplicate command execution skipped
- Do not reintroduce duplicate subprocess runs
- Keep default human output concise

## Non-Goals
- No shell command normalization beyond exact trimmed string matching
- No command dependency graph

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/verification.ts
- tests/verification.test.ts
- docs/verification-reports.md
- CHANGELOG.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- JSON verification results list skipped duplicate commands with original and duplicate keys
- Markdown reports include a concise Duplicate Commands section when duplicates are skipped
- Task command found counts remain accurate
- Duplicate commands still execute only once

## Verification Commands
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build
- npm test -- tests/verification.test.ts

## Post-Verification Gates
- npm run dogfood:strict
- npm run check:links
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Exposing duplicate details could confuse users if wording implies commands failed

## Rollback Notes
Revert duplicate-skip reporting fields, docs, and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
