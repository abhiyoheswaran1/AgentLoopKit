# Prepare AgentLoopKit 0.36.2 release

- Created date: 2026-06-19
- Task type: release
- Status: done

## Problem Statement
Maintainer approved a patch release for the verified post-0.36.1 hardening and documentation changes.

## Desired Outcome
AgentLoopKit 0.36.2 has release metadata, local release evidence, commit, tag, GitHub release, and post-publish proof through the usual release flow.

## Constraints
- Release version is `0.36.2`.
- Use the existing GitHub Releases plus trusted npm publishing flow.
- Pre-bump npm proof passed: local `0.36.1` matched npm latest `0.36.1`.
- Do not revive deferred GitHub Marketplace or Windows package-manager tasks beyond normal release proof.

## Non-Goals
- No feature work beyond release metadata and release evidence.
- No manual npm publish unless the trusted-publishing workflow is unavailable and the maintainer explicitly approves fallback.
- No unsupported channel availability claims.

## Assumptions
- This is a patch release for already-verified local changes.
- GitHub CLI auth is available for pushing tags and creating the GitHub Release.
- npm publish should happen through `.github/workflows/publish.yml` after the GitHub Release is published.

## Likely Files or Areas
- `package.json`
- `server.json`
- `CHANGELOG.md`
- `ROADMAP.md`
- `docs/release-status.md`
- `docs/npm-publishing.md`
- `docs/launch-checklist.md`
- `FINAL_HANDOFF.md`
- `.agentloop/` release evidence

## Files or Areas Not to Touch
- Do not edit `.env` files or read secret contents.
- Do not edit dependency lockfiles unless release tooling requires it.
- Do not edit GitHub workflow behavior unless a release gate proves it is broken.

## Acceptance Criteria
- `package.json`, `server.json`, `CHANGELOG.md`, and release docs name `0.36.2`.
- `CHANGELOG.md` has `## Unreleased` reset to `- No unreleased changes yet.` and a `## 0.36.2` section.
- Local release gate passes before commit/tag.
- Release commit and `v0.36.2` tag are pushed to `origin/main`.
- GitHub Release `v0.36.2` is published with the packed tarball attached.
- Post-publish npm, published smoke, and release-proof evidence is recorded or any external-channel lag is stated clearly.

## Verification Commands
- npm run release-flow
- npm run maintenance:check
- git diff --check
- npx --yes projscan doctor --format markdown
- npx --yes agentflight doctor

## Post-Verification Gates
- npx --no-install agentloop ship --redact-paths
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Before publishing, reset the release metadata commit and delete the local tag. After publishing, prefer a corrective patch release; if needed, delete an unpublished GitHub release/tag and rerun the usual release flow from a clean commit.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
