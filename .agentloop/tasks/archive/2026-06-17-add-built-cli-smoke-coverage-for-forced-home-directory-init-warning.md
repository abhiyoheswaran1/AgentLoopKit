# Add built CLI smoke coverage for forced home-directory init warning

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
The forced home-directory init warning is covered by unit tests, but the built CLI smoke script does not exercise the human dry-run warning path. Distribution smoke coverage should catch regressions in packaged CLI output without touching release channels.

## Desired Outcome
The built CLI smoke flow verifies that init --dry-run --force in a temporary HOME prints the non-fatal warning, reports no writes, and leaves harness files absent.

## Constraints
- Do not publish, tag, bump versions, or prepare release-channel artifacts.
- Keep coverage local-only and scoped to smoke/distribution tests.
- Do not broaden filesystem scans beyond the temporary smoke directory.

## Non-Goals
- Changing init product behavior beyond test-hardening coverage.
- Running packed release smoke or release-proof flows.

## Assumptions
- Existing unit tests define the intended forced-home warning contract.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- scripts/smoke-cli.mjs exercises init --dry-run --force with HOME pointing at an isolated temporary directory.
- The smoke script asserts the warning text, dry-run no-write output, and absence of AgentLoop harness files.
- tests/distribution-artifacts.test.ts locks the smoke script coverage so future edits do not drop it.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "CLI smoke script covers forced home-directory init warning"
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
- Smoke script changes can be OS-sensitive around HOME and realpath handling.
- Output assertions should stay stable without overfitting unrelated CLI copy.

## Rollback Notes
Revert the smoke-script assertions and distribution-artifacts coverage test.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
