# Remove tracked macOS metadata files

- Created date: 2026-06-10
- Task type: bugfix
- Status: blocked

## Problem Statement
The repository scan showed macOS `.DS_Store` files under docs, and the initial hypothesis was that they were tracked source files.

## Desired Outcome
Confirm whether `.DS_Store` files are tracked and avoid unnecessary product changes if the repository already ignores them.

## Constraints
- Do not change package version or release artifacts
- Keep this cleanup scoped to repo hygiene

## Non-Goals
- Do not rewrite docs or generated assets

## Assumptions
- None recorded yet.

## Likely Files or Areas
- .gitignore
- tests/repo-hygiene.test.ts
- docs/.DS_Store
- docs/assets/.DS_Store

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Confirm whether `.DS_Store` files are tracked.
- Confirm whether `.gitignore` ignores `.DS_Store`.
- Record the investigation result.

## Verification Commands
- npx pnpm@10.12.1 test tests/repo-hygiene.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
No committed product change was made for this investigation.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.

## Investigation Result
The files exist only as ignored local Finder metadata. `git ls-files "*DS_Store"` returned no tracked files, and `.gitignore` already includes `.DS_Store`. No source change is warranted for this hypothesis.
