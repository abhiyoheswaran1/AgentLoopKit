# Bound MCP handoff listing work

- Created date: 2026-06-24
- Task type: bugfix
- Status: done

## Problem Statement
MCP handoff listing reads and stats every PR summary before applying the requested limit, which can be slow in repos with long handoff history and weakens local DoS boundaries.

## Desired Outcome
agentloop_list_handoffs bounds expensive handoff metadata work before reading handoff Markdown content while preserving read-only behavior and response shape.

## Constraints
- Keep the change scoped to MCP handoff listing and supporting tests.
- Preserve existing handoff sort semantics for the returned newest handoffs.
- Do not release, version, tag, publish, or change dependencies.

## Non-Goals
- Do not redesign handoff storage or latest-handoff behavior.
- Do not clean up inherited AgentLoop or AgentFlight evidence.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/mcp-tools.ts
- tests/mcp-tools.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop_list_handoffs with a limit avoids reading non-returned PR summary Markdown content.
- MCP handoff response objects keep path, title, and modifiedAt fields.
- Focused MCP tests, typecheck, and build pass.

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
- Sorting by modified time must stay deterministic without relying on Markdown content reads for every handoff.
- Pre-existing dirty non-evidence files before task creation: 59 total; examples: `.agentloop/README.md`, `.agentloop/agents/claude-code.md`, `.agentloop/agents/codex.md`, `.agentloop/agents/cursor.md`, `.agentloop/agents/gemini-cli.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert the bounded listHandoffs change and its focused MCP test.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
