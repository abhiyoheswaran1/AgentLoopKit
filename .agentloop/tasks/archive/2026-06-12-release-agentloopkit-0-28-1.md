# Release AgentLoopKit 0.28.1

- Created date: 2026-06-12
- Task type: release
- Status: done

## Problem Statement
The dogfood gate and official icon assets are complete on main and need a small patch release.

## Desired Outcome
Publish and verify AgentLoopKit 0.28.1 with clean npm, GitHub release, CI, MCP registry, GHCR, and local evidence.

## Constraints
- Do not publish a new minor version
- Do not add Homebrew distribution
- Do not include internal release confusion in public README

## Non-Goals
- No new product features in the release prep commit

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- package metadata is 0.28.1
- CHANGELOG.md documents the 0.28.1 changes
- release gate passes before tagging
- npm and GitHub release are verified after publish

## Verification Commands
- npm run lint
- npm run typecheck
- npm test
- npm run check:links
- npm run build
- node scripts/prepublish-check.mjs
- npm run smoke:release
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Publishing automation or registry propagation can lag after tag push.

## Rollback Notes
Deprecate or supersede the npm version with a corrected patch and update GitHub release notes if a packaging issue is discovered.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
