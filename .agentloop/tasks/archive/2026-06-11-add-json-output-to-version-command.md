# Add JSON output to version command

- Created date: 2026-06-11
- Task type: feature
- Status: done

## Problem Statement
agentloop version is useful in scripts but only prints the raw version string.

## Desired Outcome
agentloop version --json returns a stable object with the package version while agentloop version keeps printing the plain version string.

## Constraints
- Do not change the top-level -V behavior
- Do not bump package version
- Do not publish a release

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/version.ts
- tests/version.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop version remains plain text
- agentloop version --json returns { version }

## Verification Commands
- npm test -- version
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
