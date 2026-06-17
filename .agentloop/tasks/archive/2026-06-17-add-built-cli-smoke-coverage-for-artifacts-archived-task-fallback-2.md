# Add built CLI smoke coverage for artifacts archived task fallback

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
Source tests cover archived task fallback in agentloop artifacts, but the built CLI smoke script does not exercise the packaged artifacts command after task archival.

## Desired Outcome
The built CLI smoke script creates an archived done-task fixture with no live actionable task and asserts artifacts --type task --latest reports it as archived evidence.

## Constraints
- Coverage only. Do not change artifacts command behavior beyond the already implemented archived-task fallback.
- Do not change task archive behavior, release readiness, publishing, package metadata, dependencies, or protected release files.

## Non-Goals
- Do not add cleanup, migration, retention, or task-state mutation behavior.
- Do not broaden the smoke fixture beyond archived task artifact inventory coverage.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- CHANGELOG.md
- action.yml
- .github/workflows

## Acceptance Criteria
- `tests/distribution-artifacts.test.ts` guards that `scripts/smoke-cli.mjs` covers archived task artifact fallback.
- `scripts/smoke-cli.mjs` asserts built `artifacts --type task --latest` human output reports the archived task as `done`, `archived`.
- `scripts/smoke-cli.mjs` asserts built `artifacts --json` exposes the archived task under `tasks.latest` with `archived: true`.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t archived

## Post-Verification Gates
- npm run dogfood

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the smoke script assertions and the distribution guard test additions.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
