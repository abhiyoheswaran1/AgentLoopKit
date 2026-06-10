# Prepare 0.2.1 release candidate

- Created date: 2026-06-09
- Task type: release
- Status: done

## Problem Statement
Two package-behavior improvements landed after the public GitHub `v0.2.0` tag: verification tail excerpts and failed-verification status routing. npm still has not published `0.2.0`, so main must move to a clean next version before any future publish attempt.

## Desired Outcome
Prepare `agentloopkit@0.2.1` as the next release candidate with package metadata, changelog, launch checklist, final handoff, and dogfood records aligned.

## Constraints
- Do not publish to npm automatically.
- Do not create a public GitHub release until npm publishing is configured or a manual publish succeeds.
- Keep the release candidate local and reviewable.
- Keep the `v0.2.0` GitHub/npm split documented honestly.

## Non-Goals
- No new runtime behavior beyond the merged PRs.
- No npm token or OTP handling.
- No cloud or hosted release system.

## Assumptions
- `0.2.1` should include PR #1 and PR #2 behavior.
- npm trusted publishing remains the preferred publish path.

## Likely Files or Areas
- `package.json`
- `CHANGELOG.md`
- `docs/launch-checklist.md`
- `docs/npm-publishing.md`
- `FINAL_HANDOFF.md`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`
- `.agentloop/research/`

## Files or Areas Not to Touch
- `src/` unless verification reveals a release-blocking bug.
- generated `dist/` except through build verification.

## Acceptance Criteria
- `package.json` version is `0.2.1`.
- Changelog lists the `0.2.1` release candidate.
- Launch checklist and final handoff identify `0.2.1` as prepared, not published.
- npm `0.2.0` and trusted publishing gap remain documented.
- Full verification and package smoke pass.

## Verification Commands
- `git diff --check`
- `npx pnpm@10.12.1 lint`
- `npx pnpm@10.12.1 typecheck`
- `npx pnpm@10.12.1 test`
- `npx pnpm@10.12.1 build`
- `npx projscan doctor --format markdown`
- `npx pnpm@10.12.1 pack`
- `npm publish --access public --dry-run`
- tarball smoke test for `agentloop version`, `agentloop status --json`, and `agentloop verify --command "node -e ..."`

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the release-prep commit. No runtime rollback is required if the release is not published.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
