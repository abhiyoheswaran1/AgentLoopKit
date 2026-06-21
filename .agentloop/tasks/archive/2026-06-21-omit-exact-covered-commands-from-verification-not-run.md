# Omit exact covered commands from verification Not Run

- Created date: 2026-06-21
- Task type: bugfix
- Status: done

## Problem Statement
Verification reports list every configured command skipped by --only-task-commands under Not Run, even when an identical command was executed from the task contract. Handoffs then imply commands like typecheck were not verified even though the same command ran as task evidence.

## Desired Outcome
Verification Not Run entries omit configured shortcuts when an exact same command string was executed in the same verification run, so handoffs do not overstate skipped coverage.

## Constraints
- Use exact normalized command-string equality only; do not add fuzzy npm-script matching or shell parsing.
- Do not change which commands execute, command exit handling, verification status semantics, release behavior, dependency behavior, tags, publishing, or package versions.

## Non-Goals
- Do not hide configured commands that were only partially covered, such as npm test versus npm test -- tests/example.test.ts.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/verification.ts
- src/core/verification-report-sections.ts
- tests/verification.test.ts
- tests/prepare-pr.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- When --only-task-commands runs a task command exactly equal to a configured command, that configured command is omitted from Not Run.
- Configured commands that are not exact matches to executed task commands remain listed in Not Run.
- PR handoff Not Run output reflects the filtered verification report without changing handoff structure.

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
- Verification evidence wording is reviewer-facing; keep command execution and status logic unchanged.
- Exact-match filtering avoids claiming partial test coverage as full configured test coverage.
- Pre-existing dirty non-evidence files before task creation: 96 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Restore the previous Not Run calculation and remove the new tests/records.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
