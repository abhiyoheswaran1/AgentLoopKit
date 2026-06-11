# Reject install-agent symlink escapes

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
install-agent writes agent instruction files and updates AGENTS.md, but those paths can be symlinked outside the repo.

## Desired Outcome
install-agent refuses agent instruction and AGENTS.md writes that resolve outside the current repo and returns parseable JSON errors.

## Constraints
- Do not bump versions or publish releases.
- Keep the command local-only and dependency-free.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Regression tests fail first for symlinked .agentloop/agents and AGENTS.md paths.
- install-agent --json returns OUTPUT_PATH_INVALID and writes no outside file.

## Verification Commands
- npx pnpm@10.12.1 test tests/agent-installation.test.ts
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
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
