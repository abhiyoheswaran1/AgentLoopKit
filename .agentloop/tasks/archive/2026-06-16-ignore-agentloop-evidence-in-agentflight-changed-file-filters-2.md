# Ignore AgentLoop evidence in AgentFlight changed-file filters

- Created date: 2026-06-16
- Task type: feature
- Status: done

## Problem Statement
Long AgentLoopKit dogfood sessions create many generated AgentLoop evidence files under reports, handoffs, runs, and archived task folders. AgentFlight status and proof reports then become dominated by historical evidence churn instead of the current implementation surface.

## Desired Outcome
AgentFlight keeps recording the session locally, but its changed-file filters ignore high-churn generated AgentLoop evidence directories while still surfacing real source, docs, tests, harness, config, and active product-direction files.

## Constraints
- Use the existing `.agentflight/config.json` local-first config.
- Keep AgentLoopKit evidence generation unchanged.
- Keep AgentFlight session recording local-only.
- Preserve repo-visible harness, backlog, persona, policy, and source file changes.

## Non-Goals
- Do not change AgentFlight package code.
- Do not hide all `.agentloop/` files.
- Do not delete, archive, or rewrite existing AgentLoop evidence.
- Do not change AgentLoopKit CLI behavior.
- Do not cut, tag, bump, publish, or release anything.

## Assumptions
- AgentFlight `changedFileFilters.ignore` accepts the existing glob-style patterns already used by this config.
- AgentLoopKit remains the source of truth for task, verification, ship, and handoff evidence.

## Likely Files or Areas
- `.agentflight/config.json`
- `.agentloop/harness/autonomous-dogfooding.md`
- `tests/autonomous-dogfood.test.ts`

## Files or Areas Not to Touch
- `package.json` version metadata
- Release workflows, tags, release notes, registry metadata, and publication assets
- Existing `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/handoffs/`, and archived task contents except new evidence created by verification

## Acceptance Criteria
- AgentFlight config ignores generated AgentLoop report, handoff, run-ledger, and archived-task evidence paths.
- AgentFlight config does not broadly ignore all `.agentloop/` paths.
- The autonomous dogfood harness test locks the changed-file filter contract.
- The dogfood guide explains that AgentFlight should focus on implementation changes while AgentLoopKit remains the evidence source.
- A live AgentFlight status/report bug pass shows reduced AgentLoop evidence churn or a clear explanation of any remaining current-session task files.

## Verification Commands
- npm test -- tests/autonomous-dogfood.test.ts
- npm run typecheck
- npm run lint
- npm run build
- npm test

## Post-Verification Gates
- npx --yes agentflight verify -- npm test -- tests/autonomous-dogfood.test.ts
- npx --yes projscan doctor --format markdown
- npx --yes agentflight doctor

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert `.agentflight/config.json`, `.agentloop/harness/autonomous-dogfooding.md`, and the autonomous dogfood test expectation. Existing AgentLoop evidence can remain in place because this task only changes AgentFlight's changed-file filtering.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
- Run `npm run dogfood:strict` after fresh handoff or ship evidence exists.
