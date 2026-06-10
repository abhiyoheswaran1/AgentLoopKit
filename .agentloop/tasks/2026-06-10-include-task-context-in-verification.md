# Include task context in verification reports

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement

`agentloop verify --task <path>` accepts a task path but current verification reports do not include that task context.

## Desired Outcome

Verification reports generated with `--task` include a task context section that helps reviewers connect command results to the task contract.

## Constraints

- Do not change which verification commands run.
- Do not make task context required.
- Do not fail verification only because the task file is missing.
- Keep task parsing simple and deterministic.
- Do not read `.env`-style files passed through `--task`.
- Do not add dependencies.

## Non-Goals

- No task database.
- No semantic task analysis.
- No mutation of the task contract.

## Assumptions

- Task contracts follow the generated Markdown shape with title, task type, and status lines.

## Likely Files or Areas

- `src/core/verification.ts`
- `src/cli/commands/verify.ts`
- `tests/verification.test.ts`
- `README.md`
- `docs/verification-reports.md`

## Files or Areas Not to Touch

- npm publishing workflow
- package version

## Acceptance Criteria

- `agentloop verify --task <path>` includes task path, title, task type, and status when the file is readable.
- Missing task files are reported as unavailable task context without changing verification command status.
- `.env`-style task paths are reported as unavailable without reading or printing their contents.
- `agentloop verify` without `--task` keeps the current report shape.
- Tests cover core and CLI wiring.

## Verification Commands

- npx pnpm@10.12.1 test tests/verification.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 check:links
- npx projscan doctor --format markdown

## Implementation Plan

- Add failing tests for task context rendering and CLI option wiring.
- Add a task-context option to verification core.
- Pass `--task` from the CLI command.
- Update docs and dogfood evidence.

## Risk Notes

- Missing task files must not mask failing verification commands.

## Rollback Notes

Revert verification core, CLI wiring, tests, and docs.

## Handoff Requirements

- Include tests run.
- Include report behavior changes.
- Include rollback notes.
