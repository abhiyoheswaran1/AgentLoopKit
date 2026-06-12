# Add verification progress output

- Created date: 2026-06-12
- Task type: feature
- Status: done

## Problem Statement
Long agentloop verify runs can look idle until the report is written, which makes dogfood release gates and user workflows feel stuck.

## Desired Outcome
agentloop verify supports an opt-in progress mode that prints bounded start/finish lines for each verification command while preserving existing default and JSON behavior.

## Constraints
- Keep default verify output stable.
- Do not stream raw command logs to the terminal.
- Do not print environment values or secrets.

## Non-Goals
- Do not add a TUI, spinner dependency, daemon, or live log viewer.
- Do not change verification report contents unless needed for evidence consistency.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/verification.ts
- src/cli/commands/verify.ts
- tests/verification.test.ts
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop verify --progress prints one start line and one finish line for each executed command.
- agentloop verify without --progress keeps its existing human output shape.
- agentloop verify --json does not mix progress lines into stdout.
- Progress output includes pass/fail/timeout status and elapsed time, but not raw command output.

## Verification Commands
- npm test -- tests/verification.test.ts
- npm run lint
- npm run typecheck
- npm run check:links
- git diff --check

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Progress output could break scripts if enabled implicitly, so it must remain opt-in.
- Command strings can be sensitive, so reuse existing redaction/formatting expectations and avoid environment output.

## Rollback Notes
Remove the --progress flag and progress reporter wiring; verification reports remain compatible.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
