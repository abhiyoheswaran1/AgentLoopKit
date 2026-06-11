# Harden PR summary diff stat Markdown

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
PR summaries render raw git diff stat text directly into Markdown. Paths or stat text containing backticks can make reviewer-facing handoffs harder to read.

## Desired Outcome
PR summary diff stats render as Markdown-safe text evidence while the no-diff empty state remains readable.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- A regression test fails before the fix when diff stats contain backticks.
- Non-empty diff stats are wrapped in a safe code fence.
- The no-diff fallback remains plain text.

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
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
