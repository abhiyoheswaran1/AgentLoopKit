# Add built CLI smoke coverage for stale artifact limits

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
Packaged CLI smoke coverage exercises stale artifact previews, but it does not prove the built artifact rejects --limit without --stale or reports bounded stale-preview counts.

## Desired Outcome
The built CLI smoke script proves stale artifact limit guardrails and bounded preview metadata, with static distribution tests locking the coverage.

## Constraints
- Keep this as coverage-only work; do not change `artifacts` command behavior.
- Use TDD: add a static distribution test first and watch it fail before changing the smoke script.
- Preserve existing JSON shapes, Markdown output, exit codes, and docs.
- Do not touch release files, package metadata, lockfiles, workflows, or publishing surfaces.

## Non-Goals
- No stale artifact deletion, cleanup automation, retention policy, or broad artifact refactor.
- No release prep, version bump, tag, registry publish, Marketplace work, Scoop, or WinGet work.
- No changes to AgentFlight, ProjScan, or package dependencies.

## Assumptions
- Unit coverage already proves the stale-preview behavior; this task adds packaged CLI smoke evidence.
- The smoke repository can use existing fixture helpers and local `.agentloop/reports` files.

## Likely Files or Areas
- `scripts/smoke-cli.mjs`
- `tests/distribution-artifacts.test.ts`

## Files or Areas Not to Touch
- `package.json`
- `pnpm-lock.yaml`
- `CHANGELOG.md`
- `.github/workflows/`
- Release, registry, Marketplace, Scoop, or WinGet files.

## Acceptance Criteria
- `scripts/smoke-cli.mjs` creates enough stale evidence to exercise `artifacts --stale --limit`.
- The built CLI smoke script asserts JSON bounded-preview metadata: total candidates, shown count, hidden count, and limit.
- The built CLI smoke script asserts the human bounded preview reports hidden candidates.
- The built CLI smoke script asserts `artifacts --limit <count> --json` fails without `--stale` and reports the expected option error.
- `tests/distribution-artifacts.test.ts` statically locks the new smoke coverage strings.

## Verification Commands
- `npm test -- tests/distribution-artifacts.test.ts -t "stale artifact limit smoke"`
- `npx prettier --check scripts/smoke-cli.mjs tests/distribution-artifacts.test.ts`
- `node scripts/smoke-cli.mjs`
- `npm test -- tests/distribution-artifacts.test.ts`
- `npm run build`

## Post-Verification Gates
- `npm run dogfood:strict`

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Low risk. The task changes test/smoke evidence only, but packaged CLI smoke failures can block release readiness if fixtures are brittle.

## Rollback Notes
Revert the smoke-script assertions and the static distribution test added for this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
