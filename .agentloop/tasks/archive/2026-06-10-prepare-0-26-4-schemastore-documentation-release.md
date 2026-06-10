# Prepare 0.26.4 SchemaStore documentation release

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement

SchemaStore registration is complete, but the npm-facing README does not mention editor auto-discovery and package metadata still points at 0.26.3.

## Desired Outcome

Release 0.26.4 with README, changelog, release notes, and release-status docs reflecting SchemaStore registration.

## Constraints

- Do not change CLI behavior.
- Release through GitHub trusted publishing, not local npm tokens.

## Non-Goals

- Do not add new distribution channels.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- README.md
- CHANGELOG.md
- package.json
- pnpm-lock.yaml
- docs/release-status.md
- docs/launch-checklist.md

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- README explains SchemaStore editor discovery without release-process noise.
- `package.json`, `server.json`, `CHANGELOG.md`, and current docs point at `0.26.4`.
- Prepublish metadata check passes with no unreleased changelog entries.
- Local verification, pack, and smoke checks pass before creating the GitHub release.
- GitHub release, npm trusted publishing, GHCR, and MCP Registry workflows are verified after release.

## Release Proof

- GitHub release: https://github.com/abhiyoheswaran1/AgentLoopKit/releases/tag/v0.26.4
- Release asset: `agentloopkit-0.26.4.tgz`
- Release asset SHA-256: `a8ede1d0710d67b40fa80c1045e7cfda93afe32525c29f46997617cc6f17fbfa`
- CI run: `27296279892`, passed.
- npm Publish workflow run: `27296379647`, passed.
- Docker/GHCR workflow run: `27296379642`, passed.
- MCP Registry workflow run: `27296470988`, passed.
- npm latest: `0.26.4`.
- Direct temp `npx --package agentloopkit@0.26.4` smoke: `agentloop version`, `agentloopkit version`, and `agentloop init --dry-run` passed.
- Live SchemaStore catalog contains the `AgentLoopKit` entry for `agentloop.config.json`.

## Verification Commands

- npx --yes pnpm@10.12.1 test
- npx --yes pnpm@10.12.1 typecheck
- npx --yes pnpm@10.12.1 lint
- npx --yes pnpm@10.12.1 build
- npx --yes pnpm@10.12.1 check:links
- node dist/cli/index.js npm-status --expect-current

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the version/docs commit and delete the draft release if it has not published.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
