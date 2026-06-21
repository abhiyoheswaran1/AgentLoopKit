# Show command strings for verification Not Run entries

- Created date: 2026-06-21
- Task type: feature
- Status: done

## Problem Statement
Verification reports list skipped configured commands under Not Run as aliases such as test, lint, typecheck, and build. In PR handoffs, those aliases are clearer than nothing but reviewers still cannot see which configured command each alias represents without opening agentloop.config.json.

## Desired Outcome
Human verification reports render Not Run aliases with their configured command strings, while JSON notRun values remain the existing stable aliases for scripts.

## Constraints
- Do not change command selection, command execution, task-command parsing, duplicate handling, verification status semantics, JSON evidence shape, release behavior, dependencies, tags, publishing, or package versions.

## Non-Goals
- Do not add fuzzy command coverage inference or change when configured commands are considered skipped.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/verification.ts
- src/core/verification-report-sections.ts
- tests/verification.test.ts
- tests/prepare-pr.test.ts
- docs/verification-reports.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Verification report Markdown shows configured Not Run entries with both alias and command string.
- Verification JSON notRun remains the existing alias list.
- Prepare-pr and deterministic Not Run parsing continue to render report Not Run items safely.

## Verification Commands
- npm test -- tests/verification.test.ts tests/prepare-pr.test.ts
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
- Reviewer-facing evidence copy only; keep script-facing JSON and execution behavior stable.
- Pre-existing dirty non-evidence files before task creation: 100 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Restore the previous Not Run Markdown rendering and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
