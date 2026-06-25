# Compact context pack JSON payloads

- Created date: 2026-06-24
- Task type: bugfix
- Status: done

## Problem Statement
agentloop context pack --json and MCP context_pack return the full evidence-map files array, so agent and MCP consumers receive broad changed-file detail that the compact context-pack workflow is supposed to avoid.

## Desired Outcome
JSON and MCP context packs return compact evidence-map data by default while preserving full detail through context show evidence-map:current.

## Constraints
- Keep internal evidence-map builders intact for existing coverage tests and local expansion.
- Do not remove source handles or receipt fields needed for auditability.
- Do not release, version, tag, publish, or change dependencies.

## Non-Goals
- Do not redesign evidence-map scoring or context-budget estimates.
- Do not change human markdown pack output except where needed to reflect compact JSON semantics.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/context-contract.ts
- src/cli/commands/context.ts
- src/core/mcp-tools.ts
- tests/context-contract.test.ts
- tests/mcp-tools.test.ts
- tests/mcp-server.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- context pack --json does not include the full evidenceMap.files array by default.
- agentloop_context_pack MCP payload does not include the full evidenceMap.files array by default.
- The payload still exposes compact evidence summary, coverage, risk, verification, next actions, claims, and source handles.
- Full evidence-map detail remains retrievable with context show evidence-map:current.
- Focused context/MCP tests, typecheck, build, dogfood, and gates pass.

## Verification Commands
- npm run test:unit -- tests/context-contract.test.ts tests/mcp-tools.test.ts tests/mcp-server.test.ts
- npm run typecheck
- npm run build

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Changing JSON shape can affect agent/MCP consumers, so keep useful summary fields and source handles.
- Pre-existing dirty non-evidence files before task creation: 60 total; preserve them.
- Pre-existing dirty non-evidence files before task creation: 60 total; examples: `.agentloop/README.md`, `.agentloop/agents/claude-code.md`, `.agentloop/agents/codex.md`, `.agentloop/agents/cursor.md`, `.agentloop/agents/gemini-cli.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert the compact context-pack serialization changes and focused tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
