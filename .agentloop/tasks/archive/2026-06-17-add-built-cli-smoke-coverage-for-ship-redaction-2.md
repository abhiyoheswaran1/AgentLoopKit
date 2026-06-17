# Add built CLI smoke coverage for ship redaction

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
Built CLI smoke coverage exercises ship output, but it does not yet prove that distributed ship --redact-paths keeps reviewer-facing JSON and GitHub-comment output free of local absolute paths.

## Desired Outcome
The smoke script and distribution guard prove ship --redact-paths redacts nested gate paths in JSON and GitHub-comment output while preserving review-readiness evidence.

## Constraints
- Tests-only behavior coverage; do not change ship semantics unless the built smoke exposes an implementation bug.
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
- Distribution artifact tests assert that the smoke script covers ship redaction.
- The built smoke script runs ship with --json --github-comment --redact-paths and validates redacted gate root and GitHub comment output.
- The built smoke script runs ship --github-comment --redact-paths in human mode and verifies it does not leak the smoke repository absolute path.
- Redacted ship output preserves readiness evidence and reports [git-root] for nested gate git root values.
- The smoke script prints Ship redaction smoke passed.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "ship redaction"
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
- Additional ship invocations in smoke can perturb latest-run ordering if placed before existing run-ledger assertions.

## Rollback Notes
Revert the smoke script assertions and matching distribution guard.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
