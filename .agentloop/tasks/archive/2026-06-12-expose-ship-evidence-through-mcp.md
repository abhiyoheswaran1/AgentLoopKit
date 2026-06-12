# Expose ship evidence through MCP

- Created date: 2026-06-12
- Task type: feature
- Status: done

## Problem Statement
The read-only MCP server exposes tasks, policies, verification reports, handoffs, status, and next action, but MCP clients cannot directly read the latest ship/readiness report or run ledger evidence.

## Desired Outcome
MCP clients can inspect local review-readiness evidence through read-only tools for the latest ship report and recent run ledger entries.

## Constraints
- Read-only only: no command execution, file writes, task status changes, GitHub calls, token reads, env-file reads, uploads, publishing, or version bump.
- Use existing local readers and path guards where possible.

## Non-Goals
- Do not add write-capable MCP tools.
- Do not expose full arbitrary file reads.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/mcp-tools.ts
- docs/mcp.md
- tests/mcp-tools.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- MCP lists an agentloop_latest_ship_report tool.
- MCP lists an agentloop_list_runs tool with a bounded limit argument.
- agentloop_latest_ship_report reads only the latest local ship report metadata and Markdown content.
- agentloop_list_runs returns recent run metadata without reading env files or executing commands.

## Verification Commands
- npm test -- tests/mcp-tools.test.ts
- npm run typecheck
- npm test

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- MCP tool additions must not weaken the read-only safety boundary.

## Rollback Notes
Remove the two MCP tools and restore docs/tests to the previous MCP tool list.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
