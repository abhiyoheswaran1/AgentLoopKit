# Harden AgentLoop Start truth consistency

- Created date: 2026-06-24
- Task type: feature
- Status: done

## Problem Statement
Start and Context can describe archived completed evidence as active work after release cleanup, which weakens the repo-truth promise.

## Desired Outcome
Start and Context use consistent active/open/previous evidence labels and route clean no-active repos away from implementation handoff commands.

## Constraints
- Do not change release channels, package versions, tags, publishing, provider traffic, telemetry, or hidden command execution.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/agent-start.ts
- src/core/context-contract.ts
- src/core/evidence.ts
- src/core/evidence-map.ts
- tests/start.test.ts
- tests/context-pack.test.ts
- tests/agent-start.test.ts
- tests/context-contract.test.ts
- README.md
- docs/cli-reference.md
- docs/context.md
- docs/mcp.md
- docs/superpowers/specs/
- docs/superpowers/plans/
- DECISIONS.md
- CHANGELOG.md
- changelog.md

## Files or Areas Not to Touch
- package.json
- package-lock.json

## Acceptance Criteria
- agentloop start and context pack never label archived completed evidence as active work.
- No-active clean repos route agents to no-op/create-task guidance instead of ship.
- README and docs explain the Start Guarantee with accurate previous-evidence language.

## Verification Commands
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build
- npm run test:unit
- npm run typecheck
- npm run check:public-docs
- npm run dogfood

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the Start/Context truth-consistency code, tests, and documentation changes. No package version, release workflow, tag, publishing, dependency, or registry state should be changed by this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
