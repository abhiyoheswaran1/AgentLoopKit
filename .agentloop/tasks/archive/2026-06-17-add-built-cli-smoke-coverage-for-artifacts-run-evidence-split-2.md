# Add built CLI smoke coverage for artifacts run evidence split

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
The source tests cover the human artifacts run evidence split, but the built CLI smoke flow does not assert that artifacts --type run --latest renders the split after ship writes a run.

## Desired Outcome
The built CLI smoke flow fails if human artifacts run output stops showing the non-evidence versus AgentLoop evidence split, while JSON smoke coverage remains unchanged.

## Constraints
- Keep this to smoke coverage and test guards; do not change runtime artifacts behavior.
- Do not publish, version bump, tag, or run release-channel workflows.

## Non-Goals
- No new artifact inventory fields, cleanup automation, or release prep.

## Assumptions
- The smoke repository already creates a ship run with changed-files evidence that includes both source/task files and AgentLoop evidence.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- package.json version
- CHANGELOG.md release entries

## Acceptance Criteria
- scripts/smoke-cli.mjs runs artifacts --type run --latest after ship and asserts the latest ship run line includes changed file(s), non-evidence, and AgentLoop evidence.
- A focused test guards that the built CLI smoke script includes this artifacts run split assertion.
- No artifacts JSON schema or runtime command behavior changes are introduced.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts
- npm run build
- node scripts/smoke-cli.mjs
- npm run typecheck

## Post-Verification Gates
- npm run dogfood
- npx --yes agentflight verify -- npm test -- tests/distribution-artifacts.test.ts
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Built smoke is slower than unit tests; keep assertions precise and avoid adding network or release-channel work.

## Rollback Notes
Revert the smoke script and focused distribution test changes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
