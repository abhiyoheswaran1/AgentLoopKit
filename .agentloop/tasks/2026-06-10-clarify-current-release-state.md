# Clarify current release state

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
README and launch docs need to answer why GitHub release v0.23.0 is current while npm still serves 0.1.1, without implying this is the normal release model.

## Desired Outcome
A first-time GitHub reader can understand the current install path, the one-time npm catch-up plan, and why older versions should not be published from current main.

## Constraints
- Keep npm/npx as the intended distribution path.
- Do not claim npm availability until npm view proves it.
- Do not publish or create another release in this iteration.

## Non-Goals
- No CLI behavior changes.
- No npm publish attempt.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- README.md
- docs/release-status.md
- docs/launch-checklist.md
- FINAL_HANDOFF.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- README names the `v0.23.0` publish workflow, not the older `v0.22.0` workflow, when explaining the current npm gap.
- Public docs explain that the npm jump to `0.23.0` is a one-time catch-up path because GitHub release tags already occupy the intermediate versions.
- Public docs continue to state that npm/npx is the intended distribution path after npm publishing is repaired.
- Docs do not claim npm availability without `npm view` proof.

## Verification Commands
- npx pnpm@10.12.1 check:links
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 build

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the docs-only release-state clarification commit.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
