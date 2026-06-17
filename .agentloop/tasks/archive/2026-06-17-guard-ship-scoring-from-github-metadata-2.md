# Guard ship scoring from GitHub metadata

- Created date: 2026-06-17
- Task type: test-generation
- Status: done

## Problem Statement

Imported local GitHub issue and PR metadata is useful review context, but maintenance checks should explicitly guard that it stays neutral for ship scoring.

## Desired Outcome

Maintenance coverage exercises the ship scoring boundary so local GitHub metadata cannot silently become score evidence.

## Constraints

- Keep imported GitHub metadata optional and read-only.
- Do not change ship score semantics except to add regression coverage and maintenance wiring.
- Do not call GitHub APIs, read tokens, post comments, publish, tag, or release.

## Non-Goals

- Do not make GitHub issue or PR text influence `ship` scoring.
- Do not add required GitHub metadata for normal AgentLoopKit usage.
- Do not change release or Marketplace behavior.

## Assumptions

- The current desired behavior is that `ship` scores local AgentLoop evidence only.
- The recurring maintenance gate should cover that boundary because `docs/maintenance-guards.md` documents it.

## Likely Files or Areas

- `scripts/maintenance-check.mjs`
- `tests/maintenance-check-script.test.ts`
- `tests/ship.test.ts`
- `docs/maintenance-guards.md`
- `README.md`

## Files or Areas Not to Touch

- Package versions, changelog release sections, tags, publish workflows, and release-channel metadata.
- GitHub Marketplace task contracts unless explicitly approved by the maintainer.

## Acceptance Criteria

- Maintenance check includes a focused `ship` scoring neutrality test step after GitHub metadata safety tests.
- `ship` regression coverage proves identical review-readiness scores with and without imported local GitHub metadata.
- Public maintenance docs mention GitHub metadata safety and ship-score neutrality coverage without implying GitHub API calls.
- JSON and human `ship` behavior remains otherwise unchanged.

## Verification Commands

- npm test -- tests/maintenance-check-script.test.ts
- npm test -- tests/ship.test.ts
- npm run check:public-docs
- npx prettier --check scripts/maintenance-check.mjs tests/maintenance-check-script.test.ts tests/ship.test.ts README.md docs/maintenance-guards.md .agentloop/tasks/2026-06-17-guard-ship-scoring-from-github-metadata-2.md
- npm run maintenance:check

## Post-Verification Gates

- npm run dogfood:strict
- npx --no-install tsx src/cli/index.ts ship --redact-paths
- npx --no-install tsx src/cli/index.ts prepare-pr --write --redact-paths

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the maintenance-check step, the ship regression test, and the related maintenance documentation updates.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
