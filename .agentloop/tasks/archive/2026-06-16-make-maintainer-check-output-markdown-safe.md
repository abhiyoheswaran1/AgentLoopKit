# Make maintainer-check output Markdown-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
maintainer-check is copied into maintainer reviews, but dynamic task, metadata, path, and contributor-request values can contain line breaks that split Markdown list items or prose.

## Desired Outcome
Human maintainer-check output renders dynamic check values and contributor requests on one Markdown line while JSON, check semantics, exit codes, and redaction behavior remain unchanged.

## Constraints
- Treat this as a human-output rendering hardening bugfix only.
- Preserve JSON output, check IDs, check statuses, path fields, redaction behavior, and exit codes.
- Keep maintainer-check read-only.
- Keep public docs user-facing; do not mention internal release timing or unpublished versions.

## Non-Goals
- Do not add GitHub API calls, token handling, PR posting, network access, or file writes.
- Do not change maintainer-check risk detection, stale-handoff detection, or overall status rules.
- Do not change check IDs or JSON shape.
- Do not cut a version or publish a release.

## Assumptions
- Maintainers paste human `agentloop maintainer-check` output into GitHub PRs, issues, or CI logs.
- Dynamic values can come from task contracts, local GitHub metadata errors, changed-file evidence, artifact paths, and contributor request text.
- JSON output should remain exact for scripts.

## Likely Files or Areas
- `src/cli/commands/maintainer-check.ts`
- `tests/maintainer-check.test.ts`
- `docs/cli-reference.md`
- `CHANGELOG.md`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`

## Files or Areas Not to Touch
- npm package version, release tags, and publish workflows.
- GitHub Actions release workflows.
- Maintainer-check core semantics unless needed to preserve existing behavior.
- Generated distribution files under `dist/`.

## Acceptance Criteria
- Human `maintainer-check` output renders dynamic check status, check id, message, path, checklist item, and contributor-request values on one Markdown line.
- JSON output keeps raw dynamic values unchanged.
- Redaction behavior and fail/warn/pass exit semantics remain unchanged.
- Regression tests fail before the fix and pass after the fix.

## Verification Commands
- npm test -- tests/maintainer-check.test.ts
- npm test -- tests/maintainer-check.test.ts tests/cli-docs-drift.test.ts
- npm run typecheck
- npm run lint
- npm run check:public-docs
- npm run check:links
- npm run build
- npm test

## Post-Verification Gates
- npx --no-install tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-16-make-maintainer-check-output-markdown-safe.md --task-commands --only-task-commands --write-run --redact-paths --progress
- npx --no-install tsx src/cli/index.ts ship --redact-paths
- npx --no-install tsx src/cli/index.ts handoff --write-run --redact-paths
- npm run dogfood:strict

## Implementation Plan
- Add failing CLI tests for newline-containing maintainer-check messages, paths, and contributor requests.
- Reuse existing Markdown helpers rather than adding a new formatting convention.
- Update concise docs and changelog notes after behavior is implemented.

## Risk Notes
- Maintainer-check is used for trust decisions; formatting changes must not alter check semantics.
- Over-sanitizing JSON would break automation, so only human Markdown should change.

## Rollback Notes
Revert the maintainer-check renderer and regression-test changes if output becomes harder to read or breaks current documented behavior.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
