# Warn about post-verification gates during task creation

- Created date: 2026-06-13
- Task type: feature
- Status: done

## Problem Statement
Dogfooding the 0.28.7 release showed that strict gates like dogfood:strict and release-check --strict can be accidentally placed in Verification Commands, where they run before agentloop verify has written the report they need.

## Desired Outcome
create-task surfaces a clear warning when verification commands look like post-verification gates, while leaving command placement unchanged and preserving JSON-script compatibility.

## Constraints
- None recorded yet.

## Non-Goals
- Do not change verify command execution semantics.
- Do not fail task creation for existing workflows.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/create-task.ts
- tests/create-task.test.ts
- docs/cli-reference.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- create-task --json includes a warning when --verification contains npm run dogfood:strict.
- human create-task output includes the same warning in a concise next-step form.
- commands are not silently moved between Verification Commands and Post-Verification Gates.

## Verification Commands
- npm test -- tests/create-task.test.ts
- npm run typecheck
- npm run build
- npm run check:links
- git diff --check

## Post-Verification Gates
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Warnings must not break existing automation that parses create-task JSON output.

## Rollback Notes
Revert the create-task warning helper, tests, and docs.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
