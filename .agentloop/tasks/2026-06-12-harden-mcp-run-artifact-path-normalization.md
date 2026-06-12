# Harden MCP run artifact path normalization

- Created date: 2026-06-12
- Task type: security-review
- Status: review

## Problem Statement

Review-context now avoids absolute run metadata path leaks, but other MCP run tools still use a local path formatter that can render outside or symlink-mismatched absolute paths as ../.. relative paths.

## Desired Outcome

Use one safe display-path formatter for review-context and MCP run summaries/details so AgentLoop artifact paths stay repo-relative and outside paths do not leak absolute directories.

## Constraints

- Keep runtime behavior read-only.
- Do not change run ledger file formats.
- Do not remove existing JSON fields; only normalize display values returned by read APIs.

## Non-Goals

- Do not migrate old run records.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/display-path.ts
- src/core/review-context.ts
- src/core/mcp-tools.ts
- tests/mcp-tools.test.ts

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- MCP list/show-run/file-intent outputs do not expose absolute outside paths from run metadata.
- AgentLoop artifact paths in MCP and review-context outputs remain .agentloop/... when metadata includes absolute AgentLoop artifact paths.
- Existing MCP review-context and CLI review-context tests continue to pass.

## Verification Commands

- npm test -- tests/mcp-tools.test.ts tests/review-context.test.ts
- npm run typecheck
- npm run build

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Over-normalizing arbitrary paths could remove useful context, so limit special handling to AgentLoop artifacts and outside-path fallback names.

## Rollback Notes

Restore the previous path helper usage in MCP and review-context; run ledger files are unchanged.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
