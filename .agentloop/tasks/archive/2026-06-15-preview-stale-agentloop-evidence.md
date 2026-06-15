# Preview stale AgentLoop evidence

- Created date: 2026-06-15
- Task type: feature
- Status: done

## Problem Statement
Repeated verify, handoff, and ship runs can leave older local evidence artifacts that make reviews noisy, but cleanup must be safe and transparent.

## Desired Outcome
AgentLoopKit can show a read-only cleanup preview for stale local evidence without deleting files.

## Constraints
- Keep the feature read-only.
- Do not delete, move, archive, or mutate evidence files.
- Do not add release, publish, registry, token, `.env`, cloud, or telemetry behavior.

## Non-Goals
- Do not add automatic cleanup or retention policy enforcement.
- Do not change default `agentloop artifacts` output.
- Do not include artifact file contents in JSON or Markdown output.

## Assumptions
- Users and agents need a safe preview before doing any manual evidence cleanup.
- Latest verification, handoff, ship report, and run ledger evidence should be protected from stale-candidate output.

## Likely Files or Areas
- `src/core/artifacts.ts`
- `src/cli/commands/artifacts.ts`
- `tests/artifacts.test.ts`
- `README.md`
- `docs/cli-reference.md`
- `docs/getting-started.md`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`

## Files or Areas Not to Touch
- `package.json` version
- Release workflows
- Registry metadata
- Destructive filesystem cleanup code

## Acceptance Criteria
- A command or flag lists stale evidence candidates and always says it writes nothing.
- Latest verification, handoff, ship, and run ledger proof are kept out of cleanup candidates.
- JSON output exposes candidates and safety notes for agents and CI.
- Public docs describe `agentloop artifacts --stale` as a preview, not cleanup automation.

## Verification Commands
- npm test -- tests/artifacts.test.ts
- npm run test:unit
- npm run typecheck
- npm run lint
- npm run check:public-docs
- npm run check:links

## Post-Verification Gates
- npx --yes agentflight verify -- npm test -- tests/artifacts.test.ts
- agentloop handoff --write-run --redact-paths
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the CLI/core/test/docs changes if the stale preview shape is not useful.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
