# Show Git target context in doctor

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement
agentloop init now shows Git root and warns when the target is a Git subdirectory, but agentloop doctor still reports setup health without showing whether the current directory is the Git root. Users who run doctor after setup need the same read-only context.

## Desired Outcome
agentloop doctor human and JSON output include Git repository status, Git root, and whether the current directory is the Git root. If the target is a Git subdirectory, human output warns that AgentLoopKit files live in the current directory, not the Git root.

## Constraints
- Keep doctor read-only.
- Reuse existing Git helpers where possible.
- Do not change init behavior, generated files, config schema, release metadata, or package version.

## Non-Goals
- Do not retarget AgentLoopKit files to the Git root.
- Do not add prompts or interactive confirmation.
- Do not add a new command.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/doctor.ts
- src/cli/commands/doctor.ts
- tests/doctor.test.ts
- README.md
- docs/getting-started.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- doctor --json includes git.isRepository, git.root, and git.targetIsRoot.
- doctor human output from a nested package includes Git root, Git target, and the subdirectory warning.
- doctor human output from a Git root does not include the subdirectory warning.

## Verification Commands
- npx --yes pnpm@10.12.1 test tests/doctor.test.ts
- npx --yes pnpm@10.12.1 typecheck
- npx --yes pnpm@10.12.1 lint

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert doctor Git-context fields/output, tests, and docs for this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
