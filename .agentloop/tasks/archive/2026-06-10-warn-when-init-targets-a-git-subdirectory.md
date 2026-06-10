# Warn when init targets a Git subdirectory

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement
agentloop init now reports the Git root and whether the target is a subdirectory, but the human output still does not explicitly say that generated files will be written into the current folder rather than the Git root.

## Desired Outcome
When init runs inside a Git repository subdirectory, human output includes a clear warning that AgentLoopKit will write files into the current directory, not the Git root. JSON output remains stable and uses the existing git.targetIsRoot field.

## Constraints
- Keep init behavior unchanged; do not retarget writes to the Git root.
- Keep the warning local and deterministic; no prompts, no new dependencies, no filesystem scans.

## Non-Goals
- Do not add interactive confirmation.
- Do not change config generation paths.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/init.ts
- tests/init.test.ts
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Human init dry-run output from a nested package contains a subdirectory warning.
- Human init output at the Git root does not show the warning.
- JSON output remains valid and keeps git.targetIsRoot.

## Verification Commands
- npx --yes pnpm@10.12.1 test tests/init.test.ts
- npx --yes pnpm@10.12.1 typecheck
- npx --yes pnpm@10.12.1 lint

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the CLI warning, tests, and docs for this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
