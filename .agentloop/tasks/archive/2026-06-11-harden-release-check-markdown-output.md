# Harden release-check Markdown output

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement

agentloop release-check still interpolates release check statuses, names, messages, paths, git metadata, package labels, changed-file counts, and next-action commands directly into Markdown.

## Desired Outcome

Release-check Markdown uses shared safe inline-code formatting for user-controlled and filesystem-derived values, while JSON output keeps raw values for automation.

## Constraints

- None recorded yet.

## Non-Goals

- Do not change release-readiness decisions, npm publishing behavior, git operations, or file writes.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/release-check.ts
- tests/release-check.test.ts

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- Release-check Markdown safely formats package labels, git metadata, check details, paths, status values, changed-file counts, and next-action commands when values contain backticks.
- JSON output preserves raw values for automation.

## Verification Commands

- npm test -- tests/release-check.test.ts
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
