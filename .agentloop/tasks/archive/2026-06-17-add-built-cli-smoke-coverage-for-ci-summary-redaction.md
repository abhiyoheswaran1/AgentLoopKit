# Add built CLI smoke coverage for CI summary redaction

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
Source tests cover ci-summary --write --redact-paths, but the built CLI smoke does not prove the packaged command redacts local roots in JSON or written summary output.

## Desired Outcome
The built smoke creates CI summary output in its temp AgentLoop repo with --redact-paths and asserts no absolute smoke repo path leaks while preserving the actual written file.

## Constraints
- Keep changes scoped to built smoke coverage and its guard test.
- Use only temp smoke fixtures; do not mutate release channels or current repo evidence outside normal AgentLoop task artifacts.
- Preserve ci-summary JSON/runtime semantics unless the smoke exposes a real bug.

## Non-Goals
- No new ci-summary feature work beyond smoke coverage.
- No release prep, version bump, tag, publish, marketplace, Scoop, or WinGet work.

## Assumptions
- Existing source tests already cover ci-summary redaction behavior; this task adds packaged CLI confidence.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- .github/workflows
- CHANGELOG.md

## Acceptance Criteria
- A focused distribution-artifacts guard test fails before CI summary redaction smoke coverage exists and passes after implementation.
- node scripts/smoke-cli.mjs runs built ci-summary --write --json --redact-paths using an absolute temp output path and verifies the JSON written path is redacted.
- The smoke verifies the written CI summary exists and neither command output nor written summary leaks the absolute smoke repo path.
- The smoke logs CI summary redaction smoke passed.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "CI summary redaction"
- npm test -- tests/distribution-artifacts.test.ts
- npx prettier --check scripts/smoke-cli.mjs tests/distribution-artifacts.test.ts
- npm run build
- node scripts/smoke-cli.mjs

## Post-Verification Gates
- npm run dogfood:strict
- npm run maintenance:check

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- CI summary writes local evidence files; keep output inside the smoke temp repo and assert the current repository path is not exposed.

## Rollback Notes
Revert scripts/smoke-cli.mjs and tests/distribution-artifacts.test.ts changes for this task; no persistent runtime data model changes are expected.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
