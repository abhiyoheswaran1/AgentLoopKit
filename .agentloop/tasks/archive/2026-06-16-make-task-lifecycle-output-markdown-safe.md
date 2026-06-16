# Make task lifecycle output Markdown-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
Task lifecycle commands print user-authored task titles, statuses, paths, diagnostics, and archive confirmations into human Markdown-like output. Newlines in those dynamic values can split list items or status lines when agents paste the output into handoffs or CI logs.

## Desired Outcome
Human task lifecycle output renders dynamic values on one Markdown line while JSON output, task state changes, archive behavior, diagnostics, exit codes, and file writes remain unchanged.

## Constraints
- Treat this as a human-output rendering hardening bugfix only.
- Preserve JSON output, task state changes, active-task selection, archive behavior, diagnostics, and exit codes.
- Keep task commands local and deterministic.
- Keep public docs user-facing; do not mention internal release timing or unpublished versions.

## Non-Goals
- Do not change task contract parsing, task status semantics, archive rules, or active-task fallback behavior.
- Do not change generated task contract content.
- Do not add network calls, GitHub API calls, posting, telemetry, or credential reads.
- Do not cut a version or publish a release.

## Assumptions
- Agents and maintainers paste `agentloop task`, `task list`, `task done`, `task archive`, and `task doctor` output into handoffs or review comments.
- Task titles are user-authored and may contain unusual whitespace or Markdown-sensitive characters.
- JSON output should remain exact for scripts.

## Likely Files or Areas
- `src/cli/commands/task.ts`
- `tests/task-state.test.ts`
- `docs/cli-reference.md`
- `CHANGELOG.md`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`

## Files or Areas Not to Touch
- npm package version, release tags, and publish workflows.
- GitHub Actions release workflows.
- Task contract generation templates unless a failing test proves they are needed.
- Generated distribution files under `dist/`.

## Acceptance Criteria
- Human task lifecycle output renders dynamic task title, status, path, diagnostic message, diagnostic command, diagnostic section, and recommendation values on one Markdown line.
- JSON output keeps raw dynamic values unchanged.
- Task state changes, task archive behavior, task doctor diagnostics, and exit codes remain unchanged.
- Regression tests fail before the fix and pass after the fix.

## Verification Commands
- npm test -- tests/task-state.test.ts
- npm test -- tests/task-state.test.ts tests/cli-docs-drift.test.ts
- npm run typecheck
- npm run lint
- npm run check:public-docs
- npm run check:links
- npm run build
- npm test

## Post-Verification Gates
- npx --no-install tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-16-make-task-lifecycle-output-markdown-safe.md --task-commands --only-task-commands --write-run --redact-paths --progress
- npx --no-install tsx src/cli/index.ts ship --redact-paths
- npx --no-install tsx src/cli/index.ts handoff --write-run --redact-paths
- npm run dogfood:strict

## Implementation Plan
- Add failing CLI tests for newline-containing task titles and task doctor diagnostics.
- Reuse the existing single-line Markdown helper rather than adding a new formatter.
- Update concise docs and changelog notes after behavior is implemented.

## Risk Notes
- Task commands are core dogfood workflow; formatting changes must not alter state transitions.
- Over-sanitizing JSON would break automation, so only human output should change.

## Rollback Notes
Revert the task command formatter and regression-test changes if output becomes harder to read or breaks current documented behavior.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
