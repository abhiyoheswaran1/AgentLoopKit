# Refresh final handoff for v0.22.0

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
FINAL_HANDOFF.md still has stale launch checklist and next-improvement references that treat 0.19.0 or old npm assumptions as current, even though GitHub release v0.22.0 is public and npm still serves 0.1.1.

## Desired Outcome
FINAL_HANDOFF.md reflects v0.22.0 as the current GitHub release, npm 0.1.1 as the current registry state, current GitHub tarball usage as the temporary install path, and the next improvements list no longer points maintainers at stale release work.

## Constraints
- Do not change runtime CLI behavior.
- Do not publish to npm.
- Keep historical release details factual; only update stale current-state guidance.

## Non-Goals
- No version bump.
- No release creation.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- FINAL_HANDOFF.md
- .agentloop/backlog.md
- .agentloop/dogfood-log.md
- .agentloop/research/interview-cycle-088.md

## Files or Areas Not to Touch
- src/
- package.json
- CHANGELOG.md

## Acceptance Criteria
- Launch checklist includes v0.20.0, v0.21.0, and v0.22.0 GitHub releases and npm-pending status.
- Next 15 improvements name 0.22.0 as the npm catch-up target, not 0.19.0.
- Announcement copy does not imply npm 0.1.1 contains the current CLI.
- Known limitations mention the temporary GitHub tarball path while npm lags.

## Verification Commands
- npx pnpm@10.12.1 check:links
- git diff --check
- npx projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the docs commit if a newer release or npm publish supersedes this handoff state.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
