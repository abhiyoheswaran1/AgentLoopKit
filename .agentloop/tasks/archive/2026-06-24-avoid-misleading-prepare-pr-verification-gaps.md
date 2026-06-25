# Avoid misleading prepare-pr verification gaps

- Created date: 2026-06-24
- Task type: bugfix
- Status: done

## Problem Statement
prepare-pr can list configured default commands as not run after a task-specific verification report passes equivalent commands, which makes reviewer handoff evidence look weaker than it is.

## Desired Outcome
prepare-pr should summarize task-specific verification accurately and avoid implying missing default command evidence when the report already contains passing task-command evidence for tests, typecheck, build, and dogfood.

## Constraints
- Keep the change scoped to verification report parsing, prepare-pr output, and focused tests.
- Preserve existing output when default configured verification commands were genuinely not run and no equivalent task-command evidence exists.

## Non-Goals
- Do not change package version, release notes, tags, or publishing workflows.
- Do not redesign the verification report schema unless existing report data is insufficient.

## Assumptions
- Task-specific verification reports already record command text and pass/fail status that can be matched against configured command names or common npm script names.

## Likely Files or Areas
- src/core/prepare-pr.ts
- src/cli/commands/prepare-pr.ts
- tests/prepare-pr.test.ts
- src/core/verification-report.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- A passing task-specific verification report with npm run typecheck and npm run build does not show those configured commands under Verification Report Not Run.
- If a configured command is absent and no equivalent task-command evidence exists, prepare-pr still reports it as not run.
- Focused prepare-pr tests, typecheck, build, dogfood, lint, and gates pass.

## Verification Commands
- npm run test:unit -- tests/prepare-pr.test.ts
- npm run typecheck
- npm run build
- npm run dogfood
- npm run lint

## Post-Verification Gates
- node dist/cli/index.js verify --task .agentloop/tasks/2026-06-24-avoid-misleading-prepare-pr-verification-gaps.md --task-commands --only-task-commands --progress --write-run --redact-paths
- node dist/cli/index.js ship --redact-paths
- node dist/cli/index.js prepare-pr --redact-paths
- node dist/cli/index.js check-gates --redact-paths

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- prepare-pr output is reviewer-facing; avoid hiding true missing verification.
- Pre-existing dirty non-evidence files before task creation: 67 total; examples: `.agentloop/README.md`, `.agentloop/agents/claude-code.md`, `.agentloop/agents/codex.md`, `.agentloop/agents/cursor.md`, `.agentloop/agents/gemini-cli.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert prepare-pr verification gap matching and its focused tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
