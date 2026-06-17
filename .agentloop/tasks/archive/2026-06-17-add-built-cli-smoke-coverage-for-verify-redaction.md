# Add built CLI smoke coverage for verify redaction

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
Built CLI smoke coverage exercises verify output, but it does not yet prove that distributed verify --redact-paths keeps verification JSON and written reports free of local absolute paths.

## Desired Outcome
The smoke script and distribution guard prove verify --redact-paths redacts local paths in JSON output and the generated verification report while preserving verification status and command evidence.

## Constraints
- Tests-only behavior coverage; do not change verify semantics unless the built smoke exposes an implementation bug.
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
- Distribution artifact tests assert that the smoke script covers verify redaction.
- The built smoke script runs verify with --json --redact-paths and validates redacted JSON output.
- The built smoke script validates the generated verification report does not leak the smoke repository absolute path.
- Redacted verify output preserves overall status and command evidence.
- The smoke script prints Verify redaction smoke passed.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "verify redaction"
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
- Additional verify invocations in smoke write reports and may affect later latest-artifact assumptions if placed too late.

## Rollback Notes
Revert the smoke script assertions and matching distribution guard.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
