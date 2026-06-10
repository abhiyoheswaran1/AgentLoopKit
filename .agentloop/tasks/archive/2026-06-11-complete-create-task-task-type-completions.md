# Complete create-task task type completions

- Created date: 2026-06-11
- Task type: feature
- Status: done

## Problem Statement
Shell completions suggest task statuses and agent names, but not create-task --type values.

## Desired Outcome
Completion scripts for bash, zsh, fish, and PowerShell expose supported create-task task types from the shared TASK_TYPES list.

## Constraints
- Do not add dependencies
- Do not edit shell profile files
- Do not bump package version
- Do not publish a release

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/completions.ts
- tests/completion.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Generated completion scripts include feature, bugfix, test-generation, and migration for create-task type completion
- Completion values come from shared task type constants

## Verification Commands
- npm test -- completion
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
