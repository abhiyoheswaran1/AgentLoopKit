# Accept redacted GitHub import flag

- Created date: 2026-06-17
- Task type: bugfix
- Status: done

## Problem Statement

Agents following shareable-output habits can pass --redact-paths to local GitHub metadata import, but github import rejects the common flag even though its paths are already repo-relative and the command is local-only.

## Desired Outcome

github import accepts --redact-paths in human and JSON modes without changing import behavior, output shape, or safety guarantees.

## Constraints

- Keep `github import` local-only: no GitHub API calls, `gh` calls, token reads, or `.env` reads.
- Treat `--redact-paths` as an output-compatibility flag only; do not change normalized metadata, write behavior, or JSON schema.
- Keep output paths repo-relative and preserve current dry-run/write semantics.
- Keep changes focused on GitHub metadata import tests, command option parsing, and public command docs.

## Non-Goals

- No broader redaction framework changes.
- No GitHub posting, issue lookup, PR lookup, or metadata fetching.
- No release, version bump, package publish, GitHub Marketplace work, Scoop, WinGet, GHCR, or MCP Registry changes.

## Assumptions

- `github import` currently emits repo-relative output paths, so accepting `--redact-paths` should be output-neutral.
- Users and agents may pass the same shareable-output flag across read-only or local evidence commands.

## Likely Files or Areas

- src/cli/commands/github.ts
- tests/github-metadata.test.ts
- docs/cli-reference.md
- README.md

## Files or Areas Not to Touch

- package.json
- pnpm-lock.yaml
- .github/workflows/
- action.yml
- docs/designs/windows-package-managers.md

## Acceptance Criteria

- `agentloop github import --issue-json <file> --dry-run --redact-paths` succeeds in human mode.
- `agentloop github import --issue-json <file> --dry-run --json --redact-paths` succeeds and produces the same JSON as the same command without `--redact-paths`.
- `--redact-paths` appears in `agentloop github import --help`.
- Docs explain that `github import --redact-paths` is accepted for consistency and is output-neutral because metadata paths are already repo-relative.

## Verification Commands

- npm test -- tests/github-metadata.test.ts
- npx --no-install tsx src/cli/index.ts github import --help
- npm run check:public-docs
- npx prettier --check src/cli/commands/github.ts tests/github-metadata.test.ts docs/cli-reference.md README.md .agentloop/tasks/2026-06-17-accept-redacted-github-import-flag-2.md

## Post-Verification Gates

- npx --no-install tsx src/cli/index.ts ship --redact-paths
- npx --no-install tsx src/cli/index.ts prepare-pr --write --redact-paths
- npm run dogfood:strict

## Implementation Plan

- Add focused failing tests for human, JSON, and help behavior.
- Add a no-op `--redact-paths` option to `github import`.
- Update public docs with the compatibility note.
- Run the focused bug pass and task verification before handoff.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the `github import` option, regression tests, and docs note. Existing GitHub metadata import behavior should remain unchanged.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
