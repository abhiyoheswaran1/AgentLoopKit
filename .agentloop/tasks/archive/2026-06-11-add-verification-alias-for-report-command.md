# Add verification alias for report command

- Created date: 2026-06-11
- Task type: feature
- Status: done

## Problem Statement
agentloop report accepts --report <path> for verification evidence, but after summarize and handoff gained --verification as an alias, report is inconsistent for agents and users.

## Desired Outcome
agentloop report accepts --verification <path> as an alias for --report <path>, with --report remaining supported and preferred.

## Constraints
- Do not change generated HTML output structure.
- Do not change source artifact lookup order except explicit alias resolution.
- Do not bump package version or cut a release.

## Non-Goals
- No report redesign.
- No new browser UI or frontend.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/report.ts
- tests/html-report.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop report --verification <path> uses that verification report.
- agentloop report --report <path> remains supported.

## Verification Commands
- npm test -- html-report
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
