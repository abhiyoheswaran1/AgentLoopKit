# Refresh public roadmap after 0.15.1

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement

ROADMAP.md still lists completed work such as task status transitions and shell completion as near-term, which makes the GitHub launch page look stale after v0.15.1.

## Desired Outcome

Update the public roadmap to reflect what is already shipped, what is blocked externally, and what future work remains without promising SaaS or npm availability.

## Constraints

- Do not create another release version for a docs-only roadmap cleanup.
- Keep npm publishing repair as the only P0 because it is the external blocker.
- Use direct public wording and avoid claiming adoption or user feedback.

## Non-Goals

- No new CLI feature in this task.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- ROADMAP.md
- README.md
- FINAL_HANDOFF.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch

- .env

## Acceptance Criteria

- ROADMAP.md no longer lists completed task status or shell completion work as future work.
- Roadmap clearly separates shipped capabilities, current blocker, near-term local-first improvements, later options, and non-goals.
- Docs keep npm availability status honest.

## Verification Commands

- npx pnpm@10.12.1 check:links
- npx projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the roadmap docs commit if the roadmap misstates current product state.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
