# Add redacted maintainer-check output

- Created date: 2026-06-13
- Task type: feature
- Status: done

## Problem Statement
maintainer-check is a shareable reviewer surface, but it does not accept the same --redact-paths option used by other public-copy commands.

## Desired Outcome
agentloop maintainer-check supports --redact-paths without changing default JSON or gate decisions.

## Constraints
- Keep default maintainer-check output unchanged for scripts.
- Do not change package version or release metadata.
- Keep paths repo-relative where they already are.

## Non-Goals
- Do not post GitHub comments or require tokens.
- Do not add secret scanning.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/maintainer-check.ts
- src/core/maintainer-check.ts
- tests/maintainer-check.test.ts
- README.md
- docs/cli-reference.md
- scripts/smoke-packed-release.mjs
- tests/release-smoke.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop maintainer-check --redact-paths is accepted in human and JSON modes.
- agentloop maintainer-check --json --redact-paths does not expose the absolute Git root when run from a nested repo path.
- README and CLI reference include maintainer-check in public-output redaction guidance.

## Verification Commands
- npm test -- tests/maintainer-check.test.ts tests/release-smoke.test.ts
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
- Flag parsing must not break maintainer-check use in CI.

## Rollback Notes
Revert the maintainer-check option, docs, and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
