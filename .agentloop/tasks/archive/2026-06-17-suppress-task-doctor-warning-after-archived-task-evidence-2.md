# Suppress task-doctor warning after archived task evidence

- Created date: 2026-06-17
- Task type: bugfix
- Status: done

## Problem Statement
After a task is verified, handed off, marked done, and archived, agentloop task doctor still reports recent-evidence-without-active-task even when there are no open tasks and the latest run points at the archived terminal task. This contradicts the documented closed-task evidence behavior and creates noisy guidance between autonomous tasks.

## Desired Outcome
task doctor treats the latest archived terminal task evidence as closed when no open task is waiting, so post-archive status stays focused on creating the next task without a stale recent-evidence warning.

## Constraints
- Keep this limited to task doctor/status evidence handling and tests.
- Do not change release, version, package, lockfile, workflow, registry, Marketplace, GHCR, MCP publishing, or cleanup behavior.
- Do not hide warnings when recent evidence points at an open, missing, non-terminal, or unrelated task.

## Non-Goals
- Adding cleanup automation or deleting evidence.
- Changing task archive semantics.
- Changing normal active-task pointer behavior.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/task-state.ts
- tests/task-state.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- A focused test reproduces a done archived task with recent verify/ship evidence and no active state, and task doctor reports pass instead of recent-evidence-without-active-task.
- The existing stale/missing active task diagnostics continue to warn when evidence points at missing or open work.
- Status and next still recommend create-task when no active or open task exists.

## Verification Commands
- npm test -- tests/task-state.test.ts -t "archived task evidence"
- npx prettier --check src/core/task-state.ts tests/task-state.test.ts
- git diff --name-only -- package.json pnpm-lock.yaml CHANGELOG.md .github/workflows
- npm test -- tests/task-state.test.ts
- npm run build

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the task-state diagnostic and test changes. No evidence migration or user data rollback is required.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
