# Park all AgentFlight placeholders during dogfood start

- Created date: 2026-06-17
- Task type: bugfix
- Status: done

## Problem Statement
dogfood:start parks only the current same-title AgentFlight placeholder, so older exact AgentFlight placeholder contracts can remain proposed and look like open work in JSON task inventory.

## Desired Outcome
dogfood:start parks every exact AgentFlight placeholder task contract as deferred while preserving custom task contracts and the detailed AgentLoop task.

## Constraints
- Only park task contracts that exactly match the generated AgentFlight placeholder shape.
- Preserve custom task contracts, detailed AgentLoop task contracts, archived tasks, and generated evidence.
- Keep the helper sequential: AgentFlight start, AgentLoop task creation, placeholder parking, status, ProjScan.

## Non-Goals
- Do not archive or delete placeholder task files.
- Do not change AgentFlight session behavior or ProjScan configuration.
- Do not change task-list grouping, task-source detection, or placeholder rendering outside dogfood start.
- Do not touch package metadata, dependencies, release workflows, or release-channel docs.

## Assumptions
- Exact AgentFlight placeholder contracts are session evidence, not active roadmap work.
- Parking all exact placeholders as `deferred` is safe because the file remains visible as `source: agentflight-placeholder`.

## Likely Files or Areas
- `scripts/dogfood-start.mjs`
- `tests/dogfood-start-script.test.ts`
- `.agentloop/harness/autonomous-dogfooding.md`
- `tests/autonomous-dogfood.test.ts`
- `.agentloop/tasks/2026-06-17-park-all-agentflight-placeholders-during-dogfood-start-2.md`

## Files or Areas Not to Touch
- `package.json`
- `pnpm-lock.yaml`
- `.github/workflows/`
- `src/core/task-state.ts`
- release, Marketplace, GHCR, MCP Registry, npm, Scoop, or WinGet docs and workflows

## Acceptance Criteria
- all exact AgentFlight placeholders are parked after task creation
- custom task contracts are not parked

## Verification Commands
- npm test -- tests/dogfood-start-script.test.ts tests/autonomous-dogfood.test.ts

## Post-Verification Gates
- npx --yes agentflight verify -- npm test -- tests/dogfood-start-script.test.ts
- npx --yes projscan doctor --format markdown
- npx --yes agentflight doctor

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Low runtime risk; this changes local dogfood helper behavior only.
- Main risk is accidentally parking a custom task. Keep the detector tied to the exact AgentFlight placeholder body.

## Rollback Notes
Revert the dogfood-start placeholder discovery change, the tests, and the dogfood guidance wording.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
