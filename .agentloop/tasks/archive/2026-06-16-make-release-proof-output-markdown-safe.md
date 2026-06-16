# Make release-proof output Markdown-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
release-proof Markdown is copied into release handoffs, but dynamic package metadata, channel messages, tags, commits, and next actions can contain line breaks that split Markdown list items.

## Desired Outcome
Human release-proof output renders dynamic release proof values as single-line inline code while JSON preserves raw values and channel semantics remain unchanged.

## Constraints
- Keep the change local to human-readable Markdown/terminal formatting.
- Preserve raw JSON values for automation.
- Preserve release-proof channel semantics, network behavior, capture-file behavior, exit codes, and strict-mode behavior.

## Non-Goals
- Do not change release channels, registry URLs, package metadata, versioning, release workflows, or publish behavior.
- Do not add live GitHub/npm/GHCR/MCP API calls beyond the existing release-proof implementation.
- Do not sanitize authored prose outside dynamic inline values.

## Assumptions
- Release-proof human output is copied into release handoffs, PR comments, and release evidence notes.
- Dynamic metadata and captured registry error strings can contain line breaks even when normal package metadata does not.

## Likely Files or Areas
- `src/core/release-proof.ts`
- `tests/release-proof.test.ts`
- `docs/cli-reference.md`
- `docs/release-proof.md`
- `CHANGELOG.md`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`

## Files or Areas Not to Touch
- `package.json` version metadata
- release workflows
- npm/GitHub/GHCR/MCP publishing configuration
- public registry credentials or environment files

## Acceptance Criteria
- Human `release-proof` Markdown renders package metadata, git tag, commit, checked channels, channel names, channel messages, and next-action command on one Markdown line when values contain line breaks.
- `checkReleaseProof()` JSON result preserves raw package metadata and channel messages.
- Existing release-proof pass/warn/strict/channel logic remains unchanged.
- Tests prove the old behavior fails before the formatter change and passes after.
- Public docs mention the Markdown-safe human output behavior without internal release chatter.

## Verification Commands
- `npm test -- tests/release-proof.test.ts`
- `npm test -- tests/release-proof.test.ts tests/cli-docs-drift.test.ts`
- `npm run typecheck`
- `npm run lint`
- `npm run check:public-docs`
- `npm run build`

## Post-Verification Gates
- `npm run dogfood:strict`
- `npx --yes agentflight verify -- npm test -- tests/release-proof.test.ts`
- `npx --yes projscan doctor --format markdown`

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the release-proof formatter import and the associated regression/docs updates. No migration or generated user files are required.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
