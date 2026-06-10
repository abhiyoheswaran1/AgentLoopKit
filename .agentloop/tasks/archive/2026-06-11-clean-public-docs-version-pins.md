# Clean public docs version pins

- Created date: 2026-06-11
- Task type: docs
- Status: done

## Problem Statement
Public docs and examples still contain stale pinned AgentLoopKit versions and committed macOS metadata, which makes the unreleased main branch look sloppy and time-sensitive before the planned 0.28.0 batch release.

## Desired Outcome
Normal user-facing install examples use @latest or <version> placeholders, historical release evidence remains intact, and .DS_Store files are removed from the repository.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- docs/github-actions.md
- examples/github-actions/README.md
- examples/gitlab-ci/README.md
- examples/buildkite/README.md
- .gitignore

## Files or Areas Not to Touch
- package.json
- CHANGELOG.md

## Acceptance Criteria
- No stale normal-usage pins remain in public CI examples
- Historical release records remain untouched
- .DS_Store files are ignored and not tracked

## Verification Commands
- npx --yes pnpm@10.12.1 check:links
- npx --yes projscan doctor --format markdown
- git diff --check

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the docs and ignore-file cleanup commit

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
