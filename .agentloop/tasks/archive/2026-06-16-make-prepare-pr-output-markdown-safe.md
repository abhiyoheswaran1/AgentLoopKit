# Make prepare-pr output Markdown-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
prepare-pr generates PR bodies and GitHub comments that maintainers paste into GitHub, but dynamic task, readiness, artifact, and GitHub metadata values can contain line breaks that split Markdown list items.

## Desired Outcome
PR body, GitHub-comment, and written-path output render dynamic inline values and list prose on one Markdown line while JSON, ship evidence reuse, scoring, and run-ledger semantics remain unchanged.

## Constraints
- Treat this as an output-rendering hardening bugfix only.
- Preserve raw JSON fields for scripts.
- Preserve ship evidence reuse, readiness scoring, gate behavior, run-ledger writes, and task selection.
- Keep public docs user-facing; do not mention internal release timing or unpublished versions.

## Non-Goals
- Do not add GitHub API calls, token handling, PR posting, or network access.
- Do not change review-readiness scoring.
- Do not redesign PR body structure beyond keeping dynamic values on one Markdown line.
- Do not cut a version or publish a release.

## Assumptions
- Maintainers paste `prepare-pr` output into GitHub PR bodies and comments.
- Dynamic values can come from task contracts, file paths, verification reports, ship evidence, and local GitHub metadata JSON.
- JSON output should keep raw values where possible because automation may depend on exact values.

## Likely Files or Areas
- `src/core/prepare-pr.ts`
- `src/cli/commands/prepare-pr.ts`
- `tests/prepare-pr.test.ts`
- `docs/cli-reference.md`
- `CHANGELOG.md`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`

## Files or Areas Not to Touch
- npm package version, release tags, and publish workflows.
- GitHub Actions release workflows.
- Public README unless command behavior changes require it.
- Generated distribution files under `dist/`.

## Acceptance Criteria
- `prepare-pr` PR bodies keep dynamic task title, summary, acceptance criteria, risk notes, rollback notes, readiness claims, verification paths, artifact paths, and imported GitHub metadata values on one Markdown line.
- `prepare-pr --github-comment` keeps dynamic score evidence, artifact paths, readiness claims, blockers, warnings, and next actions on one Markdown line.
- CLI written-path confirmation uses one-line inline code when the path contains line breaks.
- Existing JSON output, ship evidence reuse, scoring, run-ledger semantics, and changed-file grouping remain unchanged.
- Regression tests fail before the fix and pass after the fix.

## Verification Commands
- npm test -- tests/prepare-pr.test.ts
- npm test -- tests/prepare-pr.test.ts tests/cli-docs-drift.test.ts
- npm run typecheck
- npm run lint
- npm run check:public-docs
- npm run check:links
- npm run build
- npm test

## Post-Verification Gates
- npx --no-install tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-16-make-prepare-pr-output-markdown-safe.md --task-commands --only-task-commands --write-run --redact-paths --progress
- npx --no-install tsx src/cli/index.ts ship --redact-paths
- npx --no-install tsx src/cli/index.ts handoff --write-run --redact-paths
- npm run dogfood:strict

## Implementation Plan
- Add failing tests for newline-containing task/report/GitHub metadata values in `prepare-pr` output.
- Reuse existing Markdown-format helpers where possible.
- Add a prepare-pr-local single-line prose helper if list prose needs escaped line breaks rather than whitespace collapse.
- Update concise docs and changelog notes after behavior is implemented.

## Risk Notes
- PR-facing Markdown is part of user workflow; regressions could make copied PR bodies noisy.
- Over-sanitizing JSON would break scripts, so only human Markdown should change.
- GitHub metadata output already escapes Markdown syntax; the fix must preserve that while preventing list splitting.

## Rollback Notes
Revert the prepare-pr renderer and regression-test changes if the output becomes harder to read or breaks current documented behavior.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
