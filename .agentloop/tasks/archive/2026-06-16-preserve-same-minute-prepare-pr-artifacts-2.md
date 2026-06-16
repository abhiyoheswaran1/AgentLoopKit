# Preserve same-minute prepare-pr artifacts

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
agentloop prepare-pr --write can reuse the same generated minute-based PR description path and replace the previous draft when rerun quickly.

## Desired Outcome
Default generated prepare-pr PR description paths allocate a numeric suffix when the generated path already exists, preserving prior PR drafts without changing ship reuse or report generation behavior.

## Constraints
- Reuse existing artifact path safety helpers.
- Keep `prepare-pr` ship evidence reuse behavior unchanged.
- Keep generated PR body, GitHub comment output, and JSON shape unchanged except for safer `writtenPath` values when a collision exists.

## Non-Goals
- Do not add a new `--out` flag.
- Do not change `ship` scoring, run-ledger schema, or PR body formatting.
- Do not cut or publish a release.

## Assumptions
- Generated `prepare-pr --write` artifacts are review evidence and should be preserved like handoffs and release notes.
- Numeric suffix allocation is already the local convention for default generated Markdown artifacts.

## Likely Files or Areas
- src/core/prepare-pr.ts
- tests/prepare-pr.test.ts
- docs/cli-reference.md
- CHANGELOG.md
- .agentloop/backlog.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch
- package.json version
- release workflows
- npm/GitHub release metadata
- MCP server behavior

## Acceptance Criteria
- Running `prepare-pr --write` twice for the same generated timestamp preserves the first PR description.
- The second default PR description path receives a deterministic numeric suffix.
- `prepare-pr` still reuses fresh ship evidence when inputs match.
- Docs and changelog explain default generated PR description paths avoid same-minute collisions.

## Verification Commands
- npm test -- tests/prepare-pr.test.ts
- npm test -- tests/prepare-pr.test.ts tests/artifacts.test.ts tests/runs.test.ts tests/cli-docs-drift.test.ts
- npm run check:public-docs
- npm run typecheck
- npm run lint
- npm run build

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- `prepare-pr --write` is a reviewer-facing artifact writer. Preserve current output shape and avoid changing ship evidence refresh/reuse semantics.

## Rollback Notes
Revert the prepare-pr path allocator change and regression tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
