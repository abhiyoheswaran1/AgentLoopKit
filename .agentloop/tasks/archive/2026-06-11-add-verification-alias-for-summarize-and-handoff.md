# Add verification alias for summarize and handoff

- Created date: 2026-06-11
- Task type: feature
- Status: done

## Problem Statement
During dogfooding, summarize rejected --verification even though users naturally describe verification reports that way. The supported flag is --report, so agents can lose time on an avoidable option mismatch.

## Desired Outcome
summarize and handoff accept --verification <path> as an alias for --report <path>, while --report remains documented and preferred.

## Constraints
- Do not change summary content or report parsing.
- Do not remove --report.
- Do not bump package version or cut a release.

## Non-Goals
- No broad CLI option redesign.
- No generated artifact format change.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/summarize.ts
- tests/pr-summary.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop summarize --verification <path> works like --report <path>.
- agentloop handoff --verification <path> works like --report <path>.
- --report remains supported.

## Verification Commands
- npm test -- pr-summary
- npm run typecheck
- npm run check:links
- npm run build
- npx --yes projscan doctor --format markdown

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
