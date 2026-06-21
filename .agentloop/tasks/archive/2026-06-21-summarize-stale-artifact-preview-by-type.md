# Summarize stale artifact preview by type

- Created date: 2026-06-21
- Task type: feature
- Status: done

## Problem Statement
Dogfooding agentloop artifacts --stale --limit 5 in a long-running repo shows thousands of stale candidates but the bounded human preview can be dominated by one artifact type, so users cannot quickly understand the cleanup shape without JSON or multiple filters.

## Desired Outcome
The read-only stale artifact preview renders a compact candidate summary by artifact type before the bounded candidate list, while JSON remains deterministic and no cleanup automation is added.

## Constraints
- Keep artifacts --stale read-only: no writes, deletions, command execution, env reads, symlink traversal, release, tag, publish, or version bump.
- Preserve existing candidate selection, kept evidence semantics, type filters, limits, and JSON candidate data.
- Keep output bounded and Markdown-safe; use existing artifact type labels and local formatting helpers where possible.

## Non-Goals
- Do not add deletion, pruning, retention policies, or archive automation.
- Do not change stale candidate ordering or which evidence is kept.
- Do not change release-channel tasks or package metadata.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/artifacts.ts
- tests/artifacts.test.ts
- docs/cli-reference.md
- CHANGELOG.md
- DECISIONS.md
- .agentloop/backlog.md
- .agentloop/research/interview-cycle-172.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Human agentloop artifacts --stale --limit N output includes a compact summary of total stale candidates grouped by artifact type before the candidate list.
- When --type TYPE is used, the summary remains scoped to the filtered type and does not imply hidden cleanup of other types.
- JSON output continues to expose deterministic stale candidates and kept evidence without forcing consumers to parse human Markdown.

## Verification Commands
- npm test -- tests/artifacts.test.ts
- npm run typecheck
- npm run check:public-docs
- npm run check:links
- npx --no-install tsx src/cli/index.ts task doctor --redact-paths
- npx --yes projscan doctor --format markdown

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Pre-existing dirty non-evidence files from prior autonomous work remain in the working tree; keep this slice scoped to artifact preview summary behavior.
- Pre-existing dirty non-evidence files before task creation: 83 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Remove the stale-preview summary rendering/tests/docs and restore the previous stale artifacts human output.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
