# Return JSON errors for invalid npm registry files

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
agentloop npm-status --registry-json can fail through the global human error path when the captured registry file is missing or malformed, even when --json is requested.

## Desired Outcome
npm-status returns parseable JSON errors for invalid captured registry JSON inputs and does not treat registry-file problems as success.

## Constraints
- Do not change live npm view behavior.
- Keep default non-JSON errors readable.
- Do not read npm tokens or env files.

## Non-Goals
- Publish or check the real npm registry during tests.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/npm-status.ts
- src/core/npm-status.ts
- tests/npm-status.test.ts
- docs/npm-status.md
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- npm-status --registry-json missing --json exits non-zero with a structured error
- npm-status --registry-json malformed --json exits non-zero with a structured error
- non-JSON users still get a readable error

## Verification Commands
- npm test -- tests/npm-status.test.ts
- npm run lint
- npm run typecheck
- npm test
- npm run check:links
- npm run build
- git diff --check
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the commit that adds captured registry-file validation to `npm-status`, removes the matching tests, and removes the README/npm-status/changelog notes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
