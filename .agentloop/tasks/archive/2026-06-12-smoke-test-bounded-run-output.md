# Smoke test bounded run output

- Created date: 2026-06-12
- Task type: tests
- Status: done

## Problem Statement
agentloop runs --latest and --limit have source tests, but the built CLI smoke script does not yet prove the packaged binary accepts and behaves with the new run ledger flags.

## Desired Outcome
The built CLI smoke flow covers runs --latest and runs --limit <count> --json against a generated smoke repo with run ledger entries.

## Constraints
- Keep smoke deterministic and cross-platform.
- Do not add network calls or release side effects.
- Do not change runtime command behavior.

## Non-Goals
- No release or version bump.
- No new command flags.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- scripts/smoke-cli.mjs runs the built CLI with runs --latest.
- scripts/smoke-cli.mjs runs the built CLI with runs --limit 2 --json and checks the result count.
- Distribution artifact tests assert the smoke script covers the new flags.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts
- npm run build && node scripts/smoke-cli.mjs
- npm test

## Post-Verification Gates
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Smoke script changes can slow CI or become flaky if they depend on timestamps too tightly.

## Rollback Notes
Revert the smoke script and distribution-artifact assertions.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
