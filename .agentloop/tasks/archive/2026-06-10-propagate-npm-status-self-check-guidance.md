# Propagate npm-status self-check guidance

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
Generated harness and release docs still describe npm-status mostly as a local package metadata check, so future release smoke work may forget --agentloopkit outside the AgentLoopKit repo.

## Desired Outcome
Repo docs and generated harness templates explain when to use agentloop npm-status --agentloopkit for AgentLoopKit release smoke checks.

## Constraints
- Do not change CLI behavior.
- Do not bump versions, publish, tag, or create releases.

## Non-Goals
- Do not rewrite historical release records.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- .agentloop/harness/commands.md
- src/templates/harness/commands.md
- src/templates/root/agentloop-directory-readme.md
- docs/release-status.md
- docs/release-notes.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Generated harness command guidance mentions --agentloopkit for AgentLoopKit release smoke checks outside the repo.
- Release docs point maintainers at --agentloopkit when checking AgentLoopKit from temp or CI directories.

## Verification Commands
- npx pnpm@10.12.1 check:links
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
