# Print archive handoff next step

- Created date: 2026-06-13
- Task type: feature
- Status: done

## Problem Statement
After a task is archived, the CLI confirms the move but does not tell the user how to capture final reviewer evidence for the archived task.

## Desired Outcome
task archive prints a concise next-step reminder pointing users to agentloop handoff --write-run after a successful archive.

## Constraints
- Keep archive behavior unchanged.
- Keep the output deterministic and script-friendly.

## Non-Goals
- Do not change handoff generation.
- Do not change task status or archive path rules.
- Do not cut a release or bump package version.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/task.ts
- tests/task-state.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop task archive output includes a next step for agentloop handoff --write-run.
- JSON task archive output remains parseable and does not gain prose-only text.

## Verification Commands
- npm test -- tests/task-state.test.ts
- npm run typecheck
- npm run build
- git diff --check

## Post-Verification Gates
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Extra stdout could break scripts if added to JSON output.

## Rollback Notes
Revert the archive output copy and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
