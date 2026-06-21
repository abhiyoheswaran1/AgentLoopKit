# Add typecheck to maintenance check

- Created date: 2026-06-21
- Task type: tests
- Status: done

## Problem Statement
Dogfooding found that npm run maintenance:check can pass even when npm run typecheck fails, so the recurring quality guard misses TypeScript regressions.

## Desired Outcome
npm run maintenance:check includes a non-mutating npm run typecheck step, its helper tests lock the order and safety contract, and public guidance accurately describes the guard.

## Constraints
- Do not release, tag, publish, bump versions, or change dependencies.
- Keep the change focused on the maintenance guard, tests, and docs/evidence.
- Preserve the secret-filtered child process environment and do not read env files or token values.

## Non-Goals
- No release prep or public release proof expansion.
- No new maintenance checks beyond typecheck.
- No changes to package manager detection or verification command execution.

## Assumptions
- The repo already defines package.json scripts.typecheck as tsc --noEmit.

## Likely Files or Areas
- scripts/maintenance-check.mjs
- tests/maintenance-check-script.test.ts
- README.md
- docs/maintenance-guards.md
- CHANGELOG.md
- DECISIONS.md
- .agentloop/backlog.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- createMaintenanceCheckSteps includes a failing-on-error npm run typecheck step before later safety and dogfood checks.
- maintenance-check helper tests fail before implementation and pass after implementation.
- Docs describe maintenance:check as covering typecheck without implying release mutation or strict public release proof.
- Bug pass runs typecheck, focused tests, docs checks, AgentLoop task doctor, ProjScan, AgentFlight verification, dogfood strict, and maintenance:check.

## Verification Commands
- npm test -- tests/maintenance-check-script.test.ts
- npm run typecheck
- npm run check:public-docs
- npm run check:links
- npx --no-install tsx src/cli/index.ts task doctor --redact-paths
- npx --yes projscan doctor --format markdown

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- maintenance:check takes longer after adding typecheck, but this is acceptable for a recurring guard.
- Pre-existing dirty non-evidence files before task creation: 55 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`, `AGENTS.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Remove the typecheck step and revert related tests/docs if the guard becomes too slow or duplicates another mandatory check.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
