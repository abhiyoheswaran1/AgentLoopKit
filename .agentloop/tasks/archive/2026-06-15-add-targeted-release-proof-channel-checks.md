# Add targeted release-proof channel checks

- Created date: 2026-06-15
- Task type: feature
- Status: done

## Problem Statement

Maintainers sometimes need to re-check one release channel, but agentloop release-proof currently queries npm, GitHub Releases, GHCR, and MCP Registry together.

## Desired Outcome

agentloop release-proof can check one selected channel with --only while preserving the default all-channel proof flow.

## Constraints

- None recorded yet.

## Non-Goals

- None recorded yet.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/release-proof.ts
- src/cli/commands/release-proof.ts
- tests/release-proof.test.ts
- docs/release-proof.md
- docs/cli-reference.md

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- release-proof --only npm checks npm proof plus the local git tag and does not require GitHub Release, GHCR, or MCP proof.
- release-proof --only github-release, --only ghcr, and --only mcp-registry select their matching channel names deterministically.
- Invalid --only values fail before live metadata checks.
- Default release-proof behavior remains unchanged.
- No package version change, release, publish, tag, upload, token read, env-file read, or package metadata mutation is added.

## Verification Commands

- npm test -- tests/release-proof.test.ts
- npm run typecheck
- npm run lint
- npm run check:public-docs
- npm run check:links

## Post-Verification Gates

- npx --yes agentflight verify -- npm test -- tests/release-proof.test.ts
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert `src/core/release-proof.ts`, `src/cli/commands/release-proof.ts`, `tests/release-proof.test.ts`, `docs/release-proof.md`, `docs/cli-reference.md`, `README.md`, and `CHANGELOG.md`. The default `agentloop release-proof` behavior should return to checking all channels together.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
