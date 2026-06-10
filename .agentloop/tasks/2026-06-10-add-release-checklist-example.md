# Add release-checklist example

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
Maintainers need a copyable example for preparing a GitHub release while npm still serves an older version, without backfilling stale npm versions or creating confusing package metadata.

## Desired Outcome
The repo includes a release-checklist workflow doc and example artifacts that explain how to verify, document, and hand off a GitHub release when npm publish is blocked.

## Constraints
- Docs and examples only.
- Do not change package metadata, tags, releases, or npm publish state.
- Do not run npm publish or gh release create.

## Non-Goals
- Do not automate release creation.
- Do not change GitHub Actions workflows.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- docs/release-checklist-example.md
- examples/release-checklist
- docs/launch-checklist.md
- docs/npm-publishing.md
- README.md

## Files or Areas Not to Touch
- package.json
- CHANGELOG.md
- .github/workflows
- src/core
- src/cli

## Acceptance Criteria
- Docs explain a maintainer workflow for GitHub release readiness while npm is blocked.
- Example folder includes README, sample task, sample verification report, and sample release handoff.
- Docs clearly say not to backfill stale npm versions from current main.

## Verification Commands
- npx pnpm@10.12.1 check:links
- git diff --check
- npx projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Remove release-checklist docs and example folder and revert docs links.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
