# Add built CLI smoke coverage for GitHub metadata import

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
The read-only GitHub metadata import path has source-level tests and maintenance checks, but the built CLI smoke script does not exercise the packaged command surface. That leaves release/distribution verification weaker for teams relying on optional local GitHub context.

## Desired Outcome
The built CLI smoke script proves agentloop github import can dry-run explicit local issue JSON, emit JSON, preserve the read-only safety contract, and avoid writing context files.

## Constraints
- Keep the smoke fixture local to the temporary smoke repo and do not call GitHub APIs, run gh, read tokens, or read env files.
- Use dry-run JSON output for the smoke check so the command does not write .agentloop/github/context.json.
- Keep changes scoped to smoke coverage and its guard test.
- Do not change dependencies, package versions, release artifacts, GitHub workflows, or public command behavior.

## Non-Goals
- Publishing or preparing any release channel.
- Changing github import normalization behavior.
- Adding live GitHub, gh, token, or network integration.

## Assumptions
- Existing github import source tests remain the authority for parser edge cases and path-safety behavior.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- CHANGELOG.md
- .github/workflows

## Acceptance Criteria
- A failing guard test is added before implementation to prove the smoke script lacks github import dry-run coverage.
- scripts/smoke-cli.mjs creates an explicit local issue JSON fixture and runs agentloop github import --issue-json ... --dry-run --json against the built CLI.
- The smoke assertion verifies dryRun true, writesFiles false, imported issue identity, and safety flags for no GitHub API calls, no token reads, and no env-file reads.
- The smoke assertion verifies no .agentloop/github/context.json file is created during dry-run.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "CLI smoke script covers GitHub metadata import dry-run"
- npm test -- tests/distribution-artifacts.test.ts
- npm run typecheck
- npm run build
- node scripts/smoke-cli.mjs

## Post-Verification Gates
- npm run dogfood
- npx --yes agentflight verify -- npm test -- tests/distribution-artifacts.test.ts
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Medium: smoke script changes run in distribution verification, so brittle fixture assumptions could slow future release checks.
- Low security risk if implementation remains dry-run and asserts no token/env/API access.

## Rollback Notes
Revert the smoke-cli and distribution-artifacts test changes; no persistent runtime state or dependency changes are expected.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
