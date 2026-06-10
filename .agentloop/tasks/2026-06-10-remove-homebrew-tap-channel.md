# Remove Homebrew tap channel

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement

The temporary Homebrew tap path is not a real Homebrew Core release and the maintainer does not want AgentLoopKit to advertise or maintain it.

## Desired Outcome

Public docs and release guidance stop advertising the Homebrew tap, the local formula artifact is removed, and tests no longer require Homebrew packaging.

## Constraints

- Keep npm/npx as the primary channel.
- Keep GitHub Releases, GitHub Action, GHCR, and MCP Registry release guidance intact.
- Do not claim Homebrew Core support.

## Non-Goals

- Do not submit a Homebrew Core PR now.
- Do not create another tap.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- docs/distribution-channels.md
- README.md
- ROADMAP.md
- docs/release-status.md
- docs/npm-publishing.md
- docs/launch-checklist.md
- tests/distribution-artifacts.test.ts
- packaging/homebrew/agentloopkit.rb

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- No public docs advertise brew install for AgentLoopKit.
- The Homebrew formula artifact is removed or no longer tested as a supported channel.
- Distribution tests pass after removing Homebrew expectations.

## Verification Commands

- npx --yes pnpm@10.12.1 test tests/distribution-artifacts.test.ts
- npx --yes pnpm@10.12.1 check:links
- npx --yes pnpm@10.12.1 test

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Restore the formula and docs only if the maintainer decides to pursue Homebrew again.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
