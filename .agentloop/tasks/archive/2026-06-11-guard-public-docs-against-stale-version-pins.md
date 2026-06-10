# Guard public docs against stale version pins

- Created date: 2026-06-11
- Task type: tests
- Status: done

## Problem Statement
A docs cleanup fixed stale AgentLoopKit version pins, but there is no automated guard covering docs and examples beyond the packed README check.

## Desired Outcome
Vitest fails if normal public docs or examples reintroduce hardcoded AgentLoopKit package/action versions, while release history docs can keep exact version evidence.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- tests/release-smoke.test.ts
- scripts/smoke-packed-release.mjs
- CHANGELOG.md
- .agentloop/backlog.md

## Files or Areas Not to Touch
- package.json
- README.md

## Acceptance Criteria
- A failing test proves stale public-doc pins are detected
- Release history docs are excluded from the public-doc pin guard
- Current docs pass the guard

## Verification Commands
- npx --yes pnpm@10.12.1 test tests/release-smoke.test.ts
- npx --yes pnpm@10.12.1 test
- npx --yes projscan doctor --format markdown
- git diff --check

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the guard test and helper changes

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
