# Add built CLI smoke coverage for maintainer-check redaction

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
maintainer-check --redact-paths has source-level coverage, but the built CLI smoke script only exercises unredacted maintainer-check JSON output.

## Desired Outcome
The smoke script and distribution guard prove maintainer-check --redact-paths preserves maintainer reviewability data while redacting the smoke repo path in human and JSON output.

## Constraints
- Tests-only behavior coverage; do not change maintainer-check semantics unless the smoke exposes an implementation bug.
- Do not release, version bump, publish, tag, or touch package-manager lockfiles.
- Keep coverage bounded to distribution guard and smoke assertions.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- tests/distribution-artifacts.test.ts
- scripts/smoke-cli.mjs

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Distribution artifact tests assert that the smoke script covers maintainer-check redaction.
- The built smoke script runs maintainer-check in human and JSON modes with and without --redact-paths.
- Redacted maintainer-check JSON preserves status and checks while not leaking the smoke repository absolute path.
- Redacted maintainer-check human output includes the maintainer-check heading and does not leak the smoke repository absolute path.
- The smoke script prints Maintainer-check redaction smoke passed.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "maintainer-check redaction"
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
- Additional maintainer-check invocations in smoke read current evidence and should stay before task done so the check remains meaningful.

## Rollback Notes
Revert the smoke script assertions and matching distribution guard.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
