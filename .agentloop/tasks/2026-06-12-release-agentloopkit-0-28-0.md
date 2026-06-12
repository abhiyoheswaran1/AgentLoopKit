# Release AgentLoopKit 0.28.0

- Created date: 2026-06-12
- Task type: release
- Status: done

## Problem Statement
The 0.28.0 batch is complete and needs the normal release gate: metadata, changelog, verification, GitHub release, npm trusted publishing, GHCR, and MCP Registry proof.

## Desired Outcome
AgentLoopKit 0.28.0 is released through GitHub Releases and npm, with post-publish proof recorded in release docs.

## Constraints
- Do not publish manually unless trusted publishing fails and the maintainer explicitly approves fallback.
- Do not mention internal product-panel or dogfood notes in public release notes.
- Do not claim unsupported Homebrew or editor install channels.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- package.json reports 0.28.0.
- CHANGELOG.md has a 0.28.0 section and an empty Unreleased section.
- Full local release gate passes.
- GitHub release v0.28.0 exists with release notes and tarball asset.
- npm latest reports 0.28.0 after trusted publishing.
- Release status docs record CI, publish, GHCR, MCP, npm, and asset proof.

## Verification Commands
- npm run lint
- npm run typecheck
- npm test
- npm run check:links
- node scripts/prepublish-check.mjs
- git diff --check
- npm run build
- npm run smoke:release
- node scripts/smoke-cli.mjs
- node dist/cli/index.js artifacts --json
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
If any publish workflow fails, do not retag. Fix forward with a patch or rerun the failed workflow after recording the blocked state.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
