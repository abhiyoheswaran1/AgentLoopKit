# Add built CLI smoke coverage for GitHub metadata review surfaces

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
The built CLI smoke script covers GitHub metadata import dry-run safety, but it does not prove a real local import write is then consumed by review-context, prepare-pr, and maintainer-check through the packaged CLI.

## Desired Outcome
The built smoke flow writes local GitHub metadata from explicit fixture JSON and proves the downstream review-facing commands include that optional context without network calls, token reads, or release behavior.

## Constraints
- Keep this as smoke coverage only; do not change GitHub metadata runtime behavior unless the bug pass finds a defect.
- Do not call GitHub APIs, gh, registries, or read tokens or .env files.
- Do not bump versions, tag, publish, or touch release-channel files.

## Non-Goals
- No GitHub posting, comments, issue sync, or scoring changes.
- No dependency changes.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- CHANGELOG.md
- .github/workflows

## Acceptance Criteria
- scripts/smoke-cli.mjs runs github import without --dry-run against explicit fixture JSON and asserts .agentloop/github/context.json is written.
- The smoke flow asserts review-context JSON, prepare-pr output, and maintainer-check JSON include the imported issue/PR context.
- The smoke flow asserts the metadata path remains repo-relative and no absolute smoke repo path leaks.
- tests/distribution-artifacts.test.ts locks the smoke coverage strings.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "GitHub metadata review surfaces"
- node scripts/smoke-cli.mjs
- npm test -- tests/distribution-artifacts.test.ts
- npm run build

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Smoke script runtime can grow; keep assertions bounded and reuse the existing fixture repo.

## Rollback Notes
Revert the smoke-script additions and the distribution-artifact static coverage test.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
