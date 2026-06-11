# Compact public release docs for 0.28.0 batch

- Created date: 2026-06-11
- Task type: docs
- Status: done

## Problem Statement
Public maintainer docs still carry stale incident-style release history and version catch-up detail after trusted publishing is working. Keep user-facing docs concise and preserve only current release procedure.

## Desired Outcome
Public maintainer docs describe the current trusted-publishing path without stale incident-log history, and the packed-release smoke gate fails if normal public docs reintroduce unsupported install-channel claims or maintainer-only release chatter.

## Constraints
- Do not bump package metadata or publish a release.
- Keep README user-facing.
- Preserve useful release procedure, not old transient auth state.

## Non-Goals
- Do not rewrite product positioning.
- Do not change CLI runtime behavior.
- Do not remove internal `.agentloop` research or dogfood records.

## Assumptions
- The next public release is still planned as the batched `0.28.0` release.
- npm, GitHub Releases, GHCR, and MCP Registry remain the supported current public channels.

## Likely Files or Areas
- README.md
- docs/npm-publishing.md
- docs/release-status.md
- docs/distribution-channels.md
- scripts/smoke-packed-release.mjs
- tests/release-smoke.test.ts
- CHANGELOG.md

## Files or Areas Not to Touch
- package.json

## Acceptance Criteria
- README remains user-facing with no internal release chatter
- distribution, npm publishing, and release-status docs describe current channels without old incident log noise
- a regression check prevents normal public docs from reintroducing unsupported Homebrew or internal release chatter

## Verification Commands
- npx pnpm@10.12.1 test tests/release-smoke.test.ts
- npx pnpm@10.12.1 check:links
- npm run build
- npm run smoke:release
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the docs and release-smoke changes. If the smoke guard is too strict, narrow `assertPublicDocsAvoidUnsupportedClaims` instead of deleting the public-doc check entirely.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
