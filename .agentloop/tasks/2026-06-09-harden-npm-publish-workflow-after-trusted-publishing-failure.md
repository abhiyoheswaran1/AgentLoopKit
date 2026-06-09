# Harden npm publish workflow after trusted publishing failure

- Created date: 2026-06-09
- Task type: docs
- Status: completed

## Problem Statement
GitHub release `v0.2.0` triggered the publish workflow. The workflow passed install, lint, typecheck, tests, and build, then npm rejected `npm publish` with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`, which indicates missing npm publish permission or missing trusted-publisher configuration.

## Desired Outcome
Make the release workflow easier to retry and make docs explicit about npm trusted publishing setup and fallback local publish steps.

## Constraints
- Do not add npm tokens to the repo.
- Do not collect credentials or print secrets.
- Do not change package version on this branch.
- Keep the workflow local-first and transparent.

## Non-Goals
- No npm publish from this branch.
- No deletion of existing GitHub releases or tags.
- No cloud service beyond GitHub Actions and npm registry publishing.

## Assumptions
- The package owner must configure npm trusted publishing on npmjs.com before GitHub Actions can publish without OTP.
- Manual local publish can still work after browser/OTP authentication.

## Likely Files or Areas
- `.github/workflows/publish.yml`
- `docs/npm-publishing.md`
- `FINAL_HANDOFF.md`
- `.agentloop/dogfood-log.md`
- `.agentloop/backlog.md`

## Files or Areas Not to Touch
- Source command behavior.
- Package version.
- Existing tags.
- Release assets.

## Acceptance Criteria
- Publish workflow can be manually retried with `workflow_dispatch`.
- Publish command uses explicit public access.
- Docs explain the exact trusted publisher settings and the observed failure mode.
- Docs give a local fallback that does not ask maintainers to share OTPs or tokens.

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
Revert the workflow and documentation changes. The release workflow will return to release-only triggering and implicit npm publish access.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
