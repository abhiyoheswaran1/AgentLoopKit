# Add built CLI smoke coverage for install-agent redaction

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
install-agent --redact-paths is covered by source tests, but the built CLI smoke path does not prove packaged JSON output preserves redacted public paths while still writing the agent guide.

## Desired Outcome
The built CLI smoke script exercises install-agent codex --json --redact-paths from a nested directory and asserts redacted output plus real file preservation.

## Constraints
- Do not change install-agent runtime behavior beyond fixing any bug the smoke exposes.
- Do not release, publish, bump versions, call external APIs, or mutate release channels.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- A focused distribution-artifacts test fails before the smoke guard exists and passes after implementation.
- The smoke script asserts redacted install-agent JSON uses [git-root] and does not leak the temp smoke repo path.
- Existing install-agent preservation smoke remains intact.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "install-agent redaction"
- npm test -- tests/distribution-artifacts.test.ts
- npx prettier --check scripts/smoke-cli.mjs tests/distribution-artifacts.test.ts

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the smoke-script assertions and the distribution-artifacts guard test.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
