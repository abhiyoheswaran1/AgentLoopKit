# Make ci-summary output Markdown-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
Human-readable ci-summary output is pasted into PR comments and CI logs, but allowlisted CI metadata or artifact headings containing line breaks can split Markdown list items.

## Desired Outcome
Human ci-summary output renders dynamic values as single-line inline code while JSON preserves raw values.

## Constraints
- Keep the change local to `ci-summary` human rendering and CLI wrapper output.
- Preserve JSON output exactly for scripts and CI consumers.
- Do not change CI provider detection, artifact lookup, gate semantics, write behavior, release behavior, or package version.

## Non-Goals
- Do not add new CI provider integrations.
- Do not call CI provider APIs or read arbitrary environment variables.
- Do not sanitize stored task/report/handoff metadata; only make human Markdown rendering safe.

## Assumptions
- CI provenance values are already normalized upstream, but local AgentLoop evidence paths can preserve unusual filenames.
- Single-line inline code is the existing project convention for Markdown that may be pasted into PR comments, issues, or CI logs.

## Likely Files or Areas
- `src/core/ci-summary.ts`
- `src/cli/commands/ci-summary.ts`
- `tests/ci-summary.test.ts`
- `docs/cli-reference.md`
- `CHANGELOG.md`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`

## Files or Areas Not to Touch
- `package.json` version fields
- Release workflows, publish workflows, and registry metadata
- CI provider detection semantics in `src/core/verification.ts`

## Acceptance Criteria
- Human-readable `agentloop ci-summary` Markdown keeps task evidence paths and gate-detail paths on one Markdown line when they contain line breaks.
- The `CI summary written:` console message keeps custom output paths on one Markdown line when they contain line breaks.
- `agentloop ci-summary --json` preserves raw task evidence values for scripts.
- Existing backtick escaping behavior remains covered.
- Public CLI docs describe the shareable-output behavior without internal release chatter.

## Verification Commands
- `npm test -- tests/ci-summary.test.ts`
- `npm test -- tests/ci-summary.test.ts tests/cli-docs-drift.test.ts`
- `npm run typecheck`
- `npm run lint`
- `npm run check:public-docs`
- `npm run build`

## Post-Verification Gates
- `npm run check:links`
- `npm run dogfood:strict`
- `npx --yes agentflight verify -- npm test -- tests/ci-summary.test.ts`
- `npx --yes projscan doctor --format markdown`

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Low behavior risk: rendering-only change for human Markdown.
- Main regression risk is changing JSON output or CI detection. Tests must prove JSON remains raw and existing CI metadata behavior still passes.

## Rollback Notes
- Revert the import changes in `src/core/ci-summary.ts` and `src/cli/commands/ci-summary.ts`, plus the related tests and docs.
- No generated user files or migrations are involved.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
