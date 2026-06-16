# Preserve same-minute HTML report artifacts

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
agentloop report can reuse the same generated minute-based HTML report path and replace the previous local evidence report when rerun quickly.

## Desired Outcome
Default generated HTML report paths allocate a numeric suffix when the generated path already exists, preserving prior static report evidence without changing explicit --out behavior or report contents.

## Constraints
- Reuse existing artifact path safety helpers.
- Keep explicit `agentloop report --out <path>` exact-path behavior unchanged.
- Keep generated HTML contents, metadata, JSON shape, and source path behavior unchanged except for safer generated `outPath` values when a collision exists.

## Non-Goals
- Do not add a new report retention policy.
- Do not change badge behavior; badges are stable status assets.
- Do not change init, install-agent, or state-file overwrite behavior.
- Do not cut or publish a release.

## Assumptions
- Generated static HTML reports are local review evidence and should be preserved like generated Markdown evidence.
- Numeric suffix allocation is already the local convention for default generated artifacts.

## Likely Files or Areas
- src/core/html-report.ts
- tests/html-report.test.ts
- docs/html-reports.md
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
- Running `agentloop report` twice for the same generated timestamp preserves the first HTML report.
- The second default HTML report path receives a deterministic numeric suffix.
- Explicit `agentloop report --out <path>` keeps exact requested path behavior and existing safety checks.
- Docs and changelog explain default generated HTML report paths avoid same-minute collisions.

## Verification Commands
- npm test -- tests/html-report.test.ts
- npm test -- tests/html-report.test.ts tests/artifacts.test.ts tests/cli-docs-drift.test.ts
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
- `agentloop report` is a local evidence writer. Preserve explicit output behavior and avoid changing report content generation.

## Rollback Notes
Revert the HTML report path allocator change and regression tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
