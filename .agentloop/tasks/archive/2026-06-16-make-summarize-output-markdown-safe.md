# Make summarize output Markdown-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
Human summarize and handoff output currently formats generated summary and run paths with raw inline Markdown, so newline-bearing paths can split pasted reviewer evidence.

## Desired Outcome
Summarize and handoff human output keeps generated summary and run paths on one Markdown line while JSON preserves raw values.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- `src/cli/commands/summarize.ts`
- `tests/handoff.test.ts`
- `docs/cli-reference.md`
- `CHANGELOG.md`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Human summarize output escapes CR and LF in generated summary and run paths.
- Human handoff output uses the same one-line formatting because it shares the summarize command path.
- JSON summarize output preserves raw path values.
- Docs, changelog, backlog, and dogfood notes record the behavior.

## Verification Commands
- npm test -- tests/handoff.test.ts
- npm run typecheck
- npm run lint
- npm run build

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the formatter import change in `src/cli/commands/summarize.ts` and remove the newline-path regression test plus related docs/internal notes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
