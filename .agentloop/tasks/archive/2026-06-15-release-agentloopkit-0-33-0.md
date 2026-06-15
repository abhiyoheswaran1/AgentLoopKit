# Release AgentLoopKit 0.33.0

- Created date: 2026-06-15
- Task type: release
- Status: done

## Problem Statement
Unreleased release-proof work is on main but not published.

## Desired Outcome
Publish AgentLoopKit 0.33.0 through the standard GitHub Release, npm trusted publishing, GHCR, and MCP Registry flow.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- package.json and server.json use version 0.33.0
- CHANGELOG.md has a 0.33.0 section and an empty Unreleased section
- npm run release-flow passes before tagging
- v0.33.0 tag and GitHub release are created from the release commit
- Post-release proof verifies npm, GitHub Release, GHCR, and MCP Registry

## Verification Commands
- node scripts/prepublish-check.mjs
- npm run lint
- npm run typecheck
- npm test
- npm run build
- npm run check:public-docs
- npm run check:links
- npm run smoke:release

## Post-Verification Gates
- npm run dogfood:strict
- npm run release-flow
- npm run smoke:published -- --version 0.33.0
- node dist/cli/index.js release-proof --strict --timeout-ms 10000
- node dist/cli/index.js check-gates --strict --redact-paths

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Release metadata drift between package.json, server.json, CHANGELOG.md, npm, GHCR, and MCP Registry.

## Rollback Notes
If publication fails, fix the failing release channel and rerun the workflow; if a bad package ships, publish a patch release.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
