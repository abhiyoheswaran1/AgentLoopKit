# Add publish metadata guard

- Created date: 2026-06-10
- Task type: release
- Status: done

## Problem Statement

Current main can pass npm prepublish checks even when CHANGELOG has unreleased entries and package.json still points at the prior GitHub release version.

## Desired Outcome

npm publish from main fails until release metadata is prepared or Unreleased is empty.

## Constraints

- Do not block publishing from a prepared release commit where Unreleased is empty.
- Keep the guard local and transparent; no network calls or tokens.

## Non-Goals

- Do not publish to npm or create a GitHub release.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- scripts
- package.json
- tests
- docs/npm-publishing.md

## Files or Areas Not to Touch

- .github/workflows/publish.yml

## Acceptance Criteria

- prepublishOnly fails when CHANGELOG has unreleased entries
- prepublishOnly passes when Unreleased says no unreleased changes

## Verification Commands

- npx pnpm@10.12.1 test tests/prepublish-check.test.ts
- npx pnpm@10.12.1 test
- npx projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Remove the prepublish guard script, package script hook, tests, and docs

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
