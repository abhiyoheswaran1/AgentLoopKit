# Record v0.21.0 release status

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement

GitHub release `v0.21.0` is public, but the release-triggered npm Publish workflow failed at npm authorization.

## Desired Outcome

Public docs and internal handoff files state the GitHub release URL, tarball digest, workflow result, and current npm registry status without claiming npm availability.

## Constraints

- Do not retry npm publish from this shell.
- Do not claim npm has `0.21.0` unless `npm view` proves it.
- Keep this as documentation/status work only.

## Non-Goals

- Do not change CLI behavior.
- Do not create another release version.
- Do not delete or recreate the GitHub release.

## Assumptions

- npm authentication or package permissions still need repair outside the repo.

## Likely Files or Areas

- README.md
- docs/npm-publishing.md
- docs/launch-checklist.md
- ROADMAP.md
- FINAL_HANDOFF.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch

- src/
- tests/
- package.json

## Acceptance Criteria

- GitHub release `v0.21.0` is recorded as public.
- Publish workflow run `27249612803` is recorded as failing at npm authorization after package checks passed.
- npm registry proof is recorded.
- Docs say normal semver should resume after npm catches up.

## Verification Commands

- npm view agentloopkit version versions --json
- npx pnpm@10.12.1 check:links
- npx projscan doctor --format markdown

## Implementation Plan

- Inspect release and npm status.
- Update status docs and dogfood log.
- Run docs-focused verification.

## Risk Notes

- Main risk is overstating npm availability.

## Rollback Notes

Revert the status documentation commit.

## Handoff Requirements

- Include GitHub release URL.
- Include workflow run id and npm error category.
- Include npm registry proof.
