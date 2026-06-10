# Add markdown link checking

- Created date: 2026-06-09
- Task type: feature
- Status: done

## Problem Statement

Launch docs can drift when local Markdown links point at missing files, and CI does not catch that.

## Desired Outcome

The repo has a local markdown link checker, tests for local link validation, an npm script, and CI runs the check without making network calls.

## Constraints

- Do not add dependencies.
- Ignore http, https, mailto, and other external links.
- Do not check network availability.

## Non-Goals

- Validate remote URLs.
- Implement a full Markdown parser.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/markdown-links.ts
- tests/markdown-links.test.ts
- scripts/check-markdown-links.mjs
- package.json
- .github/workflows/ci.yml

## Files or Areas Not to Touch

- src/cli/index.ts

## Acceptance Criteria

- Local Markdown links to missing files fail with useful messages.
- External links are ignored.
- CI runs the markdown link check.

## Verification Commands

- npx pnpm@10.12.1 test tests/markdown-links.test.ts
- npx pnpm@10.12.1 check:links
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 build
- npx projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Remove the checker, script, CI step, and tests.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
