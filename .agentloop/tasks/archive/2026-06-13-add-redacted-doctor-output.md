# Add redacted doctor output

- Created date: 2026-06-13
- Task type: feature
- Status: done

## Problem Statement
doctor is a first-run support command, but it cannot currently redact absolute paths before users paste output into public issues or CI logs.

## Desired Outcome
agentloop doctor supports --redact-paths in human and JSON output while default output remains unchanged for scripts.

## Constraints
- Keep default doctor output unchanged.
- Do not change package version or release metadata.
- Redact absolute Git root values only; keep repo-relative AgentLoop paths readable.

## Non-Goals
- Do not add secret scanning or credential inspection.
- Do not change doctor check decisions.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/doctor.ts
- src/cli/commands/doctor.ts
- tests/doctor.test.ts
- README.md
- docs/cli-reference.md
- scripts/smoke-packed-release.mjs
- tests/release-smoke.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop doctor --redact-paths hides the absolute Git root in human output.
- agentloop doctor --json --redact-paths hides the absolute Git root in JSON output.
- agentloop doctor --json without --redact-paths keeps the absolute Git root for scripts.
- README and CLI reference list doctor as a public-output redaction command.

## Verification Commands
- npm test -- tests/doctor.test.ts tests/release-smoke.test.ts
- npm run check:public-docs
- npm run typecheck
- npm run build

## Post-Verification Gates
- node dist/cli/index.js verify --task-commands --only-task-commands --write-run
- node dist/cli/index.js ship --redact-paths
- node dist/cli/index.js check-gates --redact-paths --strict
- npm run dogfood:strict:json

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Redaction must not break scripts that rely on default doctor JSON.
- Docs hygiene must stay aligned with release smoke checks.

## Rollback Notes
Revert the doctor redaction implementation and docs/test updates.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
