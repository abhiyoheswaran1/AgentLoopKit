# Harden verification report command code spans

- Created date: 2026-06-11
- Task type: security-review
- Status: review

## Problem Statement

Verification reports wrap command strings in Markdown inline code. Commands can contain backticks, which can break report headings or make command evidence ambiguous.

## Desired Outcome

Verification report command labels render safely when command strings contain backticks, while preserving the exact command text.

## Constraints

- Keep existing simple command rendering unchanged when commands contain no backticks.
- Do not change command execution behavior.

## Non-Goals

- Do not parse or sanitize shell syntax.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/verification.ts
- tests/verification.test.ts

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- A custom command containing backticks appears in failure summary and command sections without breaking inline code spans.
- Existing report tests for normal command labels still pass.

## Verification Commands

- npm test -- tests/verification.test.ts -t "escapes command labels"
- npm test -- tests/verification.test.ts
- npm run lint
- npm run typecheck

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Command text is user-controlled project configuration and should not be able to corrupt generated Markdown evidence.

## Rollback Notes

Revert the inline command renderer and regression test if downstream Markdown rendering changes unexpectedly.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
