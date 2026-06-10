# Upgrade GitHub Actions to v6

- Created date: 2026-06-09
- Task type: docs
- Status: done

## Problem Statement
CI now forces GitHub JavaScript actions onto Node 24, but GitHub still warns because the pinned action major versions target Node 20. The repo should use action major versions that support the newer runtime.

## Desired Outcome
CI and Publish workflows should use current major versions of official/setup actions while preserving the same install, check, build, and publish behavior.

## Constraints
- Do not change package version.
- Do not change source behavior.
- Do not add npm tokens or secrets.
- Keep package contents unchanged.

## Non-Goals
- No npm publish retry.
- No CI matrix.
- No dependency upgrades outside workflow actions.

## Assumptions
- `actions/checkout@v6`, `actions/setup-node@v6`, and `pnpm/action-setup@v6` are available from upstream tags.

## Likely Files or Areas
- `.github/workflows/ci.yml`
- `.github/workflows/publish.yml`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`

## Files or Areas Not to Touch
- `src/`
- `package.json`
- lockfiles
- generated README visuals

## Acceptance Criteria
- CI uses `actions/checkout@v6`, `actions/setup-node@v6`, and `pnpm/action-setup@v6`.
- Publish uses the same newer action majors.
- Existing workflow commands remain unchanged.
- Local checks pass.

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
Revert action version pins to the previous major versions.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
