# Support redacted handoff output

- Created date: 2026-06-15
- Task type: bugfix
- Status: done

## Problem Statement
`agentloop handoff --redact-paths` fails with `error: unknown option '--redact-paths'`, even though handoff and summarize output is commonly copied into PRs, issues, and public CI logs. The flag is already supported by nearby review-readiness commands, so this inconsistency makes the public-output safety model harder to use.

## Desired Outcome
`agentloop summarize` and `agentloop handoff` accept `--redact-paths`, redact local absolute roots from generated reviewer Markdown, and keep default non-redacted behavior stable for existing scripts.

## Constraints
- Keep the change local-first and deterministic.
- Do not change default summary or handoff output unless `--redact-paths` is passed.
- Do not bump package version or cut a release for this task.
- Do not introduce new dependencies.

## Non-Goals
- Do not redesign PR summaries.
- Do not add network calls, GitHub posting, telemetry, or token access.
- Do not change release-channel behavior.

## Assumptions
- Redacting the current AgentLoop root is enough for this bugfix; repo-relative changed-file paths should remain visible for review.

## Likely Files or Areas
- `src/cli/commands/summarize.ts`
- `src/core/pr-summary.ts`
- `tests/pr-summary.test.ts`
- README and PR-summary CLI docs

## Files or Areas Not to Touch
- Package version and release notes for a published release.
- npm/GitHub release automation.

## Acceptance Criteria
- `agentloop handoff --redact-paths` exits successfully.
- `agentloop summarize --redact-paths` exits successfully.
- Written handoff Markdown replaces the local git root with `[git-root]` when an absolute root appears in reviewer evidence.
- Default `summarize` and `handoff` behavior remains compatible when `--redact-paths` is not used.
- Public docs mention `summarize` and `handoff` in redaction guidance.
- `agentloop verify --task-commands` accepts task verification commands written as Markdown inline code, for example ``- `npm test` ``.

## Verification Commands
- `npm test -- tests/pr-summary.test.ts`
- `npm test -- tests/verification.test.ts`
- `npm run test:unit`
- `npm run typecheck`
- `npm run check:public-docs`
- `npm run build`

## Post-Verification Gates
- `npm run dogfood:strict`
- `npx --yes agentflight doctor`
- `npx --yes projscan doctor --format markdown`

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.
- Main risk is over-redacting useful repo-relative evidence; keep changed-file paths readable.
- Second risk is docs drift where public docs claim a flag not accepted by the CLI; keep CLI reference and README aligned.

## Rollback Notes
Revert the CLI option additions, `summarizeRepository` redaction option, related regression tests, and docs/changelog lines.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
