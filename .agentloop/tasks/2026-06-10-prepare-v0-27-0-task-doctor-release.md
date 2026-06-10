# Prepare v0.27.0 task doctor release

- Created date: 2026-06-10
- Task type: release
- Status: in-progress

## Problem Statement
The task doctor diagnostics command is implemented on main but not released. Public package metadata, changelog, README examples, release assets, npm, GHCR, MCP registry metadata, and release-status docs need to stay aligned.

## Desired Outcome
AgentLoopKit v0.27.0 is released from a verified commit, npm latest reports 0.27.0, release artifacts are published, and post-release docs record the exact proof.

## Constraints
- Keep README user-facing; do not include internal release confusion or stale npm caveats.
- Use npm and GitHub trusted publishing flow; do not publish stale intermediate versions.
- Use AgentLoopKit dogfood evidence and projscan doctor before handoff.

## Non-Goals
- Do not change Homebrew positioning.
- Do not add new product features beyond release metadata.
- Do not publish manually if trusted publishing succeeds.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- package.json
- server.json
- action.yml
- CHANGELOG.md
- README.md
- docs/release-status.md
- docs/distribution-channels.md
- docs/npm-publishing.md
- docs/launch-checklist.md
- FINAL_HANDOFF.md
- ROADMAP.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- package.json, server metadata, and action defaults report 0.27.0.
- CHANGELOG moves unreleased task doctor entries into 0.27.0 and resets Unreleased.
- README and distribution docs use 0.27.0 for current pinned examples.
- local lint, typecheck, tests, build, markdown links, projscan doctor, release smoke, and npm dry-run pass.
- GitHub release v0.27.0 is published from the verified release commit.
- npm latest reports 0.27.0 after trusted publishing.

## Verification Commands
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 build
- npx pnpm@10.12.1 check:links
- npx --yes projscan doctor --format markdown
- npm run smoke:release
- npm publish --access public --dry-run

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
If the release fails before npm publish, delete the draft GitHub release or tag and keep package metadata unreleased on main. If npm publishes but a bug appears, ship a patch release rather than deleting the package.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
