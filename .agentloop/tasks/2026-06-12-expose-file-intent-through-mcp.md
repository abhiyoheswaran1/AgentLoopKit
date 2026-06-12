# Expose file intent through MCP

- Created date: 2026-06-12
- Task type: feature
- Status: review

## Problem Statement
Describe the problem this task should solve.

## Desired Outcome
MCP clients can ask which local AgentLoopKit runs touched or referenced a file and why, using the existing run ledger without command execution.

## Constraints
- None recorded yet.

## Non-Goals
- Do not add MCP write tools, command execution, or GitHub token handling.
- Do not infer intent with an LLM or inspect file contents.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/mcp-tools.ts
- tests/mcp-tools.test.ts
- docs/mcp.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Read-only MCP tool agentloop_file_intent accepts a repo-relative file path and returns the same deterministic intent matches as agentloop intent.
- The MCP intent payload includes the normalized file path and matching run summaries with repo-relative AgentLoop artifact paths.
- The tool does not read the target file contents, execute commands, call APIs, or write files.

## Verification Commands
- npm test -- tests/mcp-tools.test.ts tests/mcp-server.test.ts
- npm run typecheck
- npm run lint

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- MCP intent lookup must not turn arbitrary file paths into file reads or absolute path leaks.

## Rollback Notes
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
