# Make ship output Markdown-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
ship reports and GitHub comments are copied into PRs, but dynamic task, gate, score, file, and artifact values can contain line breaks that split Markdown list items.

## Desired Outcome
Human ship report and ship GitHub-comment output render dynamic inline values on one Markdown line while JSON, scoring, gates, and run-ledger semantics remain unchanged.

## Constraints
- Keep the change local to human-readable `ship` Markdown and GitHub-comment rendering.
- Preserve JSON output, review-readiness scoring, gate semantics, run-ledger metadata, file writes, and exit behavior.
- Reuse the existing Markdown formatting helpers instead of inventing a new sanitizer.

## Non-Goals
- Do not change score weights, gate logic, task selection, verification execution, or run-ledger schema.
- Do not change `prepare-pr`, release commands, registry checks, publishing, or version metadata.
- Do not rewrite authored prose beyond dynamic inline values.

## Assumptions
- `ship` reports and GitHub comments are copied into PRs and CI-managed comments.
- Task titles, paths, gate messages, and artifact paths can contain unusual characters even when normal repos do not.

## Likely Files or Areas
- `src/core/ship.ts`
- `tests/ship.test.ts`
- `docs/cli-reference.md`
- `CHANGELOG.md`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`

## Files or Areas Not to Touch
- `package.json` version metadata
- release workflows
- run-ledger schema migrations
- verification command execution logic
- publish, registry, or GitHub token behavior

## Acceptance Criteria
- Human ship report output renders dynamic task title, task status, task path, verification status/path, handoff path, gate status/name/message, changed-file paths, and dimension reasons on one Markdown line when values contain line breaks.
- `ship --github-comment` renders dynamic task and artifact values on one Markdown line.
- `ship --json` keeps raw structured values and existing scoring/gate/run fields.
- Tests prove the current multiline behavior fails before the formatter change and passes after.
- Public docs mention the Markdown-safe human output behavior without internal release chatter.

## Verification Commands
- `npm test -- tests/ship.test.ts`
- `npm test -- tests/ship.test.ts tests/cli-docs-drift.test.ts`
- `npm run typecheck`
- `npm run lint`
- `npm run check:public-docs`
- `npm run build`

## Post-Verification Gates
- `npm run dogfood:strict`
- `npx --yes agentflight verify -- npm test -- tests/ship.test.ts`
- `npx --yes projscan doctor --format markdown`

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the `ship` formatter import and associated regression/docs updates. No migration or generated user file refresh is required.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
