# Add built CLI smoke coverage for handoff redaction

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
Built CLI smoke coverage exercises handoff output, but it does not yet prove that distributed handoff --redact-paths keeps JSON output and generated handoff summaries free of local absolute paths.

## Desired Outcome
The smoke script and distribution guard prove handoff --redact-paths redacts local paths in JSON output and written handoff summaries while preserving summary generation and run evidence.

## Constraints
- Tests-only behavior coverage; do not change handoff semantics unless the built smoke exposes an implementation bug.
- Do not touch package versions, lockfiles, changelog, release workflows, or publishing metadata.
- Keep the task scoped to built CLI smoke coverage and its distribution guard.

## Non-Goals
- Do not publish, tag, release, or cut a version.
- Do not revive deferred Marketplace, Scoop, or WinGet tasks.

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
- Distribution artifact tests assert that the smoke script covers handoff redaction.
- The built smoke script runs handoff with --json --redact-paths and validates redacted JSON output.
- The built smoke script validates the generated handoff summary does not leak the smoke repository absolute path.
- Redacted handoff output preserves outPath and run evidence.
- The smoke script prints Handoff redaction smoke passed.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "handoff redaction"
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
- Additional handoff invocations in smoke write summaries and may affect later latest-artifact assumptions if placed too late.

## Rollback Notes
Revert the smoke script assertions and matching distribution guard.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
