# Show Git target context in status

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement
agentloop status is the main read-only command agents use before working, but it only shows branch and commit. After init and doctor gained Git root and subdirectory context, status should expose the same target signal so agents can tell whether the current harness is at the repo root or a subdirectory.

## Desired Outcome
agentloop status human and JSON output include Git root and target-is-root context when inside a Git repository. Subdirectory targets show a warning line in Markdown while keeping the command read-only.

## Constraints
- Keep status read-only.
- Reuse existing Git helper behavior and output style.
- Do not change next-action rules, active task selection, release metadata, or package version.

## Non-Goals
- Do not retarget AgentLoopKit files to the Git root.
- Do not add prompts or command execution.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/status.ts
- tests/status.test.ts
- README.md
- docs/status.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- status --json includes git.root and git.targetIsRoot.
- status Markdown from a Git subdirectory includes Git root, Git target, and subdirectory warning.
- status Markdown from a Git root does not include the subdirectory warning.

## Verification Commands
- npx --yes pnpm@10.12.1 test tests/status.test.ts
- npx --yes pnpm@10.12.1 typecheck
- npx --yes pnpm@10.12.1 lint

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert status Git-context fields/output, tests, and docs for this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
