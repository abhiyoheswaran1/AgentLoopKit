# Record v0.22.0 release status

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
GitHub release v0.22.0 is public, but npm still serves 0.1.1 after the release-triggered publish workflow failed at authorization. Public docs still imply v0.22.0 is only prepared or pending.

## Desired Outcome
README, publishing docs, launch checklist, roadmap, final handoff, product backlog, and dogfood log state that v0.22.0 is public on GitHub, npm remains at 0.1.1, and the next npm publish should catch up directly to 0.22.0 rather than backfilling stale intermediate versions.

## Constraints
- Do not publish to npm from this shell unless npm authentication is proven.
- Do not change runtime CLI behavior for a documentation-only release-status update.
- Use exact release evidence from git, npm, GitHub release metadata, and GitHub Actions.

## Non-Goals
- No version bump beyond 0.22.0.
- No new feature work.
- No npm publish attempt without valid account authorization.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- README.md
- docs/npm-publishing.md
- docs/launch-checklist.md
- ROADMAP.md
- FINAL_HANDOFF.md
- .agentloop/backlog.md
- .agentloop/dogfood-log.md
- .agentloop/research/interview-cycle-086.md

## Files or Areas Not to Touch
- src/
- package.json
- CHANGELOG.md

## Acceptance Criteria
- GitHub v0.22.0 release URL, asset name, and SHA-256 are documented.
- Publish workflow run 27251450540 failure at npm authorization is documented.
- npm latest remains 0.1.1 in public release docs.
- Docs explain why npm should jump once to 0.22.0 and then return to normal semver.

## Verification Commands
- npx pnpm@10.12.1 check:links
- git diff --check
- node scripts/prepublish-check.mjs
- npx projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the documentation and internal artifact commit if the release evidence is later proven inaccurate.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
