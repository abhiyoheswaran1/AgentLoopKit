# Guard roadmap release state

- Created date: 2026-06-12
- Task type: tests
- Status: done

## Problem Statement
A post-release docs pass updated release-status docs but left ROADMAP.md saying 0.28.1 was current while 0.28.3 was already live.

## Desired Outcome
Release smoke coverage fails when ROADMAP.md current-state release lines drift from package.json's current version.

## Constraints
- Keep the guard local and deterministic.
- Do not call GitHub, npm, GHCR, or MCP Registry.
- Do not require release-time network access.

## Non-Goals
- Do not rewrite release docs automatically.
- Do not add a broader release dashboard.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/smoke-packed-release.mjs
- tests/release-smoke.test.ts
- .agentloop/backlog.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- A helper rejects ROADMAP.md current-state lines that name an older current public release, npm latest, GHCR/MCP Registry version, or release tag.
- The helper accepts ROADMAP.md when those current-state lines match the expected package version.
- Current release-smoke tests run the guard against the real ROADMAP.md.

## Verification Commands
- npm test -- tests/release-smoke.test.ts
- npm run lint
- npm run typecheck
- npm run check:links
- git diff --check

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Overly broad matching could reject historical changelog-style content, so scope the guard to ROADMAP.md current-state wording.

## Rollback Notes
Remove the roadmap release-state helper and its tests; release smoke returns to the previous public-doc checks.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
