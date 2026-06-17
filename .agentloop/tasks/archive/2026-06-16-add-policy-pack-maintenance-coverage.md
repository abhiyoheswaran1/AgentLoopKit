# Add policy-pack maintenance coverage

- Created date: 2026-06-16
- Task type: tests
- Status: done

## Problem Statement
The near-term maintenance guard lists policy-pack inventory, but it does not directly run the focused policy-pack safety tests that protect local-only, bounded, no-overwrite behavior.

## Desired Outcome
maintenance:check includes a focused policy-pack safety test step while preserving the existing policy-pack inventory step and documenting the guard in public docs.

## Constraints
- Keep policy packs local-only and deterministic; do not add remote pack support, policy enforcement, telemetry, token reads, or API calls.
- Do not change bundled policy-pack behavior beyond maintenance coverage and docs.
- Do not release, publish, tag, or bump versions.

## Non-Goals
- No new bundled policy packs.
- No remote policy registry, compliance claims, or enforcement engine.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/maintenance-check.mjs
- tests/maintenance-check-script.test.ts
- tests/policy-packs.test.ts
- docs/maintenance-guards.md
- README.md

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- package-lock.json

## Acceptance Criteria
- maintenance:check runs both the existing policy pack inventory command and npm test -- tests/policy-packs.test.ts.
- Tests lock the maintenance step list so the policy-pack safety step cannot disappear silently.
- Public docs mention direct policy-pack safety coverage without implying compliance, remote packs, or enforcement.
- No release, version bump, publish, tag, dependency, or lockfile changes.

## Verification Commands
- npm test -- tests/maintenance-check-script.test.ts tests/policy-packs.test.ts
- npm run typecheck
- npm run lint
- npm run build
- npm test

## Post-Verification Gates
- npm run maintenance:check
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- maintenance:check runtime increases slightly because it runs one focused test file.

## Rollback Notes
Revert the maintenance-check step, related tests, and docs changes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
