# Avoid full run hydration in file intent lookup

- Created date: 2026-06-24
- Task type: feature
- Status: done

## Problem Statement
`agentloop intent <file>` and the MCP file-intent surface can scan the run ledger by hydrating every run through
`listRuns()`. Large repos or long-running dogfood sessions accumulate many run directories, so a single file-intent lookup
can perform broad metadata and changed-file reads when it only needs recent changed-file evidence for one path.

## Desired Outcome
File-intent lookup inspects bounded, newest-first run evidence and stops once enough relevant matches are found. The command
stays deterministic, preserves the existing user-facing output shape, and avoids broad run hydration for a single-file
question.

## Constraints
- Keep changes scoped to run-ledger/file-intent lookup behavior.
- Preserve current CLI and MCP response fields.
- Do not rewrite existing run artifacts.
- Do not broaden filesystem scans beyond `.agentloop/runs/`.

## Non-Goals
- Do not redesign run storage.
- Do not change ship, verify, or report run-writing behavior.
- Do not change unrelated context-pack compaction behavior.

## Assumptions
- Newest runs are the most useful source for file-intent lookup.
- Bounded lookup can still return useful evidence if it reports when older runs were not inspected.

## Likely Files or Areas
- `src/core/runs.ts`
- `src/core/mcp-tools.ts`
- `tests/runs.test.ts`
- `tests/mcp-tools.test.ts`

## Files or Areas Not to Touch
- package version, changelog, release metadata, npm/GitHub publishing paths

## Acceptance Criteria
- `agentloop intent <file>` no longer calls full run hydration for all runs before filtering by file path.
- File-intent lookup reads newest runs first, applies a documented upper bound, and stops after enough relevant evidence.
- CLI output remains compatible and mentions when the run search was bounded or truncated.
- MCP file-intent payload remains compatible and includes the same bounded/truncated signal.
- Regression tests prove old all-run hydration is not needed for bounded lookup and the user can see truncation context.

## Verification Commands
- `npm run test:unit -- tests/markdown-format.test.ts tests/prepare-pr.test.ts tests/runs.test.ts tests/mcp-tools.test.ts`
- `npm run typecheck`
- `npm run build`
- `npm run dogfood`

## Post-Verification Gates
- `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-24-avoid-full-run-hydration-in-file-intent-lookup-2.md --task-commands --only-task-commands --progress --write-run --redact-paths`
- `node dist/cli/index.js ship --redact-paths`
- `node dist/cli/index.js prepare-pr --redact-paths`
- `node dist/cli/index.js check-gates --redact-paths`

## Implementation Plan
- Inspect current run listing and file-intent flow.
- Add red tests for bounded file-intent lookup and truncation context.
- Implement a bounded run evidence iterator or lookup path that avoids full metadata hydration.
- Wire the bounded signal into CLI and MCP output without breaking existing fields.
- Run bug, performance, security, and dogfood passes.

## Risk Notes
- Changing lookup bounds may hide older evidence if the limit is too low; surface the bound so users can expand later if needed.
- Pre-existing dirty non-evidence files before task creation: 59 total; examples: `.agentloop/README.md`, `.agentloop/agents/claude-code.md`, `.agentloop/agents/codex.md`, `.agentloop/agents/cursor.md`, `.agentloop/agents/gemini-cli.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert the bounded file-intent lookup changes and related tests to restore full run hydration behavior.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
