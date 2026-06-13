# Avoid same-minute evidence artifact overwrites

- Created date: 2026-06-13
- Task type: bugfix
- Status: done

## Problem Statement
Dogfooding showed repeated ship runs in the same minute allocate unique run ledger directories but reuse the same ship report and handoff Markdown filenames, overwriting earlier human-readable evidence.

## Desired Outcome
Repeated same-minute ship and handoff flows preserve separate Markdown artifacts while keeping run ledger IDs, JSON shapes, and public paths deterministic.

## Constraints
- None recorded yet.

## Non-Goals
- Do not change timestamp format.
- Do not change package version or cut a release.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/artifacts.ts
- src/core/ship.ts
- src/core/pr-summary.ts
- tests/ship.test.ts
- tests/handoff.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Two ship reports created with the same timestamp write distinct ship report paths.
- Two ship reports created with the same timestamp write distinct handoff paths.
- Existing path safety checks still constrain generated artifacts to the configured AgentLoop directories.

## Verification Commands
- npm test -- tests/ship.test.ts tests/handoff.test.ts
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
- Artifact lookup patterns may need to recognize suffixed filenames without breaking existing files.

## Rollback Notes
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
