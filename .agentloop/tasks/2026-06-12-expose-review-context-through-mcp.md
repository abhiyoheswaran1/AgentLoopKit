# Expose review context through MCP

- Created date: 2026-06-12
- Task type: feature
- Status: review

## Problem Statement

MCP clients currently have to call several AgentLoopKit tools to understand whether a repo is review-ready before an agent continues work.

## Desired Outcome

Provide one read-only MCP review context snapshot that combines local status, gates, policies, artifacts, recent runs, and latest ship evidence.

## Constraints

- Keep the MCP server read-only.
- Do not run verification or mutate files from the MCP tool.
- Keep paths repo-relative in returned run metadata.

## Non-Goals

- Do not add write-capable MCP tools.
- Do not call GitHub, npm, external APIs, or AI services.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/mcp-tools.ts
- tests/mcp-tools.test.ts
- docs/mcp.md

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- MCP clients can call agentloop_review_context for one read-only reviewability snapshot.
- The payload includes status, gates, policy status, artifact inventory, recent runs, and latest ship score when available.
- The tool does not run commands, read env contents, write files, or expose absolute repo paths in nested run metadata.

## Verification Commands

- npm test -- tests/mcp-tools.test.ts
- npm run typecheck
- npm run build

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Payload could become too noisy if it includes full Markdown contents.
- Incorrect path normalization could leak absolute temporary paths.

## Rollback Notes

Remove the MCP tool definition and dispatch branch; no generated user files depend on it.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
