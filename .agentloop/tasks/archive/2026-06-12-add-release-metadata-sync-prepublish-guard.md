# Add release metadata sync prepublish guard

- Created date: 2026-06-12
- Task type: bugfix
- Status: done

## Problem Statement
The 0.28.2 release gate failed late because server.json still listed 0.28.1 while package.json had 0.28.2.

## Desired Outcome
Prepublish metadata checks fail fast when server.json package metadata drifts from package.json.

## Constraints
- None recorded yet.

## Non-Goals
- Do not change release workflows or publish another version.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- prepublish check fails when server.json top-level version differs from package.json
- prepublish check fails when server.json package version differs from package.json
- error output names the mismatched file and expected version

## Verification Commands
- npm test -- tests/prepublish-check.test.ts
- node scripts/prepublish-check.mjs
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Release metadata checks can block publishing if they are too broad or brittle.

## Rollback Notes
Revert the prepublish-check validation and tests if it blocks valid release metadata.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- Run `npm run dogfood:strict` after the AgentLoop verification report exists.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
