# Harden CI summary Markdown output

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement

agentloop ci-summary still interpolates artifact titles, evidence paths, gate statuses, gate names, gate messages, timestamps, and next-action commands directly into Markdown.

## Desired Outcome

CI summary Markdown uses shared safe inline-code formatting for user-controlled and filesystem-derived values, while JSON output keeps raw values for automation.

## Constraints

- None recorded yet.

## Non-Goals

- Do not change CI summary evidence discovery, gate decisions, file writes, or release behavior.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/ci-summary.ts
- tests/ci-summary.test.ts

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- CI summary Markdown safely formats artifact titles, paths, gate details, status values, timestamps, and next-action commands when values contain backticks.
- JSON output preserves raw values for automation.

## Verification Commands

- npm test -- tests/ci-summary.test.ts
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
