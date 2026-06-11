# Harden npm-status Markdown version labels

- Created date: 2026-06-11
- Task type: security-review
- Status: review

## Problem Statement

npm-status renders local, latest, and registry version labels with fixed inline backticks. Captured registry JSON or local package metadata could contain backticks and corrupt the Markdown status report.

## Desired Outcome

npm-status Markdown uses the shared inline-code formatter for package and version labels while preserving exact values.

## Constraints

- Do not change npm package-name validation or registry lookup behavior.
- Do not add a Markdown parser or sanitizer dependency.

## Non-Goals

- Do not validate semantic versions in npm-status.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/npm-status.ts
- tests/npm-status.test.ts

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- npm-status Markdown safely renders local, latest, and registry version strings that contain backticks.
- Existing npm-status tests still pass.

## Verification Commands

- npm test -- tests/npm-status.test.ts -t "escapes npm-status version labels"
- npm test -- tests/npm-status.test.ts
- npm run lint
- npm run typecheck

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- npm-status output is release evidence; malformed captured registry data should not corrupt Markdown report structure.

## Rollback Notes

Revert npm-status Markdown rendering to fixed backticks if downstream output compatibility breaks unexpectedly.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
