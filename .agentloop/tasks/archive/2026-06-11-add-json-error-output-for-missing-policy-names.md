# Add JSON error output for missing policy names

- Created date: 2026-06-11
- Task type: feature
- Status: done

## Problem Statement
agentloop policy show --json returns structured success output, but missing or unsafe policy names still use the global human error path. Agents and CI cannot parse the requested policy name or available policies.

## Desired Outcome
agentloop policy show <policy> --json returns a structured error with code, message, requestedPolicy, and availablePolicies when the policy cannot be found.

## Constraints
- Keep default non-JSON error output human-readable.
- Do not change policy lookup semantics or policy file contents.
- Do not change package version or cut a release.

## Non-Goals
- Do not add a policy engine, enforcement mode, or remote policy packs.

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
- Missing policy names with --json print valid JSON to stdout and exit non-zero.
- The JSON includes requestedPolicy and availablePolicies.
- Missing policy names without --json remain human-readable on stderr.

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
Revert the policy command, policy core error type, tests, README, policy docs, changelog, and AgentLoop evidence files from this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
