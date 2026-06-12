# Expose policy status through MCP

- Created date: 2026-06-12
- Task type: feature
- Status: done

## Problem Statement
MCP clients can read individual policy files, but cannot inspect whether local AgentLoopKit policies are current, customized, missing, or extra without shelling out to the CLI.

## Desired Outcome
Expose policy template status through a read-only MCP tool so agents can check policy drift before changing repo rules.

## Constraints
- Keep MCP v1 read-only.
- Do not overwrite, install, or update policies from MCP.
- Do not add network calls, telemetry, AI API usage, or credential/env reads.

## Non-Goals
- Automatic policy migration or repair.
- Remote policy registry support.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/mcp-tools.ts
- tests/mcp-tools.test.ts
- docs/mcp.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop_policy_status appears in the MCP tool list with an empty input schema.
- Calling agentloop_policy_status returns the same deterministic policy status shape used by agentloop policy status --json.
- The MCP tool remains read-only and safe against policy root traversal.
- MCP docs describe the policy status tool and its intended use.

## Verification Commands
- npm test -- tests/mcp-tools.test.ts tests/mcp-server.test.ts
- npm run typecheck
- npm run lint

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
