# Harden verification task context Markdown

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
Verification reports render task context path, title, type, and status directly into Markdown, so task metadata containing backticks can corrupt reviewer-facing evidence.

## Desired Outcome
Verification report task context values use the shared Markdown-safe inline-code formatter while command execution, task metadata parsing, JSON output, and artifact paths remain unchanged.

## Constraints
- Keep the change scoped to verification report task context Markdown and tests.
- Do not change verification command execution, task contract format, path safety rules, package version, release notes, or publishing.

## Non-Goals
- No version bump, npm publish, GitHub release, Homebrew work, MCP registry work, or new distribution channel.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/verification.ts
- tests/verification.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- A regression test fails before the fix when task context metadata contains backticks.
- Path, title, task type, and status task-context lines render with inlineCode.
- Unavailable task-context paths and statuses are also Markdown-safe.

## Verification Commands
- npm test -- tests/verification.test.ts
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
- Verification reports are reviewer evidence; formatting changes must stay presentation-only and preserve structured command results.

## Rollback Notes
Revert verification task-context formatting and the associated regression tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
