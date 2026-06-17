# Prevent stale AgentLoop task state

- Created date: 2026-06-16
- Task type: feature
- Status: done

## Problem Statement
Installed repos can preserve real work in devlogs, changelogs, or reports while AgentLoopKit still points at an old active task. Agents then see stale task context and may miss current shipped work.

## Desired Outcome
AgentLoopKit should detect stale or missing task state, suggest token-conscious recovery steps, and help users create or close task contracts without scanning whole repos or dumping long context.

## Implementation Plan Reference
Use `docs/superpowers/plans/2026-06-16-stale-task-state-recovery.md` when this task is approved for implementation.

## Constraints
- Keep the detector local-first and deterministic.
- Avoid broad full-repo scans by default.
- Do not call LLMs, GitHub APIs, or external services.
- Do not auto-overwrite user task files or state pointers.
- Prefer compact summaries and explicit file references over copying long reports into output.
- Keep v1 scoped to `.agentloop/state.json`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`, recent `.agentloop/runs/`, and recent `.agentloop/reports/`.
- Cap inspected file counts and file sizes before reading evidence.

## Non-Goals
- Do not implement the fix in this task creation pass.
- Do not build a project-management system.
- Do not make AgentLoopKit infer task history from arbitrary prose with an LLM.
- Do not scan arbitrary devlogs, changelogs, repository prose, dependency folders, home directories, or `.env` files.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/task-state.ts
- src/cli/index.ts
- tests/task-state.test.ts
- docs/getting-started.md
- docs/upgrading-existing-repos.md
- AGENTLOOP.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- doctor or task doctor warns when .agentloop/state.json points to an archived, missing, done, or clearly old task while newer reports/runs exist.
- status and next recommend a bounded recovery command when task state is stale.
- A read-only recovery command or mode prints suggested task contracts to create or close without mutating files unless the user asks.
- The implementation caps report/run inspection by count, file size, and directory scope.
- Docs explain how existing users recover stale AgentLoop task state in old repos.
- Tests cover missing active task, archived active task, terminal active task, deferred active task, active task older than recent run evidence, and recent evidence without an active task.
- Human output uses compact file references and recovery commands instead of copying long report or run bodies.

## Verification Commands
- npm test -- tests/task-state.test.ts tests/doctor.test.ts tests/task-lifecycle.test.ts
- npm run typecheck
- npm run check:public-docs

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- False positives could annoy users in repos with intentionally parked tasks.
- Over-eager scanning could waste tokens or slow home-directory mistakes.

## Rollback Notes
Revert task-state detector, tests, docs, and generated AgentLoop evidence.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
