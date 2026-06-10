# Prepare 0.24.0 npm-status release

- Created date: 2026-06-10
- Task type: release
- Status: done

## Problem Statement
main now includes the npm-status catch-up check after the v0.23.0 GitHub release, so package metadata, changelog, release docs, tarball pins, and release handoff need a coherent 0.24.0 release line.

## Desired Outcome
AgentLoopKit 0.24.0 is verified, packed, smoke-tested, pushed, published as a GitHub release with tarball evidence, and npm status is documented honestly if local npm auth remains unavailable.

## Constraints
- Do not publish 0.23.0 from current main because current main includes post-0.23.0 behavior.
- Do not backfill stale npm versions from current main.
- Do not claim npm availability without npm registry proof.
- Do not read tokens, env files, or credentials.

## Non-Goals
- Do not add new product behavior beyond release metadata/docs.
- Do not change GitHub Actions workflows.
- Do not create a SaaS, dashboard, or release automation system.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- package.json
- pnpm-lock.yaml
- CHANGELOG.md
- README.md
- docs/release-status.md
- docs/npm-publishing.md
- docs/launch-checklist.md
- docs/github-actions.md
- examples/github-actions/README.md
- examples/gitlab-ci/README.md
- examples/buildkite/README.md
- FINAL_HANDOFF.md

## Files or Areas Not to Touch
- src/core
- src/cli
- .github/workflows

## Acceptance Criteria
- package metadata and changelog identify 0.24.0 as the npm-status release line.
- Current release docs and temporary tarball install guidance point to v0.24.0 after the release is created.
- Tarball SHA-256 and smoke-test evidence are recorded.
- npm status is checked and documented without overclaiming availability.

## Verification Commands
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build
- npx pnpm@10.12.1 check:links
- node scripts/prepublish-check.mjs
- npm pack --pack-destination /tmp --silent
- npx projscan doctor --format markdown
- npx tsx src/cli/index.ts npm-status --json

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Delete the v0.24.0 GitHub release/tag if created, revert release metadata/docs, and remove the generated tarball.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
