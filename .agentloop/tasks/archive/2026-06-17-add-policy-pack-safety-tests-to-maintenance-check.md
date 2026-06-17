# Add policy pack safety tests to maintenance check

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
The near-term maintenance gate lists policy-pack inventory, but it does not directly run the focused policy-pack safety tests that protect local-only, no-overwrite, and bounded policy-pack behavior.

## Desired Outcome
npm run maintenance:check includes an explicit policy pack safety tests step while preserving the existing policy-pack inventory check and public docs describe that safety coverage without compliance or remote-pack claims.

## Constraints
- Do not add remote policy packs, policy enforcement engines, new bundled packs, overwrite behavior, API calls, token reads, env-file reads, dependency changes, release prep, publishing, or Marketplace work.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/maintenance-check.mjs
- tests/maintenance-check-script.test.ts
- docs/maintenance-guards.md
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- A failing guard test proves the maintenance-check step list lacks policy pack safety tests before implementation.
- npm run maintenance:check runs npm test -- tests/policy-packs.test.ts as a named policy pack safety tests step while keeping the policy packs --json inventory step.
- Public docs mention direct policy-pack safety coverage in user-facing language without implying compliance, remote packs, or enforcement.

## Verification Commands
- npm test -- tests/maintenance-check-script.test.ts -t "maintenance check includes policy pack safety tests"
- npm test -- tests/maintenance-check-script.test.ts
- npm run maintenance:check
- npm run typecheck
- npm run build

## Post-Verification Gates
- npm run dogfood
- npx --yes agentflight verify -- npm test -- tests/maintenance-check-script.test.ts
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the maintenance-check step, the maintenance-check script guard test, and the public docs wording; no persistent runtime state or dependency changes are expected.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
