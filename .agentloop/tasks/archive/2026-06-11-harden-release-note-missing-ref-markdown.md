# Harden release-note missing ref Markdown

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
Release notes render the missing git ref fallback reason as raw Markdown. A requested ref containing backticks can corrupt the changelog section in generated release notes.

## Desired Outcome
Release-note missing-ref fallback copy formats the requested ref with Markdown-safe inline-code delimiters while preserving the raw fallback reason in structured output.

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
- A regression test fails before the fix when --from contains a backtick and the ref is missing.
- The requested missing ref renders with the shared inline-code formatter in Markdown output.
- The no-previous-tag fallback remains plain fixed prose.

## Verification Commands
- npm test -- tests/release-notes.test.ts
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
