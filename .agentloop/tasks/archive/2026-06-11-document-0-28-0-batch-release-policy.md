# Document 0.28.0 batch release policy

- Created date: 2026-06-11
- Task type: docs
- Status: done

## Problem Statement
The project has been cutting too many tiny release versions during active development. The maintainer wants unreleased work to accumulate and ship together as 0.28.0 when explicitly requested.

## Desired Outcome
Repo agent instructions and release docs tell future agents to keep developing without version bumps or releases until the maintainer asks to cut the 0.28.0 batch.

## Constraints
- Do not change package version.
- Do not publish npm, GitHub Releases, GHCR, or MCP Registry.
- Keep README user-facing and avoid internal release chatter there.

## Non-Goals
- Do not prepare the 0.28.0 release in this task.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- AGENTS.md
- AGENTLOOP.md
- docs/npm-publishing.md
- docs/release-status.md
- ROADMAP.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Future agents can find the no-version-spam rule in AGENTS.md.
- Release docs record that current main is accumulating unreleased 0.28.0 batch work.
- README remains free of internal release-process notes.

## Verification Commands
- npm run check:links
- npm run lint
- npm run typecheck
- npm test
- npm run build
- git diff --check
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
