# Return JSON errors for invalid npm-status timeouts

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
agentloop npm-status --timeout-ms currently lets Commander reject invalid timeout values before the command can honor --json.

## Desired Outcome
npm-status returns parseable JSON errors for invalid timeout values when --json is requested, while default CLI output remains readable.

## Constraints
- Do not change valid timeout behavior.
- Do not run live npm registry calls in tests.
- Do not change release publishing behavior.

## Non-Goals
- Add new timeout options.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/npm-status.ts
- tests/npm-status.test.ts
- docs/npm-status.md
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- npm-status --timeout-ms nope --json exits non-zero with a structured timeout error
- npm-status --timeout-ms 0 --json exits non-zero with the same structured timeout error
- npm-status --timeout-ms nope without --json keeps a readable stderr error

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
Revert the commit that moves npm-status timeout parsing into the command action, removes the timeout JSON-error tests, and removes the README/npm-status/changelog notes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
