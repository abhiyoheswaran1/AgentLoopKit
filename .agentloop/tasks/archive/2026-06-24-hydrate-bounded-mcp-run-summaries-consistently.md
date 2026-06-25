# Hydrate bounded MCP run summaries consistently

- Created date: 2026-06-24
- Task type: bugfix
- Status: done

## Problem Statement
MCP agentloop_list_runs uses bounded run listing but returns stored task title/status while the CLI run summary hydrates current or archived task metadata. That can make MCP and CLI disagree for the same recent run after a task is renamed, completed, or archived.

## Desired Outcome
agentloop_list_runs remains bounded by the requested limit, but returned run summaries hydrate task metadata for the limited result set so MCP and CLI agree on task title/status.

## Constraints
- Keep the change scoped to MCP list-runs behavior and focused tests.
- Preserve the existing MCP response shape and limit validation.
- Do not release, version, tag, publish, or change dependencies.

## Non-Goals
- Do not redesign run ledger storage or unsafe metadata reporting.
- Do not clean up inherited AgentLoop or AgentFlight evidence.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/mcp-tools.ts
- tests/mcp-tools.test.ts
- tests/runs.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop_list_runs calls the bounded run listing API with the requested limit and hydrates only returned run task metadata.
- MCP list-runs output matches CLI run summary task title/status for current task files.
- Focused MCP/run tests, typecheck, and build pass.

## Verification Commands
- npm run test:unit -- tests/mcp-tools.test.ts tests/runs.test.ts
- npm run typecheck
- npm run build

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Hydrating task metadata must stay bounded to the requested run limit.
- Pre-existing dirty non-evidence files before task creation: 60 total; examples: `.agentloop/README.md`, `.agentloop/agents/claude-code.md`, `.agentloop/agents/codex.md`, `.agentloop/agents/cursor.md`, `.agentloop/agents/gemini-cli.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert the MCP list-runs hydration change and focused test.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
