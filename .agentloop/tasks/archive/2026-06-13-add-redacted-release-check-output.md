# Add redacted release-check output

- Created date: 2026-06-13
- Task type: feature
- Status: done

## Problem Statement
release-check is a maintainer and CI-facing command, but it does not accept --redact-paths before users paste output into public release issues, PRs, or logs.

## Desired Outcome
agentloop release-check supports --redact-paths in human and JSON output while default output remains unchanged.

## Constraints
- Keep default release-check output unchanged for scripts.
- Do not change package version or release metadata.
- Do not call npm, GitHub, or registries from release-check.

## Non-Goals
- Do not publish, tag, or create releases.
- Do not change release readiness decisions.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/release-check.ts
- src/core/release-check.ts
- tests/release-check.test.ts
- README.md
- docs/cli-reference.md
- scripts/smoke-packed-release.mjs
- tests/release-smoke.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop release-check --redact-paths is accepted in human and JSON modes.
- agentloop release-check --json --redact-paths does not expose the absolute Git root when release evidence includes local paths.
- README and CLI reference include release-check in public-output redaction guidance.

## Verification Commands
- npm test -- tests/release-check.test.ts tests/release-smoke.test.ts
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
- Flag parsing must not break CI release gates.

## Rollback Notes
Revert the release-check option, docs, and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
