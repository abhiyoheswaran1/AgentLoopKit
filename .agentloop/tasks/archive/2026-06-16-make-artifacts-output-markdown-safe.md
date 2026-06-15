# Make artifacts output Markdown-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement

agentloop artifacts output is frequently pasted into reviews and CI logs, but artifact titles, paths, statuses, run IDs, or stale-candidate paths with line breaks can split Markdown list items.

## Desired Outcome

Human-readable artifacts output renders dynamic values as single-line inline code while JSON output keeps raw values for scripts.

## Constraints

- Keep artifact discovery, filtering, stale preview semantics, and JSON output unchanged.
- Do not delete, prune, or rewrite artifact files.
- Do not change release metadata or package version.

## Non-Goals

- Do not sanitize every command in the CLI in this task.

## Assumptions

- Human-readable `artifacts` output is Markdown-like text that agents paste into reviews, CI logs, and handoffs.
- JSON output is the automation contract and should keep raw artifact values.
- Artifact discovery and stale-preview candidate selection are already covered by existing tests.

## Likely Files or Areas

- src/core/artifacts.ts
- src/core/markdown-format.ts
- tests/artifacts.test.ts
- docs/cli-reference.md

## Files or Areas Not to Touch

- Release metadata, package version, publish workflows, artifact discovery semantics, stale-preview filtering, and cleanup behavior.

## Acceptance Criteria

- artifacts Markdown output keeps artifact values containing line breaks on one Markdown list line.
- artifacts --stale Markdown output keeps stale candidate values containing line breaks on one Markdown list line.
- artifacts --json preserves raw artifact values.

## Verification Commands

- npm test -- tests/artifacts.test.ts
- npm test -- tests/artifacts.test.ts tests/cli-docs-drift.test.ts

## Post-Verification Gates

- npm run dogfood:strict
- npx --yes agentflight verify -- npm test -- tests/artifacts.test.ts
- npx --yes projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert `src/core/artifacts.ts` to use raw `inlineCode`, then remove the line-break regression tests and docs note.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
