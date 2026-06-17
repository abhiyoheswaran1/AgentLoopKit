# Separate AgentFlight placeholders in artifact inventory

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
agentloop artifacts still counts exact AgentFlight placeholder task contracts as ordinary deferred task artifacts even though status and next now separate them from roadmap work.

## Desired Outcome
artifact inventory keeps placeholders visible as preserved task evidence while reporting ordinary task counts and status counts separately.

## Constraints
- Do not delete, archive, or mutate placeholder task files.
- Keep artifacts read-only and bounded to the existing direct inventory.
- Do not change release, Marketplace, npm, GHCR, or MCP flows.

## Non-Goals
- No stale cleanup or deletion behavior.
- No AgentFlight package changes.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/artifacts.ts
- tests/artifacts.test.ts
- docs/cli-reference.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- artifacts JSON exposes AgentFlight placeholder tasks separately from regular task counts.
- artifacts Markdown labels preserved placeholders without including them in by-status task counts.
- filtered task artifact output still shows placeholders when requested as task artifacts.

## Verification Commands
- npm test -- tests/artifacts.test.ts
- npm run typecheck
- npm run lint
- npm run build

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the artifact inventory task classification changes, artifact tests, and CLI reference wording. Existing AgentFlight placeholder task files can remain deferred; this change only affects read-only inventory reporting.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
