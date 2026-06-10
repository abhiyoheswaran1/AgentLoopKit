# Add JSON output to list-templates

- Created date: 2026-06-11
- Task type: feature
- Status: done

## Problem Statement
agentloop list-templates is useful for agents but only prints grouped human text today.

## Desired Outcome
agentloop list-templates --json returns the grouped template map in a stable JSON shape while preserving human output by default.

## Constraints
- Do not change existing human output
- Do not add dependencies
- Do not bump package version
- Do not publish a release

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/list-templates.ts
- tests/list-templates.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- list-templates keeps grouped human output
- list-templates --json returns parseable grouped template data

## Verification Commands
- npm test -- list-templates
- npm test
- npm run typecheck
- npm run build

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
