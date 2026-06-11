# Harden release-note commit Markdown

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
Release notes render git commit subjects directly into Markdown. Commit subjects containing backticks, headings, or list syntax can corrupt maintainer-facing release notes.

## Desired Outcome
Release-note commit lines render commit subjects as Markdown-safe inline-code evidence while empty commit output remains readable.

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
- A regression test fails before the fix when a commit subject contains backticks.
- Commit subjects in release notes use the shared inline-code formatter.
- The empty commits fallback remains plain text.

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
