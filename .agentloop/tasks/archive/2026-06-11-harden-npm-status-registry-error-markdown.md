# Harden npm-status registry error Markdown

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
agentloop npm-status wraps package and version labels but still renders registry error text as raw Markdown, so npm stderr containing backticks or newlines can corrupt the generated report.

## Desired Outcome
npm-status Markdown renders registry errors as safe inline code while JSON output remains unchanged.

## Constraints
- Keep the change narrowly scoped to npm-status Markdown rendering and tests.
- Do not change npm registry behavior, package-name validation, publishing behavior, version metadata, or release docs.

## Non-Goals
- No version bump, npm publish, GitHub release, Homebrew work, MCP registry work, or new distribution channel.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/npm-status.ts
- tests/npm-status.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- A regression test fails before the fix when registry errors contain Markdown-sensitive content.
- The npm-status Markdown registry error line uses the shared inline-code formatter.
- Existing npm-status JSON output remains structured and unwrapped.

## Verification Commands
- npm test -- tests/npm-status.test.ts
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
- Changing report formatting can break tests or downstream Markdown expectations; keep JSON unchanged and update only human Markdown expectations.

## Rollback Notes
Revert npm-status Markdown formatting and the associated regression test.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
