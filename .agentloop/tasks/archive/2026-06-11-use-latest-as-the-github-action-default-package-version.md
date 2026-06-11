# Use latest as the GitHub Action default package version

- Created date: 2026-06-11
- Task type: feature
- Status: done

## Problem Statement
The composite GitHub Action defaults agentloopkit-version to a concrete released version, so main becomes stale immediately after unreleased CLI improvements land and every release needs another manual action.yml pin update.

## Desired Outcome
The action defaults to agentloopkit@latest for low-friction use, while docs keep showing agentloopkit-version: <version> for reproducible pinned workflows.

## Constraints
- Do not cut a release or bump package metadata.
- Do not change the action command execution model.
- Do not add upload, commenting, token, or artifact behavior.

## Non-Goals
- No new GitHub Action features.
- No workflow release automation changes.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- action.yml
- tests/distribution-artifacts.test.ts
- docs/github-actions.md
- docs/distribution-channels.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- action.yml defaults agentloopkit-version to latest.
- tests reject a hardcoded exact AgentLoopKit version default in action.yml.
- docs tell teams to set agentloopkit-version: <version> when reproducibility matters.

## Verification Commands
- npm test -- distribution-artifacts
- npm run typecheck
- npm run check:links
- npm run build
- npx --yes projscan doctor --format markdown

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
