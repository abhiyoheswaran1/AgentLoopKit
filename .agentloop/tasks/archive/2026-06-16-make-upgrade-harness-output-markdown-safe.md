# Make upgrade-harness output Markdown-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
upgrade-harness prints target directories, manifest paths, file paths, statuses, template versions, and suggested target files into human output. Values containing line breaks can split Markdown when users paste upgrade guidance into issues, PRs, or agent handoffs.

## Desired Outcome
Human upgrade-harness output renders dynamic audit values on one Markdown line while JSON output, read-only behavior, stale-topic detection, suggestions, redaction, and exit codes remain unchanged.

## Constraints
- Human-readable `upgrade-harness` output only.
- Preserve JSON output shape and raw values.
- Preserve stale-topic detection, redaction, copy guidance, read-only behavior, exit codes, and no-write guarantee.
- Keep behavior local-only and deterministic.
- Keep public docs user-facing.

## Non-Goals
- Do not change template topic detection.
- Do not change upgrade suggestions or copyMarkdown content.
- Do not add write-mode upgrade automation.
- Do not cut, tag, publish, or release a version.

## Assumptions
- Agents and maintainers may paste `upgrade-harness` output into PRs, issues, handoffs, or review notes.
- Older repos may contain unusual paths or manifest data.
- JSON consumers need unmodified machine-readable values.

## Likely Files or Areas
- `src/cli/commands/upgrade-harness.ts`
- `tests/upgrade-harness.test.ts`
- `docs/cli-reference.md`
- `docs/upgrading-existing-repos.md`
- `CHANGELOG.md`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`

## Files or Areas Not to Touch
- `package.json` version field
- npm or GitHub release metadata
- External registry publishing configuration

## Acceptance Criteria
- Human `upgrade-harness` output renders dynamic status, target directory, manifest path/status, template version values, file paths/statuses, missing topics, and suggested files on one Markdown line.
- JSON output keeps raw values unchanged.
- Redaction, stale-topic detection, suggestion generation, copyMarkdown text, read-only/no-write behavior, and exit behavior remain unchanged.
- Regression tests fail before the fix and pass after it.
- Public docs mention human-vs-JSON output behavior without internal notes.

## Verification Commands
- `npm test -- tests/upgrade-harness.test.ts`
- `npm test -- tests/upgrade-harness.test.ts tests/cli-docs-drift.test.ts`
- `npm run typecheck`
- `npm run lint`
- `npm run check:public-docs`
- `npm run check:links`
- `npm run build`
- `npm test`

## Post-Verification Gates
- `npx --no-install tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-16-make-upgrade-harness-output-markdown-safe.md --task-commands --only-task-commands --write-run --redact-paths --progress`
- `npx --no-install tsx src/cli/index.ts handoff --write-run --redact-paths`
- `npx --no-install tsx src/cli/index.ts ship --redact-paths`
- `npm run dogfood:strict`

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the formatter import/output changes, tests, and docs for this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
