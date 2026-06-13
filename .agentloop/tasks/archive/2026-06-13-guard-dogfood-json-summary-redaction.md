# Guard dogfood JSON summary redaction

- Created date: 2026-06-13
- Task type: security-review
- Status: done

## Problem Statement
Dogfood JSON summaries include command arguments, command text, and child process error messages. The dogfood gate now calls redacted AgentLoopKit commands, but the summary layer itself should not leak this repo's absolute path if a step argument or error includes it.

## Desired Outcome
Dogfood JSON summaries redact the current workspace root from step arguments, command text, and error messages before returning or printing the summary.

## Constraints
- Keep the dogfood gate local-only and read-only.
- Do not change release metadata, package version, tags, npm publishing, or GitHub releases.
- Preserve existing dogfood step order and behavior.

## Non-Goals
- Do not add a release flow or publish gate.
- Do not redact normal repo-relative AgentLoop artifact paths.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/dogfood.mjs
- tests/dogfood-script.test.ts
- .agentloop/dogfood-log.md
- CHANGELOG.md

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml

## Acceptance Criteria
- A regression test proves runDogfood JSON summaries replace the absolute cwd with [git-root] inside args, commandText, and errorMessage.
- Existing dogfood tests continue to pass.
- The package version remains unchanged.

## Verification Commands
- npm test -- tests/dogfood-script.test.ts
- npm run typecheck
- npm run build

## Post-Verification Gates
- node dist/cli/index.js verify --task-commands --only-task-commands --write-run
- node dist/cli/index.js ship --redact-paths
- node dist/cli/index.js check-gates --redact-paths --strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Over-redaction could hide useful repo-relative evidence in local dogfood output.
- Under-redaction could leak absolute local paths in CI logs or copied JSON summaries.

## Rollback Notes
Revert the dogfood summary redaction helper and its focused regression test.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
