# Add built CLI smoke coverage for archived task doctor pass

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
Source tests now prove task doctor accepts pre-archive run metadata after a task is archived, but the built CLI smoke script does not exercise the packaged post-archive task doctor pass case. This leaves a small distribution-safety gap for autonomous task closeout.

## Desired Outcome
The built smoke script closes and archives a task, runs task doctor with the packaged CLI, and asserts the doctor reports pass with no recent-evidence-without-active-task warning; distribution-artifacts tests guard that smoke coverage.

## Constraints
- Smoke-test hardening only; do not change task doctor runtime behavior unless the smoke pass exposes a bug.
- Use the existing smoke repo and task lifecycle flow.
- Do not add release, version, package, lockfile, workflow, registry, Marketplace, GHCR, MCP publishing, cleanup automation, or evidence deletion changes.

## Non-Goals
- Adding a new command or flag.
- Changing task archive semantics.
- Refactoring the full smoke script.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- scripts/smoke-cli.mjs runs task doctor after task done/archive and asserts pass with no recent-evidence-without-active-task diagnostic.
- The smoke assertion uses the packaged built CLI, not source tsx.
- tests/distribution-artifacts.test.ts locks the new built smoke coverage.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "archived task doctor"
- npx prettier --check scripts/smoke-cli.mjs tests/distribution-artifacts.test.ts
- git diff --name-only -- package.json pnpm-lock.yaml CHANGELOG.md .github/workflows
- npm run build
- node scripts/smoke-cli.mjs
- npm test -- tests/distribution-artifacts.test.ts

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the smoke-script and distribution-artifact test edits. No runtime state migration is required.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
