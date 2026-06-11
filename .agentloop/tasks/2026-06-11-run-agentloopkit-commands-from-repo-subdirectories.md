# Run AgentLoopKit commands from repo subdirectories

- Created date: 2026-06-11
- Task type: bugfix
- Status: review

## Problem Statement
After AgentLoopKit is initialized at a repo root, agents and humans can cd into nested folders and run commands from there. Many commands currently load agentloop.config.json only from the current folder and then pass that nested cwd into core operations, which can fail or write artifacts in the wrong place.

## Desired Outcome
Non-init AgentLoopKit commands discover the nearest parent agentloop.config.json and run against that config root while preserving init as current-directory setup.

## Constraints
- Do not bump package version
- Do not release or publish
- Keep init current-directory based
- Use Vitest regression tests

## Non-Goals
- No global config discovery
- No project-management or SaaS behavior

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- status --json works from a nested folder after root init and reports the root project
- create-task from a nested folder writes into the root .agentloop/tasks directory
- verify from a nested folder writes reports into the root .agentloop/reports directory
- doctor uses the discovered config root when a parent config exists

## Verification Commands
- npm test -- tests/config.test.ts tests/status.test.ts tests/create-task.test.ts tests/verification.test.ts tests/doctor.test.ts
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
Revert the workspace discovery helper, command cwd rewiring, tests, and docs.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
