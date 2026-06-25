# Bound MCP evidence listing work

- Created date: 2026-06-24
- Task type: bugfix
- Status: done

## Problem Statement
MCP list-style tools can read or sort more local ledger and handoff evidence than their returned limit requires, which is slow in large repos and weakens the local DoS boundary.

## Desired Outcome
MCP list tools apply bounded evidence reads before expensive hydration where existing core APIs support it, while preserving output shape and read-only behavior.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/mcp-tools.ts
- src/core/runs.ts
- tests/mcp-tools.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop_list_runs uses the bounded run listing API with the requested limit
- MCP output shape stays compatible for runs and handoff list consumers
- Focused MCP tests, typecheck, and build pass

## Verification Commands
- npm run test:unit -- tests/mcp-tools.test.ts
- npm run typecheck
- npm run build

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Starts from a broad dirty unreleased batch; preserve prior context/start/run-ledger changes and keep this task scoped to MCP list bounds.
- Pre-existing dirty non-evidence files before task creation: 59 total; examples: `.agentloop/README.md`, `.agentloop/agents/claude-code.md`, `.agentloop/agents/codex.md`, `.agentloop/agents/cursor.md`, `.agentloop/agents/gemini-cli.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Restore MCP list tools to their previous list-then-slice behavior.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
