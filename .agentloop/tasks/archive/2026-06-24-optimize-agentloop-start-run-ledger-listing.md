# Optimize AgentLoop Start run ledger listing

- Created date: 2026-06-24
- Task type: refactor
- Status: done

## Problem Statement
AgentLoop Start and context pack still list and hydrate every run before selecting recent evidence, which slows long-lived repos with large .agentloop/runs ledgers.

## Desired Outcome
Start and context pack can request only the recent run summaries they need while preserving run handles and run-coverage behavior.

## Constraints
- No dependency changes, release metadata, tags, publishing, telemetry, provider proxying, or prompt interception.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/runs.ts
- src/core/context-contract.ts
- src/core/evidence-map.ts
- tests/context-contract.test.ts
- tests/runs.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Context pack and Start use a bounded run listing path for recent run evidence
- Existing run sorting and run coverage behavior remain covered by tests
- Performance, security, and docs checks pass without release metadata changes

## Verification Commands
- npm run test:unit -- tests/context-contract.test.ts tests/runs.test.ts
- npm run typecheck
- npm run build

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Starts from a broad dirty unreleased batch; keep this task scoped to run-ledger performance and preserve existing evidence.
- Pre-existing dirty non-evidence files before task creation: 48 total; examples: `.agentloop/README.md`, `.agentloop/agents/claude-code.md`, `.agentloop/agents/codex.md`, `.agentloop/agents/cursor.md`, `.agentloop/agents/gemini-cli.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert the bounded run-listing API and restore context pack evidence map calls to the previous listRuns behavior.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
