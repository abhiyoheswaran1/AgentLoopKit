# Expose review context through the CLI

- Created date: 2026-06-12
- Task type: feature
- Status: review

## Problem Statement
Non-MCP agent sessions can only get reviewability context by stitching together status, gates, policy status, artifacts, and runs manually.

## Desired Outcome
Add a read-only CLI command that prints the same review context snapshot used by MCP clients.

## Constraints
- Keep the command read-only and local-only.
- Default to Markdown for humans and support --json for agents and scripts.
- Do not run verification commands or write artifacts.

## Non-Goals
- Do not add a cloud dashboard, GitHub posting, or token handling.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/review-context.ts
- src/core/mcp-tools.ts
- src/cli/commands/review-context.ts
- tests/review-context.test.ts
- tests/cli-docs-drift.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop review-context prints a concise Markdown snapshot with status, gates, artifacts, recent runs, latest ship score, and next action.
- agentloop review-context --json returns the full deterministic payload with repo-relative artifact paths.
- The command appears in CLI help, README, CLI reference, and shell completions.

## Verification Commands
- npm test -- tests/review-context.test.ts tests/cli-docs-drift.test.ts tests/mcp-tools.test.ts
- npm run typecheck
- npm run build

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- A default Markdown report could become too noisy if it dumps every nested object.

## Rollback Notes
Remove the CLI command, shared core module, and docs entries; MCP can continue using its current implementation.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
