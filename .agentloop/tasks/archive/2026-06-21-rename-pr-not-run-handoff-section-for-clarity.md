# Rename PR Not Run handoff section for clarity

- Created date: 2026-06-21
- Task type: docs
- Status: done

## Problem Statement
PR handoffs label verification-report Not Run entries as 'What Was Not Verified', which can overstate the gap when task-specific verification ran focused or equivalent commands. The section is really the configured commands or report Not Run entries copied from verification evidence.

## Desired Outcome
PR handoff and deterministic summary wording describes configured/report Not Run entries more precisely without changing verification parsing, command execution, or report generation.

## Constraints
- Do not change verification report generation, command execution, Not Run filtering, JSON evidence shape, release behavior, dependency behavior, tags, publishing, or package versions.
- Keep the section content sourced from the existing verification Not Run parser.

## Non-Goals
- Do not add fuzzy command coverage inference.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/prepare-pr.ts
- src/core/pr-summary.ts
- tests/prepare-pr.test.ts
- tests/pr-summary.test.ts
- docs/pr-summaries.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- PR bodies use a clearer heading for verification report Not Run entries.
- Deterministic handoff summaries use matching wording for the same Not Run entries.
- Fallback text for no skipped commands remains clear and still comes from the verification report parser.

## Verification Commands
- npm test -- tests/prepare-pr.test.ts tests/pr-summary.test.ts
- npm run typecheck
- npm run check:public-docs
- npm run check:links
- npx --no-install tsx src/cli/index.ts task doctor --redact-paths
- npx --yes projscan doctor --format markdown

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- This is reviewer-facing copy; keep behavior stable while making the label more precise.
- Pre-existing dirty non-evidence files before task creation: 98 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Restore the previous section heading and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
