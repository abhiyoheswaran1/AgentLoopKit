# Add packed symlink safety smoke

- Created date: 2026-06-11
- Task type: tests
- Status: done

## Problem Statement
The release smoke script verifies lexical path guards but does not exercise the symlink safety guards added for init, install-agent, task state, and task archives.

## Desired Outcome
Packed release smoke covers representative symlink escape attempts against the packaged CLI before the 0.28.0 release batch.

## Constraints
- Do not change package version or publish a release.
- Keep smoke tests local-only and free of network calls beyond npm/npx package install mechanics.
- Use Vitest helper tests before script changes.

## Non-Goals
- Do not make the smoke script exhaustive for every command.
- Do not publish or tag a release.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/smoke-packed-release.mjs
- tests/release-smoke.test.ts
- CHANGELOG.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- createSmokeSteps lists packed symlink safety smoke coverage.
- The smoke script rejects unsafe symlinked init and task archive destinations.
- The smoke script checks outside files are not created or changed.

## Verification Commands
- npx pnpm@10.12.1 test tests/release-smoke.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 check:links
- npx pnpm@10.12.1 build
- npm run smoke:release
- git diff --check
- npx --yes projscan doctor --format markdown

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
