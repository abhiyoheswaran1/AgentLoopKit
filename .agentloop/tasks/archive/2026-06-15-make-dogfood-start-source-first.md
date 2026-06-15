# Make dogfood start source-first

- Created date: 2026-06-15
- Task type: bugfix
- Status: done

## Problem Statement
The repo-local dogfood start helper calls dist/cli/index.js for AgentLoop commands, which can fail in fresh contributor checkouts before a build exists.

## Desired Outcome
dogfood:start uses the source CLI through tsx so it works before dist is built, while preserving command order and local-first safety.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/dogfood-start.mjs
- tests/dogfood-start-script.test.ts

## Files or Areas Not to Touch
- README.md

## Acceptance Criteria
- AgentLoop commands in dogfood:start use npx --no-install tsx src/cli/index.ts instead of node dist/cli/index.js.
- Tests fail if dogfood:start regresses to requiring dist for AgentLoop commands.

## Verification Commands
- npm test -- tests/dogfood-start-script.test.ts
- npm run test:unit
- npm run typecheck
- npm run lint

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- This affects repo-local maintainer automation only; avoid changing public CLI behavior.

## Rollback Notes
Revert the dogfood-start helper and test changes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
