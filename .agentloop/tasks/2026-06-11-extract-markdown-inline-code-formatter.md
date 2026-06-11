# Extract Markdown inline-code formatter

- Created date: 2026-06-11
- Task type: refactor
- Status: review

## Problem Statement

Verification reports, PR summaries, and release notes now duplicate the same Markdown inline-code delimiter logic for content containing backticks.

## Desired Outcome

A small shared Markdown formatting helper covers inline-code delimiter behavior and the existing renderers use it without changing output semantics.

## Constraints

- Keep generated Markdown output unchanged for existing covered cases.
- Do not add a Markdown parser or sanitizer dependency.
- Do not change command execution, git parsing, or artifact write behavior.

## Non-Goals

- Do not refactor all Markdown rendering in the CLI.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/markdown-format.ts
- tests/markdown-format.test.ts
- src/core/verification.ts
- src/core/pr-summary.ts
- src/core/release-notes.ts

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- A dedicated Vitest suite covers inline code without backticks, with backticks, and with edge padding cases.
- Verification, PR summary, and release-note tests still pass.
- Full test, lint, typecheck, build, smoke, and packed release smoke pass.

## Verification Commands

- npm test -- tests/markdown-format.test.ts
- npm test -- tests/verification.test.ts tests/pr-summary.test.ts tests/release-notes.test.ts
- npm run lint
- npm run typecheck

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Shared formatting helpers affect several report surfaces; tests must prove output stays stable.

## Rollback Notes

Revert the shared helper extraction and restore local inline-code helper functions if report rendering regresses.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
