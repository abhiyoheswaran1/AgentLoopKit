# Implement Baseframe Suite Integration v1

- Created date: 2026-06-26
- Task type: feature
- Status: done

## Problem Statement
AgentLoopKit cannot yet consume ProjScan Baseframe assessment artifacts or reconcile AgentFlight results through versioned local JSON contracts.

## Desired Outcome
AgentLoopKit can create a native task and stable .baseframe/evidence/<task-id>/agentloopkit-task.json from a ProjScan assessment, update .baseframe/agent-workflow.json safely, and later evaluate AgentFlight gate results without importing either product internals.

## Constraints
- Do not version bump, commit, push, tag, publish, modify ProjScan or AgentFlight repos, build an umbrella CLI, or execute a coding agent.
- Use local versioned JSON artifacts and keep AgentLoopKit standalone-compatible.
- Validate schema version, kind, task ID, required fields, and path safety with clear failures for incompatible artifacts.

## Non-Goals
- Do not merge AgentLoopKit, ProjScan, and AgentFlight products or import their internals.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/**
- tests/**
- docs/integrations/baseframe-suite-v1.md
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- create-task --from-projscan validates a ProjScan assessment and creates/updates a native AgentLoopKit task.
- AgentLoopKit writes .baseframe/evidence/<task-id>/agentloopkit-task.json matching the v1 task contract schema.
- Suggested ProjScan checks become verification gates and blocking/warning risks are surfaced.
- Missing acceptance criteria remain explicit pending/unknown placeholders and do not mark readiness automatically.
- The Baseframe workflow manifest preserves other tool sections and updates only AgentLoopKit fields plus timestamps.
- check-gates --task <task-id> --from-agentflight reconciles AgentFlight verification, failed/missing/incomplete gates, and scope drift.
- Existing AgentLoopKit standalone task workflows remain compatible.

## Verification Commands
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 build
- npx pnpm@10.12.1 pack --dry-run

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Public CLI behavior changes around create-task/check-gates require compatibility with existing options.
- Path handling writes under .baseframe and .agentloop must reject traversal and unsafe paths.

## Rollback Notes
Revert Baseframe integration files and remove generated .baseframe/.agentloop task evidence for affected test fixtures.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
