# Smoke test verify progress flag

- Created date: 2026-06-12
- Task type: tests
- Status: done

## Problem Statement
agentloop verify --progress is implemented and tested through source CLI paths, but the built CLI smoke flow does not prove the packaged binary accepts and formats the flag.

## Desired Outcome
Built CLI smoke coverage exercises verify --progress and confirms progress lines are bounded and raw child output stays out of stdout.

## Constraints
- Keep the smoke check cross-platform.
- Do not make the smoke flow depend on network access.
- Keep JSON verify smoke unchanged.

## Non-Goals
- Do not expand release smoke beyond this flag.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- .agentloop/backlog.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- scripts/smoke-cli.mjs runs a built CLI verify --progress command.
- The smoke assertion checks start and finish progress lines.
- The smoke assertion checks child command output is not streamed into progress stdout.

## Verification Commands
- node scripts/smoke-cli.mjs
- npm test -- tests/distribution-artifacts.test.ts
- npm run lint
- npm run typecheck
- git diff --check

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- The smoke flow must stay stable across Ubuntu, macOS, and Windows.

## Rollback Notes
Remove the verify --progress smoke step and assertions.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
