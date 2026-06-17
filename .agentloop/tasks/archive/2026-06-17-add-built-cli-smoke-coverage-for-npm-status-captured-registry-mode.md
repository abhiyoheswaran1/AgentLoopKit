# Add built CLI smoke coverage for npm-status captured registry mode

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
The source tests cover npm-status captured registry and env-file refusal, but the built CLI smoke script does not yet prove the packaged dist command exercises those release-adjacent safety paths without a live npm lookup.

## Desired Outcome
The built CLI smoke script checks npm-status from captured registry JSON, validates JSON and human expect-current output, refuses .env registry-json paths without printing env contents, and records a focused guard so future changes cannot drop the smoke coverage silently.

## Constraints
- Do not publish packages, create tags, cut releases, bump versions, change release workflows, change dependencies, call live npm registry, read tokens, read env-file contents, or mutate package metadata.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- tests/distribution-artifacts.test.ts
- scripts/smoke-cli.mjs

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- CHANGELOG.md
- .github/workflows

## Acceptance Criteria
- Focused distribution-artifacts guard fails before the smoke coverage and passes after implementation.
- scripts/smoke-cli.mjs writes captured npm view JSON, runs npm-status --agentloopkit --registry-json <path> --json, and asserts current status, agentloopkit package name, local version, captured source command, and safety does-not claims.
- scripts/smoke-cli.mjs runs npm-status --agentloopkit --registry-json <path> --expect-current and asserts human output proves npm latest matches local package version.
- scripts/smoke-cli.mjs runs npm-status --registry-json <.env fixture> --json with reject-false semantics and asserts env-file refusal without printing fixture secret contents.
- No live npm registry command is added to the smoke path.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "npm-status captured registry"
- npx prettier --check tests/distribution-artifacts.test.ts scripts/smoke-cli.mjs
- git diff --name-only -- package.json pnpm-lock.yaml CHANGELOG.md .github/workflows
- npm test -- tests/distribution-artifacts.test.ts
- npm run build
- node scripts/smoke-cli.mjs

## Post-Verification Gates
- npx --yes agentflight status
- npx --yes projscan doctor --format markdown
- npm run dogfood:strict
- npm run maintenance:check

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the distribution-artifacts guard and the npm-status smoke block in scripts/smoke-cli.mjs.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
