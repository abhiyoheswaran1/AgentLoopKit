# Improve upgrade path and docs polish

- Created date: 2026-06-13
- Task type: feature
- Status: done

## Problem Statement
Existing AgentLoopKit users can update the CLI, but older generated harness files do not explain the newer ship, prepare-pr, run ledger, maintainer-check, or MCP usage paths.

## Desired Outcome
Existing and new users have a clear safe upgrade path, a read-only harness upgrade audit, current getting-started guidance, MCP setup examples, and faster maintainer test entry points.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands
- src/core
- tests
- docs
- README.md
- package.json

## Files or Areas Not to Touch
- .env
- node_modules
- dist
- .git

## Acceptance Criteria
- CLI exposes a read-only upgrade-harness command with dry-run and JSON output
- Docs explain how existing users update the CLI and review older harness files without overwriting local edits
- Getting started promotes ship and prepare-pr as the main review-readiness flow
- MCP docs include concrete setup examples for supported agent surfaces without claiming unsafe writes
- Maintainer scripts make fast targeted tests easier to run while full tests remain available

## Verification Commands
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build
- npm test -- tests/upgrade-harness.test.ts tests/cli-docs-drift.test.ts
- npm run typecheck
- npm run build
- npm run check:links

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Touches CLI command surface, docs, package scripts, and release metadata

## Rollback Notes
Revert the upgrade-harness command, docs updates, package script changes, and release version bump

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
