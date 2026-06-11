# Harden PR summary task metadata Markdown

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
PR and handoff summaries render the task title in the top Task context line directly into Markdown, so task titles with backticks can corrupt reviewer-facing handoffs.

## Desired Outcome
PR summary task context metadata uses the shared Markdown-safe inline-code formatter while changed file grouping, verification parsing, write behavior, and JSON output remain unchanged.

## Constraints
- Keep the change scoped to PR summary task context rendering and tests.
- Do not change git parsing, changed-file classification, verification status parsing, package version, release notes, or publishing.

## Non-Goals
- No version bump, npm publish, GitHub release, Homebrew work, MCP registry work, or new distribution channel.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/pr-summary.ts
- tests/pr-summary.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- A regression test fails before the fix when task titles contain backticks.
- The top Task context line renders task titles with inlineCode.
- Existing changed-file path formatting and verification status text remain intact.

## Verification Commands
- npm test -- tests/pr-summary.test.ts
- git diff --check
- npm run lint
- npm run typecheck
- npm run check:links
- npx --yes projscan doctor --format markdown
- npm test
- npm run build
- node scripts/smoke-cli.mjs
- npm run smoke:release

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Handoff formatting is reviewer-facing; preserve deterministic wording and avoid changing summary structure beyond the task title presentation.

## Rollback Notes
Revert PR summary task-context formatting and the associated regression tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
