# Add built CLI smoke coverage for status and next redaction

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
status and next have source-level redaction coverage, but the built CLI smoke script does not exercise their --redact-paths human and JSON paths. A packaging or smoke-script regression could drop this common public-output coverage without a distribution guard failing.

## Desired Outcome
The built CLI smoke script exercises status and next redaction in human and JSON modes, and distribution artifact tests pin that coverage.

## Constraints
- Do not release, publish, tag, or bump versions.
- Keep changes scoped to smoke coverage and distribution guards.
- Do not change status or next command semantics.

## Non-Goals
- Do not add new redaction behavior beyond the existing status and next flags.
- Do not mutate external services or release channels.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- tests/distribution-artifacts.test.ts
- scripts/smoke-cli.mjs

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- A focused distribution artifact test fails before the smoke coverage exists and passes after implementation.
- The smoke script runs status with --redact-paths and --json --redact-paths.
- The smoke script runs next with --redact-paths and --json --redact-paths.
- The smoke assertions preserve status/next review data while rejecting smoke repo absolute path leaks.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "status and next redaction"
- npm test -- tests/distribution-artifacts.test.ts
- npx prettier --check tests/distribution-artifacts.test.ts scripts/smoke-cli.mjs
- npm run build
- node scripts/smoke-cli.mjs

## Post-Verification Gates
- node dist/cli/index.js verify --task .agentloop/tasks/2026-06-17-add-built-cli-smoke-coverage-for-status-and-next-redaction.md --write-run --json --redact-paths
- npm run dogfood:strict
- npm run maintenance:check

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- The main risk is brittle smoke-script string matching in the distribution guard.

## Rollback Notes
Revert the status/next smoke assertions and matching distribution guard.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
