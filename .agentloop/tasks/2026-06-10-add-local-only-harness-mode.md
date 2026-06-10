# Add local-only harness mode

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement
Developers sometimes want AgentLoopKit guidance for their local agent session without committing generated harness files to a repository.

## Desired Outcome
agentloop init --local-only generates the normal harness and excludes it through this clone's .git/info/exclude.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/init.ts
- src/cli/commands/init.ts
- tests/init.test.ts
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Local-only init updates .git/info/exclude with a marked AgentLoopKit block
- Generated AGENTS.md and AGENTLOOP.md tell agents not to commit the local harness
- Dry-run and repeated runs are safe

## Verification Commands
- npm test -- tests/init.test.ts
- npm run typecheck
- npm test

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Remove the local-only option and documented guidance

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
