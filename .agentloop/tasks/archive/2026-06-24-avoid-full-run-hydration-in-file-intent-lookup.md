# Avoid full run hydration in file intent lookup

- Created date: 2026-06-24
- Task type: bugfix
- Status: done

## Problem Statement
agentloop intent and the MCP file-intent tool use findFileIntent, which currently calls readRun for every run. That hydrates score, diffstat, and full run records even though intent lookup only needs run metadata plus changed-file artifacts.

## Desired Outcome
File intent lookup reads only the local run metadata and changed-files artifacts needed to identify matching runs, preserving output shape while reducing unnecessary ledger reads and avoiding unrelated artifact failures.

## Constraints
- Keep the change scoped to run intent lookup, MCP wiring if needed, and focused tests.
- Preserve existing CLI and MCP output shape for file intent matches.
- Do not release, version, tag, publish, or change dependencies.

## Non-Goals
- Do not redesign the run ledger or create a persistent file-intent index.
- Do not clean up inherited AgentLoop or AgentFlight evidence.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/runs.ts
- tests/runs.test.ts
- tests/mcp-tools.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- findFileIntent can return a match when the run has valid metadata and changed-files evidence even if unrelated score or diffstat artifacts are unsafe or unreadable.
- findFileIntent still returns sanitized repo-relative paths and the same match fields.
- Focused run/MCP tests, typecheck, and build pass.

## Verification Commands
- npm run test:unit -- tests/runs.test.ts tests/mcp-tools.test.ts
- npm run typecheck
- npm run build

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Run-ledger security boundaries around symlinked artifacts must remain intact for changed-files evidence.
- Pre-existing dirty non-evidence files before task creation: 59 total; examples: `.agentloop/README.md`, `.agentloop/agents/claude-code.md`, `.agentloop/agents/codex.md`, `.agentloop/agents/cursor.md`, `.agentloop/agents/gemini-cli.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert the findFileIntent lookup change and focused tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
