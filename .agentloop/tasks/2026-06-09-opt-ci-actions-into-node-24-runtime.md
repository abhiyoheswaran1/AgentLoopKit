# Opt CI actions into Node 24 runtime

- Created date: 2026-06-09
- Task type: docs
- Status: completed

## Problem Statement
GitHub Actions CI passes, but GitHub warns that JavaScript actions are still running on the deprecated Node.js 20 runtime. Release confidence is better if CI opts into Node 24 before GitHub forces the migration.

## Desired Outcome
CI should opt GitHub JavaScript actions into Node 24 and continue to run install, lint, typecheck, tests, and build.

## Constraints
- Do not change package version.
- Do not change npm publish behavior.
- Do not add dependencies.
- Keep the workflow simple.

## Non-Goals
- No release publish retry.
- No CI matrix.
- No new deployment workflow.

## Assumptions
- The same `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` environment setting used for the Publish workflow should silence the CI runtime warning.

## Likely Files or Areas
- `.github/workflows/ci.yml`
- `.agentloop/dogfood-log.md`
- `.agentloop/backlog.md`

## Files or Areas Not to Touch
- Source code.
- Package version.
- npm publish workflow.

## Acceptance Criteria
- CI workflow declares `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true`.
- Existing CI commands remain unchanged.
- Local verification passes.

## Verification Commands
- `git diff --check`
- `npx pnpm@10.12.1 lint`
- `npx pnpm@10.12.1 typecheck`
- `npx pnpm@10.12.1 test`
- `npx pnpm@10.12.1 build`
- `npx projscan doctor --format markdown`

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the CI workflow environment setting and this task/product-cycle record.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
