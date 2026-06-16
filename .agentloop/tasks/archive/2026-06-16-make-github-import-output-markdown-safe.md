# Make github import output Markdown-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
agentloop github import prints local output paths and imported issue or pull request titles into human output. Those values can come from local JSON and may contain line breaks that split Markdown when agents paste import evidence into handoffs or reviews.

## Desired Outcome
Human github import output renders dynamic import status, output path, issue title, and pull request title values on one Markdown line while JSON output, local-only import behavior, bounded metadata normalization, dry-run behavior, and file writes remain unchanged.

## Constraints
- Human-readable `github import` output only.
- Preserve JSON output shape and raw values.
- Preserve local-only import behavior, bounded metadata normalization, dry-run behavior, write behavior, exit codes, and no-token/no-network boundary.
- Keep public docs user-facing.
- Do not cut, tag, publish, or release a version.

## Non-Goals
- Do not change `.agentloop/github/context.json` schema.
- Do not add GitHub API calls, token handling, posting, or network behavior.
- Do not change metadata normalization limits.
- Do not change `github import` validation, dry-run semantics, or write semantics.

## Assumptions
- Imported issue and pull request titles can come from untrusted local JSON.
- Agents may paste `github import` output into handoffs, PR comments, or release notes.
- JSON consumers need exact stored values, not display-escaped values.

## Likely Files or Areas
- `src/cli/commands/github.ts`
- `tests/github-metadata.test.ts`
- `docs/cli-reference.md`
- `docs/github-metadata.md`
- `CHANGELOG.md`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`

## Files or Areas Not to Touch
- `package.json` version field
- GitHub workflows
- npm, GHCR, or MCP release metadata

## Acceptance Criteria
- Human `github import` output renders status, dry-run, write flag, output path, issue title, and pull request title values on one Markdown line.
- JSON output keeps raw values unchanged.
- Local-only import behavior, metadata bounding, dry-run behavior, file writes, exit codes, and no-token/no-network boundary remain unchanged.
- Regression tests fail before the fix and pass after it.
- Public docs mention human-vs-JSON output behavior without internal notes.

## Verification Commands
- `npm test -- tests/github-metadata.test.ts`
- `npm test -- tests/github-metadata.test.ts tests/cli-docs-drift.test.ts`
- `npm run typecheck`
- `npm run lint`
- `npm run check:public-docs`
- `npm run check:links`
- `npm run build`
- `npm test`

## Post-Verification Gates
- `npx --no-install tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-16-make-github-import-output-markdown-safe.md --task-commands --only-task-commands --write-run --redact-paths --progress`
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
