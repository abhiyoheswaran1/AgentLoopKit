# Add Loop Contract and readiness gates

- Created date: 2026-06-27
- Task type: feature
- Status: done

## Problem Statement
Users need AgentLoopKit to control low-token autonomous agent loops without becoming a coding agent.

## Desired Outcome
AgentLoopKit can create loop contracts, run read-only loop ticks, report readiness, and show context-budget receipts for agent work.

## Constraints
- Keep execution local-first and deterministic; do not add hidden network calls, telemetry, dependencies, or provider prompt interception.
- Use existing AgentLoopKit task, context, guard, verification, and Baseframe concepts instead of creating a disconnected workflow.

## Non-Goals
- Do not implement a coding agent runner.
- Do not auto-publish, auto-merge, or auto-complete work from loop ticks.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- .agentloop
- AGENTLOOP.md
- AGENTS.md
- README.md
- CHANGELOG.md
- FINAL_HANDOFF.md
- ROADMAP.md
- package.json
- server.json
- src/cli
- src/core
- src/templates
- tests
- docs

## Files or Areas Not to Touch
- .env

## Acceptance Criteria
- Users can run agentloop loop create with a goal, budgets, cadence, and iteration limit.
- Users can run agentloop loop tick to record a local iteration decision without executing an external coding agent.
- Users can run agentloop loop status and loop report to inspect loop state, decisions, token estimates, and stop reasons.
- Users can run agentloop ready to evaluate task, scope, acceptance, verification, drift, and context budget readiness.
- Loop and readiness outputs include AgentLoopKit overhead, broad-context estimate, compact-context estimate, and net context estimate.
- Docs explain loop contracts, token-budget boundaries, and dogfood usage with stop-slop cleanup.

## Verification Commands
- npx vitest run --maxWorkers=1
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 build

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the loop and ready command additions, docs, tests, and package release changes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
