# Harden verification report markdown fences

- Created date: 2026-06-11
- Task type: security-review
- Status: review

## Problem Statement

Verification reports embed command output from project commands. Output can contain Markdown fence markers and should not be able to break report structure or forge sections.

## Desired Outcome

Verification report code blocks use fences long enough to safely contain command output, including triple-backtick sequences.

## Constraints

- Keep command output intact for reviewer evidence.
- Do not add dependencies or an external sanitizer.

## Non-Goals

- Do not change how verification commands are selected or executed.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/verification.ts
- tests/verification.test.ts

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- A failing command that prints triple backticks remains inside a single report code block.
- Failure summary and full command output both use safe fences.

## Verification Commands

- npm test -- tests/verification.test.ts -t "uses longer markdown fences"
- npm test -- tests/verification.test.ts
- npm run lint
- npm run typecheck

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Report output is untrusted markdown-adjacent text; keep it readable without allowing structure spoofing.

## Rollback Notes

Revert the verification renderer and regression test if dynamic fences break downstream Markdown rendering.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
