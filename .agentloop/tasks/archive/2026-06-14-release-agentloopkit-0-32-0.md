# Release AgentLoopKit 0.32.0

- Created date: 2026-06-14
- Task type: release
- Status: done

## Problem Statement
Describe the problem this task should solve.

## Desired Outcome
Describe the concrete result expected from this task.

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
- package.json version is 0.32.0
- server.json package version is 0.32.0
- CHANGELOG moves Unreleased entries under 0.32.0
- release notes are generated for v0.32.0
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
- Release automation touches npm, GitHub Releases, GHCR, and MCP Registry metadata

## Rollback Notes
If publish fails, fix forward with a patch release or delete only an unpublished draft release/tag before workflows consume it

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
