# Show git context during init

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement
AgentLoopKit is repo-level, but first-run init output does not tell users whether the target directory is inside a Git work tree.

## Desired Outcome
agentloop init reports Git detection in human and JSON output without refusing non-Git folders.

## Constraints
- Do not require Git for normal init
- Keep local-only mode Git requirement unchanged
- Do not change package version or release artifacts

## Non-Goals
- Do not add prompts or interactive setup
- Do not scan remote Git providers

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/init.ts
- src/cli/commands/init.ts
- tests/init.test.ts
- README.md
- docs/getting-started.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- InitResult exposes whether the target is inside a Git work tree
- Human init output prints Git: detected or Git: not detected
- JSON dry-run output includes the Git context
- Tests cover Git and non-Git targets

## Verification Commands
- npx pnpm@10.12.1 test tests/init.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the init Git metadata/output changes, the init tests, and the matching README/getting-started/changelog updates.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
