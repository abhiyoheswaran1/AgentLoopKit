# Make release-check output Markdown-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement

agentloop release-check output is pasted into release PRs and CI logs, but package metadata, branch names, check messages, paths, or next-action commands with line breaks can split Markdown list items.

## Desired Outcome

Human-readable release-check output renders dynamic values as single-line inline code while JSON output keeps raw values for scripts.

## Constraints

- Keep release readiness checks, strict-mode exit codes, redact-path behavior, and JSON output unchanged.
- Do not change package version, release workflows, publish behavior, or release metadata.
- Do not add network calls, token reads, or command execution.

## Non-Goals

- Do not sanitize every release command in this task.

## Assumptions

- Human-readable `release-check` output is Markdown-like text that maintainers paste into release PRs, issue comments, and CI logs.
- JSON output is the automation contract and should keep raw release metadata and check messages.
- Release readiness logic and strict-mode exit behavior are already covered by existing tests.

## Likely Files or Areas

- src/core/release-check.ts
- src/core/markdown-format.ts
- tests/release-check.test.ts
- docs/cli-reference.md

## Files or Areas Not to Touch

- Release metadata, package version, publish workflows, release readiness logic, strict-mode exit codes, registry commands, and JSON output shape.

## Acceptance Criteria

- release-check Markdown output keeps package/check values containing line breaks on one Markdown list line.
- release-check Markdown output keeps next-action commands containing line breaks on one Markdown line.
- release-check --json preserves raw values.

## Verification Commands

- npm test -- tests/release-check.test.ts
- npm test -- tests/release-check.test.ts tests/cli-docs-drift.test.ts

## Post-Verification Gates

- npm run dogfood:strict
- npx --yes agentflight verify -- npm test -- tests/release-check.test.ts
- npx --yes projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert `src/core/release-check.ts` to use raw `inlineCode`, then remove the line-break regression test and docs note.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
