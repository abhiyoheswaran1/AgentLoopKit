# Add built CLI smoke coverage for release-proof HEAD tag clarity

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
Source tests cover release-proof output when current HEAD differs from the local version tag, but the built CLI smoke path only checks release-proof completions and does not prove packaged release-proof emits HEAD/tag clarity through captured local evidence.

## Desired Outcome
The built CLI smoke script creates a separate temp release-proof repo, uses captured npm JSON, verifies release-proof --only npm --json reports tagCommit, headMatchesTag false, and the release-check next action, without querying registries or mutating this repo.

## Constraints
- Keep changes scoped to built CLI smoke coverage and its guard test.
- Use captured JSON and a temp git repo only; do not call public registries from the smoke script.
- Do not bump versions, create tags in this repository, publish, release, or touch Marketplace/Scoop/WinGet work.

## Non-Goals
- Do not change release-proof runtime semantics unless the bug pass finds a real defect.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- .github/workflows
- CHANGELOG.md

## Acceptance Criteria
- A focused distribution-artifacts guard test fails before smoke coverage exists and passes after implementation.
- node scripts/smoke-cli.mjs runs release-proof --only npm --json with --npm-registry-json inside a temp repo whose HEAD differs from v<version>.
- Smoke assertions prove overallStatus pass, git.tagCommit is populated, git.headMatchesTag is false, and nextAction.command is agentloop release-check.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "release-proof HEAD tag clarity"
- npm test -- tests/distribution-artifacts.test.ts
- npx prettier --check scripts/smoke-cli.mjs tests/distribution-artifacts.test.ts
- npm run build
- node scripts/smoke-cli.mjs

## Post-Verification Gates
- npm run dogfood:strict
- npm run maintenance:check

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Release-proof smoke coverage is release-adjacent; keep it fixture-only to avoid network flakiness or accidental release claims.

## Rollback Notes
Revert scripts/smoke-cli.mjs and tests/distribution-artifacts.test.ts; no persistent release metadata, tags, or package changes are expected.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
