# Harden doctor Markdown output

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement

agentloop doctor still interpolates check statuses, check names, messages, paths, strict mode, overall status, and next-action commands directly into human Markdown.

## Desired Outcome

Doctor Markdown uses shared safe inline-code formatting for local values, while JSON output keeps raw values for automation.

## Constraints

- None recorded yet.

## Non-Goals

- Do not change doctor checks, risk scanning, next-action selection, strict-mode semantics, or JSON schema.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/doctor.ts
- tests/doctor.test.ts

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- Doctor human Markdown safely formats check statuses, names, messages, path-like values, overall status, strict mode, and next-action commands when values contain backticks.
- Doctor JSON output preserves raw values for automation.

## Verification Commands

- npm test -- tests/doctor.test.ts
- npm run lint
- npm run typecheck
- npm test

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Document how to revert or disable this change.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
