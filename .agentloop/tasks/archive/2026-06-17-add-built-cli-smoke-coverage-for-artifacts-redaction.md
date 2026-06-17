# Add built CLI smoke coverage for artifacts redaction

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
The artifacts command accepts --redact-paths and has source-level tests, but the built CLI smoke script does not explicitly exercise artifacts redaction in human and JSON modes. A future packaging or smoke-script change could drop this public-output safety coverage without the distribution guard failing.

## Desired Outcome
The built CLI smoke script explicitly runs artifacts redaction in human and JSON modes and distribution artifact tests pin that coverage.

## Constraints
- Keep changes scoped to smoke coverage and distribution guard tests.
- Preserve artifacts command behavior and JSON shape.
- Do not add release, publishing, registry, cleanup, or destructive filesystem behavior.

## Non-Goals
- No artifacts command feature changes beyond smoke coverage.
- No release/version bump, tag, package publication, GitHub Marketplace, Scoop, or WinGet work.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- tests/distribution-artifacts.test.ts
- scripts/smoke-cli.mjs

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- CHANGELOG.md

## Acceptance Criteria
- A focused distribution-artifacts test fails before artifacts redaction smoke coverage exists and passes after implementation.
- scripts/smoke-cli.mjs runs artifacts --redact-paths and artifacts --json --redact-paths against the smoke repo.
- Smoke assertions preserve useful artifact counts/latest data while rejecting absolute smoke repo path leaks in redacted output.
- Built smoke script still passes after build.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "artifacts redaction"
- npm test -- tests/distribution-artifacts.test.ts
- npx prettier --check tests/distribution-artifacts.test.ts scripts/smoke-cli.mjs
- git diff --name-only -- package.json pnpm-lock.yaml CHANGELOG.md .github/workflows
- npm run build
- node scripts/smoke-cli.mjs

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- The main risk is brittle string matching in the distribution guard.

## Rollback Notes
Revert the artifacts redaction smoke assertions and matching distribution guard.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
