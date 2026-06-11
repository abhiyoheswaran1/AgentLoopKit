# Add JSON error output for missing policy directory

- Created date: 2026-06-11
- Task type: feature
- Status: done

## Problem Statement
agentloop policy list/status/show have JSON success output, but when .agentloop/policies/ is missing they still use the global human error path. Agents cannot parse the setup issue or next command.

## Desired Outcome
agentloop policy list/status/show --json return a structured setup error with code, message, policiesDir, and nextCommand when the policy directory is missing.

## Constraints
- Keep default non-JSON error output human-readable.
- Do not change policy file generation or init behavior.
- Do not change package version or cut a release.

## Non-Goals
- Do not auto-run init or restore missing policy files.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/policy.ts
- src/cli/commands/policy.ts
- tests/policy.test.ts
- README.md
- docs/policies.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Missing policy directory with policy list --json prints valid JSON to stdout and exits non-zero.
- Missing policy directory with policy status --json prints valid JSON to stdout and exits non-zero.
- Missing policy directory without --json remains human-readable on stderr.

## Verification Commands
- npm test -- policy
- npm run lint
- npm run typecheck
- npm test
- npm run check:links
- npm run build
- git diff --check
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the policy command setup-error handling, policy core error type, tests, README, policy docs, changelog, and AgentLoop evidence files from this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
