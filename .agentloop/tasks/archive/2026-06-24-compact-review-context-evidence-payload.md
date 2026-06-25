# Compact review-context evidence payload

- Created date: 2026-06-24
- Task type: bugfix
- Status: done

## Problem Statement
review-context --json and MCP agentloop_review_context still include the full evidenceMap.files array, producing broad payloads that undermine the compact context contract for agents.

## Desired Outcome
Review-context JSON and MCP payloads return compact evidence-map data by default while keeping the human review-context output and evidence-map handle expansion useful.

## Constraints
- Keep human review-context output unchanged except for existing compact summary behavior.
- Preserve full evidence detail through agentloop context show evidence-map:current.
- Do not release, version, tag, publish, or change dependencies.

## Non-Goals
- Do not redesign evidence-map scoring or review-context sections.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/review-context.ts
- src/core/context-contract.ts
- tests/review-context.test.ts
- tests/mcp-tools.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- review-context --json does not include the full evidenceMap.files array by default.
- agentloop_review_context MCP payload does not include the full evidenceMap.files array by default.
- Payload keeps evidence summary, coverage, risk, verification, next actions, claims, and evidence-map expansion handle.
- Human review-context output still renders the compact evidence-map summary.
- Focused review-context/MCP tests, typecheck, build, dogfood, and gates pass.

## Verification Commands
- npm run test:unit -- tests/review-context.test.ts tests/mcp-tools.test.ts
- npm run typecheck
- npm run build

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Changing JSON shape can affect scripts that consumed review-context evidenceMap.files; preserve summary fields and source handle.
- Pre-existing dirty non-evidence files before task creation: 60 total; preserve them.
- Pre-existing dirty non-evidence files before task creation: 60 total; examples: `.agentloop/README.md`, `.agentloop/agents/claude-code.md`, `.agentloop/agents/codex.md`, `.agentloop/agents/cursor.md`, `.agentloop/agents/gemini-cli.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert review-context evidence-map compaction and focused tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
