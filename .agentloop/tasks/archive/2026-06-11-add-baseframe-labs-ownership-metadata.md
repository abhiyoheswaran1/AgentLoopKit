# Add Baseframe Labs ownership metadata

- Created date: 2026-06-11
- Task type: docs
- Status: done

## Problem Statement
AgentLoopKit now belongs under Baseframe Labs, but package metadata and user-facing docs do not make the ownership clear.

## Desired Outcome
npm and GitHub readers can see AgentLoopKit is a Baseframe Labs open-source developer tool without adding internal release history or changing the package version.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- package.json
- README.md
- tests/package-metadata.test.ts
- CHANGELOG.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- package.json includes Baseframe Labs author metadata
- README mentions Baseframe Labs in a concise user-facing way
- tests prevent accidental removal of the public package metadata

## Verification Commands
- npm test -- tests/package-metadata.test.ts
- npm test
- npm run lint
- npm run typecheck
- npm run check:links
- npm run build
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the metadata/docs/test changes

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
