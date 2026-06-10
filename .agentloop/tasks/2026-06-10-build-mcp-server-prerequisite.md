# Build MCP server prerequisite

- Created date: 2026-06-10
- Task type: feature
- Status: proposed

## Problem Statement
AgentLoopKit cannot be released to the MCP Registry until it exposes a real MCP server. The current product is a CLI, not an MCP server.

## Desired Outcome
AgentLoopKit exposes a read-only MCP server for safe local inspection of AgentLoop state, tasks, policies, reports, and handoffs.

## Constraints
- Start read-only.
- Do not run verification commands through MCP in the first version.
- Do not read `.env` contents.
- Do not call external APIs.
- Do not claim MCP Registry support until registry metadata and publish are complete.

## Non-Goals
- Do not build a cloud service.
- Do not add login, telemetry, or database storage.

## Likely Files or Areas
- src/mcp/
- src/cli/index.ts
- tests/mcp*.test.ts
- docs/mcp.md
- package.json

## Acceptance Criteria
- `agentloop mcp-server` starts an MCP-compatible stdio server.
- Read-only tools expose status, task list, policy list, and latest report metadata.
- Vitest covers tool outputs and safety constraints.

## Verification Commands
- npm test
- npm run typecheck
- npm run build

## Rollback Notes
Remove the MCP server command before release if protocol compatibility or safety checks are not proven.
