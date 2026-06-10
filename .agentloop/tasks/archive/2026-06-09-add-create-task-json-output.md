# Add create-task JSON output

- Created date: 2026-06-09
- Task type: feature
- Status: done

## Problem Statement

Dogfooding tried create-task --json for release automation, but the command rejected the option.

## Desired Outcome

agentloop create-task --json returns a machine-readable object with the created task path and markdown content while preserving existing text output by default.

## Constraints

- None recorded yet.

## Non-Goals

- None recorded yet.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- None recorded yet.

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- create-task --json prints valid JSON
- default create-task output remains unchanged
- tests cover JSON output

## Verification Commands

- npx pnpm@10.12.1 test tests/create-task.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build
- npx projscan doctor --format markdown

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
