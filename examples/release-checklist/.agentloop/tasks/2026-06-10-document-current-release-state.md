# Document current release state

- Created date: 2026-06-10
- Task type: release
- Status: review

## Problem Statement

GitHub release `v0.24.0` is current, but npm still serves `0.1.1`.

## Desired Outcome

Maintainers can see release evidence, registry state, verification results, and the next safe publish action.

## Constraints

- Do not publish to npm.
- Do not create or move tags.
- Do not change package metadata.
- Do not backfill stale npm versions from current `main`.

## Non-Goals

- Do not automate release creation.
- Do not change GitHub Actions workflows.

## Assumptions

- GitHub release assets already exist.
- npm authentication or trusted publishing still needs maintainer action.

## Likely Files or Areas

- `docs/release-status.md`
- `docs/npm-publishing.md`
- `docs/launch-checklist.md`
- `FINAL_HANDOFF.md`

## Files or Areas Not to Touch

- `package.json`
- `CHANGELOG.md`
- `.github/workflows/`

## Acceptance Criteria

- GitHub release tag and tarball are documented.
- npm latest and versions are documented.
- Docs say not to backfill old versions from current `main`.
- Next maintainer action is explicit.

## Verification Commands

- `npm view agentloopkit version versions --json`
- `npx pnpm@10.12.1 check:links`
- `npx projscan doctor --format markdown`

## Implementation Plan

- Check GitHub release state.
- Check npm registry state.
- Update release-status docs.
- Run link and health checks.
- Write maintainer handoff.

## Risk Notes

- Public docs can mislead users if npm state is stale.
- Publishing the wrong version from current `main` can make npm metadata disagree with GitHub tags.

## Rollback Notes

Revert release-status documentation changes.

## Handoff Requirements

- Include GitHub release tag and asset.
- Include npm latest and version list.
- Include verification commands and results.
- State whether publish was attempted.
- State the next maintainer action.
