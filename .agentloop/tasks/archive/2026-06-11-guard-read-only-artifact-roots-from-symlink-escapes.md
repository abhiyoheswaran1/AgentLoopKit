# Guard read-only artifact roots from symlink escapes

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
Read-only commands can list or read configured task, report, handoff, or policy directories through pre-existing symlinks that resolve outside the repo. Output writes are guarded, but discovery reads need the same repo-local boundary.

## Desired Outcome
Status, gates, handoff fallback, reports, badges, CI summaries, release notes, MCP tools, task listing, and policy reads ignore unsafe symlinked artifact roots instead of reading outside the current repository.

## Constraints
- Do not change config schema or generated file formats
- Do not throw noisy errors for read-only discovery; treat unsafe read roots like missing local artifacts unless a command already has explicit path validation

## Non-Goals
- No migration or cleanup command
- No release bump or publish

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/file-system.ts
- src/core/artifacts.ts
- src/core/task-state.ts
- src/core/policy.ts
- src/core/status.ts
- src/core/pr-summary.ts
- src/core/ci-summary.ts
- src/core/release-notes.ts
- src/core/mcp-tools.ts
- src/core/badge.ts
- src/core/html-report.ts
- tests/status.test.ts
- tests/policy.test.ts
- tests/mcp-server.test.ts
- tests/check-gates.test.ts
- tests/ci-summary.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Task listing and status ignore a symlinked tasks root that resolves outside the repo
- Latest report and handoff discovery ignores symlinked report or handoff roots outside the repo
- Policy list/status/show do not read a symlinked policy root outside the repo
- MCP read tools do not expose content from symlinked artifact roots outside the repo
- Existing output path guards and tests keep passing

## Verification Commands
- npx pnpm@10.12.1 test tests/status.test.ts tests/policy.test.ts tests/mcp-server.test.ts tests/check-gates.test.ts tests/ci-summary.test.ts tests/badge.test.ts tests/html-report.test.ts tests/release-notes.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 check:links
- npm run build
- npm run smoke:release
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the read-root guard changes and associated tests

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
