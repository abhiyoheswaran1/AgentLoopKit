# Expose run details through MCP

- Created date: 2026-06-12
- Task type: feature
- Status: done

## Problem Statement
Describe the problem this task should solve.

## Desired Outcome
MCP clients can read one local run ledger entry by id with repo-relative artifact paths and no write or command execution capability.

## Constraints
- None recorded yet.

## Non-Goals
- Do not add MCP write tools or command execution.
- Do not add network calls, GitHub token handling, telemetry, or AI API calls.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/mcp-tools.ts
- tests/mcp-tools.test.ts
- docs/mcp.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Read-only MCP tool agentloop_show_run accepts a run id and returns the same local run record shape as the CLI show-run command.
- MCP show-run payload renders AgentLoop artifact paths repo-relative and never leaks the absolute workspace path.
- Unsafe or missing run ids return the existing run-ledger error path without reading outside .agentloop/runs.

## Verification Commands
- npm test -- tests/mcp-tools.test.ts tests/mcp-server.test.ts
- npm run typecheck
- npm run lint

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- MCP payloads can accidentally expose absolute local paths or read through unsafe run ids.

## Rollback Notes
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
