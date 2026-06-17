# Add built CLI smoke coverage for default stale preview cap

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
Plain built CLI stale artifact preview default capping is implemented but not locked in the smoke path.

## Desired Outcome
The packaged CLI smoke script proves Markdown stale previews are capped by default while JSON remains complete without --limit.

## Constraints
- Tests/smoke coverage only; do not change `artifacts` runtime behavior unless a smoke bug exposes an actual mismatch.
- Preserve read-only stale preview behavior: no cleanup automation, deletion, filesystem mutation, env-file reads, registry calls, release, or publishing.
- Keep JSON stale preview complete by default; only explicit `--limit` may cap JSON candidate output.

## Non-Goals
- Do not add retention policy, artifact cleanup commands, or stale evidence deletion.
- Do not change artifact type filtering, latest artifact selection, or stale candidate ordering.
- Do not touch package versions, release workflows, Marketplace, Scoop, WinGet, GHCR, MCP Registry, or npm metadata.

## Assumptions
- The current source implementation already caps human Markdown stale previews by default.
- Built CLI smoke coverage should exercise the packaged command path because release users run `dist/cli/index.js`, not `tsx src/cli/index.ts`.

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
- Built CLI smoke script verifies `artifacts --stale --json` returns all stale candidates with `limit: null`.
- Built CLI smoke script verifies plain Markdown `artifacts --stale` applies the default cap, reports hidden candidates, and does not print a candidate beyond the default cap.
- Static distribution artifact tests lock the new smoke coverage strings.

## Verification Commands
- `npm test -- tests/distribution-artifacts.test.ts -t "default stale preview"`
- `npx prettier --check scripts/smoke-cli.mjs tests/distribution-artifacts.test.ts`
- `npm test -- tests/distribution-artifacts.test.ts`
- `node scripts/smoke-cli.mjs`
- `npm run build`

## Post-Verification Gates
- `npm run dogfood:strict`

## Implementation Plan
- Add a failing static distribution test for default stale preview smoke coverage.
- Extend the existing stale-artifact smoke fixture/assertions instead of adding a new fixture.
- Run focused tests, the built smoke script, build, AgentFlight verification, AgentLoop verification with post-verification gates, and maintenance check.

## Risk Notes
- Low risk. This is smoke/test coverage for existing read-only behavior, but built smoke drift can hide packaged CLI regressions.

## Rollback Notes
Revert the added smoke assertions and the matching static distribution test assertions.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
