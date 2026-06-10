# Add AgentLoopKit npm-status self check

- Created date: 2026-06-10
- Task type: bugfix
- Status: done

## Problem Statement
agentloop npm-status defaults to the current folder package. In a release smoke temp folder, it checks a fixture package such as agentloopkit-release instead of the published agentloopkit package.

## Desired Outcome
Maintainers can run agentloop npm-status --agentloopkit from any directory to check the published agentloopkit package against the CLI package version.

## Constraints
- Keep the existing local-package default for general package checks.
- Do not publish, bump versions, create tags, or call release workflows.

## Non-Goals
- Do not change npm publishing automation in this task.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/npm-status.ts
- src/cli/commands/npm-status.ts
- tests/npm-status.test.ts
- docs/npm-status.md
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- npm-status supports --agentloopkit and checks packageName agentloopkit.
- --agentloopkit uses the running AgentLoopKit package version when localVersion is not provided.
- --agentloopkit can be combined with --registry-json for deterministic tests.
- Docs show release smoke usage from any directory.

## Verification Commands
- npx pnpm@10.12.1 test tests/npm-status.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build

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
