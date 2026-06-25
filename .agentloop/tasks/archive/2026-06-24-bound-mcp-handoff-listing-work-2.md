# Bound MCP handoff listing work

- Created date: 2026-06-24
- Task type: feature
- Status: done

## Problem Statement
The read-only MCP handoff tools list recent `.agentloop/handoffs/*.md` files and hydrate their headings for summaries.
The current flow can still read handoff content after candidate discovery without a single safe open/stat boundary, which
leaves unnecessary work on large evidence folders and a small symlink/time-of-check-time-of-use risk if local files change
between listing and reading.

## Desired Outcome
MCP handoff listing stays bounded, newest-first, read-only, and symlink-safe. It should skip unsafe or disappearing handoff
files without failing the whole tool, preserve current response fields, and keep `agentloop_latest_handoff` strict when the
latest file itself is unsafe or missing.

## Constraints
- Keep changes scoped to MCP handoff list/latest behavior and focused tests.
- Preserve existing MCP response fields and tool names.
- Do not mutate, rewrite, or delete handoff files.
- Do not broaden scans outside the configured `.agentloop/handoffs/` directory.

## Non-Goals
- Do not redesign artifact inventory or handoff storage.
- Do not change CLI `handoff` write behavior.
- Do not add release or version metadata.

## Assumptions
- MCP handoff summaries only need a bounded newest-first list.
- Unsafe handoff files should be ignored in listing, while explicit latest-handoff reads should fail if the selected latest file is unsafe.

## Likely Files or Areas
- `src/core/mcp-tools.ts`
- `tests/mcp-tools.test.ts`
- `docs/mcp.md` if user-facing behavior needs clarification

## Files or Areas Not to Touch
- package version, changelog, release channels, publish workflows

## Acceptance Criteria
- `agentloop_list_handoffs` hydrates at most the bounded recent candidate set and does not read every handoff file in large evidence folders.
- `agentloop_list_handoffs` skips symlinked, oversized, invalid, or disappearing handoff Markdown files without failing the whole list.
- `agentloop_latest_handoff` keeps strict behavior for the selected latest file and does not follow symlinks.
- MCP tests cover bounded summary hydration and unsafe handoff file handling.
- Typecheck, build, dogfood, gates, and focused MCP tests pass.

## Verification Commands
- `npm run test:unit -- tests/markdown-format.test.ts tests/prepare-pr.test.ts tests/mcp-tools.test.ts`
- `npm run typecheck`
- `npm run build`
- `npm run dogfood`

## Post-Verification Gates
- `node dist/cli/index.js verify --task .agentloop/tasks/2026-06-24-bound-mcp-handoff-listing-work-2.md --task-commands --only-task-commands --progress --write-run --redact-paths`
- `node dist/cli/index.js ship --redact-paths`
- `node dist/cli/index.js prepare-pr --redact-paths`
- `node dist/cli/index.js check-gates --redact-paths`

## Implementation Plan
- Inspect current MCP handoff listing, latest-handoff, artifact safety helpers, and tests.
- Add failing tests for bounded hydration and unsafe handoff files.
- Implement a safe bounded handoff read helper that validates the file at read time.
- Update docs only if the public MCP behavior changes.
- Run bug, security, performance, dogfood, and evidence passes.

## Risk Notes
- Handoff listing is review evidence; skipping unsafe files must be transparent enough that reviewers can still inspect the latest strict handoff when needed.
- Pre-existing dirty non-evidence files before task creation: 59 total; examples: `.agentloop/README.md`, `.agentloop/agents/claude-code.md`, `.agentloop/agents/codex.md`, `.agentloop/agents/cursor.md`, `.agentloop/agents/gemini-cli.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert MCP handoff listing safety/bounds changes and focused tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
