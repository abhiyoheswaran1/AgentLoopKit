# Add built CLI smoke coverage for policy pack inventory

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
Near-term maintenance covers policy-pack source behavior, but the built CLI smoke script only exercises policy list and does not verify packaged policy pack inventory output.

## Desired Outcome
The built CLI smoke script verifies that agentloop policy packs --json lists bundled policy packs through dist/cli/index.js without applying policies or writing files.

## Constraints
- Do not change policy pack behavior, apply policies, fetch remote packs, publish, tag, or bump versions.
- Keep changes scoped to the smoke script and distribution-artifacts guard test.
- Preserve temp-repo safety and avoid writing policy files during this smoke step.

## Non-Goals
- No new policy packs or policy enforcement behavior.
- No public release prep.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- package.json
- CHANGELOG.md
- .github/workflows

## Acceptance Criteria
- Distribution-artifacts tests prove the smoke script calls policy packs --json.
- The smoke script asserts bundled policy pack names and positive policy counts.
- The smoke script logs a clear policy pack inventory pass message.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "CLI smoke script covers policy pack inventory"
- npm test -- tests/distribution-artifacts.test.ts
- npm run typecheck
- npm run build
- node scripts/smoke-cli.mjs

## Post-Verification Gates
- npm run dogfood
- npx --yes agentflight verify -- npm test -- tests/distribution-artifacts.test.ts
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Smoke assertions could become stale if bundled policy pack names intentionally change without updating the smoke guard.

## Rollback Notes
Remove the policy pack inventory smoke step and matching distribution-artifacts regression test.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
