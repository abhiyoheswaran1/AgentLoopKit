# Report prepare-pr ship evidence source

- Created date: 2026-06-12
- Task type: feature
- Status: review

## Problem Statement
prepare-pr can now reuse a fresh ship run, but JSON callers cannot tell whether ship evidence was reused or refreshed.

## Desired Outcome
prepare-pr JSON output reports whether ship evidence was reused or refreshed and identifies the run when available.

## Constraints
- Keep output deterministic and local-only.
- Do not add GitHub API calls, network calls, or posting behavior.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- prepare-pr --json includes shipEvidence.source with reused or refreshed.
- prepare-pr --json includes shipEvidence.runId when ship run evidence exists.
- prepare-pr human output remains concise and unchanged unless needed.

## Verification Commands
- npm test -- tests/prepare-pr.test.ts
- npm run typecheck
- npm test

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Changes prepare-pr JSON shape by adding fields.

## Rollback Notes
Remove shipEvidence from prepare-pr JSON output.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
