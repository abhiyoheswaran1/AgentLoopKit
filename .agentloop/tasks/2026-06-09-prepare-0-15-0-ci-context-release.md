# Prepare 0.15.0 CI context release

- Created date: 2026-06-09
- Task type: release
- Status: in-progress

## Problem Statement
CI context for verification reports is on main, but package metadata, release docs, and GitHub tarball references still point at 0.14.0.

## Desired Outcome
Prepare and publish a verified GitHub release candidate for agentloopkit 0.15.0 while keeping npm availability status honest.

## Constraints
- Do not claim npm 0.15.0 is available until npm view proves it.
- Keep release notes clear about npm latest still being 0.1.1.
- Do not attempt npm publish unless the release artifact is verified and authentication state is explicit.

## Non-Goals
- Do not repair npm trusted publishing inside this repo-only task.
- Do not add new product behavior beyond release metadata and docs.

## Assumptions
- 0.15.0 is the next semver minor because CI context is an additive feature after 0.14.0.

## Likely Files or Areas
- package.json
- CHANGELOG.md
- README.md
- docs/npm-publishing.md
- docs/github-actions.md
- docs/launch-checklist.md
- FINAL_HANDOFF.md
- .agentloop/backlog.md

## Files or Areas Not to Touch
- .env
- node_modules

## Acceptance Criteria
- package.json and built CLI report 0.15.0.
- Changelog and publishing docs describe 0.15.0 and the npm blocker honestly.
- GitHub release v0.15.0 exists with an attached tarball after verification passes.
- npm registry proof is recorded without claiming npm availability if latest remains 0.1.1.

## Verification Commands
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 check:links
- npx pnpm@10.12.1 build
- npx projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Delete the v0.15.0 GitHub release if created, revert the release metadata/docs commit, and leave npm untouched.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
