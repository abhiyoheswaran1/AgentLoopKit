# Accept redacted task list output flag

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement
Agents regularly use task list to share task-state context, but task list rejects the common --redact-paths option even though its output is bounded task metadata and repo-relative paths.

## Desired Outcome
task list accepts --redact-paths in human and JSON modes while preserving read-only behavior, task selection semantics, and existing output values.

## Constraints
- Keep this limited to task list; do not add no-op redaction to task show because task contracts can contain arbitrary Markdown.
- Keep task list read-only and do not mutate active state or task files.
- Do not change task parsing, placeholder grouping, task ordering, status semantics, or JSON shape beyond accepting the option.
- Do not touch release, version, publish, registry, Marketplace, Scoop, or WinGet flows.
- Do not add dependencies, API calls, telemetry, or hidden network access.

## Non-Goals
- No release prep, version bump, tag, or publication.
- No broad task lifecycle redaction sweep beyond task list.
- No content redaction for arbitrary task contract Markdown.

## Assumptions
- task list paths are already repo-relative/display-safe, so --redact-paths should be output-neutral.

## Likely Files or Areas
- src/cli/commands/task.ts
- tests/task-state.test.ts
- README.md
- docs/cli-reference.md

## Files or Areas Not to Touch
- package.json
- package-lock.json
- .github/workflows

## Acceptance Criteria
- task list --help documents --redact-paths.
- task list and task list --json accept --redact-paths without changing output values or mutating task state.
- Focused task-state tests prove the flag behavior and existing task lifecycle tests remain green.

## Verification Commands
- npm test -- tests/task-state.test.ts
- npm run check:public-docs
- npx prettier --check src/cli/commands/task.ts tests/task-state.test.ts README.md docs/cli-reference.md

## Post-Verification Gates
- npx --no-install tsx src/cli/index.ts ship --redact-paths
- npx --no-install tsx src/cli/index.ts prepare-pr --write --redact-paths
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Public CLI option addition should remain backward-compatible and output-neutral for existing scripts.

## Rollback Notes
Remove the task list option, tests, and docs additions.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
