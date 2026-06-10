# Add policy drift status

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement
Local policy files can be customized, but users and agents cannot quickly see whether generated policies are current, missing, extra, or locally modified.

## Desired Outcome
Add a read-only policy status command that compares local .agentloop/policies files with bundled templates and reports current, modified, missing, and extra policy files in human and JSON output.

## Constraints
- No policy enforcement engine, no automatic migration, no remote policy packs, no mutation of policy files, and no reading outside .agentloop/policies.

## Non-Goals
- Do not add policy editing, compliance scoring, or organization policy packs.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/policy.ts
- src/cli/commands/policy.ts
- tests/policy.test.ts
- src/core/completions.ts

## Files or Areas Not to Touch
- src/templates/policies/*.md except documentation references if needed

## Acceptance Criteria
- agentloop policy status shows each generated policy as current, modified, missing, or extra.
- agentloop policy status --json returns deterministic machine-readable entries.
- The command is read-only and does not mutate local policy files.

## Verification Commands
- npx pnpm@10.12.1 test tests/policy.test.ts tests/completion.test.ts
- npx pnpm@10.12.1 test

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Remove the policy status command, tests, and docs references; policy list/show behavior remains unchanged.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
