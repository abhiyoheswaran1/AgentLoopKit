# Add JSON error output for invalid create-task output paths

- Created date: 2026-06-11
- Task type: feature
- Status: done

## Problem Statement
agentloop create-task --json returns structured success output and unsupported-type errors, but invalid --out paths still use the global human error path. Agents cannot parse whether the output path was outside the task directory or not Markdown.

## Desired Outcome
agentloop create-task --out <path> --json returns structured errors for outside-directory and non-Markdown output paths without writing task files.

## Constraints
- Keep default non-JSON error output human-readable.
- Do not change create-task path safety rules or generated task Markdown.
- Do not change package version or cut a release.

## Non-Goals
- Do not redesign create-task prompts or add task search.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/task-contract.ts
- src/cli/commands/create-task.ts
- tests/create-task.test.ts
- README.md
- docs/task-contracts.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Outside --out path with --json prints valid JSON to stdout and exits non-zero.
- Non-Markdown --out path with --json prints valid JSON to stdout and exits non-zero.
- Invalid --out paths write no task file.
- Default non-JSON invalid --out errors remain human-readable on stderr.

## Verification Commands
- npm test -- create-task
- npm run lint
- npm run typecheck
- npm test
- npm run check:links
- npm run build
- git diff --check
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the create-task output-path error type, create-task command JSON handling, tests, README, task-contract docs, changelog, and AgentLoop evidence files from this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
