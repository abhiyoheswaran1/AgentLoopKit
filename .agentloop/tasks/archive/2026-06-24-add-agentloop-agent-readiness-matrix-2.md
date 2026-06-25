# Add AgentLoop agent readiness matrix

- Created date: 2026-06-24
- Task type: feature
- Status: done

## Problem Statement
The current Start proof is strong, but users and agents still need one setup audit that says whether this repo is ready for Codex, Claude Code, Cursor, Copilot, generic agents, and MCP clients to start with AgentLoopKit correctly.

## Desired Outcome
Doctor and generated docs expose an agent readiness matrix with Start, context-handle, broad-read, and MCP setup signals, and README/demo copy shows how agents should start here.

## Constraints
- No release metadata, version bump, tag, publish workflow, telemetry, provider proxying, prompt interception, or dependency change.
- Keep readiness checks local, deterministic, and based on existing generated guidance files.

## Non-Goals
- No new third-party agent config writer.
- No hosted dashboard or remote registry check.

## Assumptions
- upgrade-harness topic detection is the right source for Start/context/broad-read guidance readiness.

## Likely Files or Areas
- src/core/doctor.ts
- src/core/upgrade-harness.ts
- src/cli/commands/doctor.ts
- tests/doctor.test.ts
- tests/upgrade-harness.test.ts
- tests/init.test.ts
- README.md
- docs/cli-reference.md
- docs/context.md
- docs/mcp.md
- docs/start-usefulness-demo.md
- docs/assets/readme/agentloopkit-context-contract.tape
- docs/assets/readme/agentloopkit-context-contract.gif
- docs/superpowers/plans/*
- src/core/agent-start.ts
- tests/agent-start.test.ts
- src/templates/root/agentloop-directory-readme.md
- src/templates/loops/research.md
- .agentloop/README.md
- .agentloop/loops/research.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- doctor human output shows an Agent Readiness Matrix with Codex, Claude, Cursor, Copilot/generic, MCP, Start, context show, and broad-read avoidance signals
- doctor --json exposes agentReadiness for agents and automation
- README/docs/demo teach Make Your Agent Start Here without token-billing claims
- Focused tests, docs checks, build, dogfood, ProjScan, and AgentFlight proof pass

## Verification Commands
- npm run test:unit -- tests/doctor.test.ts tests/upgrade-harness.test.ts tests/init.test.ts
- npm run check:public-docs
- npm run build

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Pre-existing dirty non-evidence files before task creation: 14 total; examples: `.agentloop/README.md`, `.agentloop/loops/research.md`, `README.md`, `docs/cli-reference.md`, `docs/context.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert the doctor readiness matrix, docs/demo updates, and generated AgentLoop evidence while preserving the prior Start usefulness proof batch

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
