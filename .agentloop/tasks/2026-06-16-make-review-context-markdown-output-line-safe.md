# Make review-context Markdown output line-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: review

## Problem Statement
review-context renders line-oriented Markdown with the raw inline-code formatter, so task titles, GitHub metadata, run IDs, or next-action commands containing line breaks can split bullets and produce misleading pasted review context.

## Desired Outcome
Human review-context Markdown escapes carriage returns and line breaks as visible sequences while JSON output remains raw and machine-readable.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/review-context.ts
- tests/review-context.test.ts
- docs/cli-reference.md
- CHANGELOG.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- review-context human Markdown uses single-line inline formatting for line-oriented values.
- A regression test fails before the formatter change and passes after it.
- JSON output shape and raw values are unchanged.
- Docs and dogfood evidence mention the safety behavior without internal release chatter.

## Verification Commands
- npm test -- tests/review-context.test.ts
- npm test -- tests/review-context.test.ts tests/cli-docs-drift.test.ts
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
- Formatter-only fix, but review-context is used by agent and maintainer handoff workflows.

## Rollback Notes
Revert the review-context formatter import and regression test.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
