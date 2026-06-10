# Prepare 0.26.3 status cleanup release

- Created date: 2026-06-10
- Task type: release
- Status: done

## Problem Statement

Main now includes a user-facing status next-action fix after v0.26.2. The npm package and GitHub release should publish the patch so users get the cleaner task cleanup behavior.

## Desired Outcome

Publish agentloopkit@0.26.3 with the done-active-task archive recommendation, updated changelog, release proof, and post-publish status docs.

## Constraints

- Use GitHub Releases and npm trusted publishing.
- Keep npm/npx as the primary install path.

## Non-Goals

- Do not add unrelated features.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- package.json
- server.json
- CHANGELOG.md
- README.md

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- package.json and server.json report 0.26.3.
- CHANGELOG has a 0.26.3 entry and Unreleased is reset.
- Release checks pass locally before tagging.
- GitHub release v0.26.3 is created and npm latest becomes 0.26.3.

## Verification Commands

- npx --yes pnpm@10.12.1 test
- npx --yes pnpm@10.12.1 typecheck
- npx --yes pnpm@10.12.1 lint
- npx --yes pnpm@10.12.1 build
- npm run smoke:release

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Document how to revert or disable this change.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
