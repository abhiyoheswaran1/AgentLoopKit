# Expose gate status through MCP

- Created date: 2026-06-12
- Task type: feature
- Status: review

## Problem Statement
MCP clients can read tasks, policies, verification evidence, ship reports, runs, and maintainer checks, but cannot inspect the deterministic review gate report without shelling out to agentloop check-gates.

## Desired Outcome
Expose the existing local review gate report through a read-only MCP tool so agents can see task, verification, handoff, harness, policy, and git gates before review.

## Constraints
- Keep MCP v1 read-only.
- Do not run verification commands from MCP.
- Do not post comments, call GitHub APIs, read tokens, or mutate repository files.

## Non-Goals
- New gate definitions or scoring changes.
- A policy engine or compliance claim.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/mcp-tools.ts
- tests/mcp-tools.test.ts
- docs/mcp.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop_check_gates appears in the MCP tool list with optional strict input.
- Calling agentloop_check_gates returns the same deterministic gate status shape used by agentloop check-gates --json.
- The MCP tool supports strict mode without changing default behavior.
- MCP docs describe the gate tool and keep the server safety boundary explicit.

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
