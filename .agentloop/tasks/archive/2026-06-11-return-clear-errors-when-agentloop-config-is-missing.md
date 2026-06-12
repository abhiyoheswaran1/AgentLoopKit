# Return clear errors when AgentLoop config is missing

- Created date: 2026-06-11
- Task type: bugfix
- Status: review

## Problem Statement

Commands that need AgentLoop setup can be run before init or from a directory outside an initialized repo. Some JSON-mode commands currently fall through to raw filesystem errors instead of returning a clear CONFIG_ERROR with a setup next step.

## Desired Outcome

Commands that load AgentLoop workspace report missing agentloop.config.json as a clear ConfigError. JSON mode returns parseable CONFIG_ERROR output and human mode tells users to run agentloop init.

## Constraints

- Do not bump package version
- Do not publish or release
- Keep init current-directory based
- Use Vitest regression tests

## Non-Goals

- No global config store
- No automatic init
- No telemetry or network calls

## Assumptions

- None recorded yet.

## Likely Files or Areas

- None recorded yet.

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- status --json in an uninitialized directory returns CONFIG_ERROR JSON without raw ENOENT output
- create-task --json in an uninitialized directory returns CONFIG_ERROR JSON and writes no task
- human status in an uninitialized directory prints a clear agentloop init hint
- config loader tests cover missing config discovery

## Verification Commands

- npm test -- tests/config.test.ts tests/status.test.ts tests/create-task.test.ts
- npm run lint
- npm run typecheck
- npm test
- npm run build
- node scripts/smoke-cli.mjs
- npx --yes projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the ConfigError normalization, tests, and docs/changelog notes.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
