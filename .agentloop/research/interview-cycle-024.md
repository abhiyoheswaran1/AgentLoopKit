# Interview Cycle 24

Internal simulated feedback. Do not present this as real user research.

## Context

`agentloop task list` is implemented and pushed to `main`, with CI passing on commit `c3fb160`. `package.json` still reports `0.4.0`, but `v0.4.0` already exists as the active task lifecycle release. Releasing task-list behavior under the same version would make npm, tags, and source history disagree.

## Personas interviewed

- Founder / Product Lead
- Principal Engineer
- Open Source Maintainer
- Security Reviewer
- AI-Skeptical Senior Engineer

## Feedback summary

The strongest signal is release integrity. New CLI behavior needs a new version, and the release notes must be explicit that npm publishing remains blocked until npm accepts either trusted publishing or local authenticated publish.

## Raw simulated feedback

### Founder / Product Lead

- Liked: task discovery strengthens the active-task workflow.
- Confused: `0.4.0` already means active task lifecycle, so using it again weakens trust.
- Needs before using it: a clean `0.5.0` release story.
- Would recommend/star it if: releases map clearly to user-visible commands.
- Would abandon it if: npm and GitHub show conflicting contents for the same version.

### Principal Engineer

- Liked: the feature diff is already verified and CI passed.
- Confused: package metadata did not move after a new command landed.
- Needs before using it: version bump, changelog update, pack smoke test.
- Would recommend/star it if: the release process stays boring.
- Would abandon it if: release tags point to different contents than package tarballs.

### Open Source Maintainer

- Liked: the changelog already has an unreleased task-list entry.
- Confused: readers need to know which GitHub release contains the feature.
- Needs before using it: GitHub release notes and README status update.
- Would recommend/star it if: installation and release status are transparent.
- Would abandon it if: npm availability is overstated.

### Security Reviewer

- Liked: no postinstall, telemetry, or hidden publish behavior changed.
- Confused: publish automation still fails at npm authorization.
- Needs before using it: dry-run evidence and explicit npm-pending notes.
- Would recommend/star it if: the release does not hide auth failure.
- Would abandon it if: the tool silently tries to publish without verification.

### AI-Skeptical Senior Engineer

- Liked: task list is a concrete command, not methodology copy.
- Confused: why release metadata lags behavior.
- Needs before using it: proof from tests and a deterministic tarball smoke.
- Would recommend/star it if: the version history is auditable.
- Would abandon it if: the project keeps adding features without release hygiene.

## Product council debate

- Abhi: Ship a clean `0.5.0`; task list is a real user-facing command.
- Maya: Version alignment matters more than squeezing more features into the same release.
- Elias: Release notes should lead with `task list` and repeat npm status.
- Nora: README quickstart already includes the command; version needs to catch up.
- Samir: Do not claim npm availability unless `npm view` confirms it.
- Lina: Agents benefit from list, set, status, verify, handoff as a complete loop.
- Tom: A clean semver bump is basic trust.
- Rachel: Teams evaluating this need predictable release artifacts.

## Decision

Prepare `agentloopkit@0.5.0` for the task-list command, verify locally, create a GitHub release with attached tarball, and attempt npm publish only after package checks pass. Keep npm-pending notes if the registry rejects publish authorization.

## Non-decisions

- Do not add more product behavior in this release.
- Do not create cloud, dashboard, team, or telemetry features.
- Do not delete older GitHub releases.
- Do not claim npm `0.5.0` availability until the registry shows it.

## Resulting tasks

- Bump package metadata to `0.5.0`.
- Move the task-list changelog entry from `Unreleased` to `0.5.0`.
- Update README, final handoff, launch checklist, and dogfood log with release status.
- Run full local verification, pack, tarball smoke, and npm dry-run.
- Commit, push, verify CI, create `v0.5.0` GitHub release, and document npm publish outcome.

## Success criteria

- `agentloop version` reports `0.5.0`.
- `agentloop task list` works from the packed tarball.
- GitHub release `v0.5.0` points at the verified commit.
- npm status is documented honestly.
