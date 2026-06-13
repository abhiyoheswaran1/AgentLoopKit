# Add run ledger to artifact inventory

- Created date: 2026-06-13
- Task type: feature
- Status: done

## Problem Statement
AgentLoopKit treats .agentloop/runs as core evidence, but agentloop artifacts does not list run ledger entries, so agents and CI need a separate command to discover whether run evidence exists.

## Desired Outcome
agentloop artifacts includes run ledger count and latest run metadata in Markdown and JSON output, with --type run and --latest support.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/artifacts.ts
- src/cli/commands/artifacts.ts
- tests/artifacts.test.ts
- docs/cli-reference.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- artifact inventory JSON includes runs.count and runs.latest when run records exist
- agentloop artifacts --type run works in human and JSON output
- agentloop artifacts --latest includes the latest run entry

## Verification Commands
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build
- npm test -- tests/artifacts.test.ts
- npm run typecheck
- npm run build

## Post-Verification Gates
- npm run dogfood:strict:json

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Touches read-only inventory output shape; keep existing fields additive and preserve current filters.

## Rollback Notes
Revert artifact inventory run support and docs updates.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
