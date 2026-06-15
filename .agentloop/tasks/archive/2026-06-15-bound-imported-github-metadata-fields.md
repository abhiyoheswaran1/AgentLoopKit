# Bound imported GitHub metadata fields

- Created date: 2026-06-15
- Task type: security-review
- Status: done

## Problem Statement

GitHub metadata import caps issue and PR body excerpts, but other untrusted fields such as titles, labels, URLs, authors, and branch names can remain arbitrarily large and make review-context or prepare-pr output noisy.

## Desired Outcome

Imported GitHub metadata remains optional/read-only while normalizing untrusted string fields to bounded, deterministic lengths before storing or rendering them.

## Constraints

- None recorded yet.

## Non-Goals

- None recorded yet.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/github-metadata.ts
- tests/github-metadata.test.ts
- docs/github-metadata.md

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- Issue and PR titles, states, URLs, authors, labels, and PR branch names are length-bounded during import and context reads.
- Label arrays are capped to a reviewable count.
- Existing normal GitHub metadata output is unchanged for short values.
- No GitHub API call, token read, env-file read, comment posting, ship scoring change, release, publish, tag, or package version change is added.

## Verification Commands

- npm test -- tests/github-metadata.test.ts tests/prepare-pr.test.ts tests/review-context.test.ts tests/maintainer-check.test.ts
- npm run typecheck
- npm run lint

## Post-Verification Gates

- npx --yes agentflight verify -- npm test -- tests/github-metadata.test.ts
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert `src/core/github-metadata.ts`, `tests/github-metadata.test.ts`, and `docs/github-metadata.md` to restore the previous import behavior. Existing `.agentloop/github/context.json` files remain local artifacts; users can re-import metadata after rollback if needed.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
