# Add built CLI smoke coverage for release-check redaction

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
Source tests cover release-check --redact-paths, but the built CLI smoke script does not exercise release-check redaction. That leaves packaged CLI behavior for a public, shareable release-readiness command unverified.

## Desired Outcome
The built CLI smoke script exercises release-check in human and JSON modes with --redact-paths, proves the redacted output does not leak the absolute smoke repo path, and a distribution guard locks the coverage.

## Constraints
- Keep changes scoped to built smoke coverage and its guard test.
- Do not change release-check semantics, JSON shape, release readiness rules, release channels, package versions, dependencies, lockfiles, tags, or publishing workflows.
- Use TDD: add a focused failing distribution guard before editing the smoke script.

## Non-Goals
- Do not run release actions or modify release-channel configuration.
- Do not change release-check behavior beyond proving existing --redact-paths support in built smoke.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- CHANGELOG.md
- .github/workflows

## Acceptance Criteria
- tests/distribution-artifacts.test.ts contains a focused guard proving scripts/smoke-cli.mjs covers release-check redaction.
- scripts/smoke-cli.mjs prepares a local release-check smoke repo and runs release-check in default, human redacted, JSON, and JSON redacted modes.
- The smoke asserts redacted release-check output replaces the absolute git root with [git-root] and does not leak the absolute smoke repo path.
- node scripts/smoke-cli.mjs prints Release-check redaction smoke passed.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "release-check redaction"
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
- release-check is release-adjacent and reviewer-facing; this task must remain read-only smoke coverage and must not publish, tag, bump versions, or alter release gates.

## Rollback Notes
Remove the release-check redaction smoke block from scripts/smoke-cli.mjs and the focused guard from tests/distribution-artifacts.test.ts.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
