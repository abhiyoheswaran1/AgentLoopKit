# Clarify status brief JSON help copy

- Created date: 2026-06-17
- Task type: docs
- Status: done

## Problem Statement
The status command already supports compact JSON with --json --brief, but the CLI help describes --brief only as compact human-readable output. Agents can misclassify the feature as missing and create duplicate roadmap work.

## Desired Outcome
agentloop status --help accurately explains that --brief prints compact human output, and compact machine-readable output when combined with --json.

## Constraints
- Do not change status JSON shape or default status output.
- Do not cut a release, bump versions, publish, or touch release-channel task status.
- Keep the change to CLI copy and focused regression coverage.

## Non-Goals
- Do not add a new status flag.
- Do not change task list compact JSON behavior.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/status.ts
- tests/status.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- status --help documents compact JSON behavior for --json --brief.
- Existing status --json --brief output remains unchanged.
- Focused status tests pass.

## Verification Commands
- npm test -- tests/status.test.ts -t "documents status brief JSON help copy"
- npm test -- tests/status.test.ts -t "prints compact JSON repo status when brief JSON is requested"
- npm run build
- node scripts/smoke-cli.mjs

## Post-Verification Gates
- npx --no-install agentloop check-gates --strict --redact-paths

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- CLI help is user-facing; wording should be accurate without implying a new flag or behavior change.

## Rollback Notes
Revert the help text and the focused help-output test.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
