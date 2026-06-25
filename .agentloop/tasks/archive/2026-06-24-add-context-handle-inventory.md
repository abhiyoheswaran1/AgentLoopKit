# Add context handle inventory

- Created date: 2026-06-24
- Task type: feature
- Status: done

## Problem Statement
Agents can expand known context handles, but there is no direct read-only inventory command that lists which handles are available, why they matter, and how to expand them before broad reads.

## Desired Outcome
Users and software agents can run a context handle inventory command to see available source handles, availability, reasons, and expansion commands without generating a full pack.

## Constraints
- No release metadata, tags, publishing, telemetry, network calls, provider proxying, prompt interception, dependency changes, or secret reads.

## Non-Goals
- Do not add reducers, provider tokenization, billing-token claims, or hosted state.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/context-contract.ts
- src/cli/commands/context.ts
- src/core/mcp-tools.ts
- tests/context-contract.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- CLI exposes a read-only context handle inventory with human and JSON output
- Inventory marks unavailable handles without throwing for normal empty states
- MCP or agent-facing surfaces can discover the inventory without broad reads
- Focused tests, typecheck, build, and dogfood checks pass

## Verification Commands
- npm run test:unit -- tests/context-contract.test.ts
- npm run typecheck
- npm run build

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Starts from a broad dirty unreleased batch; keep this task scoped to context handle inventory and preserve existing evidence.
- Pre-existing dirty non-evidence files before task creation: 52 total; examples: `.agentloop/README.md`, `.agentloop/agents/claude-code.md`, `.agentloop/agents/codex.md`, `.agentloop/agents/cursor.md`, `.agentloop/agents/gemini-cli.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Remove the context handle inventory command/tool and restore context command help to the previous budget/pack/show surface.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
