# Document current GitHub tarball usage

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
README leads with npx agentloopkit, but npm still serves 0.1.1 while GitHub release v0.22.0 contains the current CLI. Users need a safe copy-paste path for the current release until npm catches up.

## Desired Outcome
README and publishing docs show how to run or install the v0.22.0 GitHub release tarball without implying npm latest is current.

## Constraints
- Do not publish to npm.
- Do not change runtime CLI behavior.
- Keep the tarball fallback clearly temporary until npm catches up.

## Non-Goals
- No version bump.
- No workflow or code changes.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- README.md
- docs/npm-publishing.md
- .agentloop/backlog.md
- .agentloop/dogfood-log.md
- .agentloop/research/interview-cycle-087.md

## Files or Areas Not to Touch
- src/
- package.json
- CHANGELOG.md

## Acceptance Criteria
- README includes a current GitHub tarball npx command for agentloop version/init.
- Docs still say npm latest is 0.1.1 and do not claim npm availability for 0.22.0.
- Publishing docs explain the tarball fallback and when to remove it.

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
Revert the docs commit if npm publishes 0.22.0 before this guidance is useful.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
