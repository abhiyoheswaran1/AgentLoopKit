# Skip AgentFlight placeholder section warnings

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
Exact AgentFlight placeholder task contracts are intentionally skeletal evidence, but task doctor can still warn that their placeholder sections are incomplete when they are proposed or otherwise open. That adds noise and forces manual status parking beyond fixing real active-task ambiguity.

## Desired Outcome
task doctor keeps active AgentFlight placeholder recovery warnings, but does not emit placeholder-task-section diagnostics for exact AgentFlight placeholder contracts.

## Constraints
- Keep AgentFlight placeholder files preserved and visible in task list/review-context/artifacts.
- Do not change task selection, active-task pointer semantics, AgentFlight itself, or ordinary task placeholder diagnostics.
- Do not release, publish, tag, bump versions, add dependencies, call network APIs, or clean up evidence files.

## Non-Goals
- No automatic mutation of AgentFlight placeholder status.
- No change to active-task-agentflight-placeholder warnings.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/task-state.ts
- tests/task-state.test.ts
- docs/status.md

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml

## Acceptance Criteria
- task doctor does not report placeholder-task-section for exact AgentFlight placeholder contracts even when status is proposed.
- task doctor still reports active-task-agentflight-placeholder when .agentloop/state.json points at an exact AgentFlight placeholder.
- ordinary open task contracts with placeholder sections still produce placeholder-task-section diagnostics.

## Verification Commands
- npm test -- tests/task-state.test.ts
- npm run typecheck
- npm run lint
- npm run build
- npm test

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Over-broad suppression could hide incomplete real task contracts if the AgentFlight placeholder classifier is too loose.

## Rollback Notes
Revert the task-state doctor change, tests, docs, and task evidence for this bugfix.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
