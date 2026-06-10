# Avoid stale pinned versions in user-facing distribution docs

- Created date: 2026-06-11
- Task type: docs
- Status: done

## Problem Statement
User-facing docs include hard-coded current package versions in normal usage examples. Those pins become stale immediately after the next release and make the public docs look behind even when the package is current.

## Desired Outcome
User-facing MCP and distribution docs avoid hard-coded current package versions where @latest or matching-release wording is clearer.

## Constraints
- Do not bump package version or publish anything.
- Do not rewrite historical release evidence.

## Non-Goals
- Do not edit historical release logs or evidence sections.
- Do not change release workflows or package metadata.

## Assumptions
- `@latest` is clearer for first-time user examples, while `<version>` is clearer where maintainers should pin a release.

## Likely Files or Areas
- docs/mcp.md
- docs/distribution-channels.md
- README.md

## Files or Areas Not to Touch
- Historical release status entries in `docs/npm-publishing.md`, `docs/launch-checklist.md`, and `docs/release-status.md`.

## Acceptance Criteria
- README remains free of internal release-chatter and unsupported Homebrew claims.
- docs/mcp.md and docs/distribution-channels.md do not hard-code 0.27.0 for normal user commands.
- Historical release logs can keep exact versions where they are evidence.

## Verification Commands
- npx --yes pnpm@10.12.1 check:links
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the docs wording changes for this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
