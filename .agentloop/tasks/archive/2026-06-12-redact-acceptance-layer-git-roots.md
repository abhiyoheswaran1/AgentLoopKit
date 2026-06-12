# Redact acceptance-layer git roots

- Created date: 2026-06-12
- Task type: security-review
- Status: done

## Problem Statement
ship and prepare-pr can embed check-gates output that contains the absolute local Git root in public-facing JSON or comments.

## Desired Outcome
ship and prepare-pr support opt-in path redaction so public review-readiness evidence can hide the local Git root without changing default script behavior.

## Constraints
- No version bump or release.
- Do not redact repo-relative AgentLoop artifact paths.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop ship --json --redact-paths replaces nested gates.git.root with [git-root].
- agentloop ship --github-comment --redact-paths does not expose the local absolute Git root.
- agentloop prepare-pr --json --github-comment --redact-paths does not expose the local absolute Git root when ship evidence is refreshed.
- Default ship and prepare-pr JSON behavior remains backward-compatible unless --redact-paths is passed.

## Verification Commands
- npm test -- tests/ship.test.ts tests/prepare-pr.test.ts
- npm run typecheck

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Changing JSON defaults could break automation, so redaction must be opt-in.

## Rollback Notes
Remove the new CLI flag propagation and tests if it breaks existing automation.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
