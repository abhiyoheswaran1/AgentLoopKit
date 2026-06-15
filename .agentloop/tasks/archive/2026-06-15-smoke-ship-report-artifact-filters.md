# Smoke ship report artifact filters

- Created date: 2026-06-15
- Task type: tests
- Status: done

## Problem Statement
Source tests cover ship-report artifact filters, but the cross-platform built CLI smoke does not prove the packaged binary can inventory or stale-filter ship report evidence.

## Desired Outcome
The built CLI smoke flow verifies ship-report artifact inventory and stale ship-report preview on Ubuntu, macOS, and Windows.

## Constraints
- Keep this as smoke coverage for existing CLI behavior.
- Use only local temporary repositories created by `scripts/smoke-cli.mjs`.
- Do not publish, upload, delete evidence, call registries, read tokens, or read `.env` contents.

## Non-Goals
- Do not change production artifact filtering behavior unless the smoke exposes a real bug.
- Do not add cleanup automation or destructive artifact management.
- Do not bump package versions or cut a release.

## Assumptions
- Source-level tests already cover ship-report artifact filtering.
- The built CLI smoke should catch packaging or cross-platform regressions in the same behavior.

## Likely Files or Areas
- `scripts/smoke-cli.mjs`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`

## Files or Areas Not to Touch
- `package.json` version fields
- npm, GitHub Release, GHCR, MCP Registry, or SchemaStore publishing metadata
- Production release workflows unless a smoke failure proves they are broken

## Acceptance Criteria
- scripts/smoke-cli.mjs creates or observes ship report evidence from the built CLI flow.
- scripts/smoke-cli.mjs asserts artifacts --type ship-report --json returns ship report metadata.
- scripts/smoke-cli.mjs asserts artifacts --stale --type ship-report --json returns only stale ship-report candidates and preserves read-only safety flags.
- The smoke flow remains local-only and does not publish, upload, delete evidence, or call registries.

## Verification Commands
- npm test -- tests/artifacts.test.ts
- npm run build
- node scripts/smoke-cli.mjs
- npm run typecheck
- npm run lint
- npm run check:public-docs
- npm run check:links

## Post-Verification Gates
- npx --yes agentflight verify -- node scripts/smoke-cli.mjs
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the smoke-script assertions and generated dogfood notes. This only removes extra release-smoke coverage; it should not change runtime CLI behavior.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
