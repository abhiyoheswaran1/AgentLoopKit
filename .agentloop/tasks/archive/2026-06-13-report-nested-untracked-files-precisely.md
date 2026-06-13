# Report nested untracked files precisely

- Created date: 2026-06-13
- Task type: bugfix
- Status: done

## Problem Statement
Changed-file evidence can collapse a newly added directory to one git status shorthand path, which makes run ledgers, handoffs, ship reports, and maintainer checks less precise.

## Desired Outcome
AgentLoopKit records individual nested untracked file paths when git can provide them, without adding a parser dependency or changing release metadata.

## Constraints
- None recorded yet.

## Non-Goals
- Do not add a new git parser dependency.
- Do not change release metadata or cut a version.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/git.ts
- tests/git.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Git status helper returns nested untracked file paths for a newly added directory.
- Existing changed-file consumers continue to use the same GitFileStatus shape.

## Verification Commands
- npm test -- tests/git.test.ts
- npm run typecheck
- npm run build
- npm test

## Post-Verification Gates
- node dist/cli/index.js verify --task-commands --write-run
- node dist/cli/index.js check-gates --redact-paths --strict
- node dist/cli/index.js ship --redact-paths

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Large untracked directories can create more changed-file entries; rely only on git's built-in porcelain option and existing ignore behavior.

## Rollback Notes
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
