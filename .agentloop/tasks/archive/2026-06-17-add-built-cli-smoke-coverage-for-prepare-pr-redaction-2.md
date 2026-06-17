# Add built CLI smoke coverage for prepare-pr redaction

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
Built CLI smoke coverage exercises prepare-pr output, but it does not yet prove that distributed prepare-pr --redact-paths keeps reviewer-facing JSON and GitHub-comment output free of local absolute paths.

## Desired Outcome
The smoke script and distribution guard prove prepare-pr --redact-paths redacts local paths in PR body and GitHub-comment output while preserving title, readiness, and ship evidence.

## Constraints
- Tests-only behavior coverage; do not change prepare-pr semantics unless the built smoke exposes an implementation bug.
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
- Distribution artifact tests assert that the smoke script covers prepare-pr redaction.
- The built smoke script runs prepare-pr with --json --github-comment --redact-paths and validates redacted PR body and GitHub comment output.
- Redacted prepare-pr output preserves title suggestion, GitHub comment markdown, and ship evidence status.
- Redacted prepare-pr JSON does not leak the smoke repository absolute path.
- The smoke script prints Prepare-pr redaction smoke passed.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "prepare-pr redaction"
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
- Additional prepare-pr invocations in smoke can refresh ship evidence and affect later latest-artifact assumptions if placed too early.

## Rollback Notes
Revert the smoke script assertions and matching distribution guard.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
