# Show Git target context in check-gates

- Created date: 2026-06-11
- Task type: feature
- Status: done

## Problem Statement
agentloop check-gates is the review-readiness command, but its git gate only reports whether the repo is inside Git and how many files changed. After init, doctor, and status gained Git root and subdirectory target context, check-gates should expose the same context before review.

## Desired Outcome
agentloop check-gates human and JSON output include Git root and whether the current directory is the Git root. Subdirectory targets produce a warning gate while keeping the command read-only.

## Constraints
- Keep check-gates read-only.
- Do not change gate strictness except for the new warning gate when the target is a Git subdirectory.
- Do not change release metadata, package version, or publish anything.

## Non-Goals
- Do not retarget AgentLoopKit files to the Git root.
- Do not add prompts or command execution.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/check-gates.ts
- tests/check-gates.test.ts
- README.md
- docs/check-gates.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- check-gates --json includes git.root and git.targetIsRoot.
- check-gates Markdown from a Git subdirectory includes Git root and a subdirectory warning gate.
- check-gates Markdown from a Git root does not include the subdirectory warning gate.

## Verification Commands
- npx --yes pnpm@10.12.1 test tests/check-gates.test.ts
- npx --yes pnpm@10.12.1 typecheck
- npx --yes pnpm@10.12.1 lint

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert check-gates Git-context fields/output, tests, and docs for this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
