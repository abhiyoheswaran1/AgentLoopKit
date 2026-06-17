# Add built CLI smoke coverage for run ledger redaction

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
Source tests cover runs, show-run, and intent accepting --redact-paths, but the built CLI smoke script only exercises the basic run-ledger paths. That leaves packaged CLI behavior for the common redaction flag unverified.

## Desired Outcome
The built CLI smoke script exercises runs, show-run, and intent with --redact-paths in human and JSON modes, confirms outputs remain display-safe and semantically unchanged, and the distribution guard test locks the coverage.

## Constraints
- Keep changes scoped to built smoke coverage and its guard test.
- Do not change run-ledger semantics, JSON shape, path discovery, release channels, package versions, dependencies, or lockfiles.
- Use TDD: add a focused failing distribution guard before editing the smoke script.

## Non-Goals
- Do not modify run ledger command behavior beyond proving existing --redact-paths support in built smoke.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- CHANGELOG.md

## Acceptance Criteria
- tests/distribution-artifacts.test.ts contains a focused guard proving scripts/smoke-cli.mjs covers run ledger redaction.
- scripts/smoke-cli.mjs runs runs --latest, show-run <id>, and intent <file> with --redact-paths in human and JSON modes.
- The smoke asserts redacted run-ledger outputs match the existing display-safe unredacted outputs and do not leak the absolute smoke repo path.
- node scripts/smoke-cli.mjs prints Run ledger redaction smoke passed.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "run ledger redaction"
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
- Run ledger output is reviewer-facing evidence; keep this as smoke coverage for existing display-safe output.

## Rollback Notes
Remove the run-ledger redaction smoke block from scripts/smoke-cli.mjs and the focused guard from tests/distribution-artifacts.test.ts.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
