# Expand smoke coverage for setup and nested command flows

- Created date: 2026-06-11
- Task type: tests
- Status: review

## Problem Statement

Recent fixes made missing config errors clearer and made non-init commands work from nested folders, but the cross-platform CLI smoke script still does not exercise those paths. A future regression could pass unit tests locally while the packaged built CLI misses the real workflow.

## Desired Outcome

The built CLI smoke script covers uninitialized status --json and nested working-directory use for status, create-task, verify, handoff, check-gates, policy, and install-agent.

## Constraints

- Do not bump package version
- Do not publish or release
- Do not add dependencies
- Keep smoke deterministic and local-only

## Non-Goals

- No new product behavior
- No network calls beyond existing npm mechanics

## Assumptions

- None recorded yet.

## Likely Files or Areas

- None recorded yet.

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- smoke-cli fails before implementation for missing uninitialized status JSON coverage
- smoke-cli covers nested cwd task/report/handoff writes to the initialized root
- smoke-cli covers policy and install-agent from a nested cwd
- docs or records explain this is smoke coverage, not new runtime behavior

## Verification Commands

- node scripts/smoke-cli.mjs
- npm test -- tests/distribution-artifacts.test.ts
- npm run lint
- npm run typecheck
- npm test
- npm run build
- npx --yes projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the smoke script coverage, tests, and dogfood records.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
