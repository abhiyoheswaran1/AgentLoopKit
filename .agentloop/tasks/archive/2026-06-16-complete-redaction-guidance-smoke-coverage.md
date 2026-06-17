# Complete redaction guidance smoke coverage

- Created date: 2026-06-16
- Task type: tests
- Status: done

## Problem Statement
README public-output guidance lists verify, summarize, and handoff as --redact-paths-capable commands, but the packed-release README redaction smoke guard only checks a subset of shareable commands. This can let future docs drift miss those commands.

## Desired Outcome
The README redaction smoke guard requires every command named in the public guidance, including verify, summarize, and handoff, while preserving existing CLI behavior.

## Constraints
- Do not change command behavior; verify, summarize, and handoff already accept --redact-paths.
- Do not release, tag, publish, bump package versions, or touch distribution manifests.
- Keep the change focused on guard coverage and matching tests.

## Non-Goals
- No new redaction semantics.
- No public API change.
- No cleanup of existing AgentLoop evidence artifacts.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/smoke-packed-release.mjs
- tests/release-smoke.test.ts
- README.md
- docs/cli-reference.md

## Files or Areas Not to Touch
- package.json
- package-lock.json
- pnpm-lock.yaml

## Acceptance Criteria
- The README redaction command guard includes verify, summarize, and handoff.
- A focused test fails when README guidance omits any of verify, summarize, or handoff.
- Existing packed-release smoke tests continue to pass.

## Verification Commands
- npm test -- tests/release-smoke.test.ts
- npm run typecheck
- npm run lint
- npm test
- npm run check:public-docs
- npm run check:links

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Low-risk guard-only change; a too-strict assertion could require future docs updates when guidance changes.

## Rollback Notes
Revert scripts/smoke-packed-release.mjs and tests/release-smoke.test.ts changes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
