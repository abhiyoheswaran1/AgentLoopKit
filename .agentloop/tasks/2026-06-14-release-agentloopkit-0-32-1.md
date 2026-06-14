# Release AgentLoopKit 0.32.1

- Created date: 2026-06-14
- Task type: release
- Status: proposed

## Problem Statement
`main` contains post-release proof documentation and AgentLoop dogfood evidence that landed after the `0.32.0` release tag. Cut a small patch release so npm, GitHub Releases, GHCR, MCP Registry, and the public release docs match the current repository state before starting the next roadmap implementation batch.

## Desired Outcome
AgentLoopKit `0.32.1` is published through the normal GitHub release and trusted-publishing flow, with release-flow evidence before tagging and post-release verification for npm, GHCR, MCP Registry, and GitHub Actions.

## Constraints
- Keep this as a patch release; do not add product features in this release.
- Do not publish manually unless trusted publishing fails and the maintainer explicitly approves a fallback.

## Non-Goals
- Do not implement roadmap items in this release task.
- Do not change public positioning beyond version and release-status metadata.

## Assumptions
- `0.32.0` is already live on npm, GHCR, GitHub Releases, and MCP Registry.
- The next feature work should start from a clean `0.32.1` baseline.

## Likely Files or Areas
- package metadata
- MCP server metadata
- changelog
- release-status docs
- final handoff and roadmap current-state docs

## Files or Areas Not to Touch
- source command implementations
- public README feature copy unless a release guard requires a version-only update

## Acceptance Criteria
- package.json version is 0.32.1
- server.json package version is 0.32.1
- CHANGELOG documents 0.32.1
- release-flow passes before tag creation
- GitHub release, npm, GHCR, and MCP Registry are verified after release

## Verification Commands
- npm run release-flow
- node dist/cli/index.js npm-status --agentloopkit --expect-current

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Release automation touches npm, GitHub Releases, GHCR, and MCP Registry metadata.
- Public docs may briefly say `0.32.1` while the release is being prepared; post-release proof must be recorded after workflows complete.

## Rollback Notes
If publish fails before npm receives `0.32.1`, delete only the draft release/tag if safe and retry from the fixed release commit. If npm receives `0.32.1`, fix forward with a patch release.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
