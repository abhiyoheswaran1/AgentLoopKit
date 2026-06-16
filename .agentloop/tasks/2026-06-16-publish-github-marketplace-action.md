# Publish GitHub Marketplace Action

- Created date: 2026-06-16
- Task type: release
- Status: in-progress

## Problem Statement
The GitHub Marketplace URL for AgentLoopKit returns 404 even though prior release guidance implied Marketplace availability.

## Desired Outcome
AgentLoopKit is published to GitHub Marketplace if GitHub permits automated publication, or release evidence clearly captures the manual owner-only blocker and local docs/tests no longer overclaim Marketplace availability.

## Constraints
- Preserve existing release channels unless a patch release is required to publish Marketplace metadata.
- Do not read or print secrets.
- Do not publish npm, GitHub Releases, GHCR, or MCP Registry without explicit evidence and release-channel verification.

## Non-Goals
- Do not add telemetry, hosted services, or new dependencies.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- action.yml
- docs/github-actions.md
- docs/distribution-channels.md
- docs/release-status.md
- scripts/smoke-packed-release.mjs
- tests

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- GitHub Marketplace URL or GitHub release UI state has been checked from current evidence.
- Marketplace publication path is documented without implying unsupported channels are live.
- If a patch release is needed, package metadata, changelog, docs, and verification evidence are prepared.

## Verification Commands
- npm run check:public-docs
- npm run check:links
- npm run test:quick
- npm run build

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the release-channel documentation/test changes and leave published package state untouched unless a maintainer explicitly asks for release rollback.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
