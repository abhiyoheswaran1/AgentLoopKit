# Record 0.18.0 release status

- Created date: 2026-06-10
- Task type: release
- Status: done

## Problem Statement
GitHub release v0.18.0 is public, but npm still serves 0.1.1 after publish attempts failed with npm authorization errors. Public docs need to explain the version gap and next publish path.

## Desired Outcome
README, changelog, publishing docs, launch checklist, roadmap, final handoff, and dogfood log accurately describe the 0.18.0 GitHub release, npm auth blocker, and intentional npm catch-up version jump.

## Constraints
- Do not change package source behavior for this documentation-only cleanup.
- Do not claim npm 0.18.0 is published until npm registry proof confirms it.

## Non-Goals
- Do not create another GitHub release for documentation-only status updates.
- Do not attempt another npm publish without fresh npm authentication.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- README.md
- CHANGELOG.md
- docs/npm-publishing.md
- docs/launch-checklist.md
- ROADMAP.md
- FINAL_HANDOFF.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch
- src
- dist

## Acceptance Criteria
- Public docs explain why npm may jump from 0.1.1 to 0.18.0.
- Docs distinguish GitHub release availability from npm availability.
- Verification evidence is recorded before commit.

## Verification Commands
- git diff --check
- npx pnpm@10.12.1 check:links
- npx projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert this documentation commit if the release status changes before npm catch-up publish.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
