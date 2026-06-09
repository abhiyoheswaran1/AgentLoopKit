# Add README launch visuals

- Created date: 2026-06-09
- Task type: docs
- Status: proposed

## Problem Statement

The GitHub README explains AgentLoopKit clearly but lacks visual proof. The npm package is live, so the launch page should show the workflow, verification evidence, and CLI behavior without looking like a generic AI wrapper.

## Desired Outcome

Add polished README screenshots and a terminal GIF generated with Playwright and VHS, update launch docs, and cut a follow-up release so the npm README includes the stronger launch presentation.

## Constraints

- Keep the product local-first and npm-first.
- Do not add a frontend app, SaaS, telemetry, backend, or external API.
- Use generated assets that future maintainers can reproduce.
- Keep package install behavior boring and transparent.

## Non-Goals

- Do not create a hosted marketing site.
- Do not add image-generation dependencies to the CLI.
- Do not claim real user feedback from simulated product-panel work.

## Assumptions

- README images can use absolute raw GitHub URLs so npm can render them without shipping screenshots in the package tarball.
- A patch release is appropriate because this changes docs, metadata, and release workflow safety, not CLI behavior.

## Likely Files or Areas

- `README.md`
- `CHANGELOG.md`
- `package.json`
- `.github/workflows/publish.yml`
- `docs/assets/readme/`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`
- `.agentloop/research/`

## Files or Areas Not to Touch

- CLI command behavior unless verification exposes a release blocker.
- Template content unrelated to README assets.
- npm credentials, env files, or local auth state.

## Acceptance Criteria

- README shows a workflow screenshot, terminal GIF, and verification screenshot.
- Asset source files and regeneration instructions are committed.
- VHS and Playwright are used to generate assets.
- `agentloopkit@0.1.1` is ready to publish after checks.
- Product-panel cycle 004 records the simulated decision support.
- Tests, typecheck, build, projscan, pack, and live npm smoke pass.

## Verification Commands

- `npx pnpm@10.12.1 lint`
- `npx pnpm@10.12.1 typecheck`
- `npx pnpm@10.12.1 test`
- `npx pnpm@10.12.1 build`
- `npx projscan doctor --format markdown`
- `npx pnpm@10.12.1 pack`
- `npm publish --access public --dry-run`
- `npx --yes agentloopkit version`

## Implementation Plan

- Add reproducible README asset sources.
- Render screenshots with Playwright and a CLI GIF with VHS.
- Embed assets in the README with clear alt text.
- Bump package version to `0.1.1` and update changelog.
- Update internal product-panel and dogfood records.
- Verify, publish, tag, and create GitHub release notes.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the README asset commit and reset `package.json` to the previous version if the follow-up release is not published. If `0.1.1` is published and needs to be superseded, ship `0.1.2` with corrected assets or README links.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
