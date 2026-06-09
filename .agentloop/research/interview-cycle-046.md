# Interview Cycle 46

Internal simulated feedback. Do not present this as real user research.

## Context

`agentloop create-task --json` is implemented on `main`, covered by Vitest, pushed in commit `174716b`, and GitHub CI passed. The latest public GitHub release is `v0.11.0`, which packages task archiving. npm still serves `0.1.1` while publishing authorization is repaired.

## Personas interviewed

- Indie Hacker Using Codex
- Claude Code Power User
- Open Source Maintainer
- Developer Experience Designer
- Security Reviewer

## Feedback summary

The strongest signal is release coherence. The README should show the current source version and test count, and the GitHub release should explain that `create-task --json` removes brittle parsing for agents. Public docs must not imply npm has the new version until `npm view` proves it.

## Raw simulated feedback

### Indie Hacker Using Codex

- What they liked: `create-task --json` lets an automation script create a task and read the resulting path without scraping terminal prose.
- What confused them: The README source note still says `0.11.0`.
- What they would need before using it: One release page that says what changed and how to get the tarball.
- What would make them recommend/star it: A short terminal demo that shows the task lifecycle, including JSON-friendly creation.
- What would make them abandon it: A package claim that fails when they run `npx agentloopkit`.

### Claude Code Power User

- What they liked: JSON output aligns with task list, show, set, status, current, clear, and archive.
- What confused them: Whether the human output changed.
- What they would need before using it: Release notes that say the default success line remains unchanged.
- What would make them recommend/star it: Stable output shape with no new dependency.
- What would make them abandon it: Any hidden state write during task creation.

### Open Source Maintainer

- What they liked: The feature is small, testable, and easy to explain.
- What confused them: The release trail has npm-pending versions.
- What they would need before using it: Changelog and final handoff that separate GitHub release readiness from npm registry status.
- What would make them recommend/star it: A verified tarball and clear release notes.
- What would make them abandon it: Fabricated npm availability or inflated user claims.

### Developer Experience Designer

- What they liked: The README images make the workflow concrete.
- What confused them: The screenshots still show 67 tests while the project now has 68.
- What they would need before using it: Refresh the Playwright screenshots and VHS demo from the committed sources.
- What would make them recommend/star it: The first-screen README remains command-led, not methodology-heavy.
- What would make them abandon it: More copy without a clearer action path.

### Security Reviewer

- What they liked: The release does not need credentials, secrets, env reads, postinstall scripts, or network calls beyond explicit release commands.
- What confused them: Whether we will try to bypass npm authorization.
- What they would need before using it: Pack, dry-run, tarball smoke test, registry proof, and honest GitHub notes.
- What would make them recommend/star it: Repeated proof that the package is boring and transparent.
- What would make them abandon it: Any attempt to publish with hidden credentials or modify npm settings from the repo.

## Product council debate

- Abhi: Ship `0.12.0` as a small release candidate; CLI consistency is part of the product wedge.
- Maya: Keep the release scoped. No new behavior unless a verification check exposes a bug.
- Elias: Update changelog, final handoff, launch checklist, and release notes. Keep npm status visible.
- Nora: Refresh screenshots and the VHS demo so the README matches the current source version and 68 tests.
- Samir: Use pack, dry-run, tarball smoke test, and registry proof. Do not touch credentials.
- Lina: Agents will use this immediately in autonomous task setup.
- Tom: Lead with deterministic JSON, not AI claims.
- Rachel: Teams need stable automation surfaces, but no team dashboard belongs in this release.

## Decision

Prepare a `0.12.0` GitHub release candidate for `create-task --json`. Update package metadata, changelog, README copy, Playwright screenshots, VHS demo assets, dogfood records, and final handoff. Pack and dry-run locally, smoke test the packed CLI, push to GitHub, tag, and create a GitHub release with a tarball asset. Keep npm status explicit.

## Non-decisions

- Do not add a new CLI feature in this release cycle.
- Do not redesign task contracts.
- Do not change npm settings or credentials from the repo.
- Do not claim npm `0.12.0` availability until the registry proves it.

## Resulting tasks

- Bump package metadata to `0.12.0`.
- Add a `0.12.0` changelog entry.
- Update README source status and visual assets.
- Refresh Playwright screenshots and VHS demo.
- Run local verification, pack, dry-run, and packed CLI smoke tests.
- Update dogfood log, final handoff, launch checklist, and npm publishing docs.
- Commit, push, watch CI, tag, and create a GitHub release with notes and tarball.

## Success criteria

- README visuals and text show the current source state.
- The packed CLI reports `0.12.0`.
- Local verification, pack, dry-run, and packed smoke tests pass.
- GitHub CI passes after push.
- GitHub release notes state the actual npm status.
