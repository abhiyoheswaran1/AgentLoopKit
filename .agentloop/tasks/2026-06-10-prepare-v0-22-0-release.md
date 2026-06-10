# Prepare v0.22.0 release

- Created date: 2026-06-10
- Task type: release
- Status: done

## Problem Statement
Current `main` has release-worthy work after `v0.21.0`: failed-verification summaries, task-linked verification reports, a guarded `--task` path behavior, and refreshed README visuals. `package.json` still reports `0.21.0`, `CHANGELOG.md` has Unreleased entries, GitHub latest is `v0.21.0`, and npm still serves `0.1.1` because local npm auth is unavailable.

## Desired Outcome
Prepare and publish a GitHub/source release `v0.22.0` that accurately matches current source, docs, tarball, and release notes. Attempt npm publish only if `npm whoami` proves local auth is available.

## Constraints
- Keep npm status honest. Do not claim npm has `0.22.0` unless `npm view` proves it.
- Do not backfill older npm versions from current source.
- Do not publish to npm from an unauthenticated shell.
- Keep the release local-first with no telemetry, no API calls beyond GitHub release operations, and no credential reads.
- Use normal semver: `0.22.0` follows the public GitHub `v0.21.0` line.

## Non-Goals
- No new CLI feature work.
- No npm trusted-publishing configuration from this shell.
- No destructive tag rewrite.
- No claims of real user feedback.

## Assumptions
- GitHub CLI auth is available for release creation.
- npm auth is currently blocked with `E401`, so npm publish will likely remain external.

## Likely Files or Areas
- `package.json`
- `CHANGELOG.md`
- `README.md`
- `docs/npm-publishing.md`
- `docs/github-actions.md`
- `docs/release-notes.md`
- `docs/launch-checklist.md`
- `ROADMAP.md`
- `FINAL_HANDOFF.md`
- `.agentloop/dogfood-log.md`
- `.agentloop/backlog.md`

## Files or Areas Not to Touch
- CLI implementation
- Generated README visual assets unless release verification requires regeneration
- npm credentials, tokens, or account settings

## Acceptance Criteria
- `package.json` reports `0.22.0`.
- `agentloop version` reports `0.22.0` after build.
- `CHANGELOG.md` has an empty Unreleased section and a `0.22.0` section for the five current changes.
- Public docs identify `v0.22.0` as the current GitHub/source release and npm latest as `0.1.1` unless registry proof changes.
- `node scripts/prepublish-check.mjs` passes after changelog release prep.
- `npm pack` produces `agentloopkit-0.22.0.tgz`.
- Packed tarball smoke test proves the CLI runs and reports `0.22.0`.
- GitHub release `v0.22.0` is created with release notes and attached tarball if verification passes.
- npm publish is skipped unless `npm whoami` succeeds.

## Verification Commands
- npm whoami
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 check:links
- npx pnpm@10.12.1 build
- node dist/cli/index.js version
- node scripts/prepublish-check.mjs
- npx projscan doctor --format markdown
- npm pack --pack-destination /tmp
- npm publish --access public --dry-run
- packed tarball smoke test in a temporary git repo
- npx tsx src/cli/index.ts release-notes --release-version 0.22.0 --write
- npx tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-10-prepare-v0-22-0-release.md

## Implementation Plan
- Move Unreleased changelog entries into `0.22.0`.
- Bump package metadata to `0.22.0`.
- Update public docs for the current GitHub/source release and npm-auth status.
- Run release verification and smoke tests.
- Generate release notes and AgentLoop handoff.
- Commit, push, tag, and create GitHub release if checks pass.

## Risk Notes
- Publishing metadata that does not match source would hurt trust.
- npm auth is blocked locally, so public docs must not imply npm availability.
- GitHub release creation should happen only after package verification.

## Rollback Notes
If release prep fails before tagging, revert the release metadata commit. If GitHub release creation fails after tag creation, delete the tag and draft release only if the release is not public; otherwise ship a patch release with corrected notes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
