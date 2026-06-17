# Add built CLI smoke coverage for latest ship report artifacts

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
The ship-report artifact filter is source-tested and partially smoke-tested, but the packaged CLI smoke path does not prove --type ship-report --latest.

## Desired Outcome
The built CLI smoke script verifies human latest ship-report artifact output points at the current ship report.

## Constraints
- Tests/smoke coverage only; do not change artifact runtime behavior unless the smoke path exposes a real packaged CLI mismatch.
- Keep `artifacts` read-only and do not add cleanup, deletion, retention, registry, release, or publish behavior.
- Preserve JSON output shape and existing source-level artifact tests.

## Non-Goals
- Do not add or change artifact filtering semantics.
- Do not add retention policy, cleanup commands, or automatic artifact deletion.
- Do not touch package versions, release workflows, Marketplace, Scoop, WinGet, GHCR, MCP Registry, or npm metadata.

## Assumptions
- Source-level tests already cover ship-report artifact filtering.
- Built smoke should also prove the user-facing packaged CLI renders latest ship-report output, because release users run `dist/cli/index.js`.

## Likely Files or Areas
- `scripts/smoke-cli.mjs`
- `tests/distribution-artifacts.test.ts`

## Files or Areas Not to Touch
- `package.json`
- `pnpm-lock.yaml`
- `CHANGELOG.md`
- `.github/workflows/`
- Release-channel docs or manifests

## Acceptance Criteria
- Built CLI smoke script runs `artifacts --type ship-report --latest`.
- Built CLI smoke script verifies the human latest ship-report output includes the ship report path from the current smoke `ship` run.
- Static distribution artifact tests lock the new smoke coverage strings.

## Verification Commands
- `npm test -- tests/distribution-artifacts.test.ts -t "latest ship report"`
- `npx prettier --check scripts/smoke-cli.mjs tests/distribution-artifacts.test.ts`
- `npm test -- tests/distribution-artifacts.test.ts`
- `node scripts/smoke-cli.mjs`
- `npm run build`

## Post-Verification Gates
- `npm run dogfood:strict`

## Implementation Plan
- Add a failing static distribution test for latest ship-report smoke coverage.
- Extend the existing ship-report smoke block instead of adding a new fixture.
- Run focused tests, the built smoke script, build, AgentFlight verification, AgentLoop verification with post-verification gates, and maintenance check.

## Risk Notes
- Low risk. This only strengthens built CLI smoke coverage for existing read-only artifact output.

## Rollback Notes
Revert the added latest ship-report smoke assertions and the matching static distribution test assertions.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
