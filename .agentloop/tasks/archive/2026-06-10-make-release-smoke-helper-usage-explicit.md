# Make release smoke helper usage explicit

- Created date: 2026-06-10
- Task type: refactor
- Status: done

## Problem Statement
projscan reports scripts/smoke-packed-release.mjs named exports as unused because tests access them through a dynamic import object.

## Desired Outcome
Release smoke helper usage is visible to static analysis, tests still cover the helpers, and projscan no longer reports the unused-export note.

## Constraints
- Do not change smoke script runtime behavior.
- Do not bump versions, publish, tag, or create releases.

## Non-Goals
- Do not rewrite release smoke coverage beyond the import style.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- tests/release-smoke.test.ts
- scripts/smoke-packed-release.mjs

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- tests/release-smoke.test.ts imports smoke helpers as named imports.
- Focused release-smoke tests pass.
- projscan doctor no longer reports unused exports in scripts/smoke-packed-release.mjs.

## Verification Commands
- npx pnpm@10.12.1 test tests/release-smoke.test.ts
- npx --yes projscan doctor --format markdown
- npx pnpm@10.12.1 test

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
