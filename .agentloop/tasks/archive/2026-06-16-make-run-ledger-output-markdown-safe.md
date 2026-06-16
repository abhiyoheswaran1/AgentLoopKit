# Make run ledger output Markdown-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
Run ledger commands print run ids, command names, file paths, and intent reasons into human output. File arguments or ledger metadata with line breaks can split Markdown list items when agents paste runs or intent output into handoffs.

## Desired Outcome
Human runs, show-run, and intent output renders dynamic run and file-intent values on one Markdown line while JSON output, run discovery, ledger reading, file intent matching, exit codes, and file writes remain unchanged.

## Constraints
- Treat this as a human-output rendering hardening bugfix only.
- Preserve JSON output, run discovery, ledger read/write behavior, file intent matching, exit codes, and run metadata.
- Keep run-ledger commands local and deterministic.
- Keep public docs user-facing; do not mention internal release timing or unpublished versions.

## Non-Goals
- Do not change run-ledger schemas, run IDs, metadata files, intent matching rules, or write-run behavior.
- Do not change `ship`, `verify`, or `handoff` run creation semantics.
- Do not add network calls, GitHub API calls, posting, telemetry, or credential reads.
- Do not cut a version or publish a release.

## Assumptions
- Agents paste `agentloop runs`, `agentloop show-run`, and `agentloop intent <file>` output into handoffs and review comments.
- File arguments and ledger metadata can contain unusual whitespace even if normal generated run IDs are timestamp-like.
- JSON output should remain exact for scripts.

## Likely Files or Areas
- `src/cli/commands/runs.ts`
- `tests/runs.test.ts`
- `docs/cli-reference.md`
- `CHANGELOG.md`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`

## Files or Areas Not to Touch
- npm package version, release tags, and publish workflows.
- GitHub Actions release workflows.
- Run-ledger core schemas unless a failing test proves they are needed.
- Generated distribution files under `dist/`.

## Acceptance Criteria
- Human `runs`, `show-run`, and `intent` output renders dynamic run id, command, status, file path, and intent reason values on one Markdown line.
- JSON output keeps raw dynamic values unchanged.
- Run discovery, run reading, file intent matching, and missing-run/missing-intent exit behavior remain unchanged.
- Regression tests fail before the fix and pass after the fix.

## Verification Commands
- npm test -- tests/runs.test.ts
- npm test -- tests/runs.test.ts tests/cli-docs-drift.test.ts
- npm run typecheck
- npm run lint
- npm run check:public-docs
- npm run check:links
- npm run build
- npm test

## Post-Verification Gates
- npx --no-install tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-16-make-run-ledger-output-markdown-safe.md --task-commands --only-task-commands --write-run --redact-paths --progress
- npx --no-install tsx src/cli/index.ts ship --redact-paths
- npx --no-install tsx src/cli/index.ts handoff --write-run --redact-paths
- npm run dogfood:strict

## Implementation Plan
- Add failing CLI tests for newline-containing intent file paths and ledger-derived reason text.
- Reuse the existing single-line Markdown helper rather than adding a new formatter.
- Update concise docs and changelog notes after behavior is implemented.

## Risk Notes
- Run-ledger output helps reviewers reconstruct intent; formatting changes must not hide or rewrite evidence in JSON.
- Over-sanitizing JSON would break automation, so only human output should change.

## Rollback Notes
Revert the run-ledger formatter and regression-test changes if output becomes harder to read or breaks current documented behavior.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
