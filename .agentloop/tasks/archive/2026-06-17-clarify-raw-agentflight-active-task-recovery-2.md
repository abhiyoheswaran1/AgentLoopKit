# Clarify raw AgentFlight active-task recovery

- Created date: 2026-06-17
- Task type: docs
- Status: done

## Problem Statement
Repo guidance permits raw agentflight start, but that can leave .agentloop/state.json pointing at an AgentFlight placeholder until the detailed task is re-pinned.

## Desired Outcome
AgentLoopKit guidance tells agents who use raw AgentFlight to run status and re-pin the real AgentLoop task when a placeholder becomes active, without changing task-status semantics or release files.

## Constraints
- Do not change task status side effects, release files, package metadata, tags, publishing, Marketplace, GHCR, MCP Registry, Scoop, or WinGet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- AGENTLOOP.md
- src/templates/root/AGENTLOOP.md
- .agentloop/harness/autonomous-dogfooding.md
- tests/autonomous-dogfood.test.ts

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- CHANGELOG.md
- action.yml
- .github/workflows

## Acceptance Criteria
- Raw AgentFlight guidance mentions running agentloop status after agentflight start and using agentloop task set for the real task if the placeholder is active.
- dogfood:start remains the recommended helper path for new sessions.

## Verification Commands
- npm test -- tests/autonomous-dogfood.test.ts

## Post-Verification Gates
- npm run dogfood

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Too much guidance can make onboarding noisy; keep the raw-path note short and subordinate to dogfood:start.

## Rollback Notes
Revert the harness guidance and focused test changes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
