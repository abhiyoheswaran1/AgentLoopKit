# Prepare 0.24.4 README pin patch

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
npm 0.24.3 published with README examples still pinning 0.24.2.

## Desired Outcome
Publish 0.24.4 with README examples pinned to the current release and release-status docs updated after publish.

## Constraints
- No CLI behavior changes.
- Keep release process through GitHub trusted publishing.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- npm package README examples reference 0.24.4.
- npm latest matches package.json after publish.

## Verification Commands
- npm run lint
- npm run typecheck
- npm test
- npm publish --access public --dry-run

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
