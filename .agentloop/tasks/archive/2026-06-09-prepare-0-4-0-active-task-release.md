# Prepare 0.4.0 active task release

- Created date: 2026-06-09
- Task type: release
- Status: done

## Problem Statement
main contains the active task command after the v0.3.0 GitHub release, but package metadata still says 0.3.0.

## Desired Outcome
Prepare a verified 0.4.0 release candidate that packages the active task command and documents npm authorization status honestly.

## Constraints
- Do not claim npm 0.4.0 is published unless npm registry proves it.
- Do not paste OTPs, tokens, auth IDs, or npm private logs into docs.
- Keep release notes factual and npm-pending if authorization still fails.

## Non-Goals
- Do not build new product behavior in this release-prep task.

## Assumptions
- 0.4.0 is an appropriate pre-1.0 minor release because it adds a new task lifecycle command.

## Likely Files or Areas
- package.json
- CHANGELOG.md
- docs/npm-publishing.md
- docs/launch-checklist.md
- FINAL_HANDOFF.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch
- src/core/task-state.ts
- src/cli/commands/task.ts

## Acceptance Criteria
- package.json version is 0.4.0.
- CHANGELOG.md has a 0.4.0 section for the active task command.
- Docs and final handoff state that 0.4.0 is prepared and npm publishing remains authorization-gated until proven otherwise.

## Verification Commands
- git diff --check
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 build
- npx projscan doctor --format markdown
- npx pnpm@10.12.1 pack
- npm publish --access public --dry-run

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the version and release docs commit if 0.4.0 should not be released.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
