# Add built CLI smoke coverage for upgrade-harness redaction

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
The built CLI smoke script exercises upgrade-harness --json --redact-paths, but the distribution artifact guard does not pin that coverage. A future smoke-script edit could drop upgrade-harness redaction coverage without a focused distribution test failing.

## Desired Outcome
Distribution artifact tests assert that the built smoke script covers upgrade-harness redaction behavior and its safety checks.

## Constraints
- Do not release, publish, tag, or bump versions.
- Keep the change scoped to smoke coverage tests unless the red test exposes a real smoke-script bug.
- Do not mutate release channels or external services.

## Non-Goals
- Do not change upgrade-harness command semantics.
- Do not add broad scans or cleanup automation.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- tests/distribution-artifacts.test.ts
- scripts/smoke-cli.mjs

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- A focused distribution artifact test fails before the guard exists and passes after the guard is added.
- The guard checks that the smoke script invokes upgrade-harness with --json --redact-paths.
- The guard checks that the smoke script asserts read-only behavior and redacts the target directory.
- The guard checks that the smoke script prints Harness upgrade smoke passed.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "upgrade-harness redaction"
- npm test -- tests/distribution-artifacts.test.ts
- npx prettier --check tests/distribution-artifacts.test.ts scripts/smoke-cli.mjs
- npm run build
- node scripts/smoke-cli.mjs

## Post-Verification Gates
- node dist/cli/index.js verify --task .agentloop/tasks/2026-06-17-add-built-cli-smoke-coverage-for-upgrade-harness-redaction.md --write-run --json --redact-paths
- npm run dogfood:strict
- npm run maintenance:check

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- The main risk is overfitting the distribution test to incidental smoke-script formatting.

## Rollback Notes
Revert the distribution-artifact guard and any smoke-script adjustment made for this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
