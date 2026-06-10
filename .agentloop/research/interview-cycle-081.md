# Interview Cycle 81

## Context

GitHub release `v0.20.0` is public, npm still serves `0.1.1`, and `main` now contains two unreleased changes: `agentloop next` and the prepublish metadata guard. The guard correctly blocks publishing current `main` as `0.20.0`. To keep GitHub/source metadata honest, the next release from `main` should be `0.21.0`.

This cycle is internal simulated feedback for product judgment. It is not real user research.

## Personas interviewed

- Founder / Product Lead
- Open Source Maintainer
- Security Reviewer
- Power User / Agentic Engineer
- Skeptical Senior Developer

## Feedback summary

The strongest signal was to stop accumulating unreleased work on a stale package version. `0.21.0` is a normal semver step after `0.20.0`, not another arbitrary jump. npm may still lag until authentication is fixed, but GitHub release metadata should match current source.

During implementation, dogfooding also exposed a release-note usability bug: `release-notes --version <version>` collided with the CLI's global version flag. The release should include a non-conflicting explicit release-version option before tagging.

## Raw simulated feedback

### Founder / Product Lead

- Liked: `agentloop next` improves the core loop.
- Confused by: current `main` saying `0.20.0` while the changelog has unreleased entries.
- Needs before use: a clear `0.21.0` release that explains the new command and release guard.
- Would recommend/star it if: the launch page and releases stay current.
- Would abandon it if: version history looks random.

### Open Source Maintainer

- Liked: the prepublish guard now fails closed.
- Confused by: whether contributors should publish `0.20.0` or `0.21.0`.
- Needs before use: a matching package version, changelog section, GitHub tag, and release note.
- Would recommend/star it if: the next release is normal semver.
- Would abandon it if: release notes do not match package contents.

### Security Reviewer

- Liked: current `main` cannot accidentally publish stale metadata.
- Confused by: whether release prep resets `Unreleased` before publish.
- Needs before use: prepublish dry-run evidence after the version bump.
- Would recommend/star it if: `npm publish --dry-run` passes only after the changelog is versioned.
- Would abandon it if: the guard is bypassed instead of satisfied.

### Power User / Agentic Engineer

- Liked: `agentloop next` helps agents recover after context resets.
- Confused by: whether the command is in the latest release.
- Needs before use: release notes that call out `next` and stale-report handling.
- Would recommend/star it if: the CLI examples show the new command.
- Would abandon it if: npm/GitHub instructions are stale.

### Skeptical Senior Developer

- Liked: the project found and fixed a real release-process bug.
- Confused by: the npm lag.
- Needs before use: direct wording that npm auth is still the blocker.
- Would recommend/star it if: the project does not pretend npm publish happened.
- Would abandon it if: docs claim availability that npm does not prove.

## Product council debate

- Abhi: "Cut 0.21.0. It is the honest version for current main."
- Maya: "Do not add more release automation. Prepare metadata, verify, tag."
- Elias: "Release notes should explain that npm still needs auth."
- Nora: "The README should not sound like 0.20.0 is current source after this."
- Samir: "Let the prepublish guard pass by doing release prep, not by weakening it."
- Lina: "The release should feature `agentloop next` because agents will use it immediately."
- Tom: "Normal semver from 0.20 to 0.21 is easy to understand."
- Rachel: "This makes the open-source core look maintained even before paid features."

## Decision

Prepare `0.21.0` from current `main`, move unreleased changelog entries into a versioned section, reset `Unreleased`, refresh README assets, run package preflight, and create a GitHub release. Do not claim npm is published unless the registry proves it.

## Non-decisions

- Do not publish npm from this shell while `npm whoami` fails.
- Do not backfill old npm versions.
- Do not remove the prepublish guard.
- Do not build a release dashboard.

## Resulting tasks

- Bump package metadata to `0.21.0`.
- Update changelog, README, npm publishing docs, launch checklist, roadmap, and final handoff.
- Refresh the README terminal demo source and generated GIF.
- Generate release notes with AgentLoopKit.
- Fix the release-note explicit version flag and cover it with a regression test.
- Verify, pack, dry-run publish, smoke test, commit, push, and create the GitHub release.

## Success criteria

- `package.json` reports `0.21.0`.
- `CHANGELOG.md` has `0.21.0` and an empty `Unreleased`.
- `node scripts/prepublish-check.mjs` passes.
- `agentloop release-notes --release-version 0.21.0 --json` reports version `0.21.0`.
- `npm publish --access public --dry-run` passes.
- GitHub release `v0.21.0` is public with notes and tarball.
- npm registry status is recorded honestly.
