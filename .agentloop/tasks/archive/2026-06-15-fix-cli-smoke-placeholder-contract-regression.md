# Fix CLI smoke placeholder contract regression

- Created date: 2026-06-15
- Task type: bugfix
- Status: done

## Problem Statement
The pushed CLI Smoke workflow fails because the smoke task fixture leaves `Likely Files or Areas` as a placeholder, triggering the new task doctor warning before `review-context`.

## Desired Outcome
CLI Smoke creates a review-ready smoke task contract and passes `review-context` gates on supported CI operating systems.

## Constraints
- Do not weaken task doctor placeholder diagnostics.
- Keep the fix scoped to the smoke fixture.

## Non-Goals
- Do not change review-readiness scoring or gate semantics.
- Do not change package version or release metadata.

## Assumptions
- The product behavior is correct: open tasks with placeholder likely-file guidance should warn.
- The smoke fixture should model a real task contract.

## Likely Files or Areas
- scripts/smoke-cli.mjs

## Files or Areas Not to Touch
- package.json
- src/core/task-state.ts

## Acceptance Criteria
- CLI smoke fixture records a likely file or area.
- `node scripts/smoke-cli.mjs` passes locally.
- Remote CLI Smoke passes after push.

## Verification Commands
- node scripts/smoke-cli.mjs
- npm run typecheck
- npm run lint

## Post-Verification Gates
- node dist/cli/index.js check-gates --strict --redact-paths

## Implementation Plan
- Inspect the failed CI smoke step and local smoke reproduction.
- Update the smoke fixture task creation arguments with a real likely file.
- Run local smoke, typecheck, lint, AgentLoop gates, AgentFlight, and ProjScan.

## Risk Notes
- CLI Smoke runs on Linux, macOS, and Windows, so keep paths portable.
- Do not hide task doctor warnings by accepting weaker review-context gates.

## Rollback Notes
Revert the smoke fixture argument change and rerun CLI Smoke.

## Handoff Requirements
- Summarize the CI failure, root cause, and fixture change.
- Include local smoke and remote CI status.
- State that no package release was cut.
