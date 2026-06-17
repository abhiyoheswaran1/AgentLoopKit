# Park release-channel backlog while release work is blocked

- Created date: 2026-06-17
- Task type: docs
- Status: done

## Problem Statement
The only remaining do-now backlog rows are release or publishing channel work, but release work is explicitly parked pending maintainer approval. Autonomous agents can keep selecting blocked release-channel tasks.

## Desired Outcome
Backlog decisions and roadmap guard keep release-channel work out of do-now selection until maintainer approval, without changing release files or publishing state.

## Constraints
- No package version changes, tags, releases, publish actions, registry mutation, protected release-file edits, GitHub Marketplace publication, GHCR, MCP Registry, Scoop, or WinGet work.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- .agentloop/backlog.md
- tests/roadmap-channels.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- No release or publishing channel backlog row remains marked do now while release-channel tasks are deferred
- GitHub Marketplace and Scoop/WinGet task contracts remain deferred

## Verification Commands
- npm test -- tests/roadmap-channels.test.ts

## Post-Verification Gates
- npm run dogfood

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Over-parking a task that should become active after maintainer approval; keep notes explicit that this is a release-approval boundary.

## Rollback Notes
Revert .agentloop/backlog.md and tests/roadmap-channels.test.ts changes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
