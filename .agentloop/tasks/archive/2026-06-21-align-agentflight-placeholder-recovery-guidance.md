# Align AgentFlight placeholder recovery guidance

- Created date: 2026-06-21
- Task type: docs
- Status: done

## Problem Statement
Generated agent/root guidance and this repo's harness still tell direct AgentFlight users to run status and task set when an AgentFlight placeholder becomes active, while newer status/doctor guidance says to preserve the placeholder, run task doctor, clear the placeholder pointer, then pin a real task or create a scoped task.

## Desired Outcome
Fresh init and installed agent instructions teach bounded AgentFlight placeholder recovery that matches task doctor and dogfood guidance without deleting placeholder evidence or mutating custom task contracts.

## Constraints
- Guidance-only change; do not change AgentFlight, task-state, status, next, or task-doctor runtime behavior.
- Keep copy concise across agent templates so AGENTS.md remains readable.

## Non-Goals
- Do not add new AgentFlight integration behavior or auto-cleanup.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/templates/root/AGENTS.md
- src/templates/root/AGENTLOOP.md
- src/templates/harness/commands.md
- src/templates/agents
- tests/init.test.ts
- tests/agent-installation.test.ts
- AGENTS.md
- AGENTLOOP.md
- .agentloop/harness/commands.md

## Files or Areas Not to Touch
- package.json
- package-lock.json
- pnpm-lock.yaml

## Acceptance Criteria
- Fresh init root guidance mentions status plus task doctor for direct AgentFlight placeholder recovery.
- Fresh init root guidance mentions clearing placeholder active state before setting or creating a real task.
- Installed/generated agent templates preserve AgentFlight placeholders as evidence instead of implying deletion or broad cleanup.

## Verification Commands
- npm test -- tests/init.test.ts tests/agent-installation.test.ts
- npm run check:public-docs
- npm run check:links

## Post-Verification Gates
- npx --no-install tsx src/cli/index.ts task doctor --redact-paths
- npx --no-install tsx src/cli/index.ts ship
- npx --no-install tsx src/cli/index.ts prepare-pr --write --redact-paths
- npm run dogfood:strict
- npm run maintenance:check

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Stale generated instructions can cause agents to treat AgentFlight placeholder files as active work or delete evidence.

## Rollback Notes
Revert the template, harness, docs record, and init/agent-installation test changes; runtime behavior remains unchanged.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
