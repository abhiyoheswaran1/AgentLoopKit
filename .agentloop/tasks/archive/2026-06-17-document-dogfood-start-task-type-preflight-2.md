# Document dogfood-start task type preflight

- Created date: 2026-06-17
- Task type: docs
- Status: done

## Problem Statement
The dogfood-start helper now preflights task types and normalizes the common test alias, but the autonomous dogfooding guide still only shows a feature example and does not explain the supported type boundary.

## Desired Outcome
The repo dogfood guide tells agents that dogfood:start validates supported task types before companion tools run and that --type test is normalized to tests.

## Constraints
- Keep this docs/test only; do not change helper behavior in this task.
- Use TDD: add or update the harness test first and watch it fail before editing the guide.
- Keep the guidance local to repo dogfooding; do not add public adoption or release claims.
- Do not touch package metadata, lockfiles, workflows, release notes, Marketplace, Scoop, or WinGet surfaces.

## Non-Goals
- No new `create-task` task types.
- No release prep, version bump, publishing, tags, or registry checks.
- No changes to AgentFlight or ProjScan configuration.

## Assumptions
- The dogfood-start helper already implements the preflight behavior; this task documents that behavior for future agents.

## Likely Files or Areas
- `.agentloop/harness/autonomous-dogfooding.md`
- `tests/autonomous-dogfood.test.ts`

## Files or Areas Not to Touch
- `package.json`
- `pnpm-lock.yaml`
- `CHANGELOG.md`
- `.github/workflows/`
- Release, registry, Marketplace, Scoop, or WinGet files.

## Acceptance Criteria
- Autonomous dogfood tests lock the guide wording for supported task types and the test alias.

## Verification Commands
- npm test -- tests/autonomous-dogfood.test.ts -t dogfood-start
- npx prettier --check .agentloop/harness/autonomous-dogfooding.md tests/autonomous-dogfood.test.ts
- npm test -- tests/autonomous-dogfood.test.ts
- npm run build

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Low risk. This updates internal harness guidance only, but stale dogfood instructions can cause companion-tool side effects.

## Rollback Notes
Revert the autonomous dogfood guide wording and the matching harness test assertions.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
