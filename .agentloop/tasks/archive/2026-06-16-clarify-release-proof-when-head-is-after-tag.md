# Clarify release proof when HEAD is after tag

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement

release-proof can report public channel proof for the package version while the current commit is newer than the version tag, which can confuse maintainers about whether current HEAD is released.

## Desired Outcome

release-proof exposes the version tag commit, whether HEAD matches it, and a next action that points to release-check when unreleased commits exist.

## Constraints

- Do not bump package version or publish anything.
- Do not make the recurring maintenance gate fail just because main has unreleased commits.
- Keep release-proof read-only and token-free.

## Non-Goals

- Do not create tags, releases, npm publishes, GHCR images, or MCP Registry entries.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/release-proof.ts
- tests/release-proof.test.ts
- docs/release-proof.md
- docs/cli-reference.md

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- release-proof JSON includes tag commit and whether HEAD matches the version tag.
- release-proof Markdown makes HEAD/tag state clear.
- when channels pass but HEAD differs from the version tag, next action recommends release-check instead of record release proof.
- maintenance:check can still pass on unreleased commits when public channel proof for the package version is healthy.

## Verification Commands

- npm test -- tests/release-proof.test.ts tests/autonomous-dogfood.test.ts
- npm run typecheck
- npm run lint
- npm run build

## Post-Verification Gates

- npm run dogfood:strict
- npm run maintenance:check -- --json

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Release messaging affects maintainer trust and release timing decisions.

## Rollback Notes

Revert release-proof metadata, tests, and docs if the distinction creates confusing output.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
