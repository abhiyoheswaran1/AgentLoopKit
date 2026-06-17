# Prepare AgentLoopKit 0.36.0 release

- Created date: 2026-06-17
- Task type: release
- Status: review

## Problem Statement
The repository has verified AgentLoopKit CLI improvements since 0.35.2 and the maintainer approved one release for today.

## Desired Outcome
Prepare, verify, publish, and prove exactly one AgentLoopKit release today; afterward continue non-release improvement work without another version cut.

## Constraints
- Only one release may be cut today.
- Do not publish until release gates pass from current local output.
- Keep GitHub Marketplace publication deferred unless the usual GitHub release flow exposes it safely.

## Non-Goals
- Do not start a second release after 0.36.0.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- package.json
- CHANGELOG.md
- docs/release-status.md
- docs/npm-publishing.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Package metadata and changelog identify 0.36.0.
- release-flow, maintenance guard, AgentLoop gates, AgentFlight, ProjScan, and post-release proof are captured.
- Public npm/GitHub release proof is verified before claiming availability.

## Verification Commands
- npm run release-flow
- npm run maintenance:check
- npx --yes projscan doctor --format markdown

## Post-Verification Gates
- npx --no-install tsx src/cli/index.ts release-proof --redact-paths

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Delete the v0.36.0 tag/release before publication, or publish a follow-up patch if post-publication proof finds a package defect.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
