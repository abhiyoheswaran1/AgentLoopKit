# Mirror raw AgentFlight recovery in agent instructions

- Created date: 2026-06-17
- Task type: docs
- Status: done

## Problem Statement
The raw AgentFlight recovery note was added to AGENTLOOP and the dogfood guide, but AGENTS.md and harness command guidance still show raw agentflight start without telling agents to re-check status and re-pin the detailed task if a placeholder becomes active.

## Desired Outcome
Agent-facing instructions consistently mention the raw AgentFlight placeholder recovery path wherever they recommend raw agentflight start.

## Constraints
- Do not change runtime task status behavior, release files, package metadata, publishing, or registry/channel tasks.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- AGENTS.md
- src/templates/root/AGENTS.md
- .agentloop/harness/commands.md
- tests/autonomous-dogfood.test.ts

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- CHANGELOG.md
- action.yml
- .github/workflows

## Acceptance Criteria
- AGENTS.md, template AGENTS.md, and harness commands mention agentloop status --redact-paths after raw agentflight start and agentloop task set <path> when an AgentFlight placeholder becomes active.

## Verification Commands
- npm test -- tests/autonomous-dogfood.test.ts

## Post-Verification Gates
- npm run dogfood

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Instruction duplication can become noisy; keep wording short and consistent.

## Rollback Notes
Revert the agent instruction guidance and focused guard test changes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
