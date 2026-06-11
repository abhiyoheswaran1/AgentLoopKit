# Run two-hour product and security hardening pass

- Created date: 2026-06-11
- Task type: security-review
- Status: review

## Problem Statement

AgentLoopKit needs a deeper product-quality pass focused on bugs, security-sensitive CLI behavior, and small high-value UX improvements before the future 0.28.0 release.

## Desired Outcome

main contains verified bug fixes and product improvements from a focused hardening pass, with security-oriented coverage and no version bump or publish.

## Constraints

- Do not bump package.json version
- Do not publish npm, create GitHub releases, publish GHCR, or change release tags
- Use Vitest and red-green tests for behavior changes
- Dogfood AgentLoopKit and run projscan during verification

## Non-Goals

- No SaaS, cloud dashboard, telemetry, API keys, Homebrew work, billing, desktop app, or hosted service

## Assumptions

- None recorded yet.

## Likely Files or Areas

- None recorded yet.

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- doctor supports strict mode for CI-style setup gates without changing default warning behavior
- status supports a compact brief mode useful for agents and humans
- security pass covers command execution, shell interpolation, path handling, env-file behavior, and public docs safety claims
- any discovered bug fix includes a regression test

## Verification Commands

- npm run lint
- npm run typecheck
- npm test
- npm run check:links
- npm run build
- node scripts/smoke-cli.mjs
- npm run smoke:release
- npx --yes projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Touches command exit behavior, status output, docs, tests, and release-readiness claims

## Rollback Notes

Revert the focused hardening commit before preparing 0.28.0

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
