# Expose artifact inventory through MCP

- Created date: 2026-06-12
- Task type: feature
- Status: review

## Problem Statement
MCP clients can read specific reports and run evidence, but cannot inventory all local AgentLoopKit artifacts the way agentloop artifacts --json can.

## Desired Outcome
Expose the existing read-only artifact inventory through MCP so agents can discover local task, verification, handoff, report, badge, CI summary, and release-note evidence without directory scraping.

## Constraints
- Keep MCP v1 read-only.
- Do not read artifact file contents beyond the existing inventory metadata behavior.
- Do not mutate files, run commands, call APIs, or read env contents.

## Non-Goals
- Adding new artifact types.
- Returning full report contents from the inventory tool.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/mcp-tools.ts
- tests/mcp-tools.test.ts
- docs/mcp.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop_artifacts appears in the MCP tool list with optional type and latest inputs.
- Calling agentloop_artifacts returns the same deterministic JSON shape as agentloop artifacts --json.
- The tool supports type and latest filtering and validates unsupported types.
- MCP docs describe the artifacts tool and preserve the read-only safety boundary.

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
