# Make release-notes output Markdown-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
Detailed and public release-notes Markdown is copied into release pages and PRs, but dynamic metadata, refs, paths, and evidence labels with line breaks can split Markdown list items.

## Desired Outcome
Human release-notes output renders dynamic release metadata and evidence values as single-line inline code while JSON preserves raw values and changelog prose remains unchanged.

## Constraints
- Keep the change local to `release-notes` human rendering and CLI wrapper output.
- Preserve JSON output exactly for scripts and release automation.
- Preserve changelog prose and public release-note body text as authored.
- Do not change git ref validation, release-note file writing rules, release workflows, publish workflows, registry metadata, or package version.

## Non-Goals
- Do not generate, publish, tag, or upload a release.
- Do not rewrite `CHANGELOG.md` content or normalize stored task/report/handoff metadata.
- Do not alter public mode scope beyond inline dynamic values that already use inline code.

## Assumptions
- Package metadata, local task paths, and explicit output paths can contain unusual characters in local fixtures even when real npm packages should not.
- Single-line inline code is the established rendering pattern for Markdown copied into PR comments, release drafts, and CI logs.

## Likely Files or Areas
- `src/core/release-notes.ts`
- `src/cli/commands/release-notes.ts`
- `tests/release-notes.test.ts`
- `docs/cli-reference.md`
- `docs/release-notes.md`
- `CHANGELOG.md`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`

## Files or Areas Not to Touch
- `package.json` version fields
- `.github/workflows/*`
- npm, GHCR, MCP Registry, or release metadata files

## Acceptance Criteria
- Human-readable detailed `agentloop release-notes` output keeps dynamic package metadata and AgentLoop evidence paths on one Markdown line when they contain line breaks.
- The `Release notes written:` console message keeps custom output paths on one Markdown line when they contain line breaks.
- `agentloop release-notes --json` preserves raw values for scripts.
- Existing backtick escaping behavior remains covered.
- Changelog prose remains unchanged.
- Public docs explain the shareable-output behavior without internal release chatter.

## Verification Commands
- `npm test -- tests/release-notes.test.ts`
- `npm test -- tests/release-notes.test.ts tests/cli-docs-drift.test.ts`
- `npm run typecheck`
- `npm run lint`
- `npm run check:public-docs`
- `npm run build`

## Post-Verification Gates
- `npm run check:links`
- `npm run dogfood:strict`
- `npx --yes agentflight verify -- npm test -- tests/release-notes.test.ts`
- `npx --yes projscan doctor --format markdown`

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Low behavior risk: rendering-only change for human Markdown.
- Main regression risk is changing JSON output or altering authored changelog prose. Tests must cover raw JSON values and keep existing release-note content checks green.

## Rollback Notes
- Revert the import changes in `src/core/release-notes.ts` and `src/cli/commands/release-notes.ts`, plus the related tests and docs.
- No generated user files, release tags, or registry state are involved.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
