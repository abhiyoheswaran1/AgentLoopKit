# Expose policy guidance through CLI

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement
Users and agents can inspect generated safety policies only by browsing .agentloop/policies manually.

## Desired Outcome
agentloop policy lists local policy files and prints a selected policy without mutating the repo.

## Constraints
- Keep the command local-first, read-only, and dependency-free.
- Do not build a policy engine or organization policy pack system in this slice.

## Non-Goals
- No remote policy packs, SaaS, telemetry, or automatic policy enforcement.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/policy.ts
- src/cli/commands/policy.ts
- tests/policy.test.ts
- docs/policies.md

## Files or Areas Not to Touch
- src/templates/policies/* semantic rewrites

## Acceptance Criteria
- agentloop policy list shows generated local policy files
- agentloop policy show <name> prints a selected policy by slug or filename
- JSON output is available for agents

## Verification Commands
- npx pnpm@10.12.1 test tests/policy.test.ts
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 build
- npx projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Remove the policy command files, tests, and docs updates.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
