# Preflight dogfood-start task type before AgentFlight

- Created date: 2026-06-17
- Task type: bugfix
- Status: done

## Problem Statement
dogfood:start accepts unsupported --type values, starts AgentFlight, and only then lets agentloop create-task fail. The exact failure hit during dogfood was --type test, which should either be normalized to tests or rejected before side effects.

## Desired Outcome
dogfood:start normalizes the common test alias to tests, rejects other unsupported task types before starting AgentFlight, and documents the supported type set in help/tests.

## Constraints
- Use TDD: add failing dogfood-start tests before changing the script.
- Do not change AgentLoop create-task task types or public release metadata.
- Do not start release prep, publish, tag, or touch registry/channel files.

## Non-Goals
- No new task type in AgentLoop create-task.
- No dependency changes or workflow changes.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/dogfood-start.mjs
- tests/dogfood-start-script.test.ts

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- CHANGELOG.md
- .github/workflows

## Acceptance Criteria
- parseArgs normalizes --type test to tests.
- parseArgs rejects unsupported task types with a clear message before runDogfoodStart can execute AgentFlight.
- dogfood-start dry-run prints create-task --type tests for --type test.
- Help output lists supported task types or points users to the supported set.

## Verification Commands
- npm test -- tests/dogfood-start-script.test.ts -t "task type"
- npx prettier --check scripts/dogfood-start.mjs tests/dogfood-start-script.test.ts
- npm test -- tests/dogfood-start-script.test.ts
- npm run build

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Low-to-medium DX risk: this changes repo dogfood helper input validation before companion tools start.

## Rollback Notes
Revert the dogfood-start parser changes and their focused tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
