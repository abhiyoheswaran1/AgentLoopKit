# Bound MCP evidence listing work

- Created date: 2026-06-24
- Task type: feature
- Status: done

## Problem Statement
The MCP `agentloop_artifacts` tool builds the full artifact inventory before rendering results. Even when an MCP client asks
for `latest: true`, the current path calls the full run ledger through `listRuns(cwd)` and can hydrate far more run metadata
than needed for a compact latest-evidence answer.

## Desired Outcome
MCP latest-artifact responses should inspect only the bounded run evidence needed for the requested latest payload while
preserving the existing response shape. Full artifact inventory remains available for callers that do not request
`latest: true`.

## Constraints
- Keep changes scoped to artifact inventory plumbing, MCP `agentloop_artifacts`, and focused tests.
- Preserve existing CLI artifact behavior unless tests prove the same safe helper can be shared without changing output.
- Do not remove full inventory support for local scripts.
- Do not mutate artifact files.

## Non-Goals
- Do not redesign stale artifact cleanup.
- Do not change artifact output schemas beyond optional internal plumbing.
- Do not release or change package metadata.

## Assumptions
- Latest-artifact MCP calls need at most the newest run summary, not the complete run ledger.
- Full artifact inventory may still need complete counts and can keep the existing broader path.

## Likely Files or Areas
- `src/core/artifacts.ts`
- `src/core/mcp-tools.ts`
- `tests/mcp-tools.test.ts`
- `tests/artifacts.test.ts` if shared artifact plumbing changes CLI behavior

## Files or Areas Not to Touch
- package version, changelog, release workflows, publish scripts

## Acceptance Criteria
- `agentloop_artifacts` with `latest: true` calls run inventory with a bounded newest-run limit instead of hydrating the full run ledger.
- Full `agentloop_artifacts` without `latest: true` preserves existing inventory counts and output shape.
- MCP tests prove latest artifact calls pass a run limit and full artifact calls do not.
- Focused MCP/artifact tests, typecheck, build, dogfood, gates, and handoff evidence pass.

## Verification Commands
- `npm run test:unit -- tests/mcp-tools.test.ts tests/artifacts.test.ts`
- `npm run typecheck`
- `npm run build`
- `npm run dogfood`

## Post-Verification Gates
- `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-24-bound-mcp-evidence-listing-work-2.md --task-commands --only-task-commands --progress --write-run --redact-paths`
- `node dist/cli/index.js ship --redact-paths`
- `node dist/cli/index.js prepare-pr --redact-paths`
- `node dist/cli/index.js check-gates --redact-paths`

## Implementation Plan
- Add red MCP tests around `agentloop_artifacts` latest/full run-listing calls.
- Add an artifact inventory option for bounded run summaries when only latest artifacts are needed.
- Wire MCP `latest: true` to the bounded path.
- Keep CLI artifact behavior stable unless it explicitly opts into the bounded path later.
- Run bug, performance, security, dogfood, and evidence passes.

## Risk Notes
- Artifact inventory is reviewer evidence; output shape compatibility matters for MCP clients.
- Pre-existing dirty non-evidence files before task creation: 59 total; examples: `.agentloop/README.md`, `.agentloop/agents/claude-code.md`, `.agentloop/agents/codex.md`, `.agentloop/agents/cursor.md`, `.agentloop/agents/gemini-cli.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert bounded MCP artifact inventory plumbing and focused tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
