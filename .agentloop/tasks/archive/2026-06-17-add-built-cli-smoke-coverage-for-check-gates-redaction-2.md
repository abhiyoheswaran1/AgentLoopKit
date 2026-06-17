# Add built CLI smoke coverage for check-gates redaction

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
Built CLI smoke coverage exercises check-gates JSON output, but it does not yet prove that the distributed check-gates command preserves gate decisions while redacting absolute repo paths.

## Desired Outcome
The smoke script and distribution guard prove check-gates --redact-paths works for human and JSON output without changing gate decisions or leaking the smoke repo path.

## Constraints
- Tests-only behavior coverage; do not change check-gates semantics unless a smoke failure exposes an implementation bug.
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
- Distribution artifact tests assert that the smoke script covers check-gates redaction.
- The built smoke script runs check-gates in human and JSON modes with and without --redact-paths.
- Redacted check-gates JSON reports git.root as [git-root] and keeps gate decisions aligned with unredacted JSON.
- Redacted human and JSON output do not leak the smoke repository absolute path.
- The smoke script prints Check-gates redaction smoke passed.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "check-gates redaction"
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
- Smoke coverage changes can make the distribution smoke script slower or brittle if assertions depend on transient evidence.

## Rollback Notes
Revert the smoke script assertions and matching distribution guard.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
