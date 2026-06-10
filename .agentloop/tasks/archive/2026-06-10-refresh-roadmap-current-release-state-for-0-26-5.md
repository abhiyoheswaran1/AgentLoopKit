# Refresh roadmap current release state for 0.26.5

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
ROADMAP.md still says the current GitHub, npm, GHCR, and MCP Registry release is 0.26.4 after 0.26.5 shipped.

## Desired Outcome
ROADMAP.md current state reflects 0.26.5 while historical release notes remain intact.

## Constraints
- Keep the change docs-only and scoped to stale current-state text.

## Non-Goals
- Do not rewrite historical release evidence or create another package release.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- ROADMAP.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- ROADMAP.md Current State lists v0.26.5, agentloopkit@0.26.5, and release channels for 0.26.5.
- A search for 0.26.4 in public docs only returns historical release evidence, not current-state claims.

## Verification Commands
- npx --yes pnpm@10.12.1 check:links
- git diff --check
- node dist/cli/index.js npm-status --expect-current
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the roadmap and dogfood-log changes.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
