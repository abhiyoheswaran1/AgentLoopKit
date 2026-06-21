# Expose maintainer check through MCP

- Created date: 2026-06-12
- Task type: feature
- Status: done

## Problem Statement
Describe the problem this task should solve.

## Desired Outcome
MCP clients can inspect local maintainer reviewability signals for agent-assisted work without command execution, writes, API calls, or token handling.

## Constraints
- None recorded yet.

## Non-Goals
- Do not add write tools, GitHub posting, token handling, or PR API integration.
- Do not change maintainer-check scoring or gate logic.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/mcp-tools.ts
- tests/mcp-tools.test.ts
- docs/mcp.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Read-only MCP tool agentloop_maintainer_check returns the same deterministic maintainer-check payload used by the CLI.
- The MCP maintainer-check payload remains local-only and does not post comments, call GitHub, or read environment files.
- The tool is documented in MCP docs and covered by MCP tool tests.

## Verification Commands
- npm test -- tests/mcp-tools.test.ts tests/mcp-server.test.ts
- npm run typecheck
- npm run lint

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Maintainer-check may expose local paths in structured output; avoid adding new path exposure beyond existing CLI JSON semantics unless already normalized.

## Rollback Notes
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
