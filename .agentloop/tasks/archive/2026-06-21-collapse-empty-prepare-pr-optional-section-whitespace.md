# Collapse empty prepare-pr optional-section whitespace

- Created date: 2026-06-21
- Task type: docs
- Status: done

## Problem Statement
When prepare-pr has no imported GitHub metadata, the generated PR body leaves an awkward blank gap between Verification Evidence and Reviewer Checklist. The content is correct, but the whitespace makes reviewer handoffs look less intentional.

## Desired Outcome
prepare-pr renders optional sections cleanly: no double blank gap when GitHub metadata is absent, while existing GitHub metadata output still appears when present.

## Constraints
- Do not change GitHub metadata parsing, imported context behavior, JSON evidence shape, verification report parsing, command execution, release behavior, dependencies, tags, publishing, or package versions.

## Non-Goals
- Do not redesign the PR body template or changed-file grouping.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/prepare-pr.ts
- tests/prepare-pr.test.ts
- docs/cli-reference.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Generated PR bodies without GitHub metadata do not contain an extra blank gap before Reviewer Checklist.
- Generated PR bodies with GitHub metadata still include that metadata section.
- The change is covered by focused prepare-pr tests.

## Verification Commands
- npm test -- tests/prepare-pr.test.ts
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
- Reviewer-facing formatting only; keep existing content and section ordering stable.
- Pre-existing dirty non-evidence files before task creation: 99 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Restore the previous prepare-pr template whitespace and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
