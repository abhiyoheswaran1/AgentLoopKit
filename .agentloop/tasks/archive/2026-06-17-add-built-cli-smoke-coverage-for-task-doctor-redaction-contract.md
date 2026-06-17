# Add built CLI smoke coverage for task-doctor redaction

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
task doctor --redact-paths has source-level coverage, but the built CLI smoke flow does not prove the packaged command accepts the flag in human and JSON modes.

## Desired Outcome
The built CLI smoke script runs task doctor --redact-paths and task doctor --json --redact-paths in the temp repo, verifies the command passes, and checks the JSON output does not leak the absolute smoke repo path.

## Constraints
- Keep this as smoke coverage only; do not change task-doctor behavior unless the smoke exposes a real packaged CLI bug.
- Do not release, version bump, publish, tag, or touch Marketplace/Scoop/WinGet work.
- Keep the fixture bounded to the temporary smoke repo.

## Non-Goals
- No new task-doctor diagnostics or JSON shape changes.
- No AgentFlight or ProjScan implementation changes.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- A focused distribution-artifacts guard test fails before task-doctor redaction smoke assertions exist and passes after implementation.
- node scripts/smoke-cli.mjs exercises built task doctor --redact-paths in human and JSON modes.
- The smoke asserts JSON status pass and no absolute smoke repo path leak.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "task-doctor redaction"
- npm test -- tests/distribution-artifacts.test.ts
- npx prettier --check scripts/smoke-cli.mjs tests/distribution-artifacts.test.ts
- npm run build
- node scripts/smoke-cli.mjs

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the smoke-script task-doctor redaction assertions and distribution-artifacts guard test.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
