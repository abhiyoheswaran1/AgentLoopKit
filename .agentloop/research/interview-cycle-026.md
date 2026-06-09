# Interview Cycle 26

Internal simulated feedback. Do not present this as real user research.

## Context

`agentloop task show` is implemented and pushed to `main`, with CI passing on commit `5456fc8`. `package.json` still reports `0.5.0`, but `v0.5.0` already exists as the task-list release. The task-show command needs a new release candidate so source, tags, and package metadata stay aligned.

## Personas interviewed

- Founder / Product Lead
- Principal Engineer
- Open Source Maintainer
- Security Reviewer
- Developer Experience Designer

## Feedback summary

The strongest signal is release clarity. `task show` completes the list/show/set task-contract preflight loop, so it should ship as a distinct release with npm status documented honestly.

## Raw simulated feedback

### Founder / Product Lead

- Liked: task show makes the task-contract wedge easier to explain.
- Confused: the new command is not reflected in a release version.
- Needs before using it: a clean `0.6.0` GitHub release.
- Would recommend/star it if: the command sequence is visible in release notes.
- Would abandon it if: GitHub and package versions drift.

### Principal Engineer

- Liked: the behavior is small and well tested.
- Confused: release metadata lags the code again after a new command.
- Needs before using it: version bump, changelog, tarball smoke.
- Would recommend/star it if: tests and package contents are reproducible.
- Would abandon it if: one tag refers to multiple behavior sets.

### Open Source Maintainer

- Liked: docs now explain list, show, set.
- Confused: npm latest remains behind GitHub releases.
- Needs before using it: release notes that separate GitHub availability from npm availability.
- Would recommend/star it if: users can download the tarball while npm is blocked.
- Would abandon it if: the README overstates npm status.

### Security Reviewer

- Liked: no publish scripts or telemetry changed.
- Confused: npm trusted publishing still needs external setup.
- Needs before using it: dry-run evidence and npm-pending notes.
- Would recommend/star it if: failed npm auth is recorded directly.
- Would abandon it if: publish failures are hidden.

### Developer Experience Designer

- Liked: list, show, set is a natural CLI flow.
- Confused: screenshots and docs mention source version, so they must not lag.
- Needs before using it: README current-source note updated.
- Would recommend/star it if: the release communicates the workflow in one sentence.
- Would abandon it if: command docs conflict.

## Product council debate

- Abhi: Release it as `0.6.0`; this is a user-facing command.
- Maya: Keep it metadata-only and verify the packed CLI.
- Elias: Make GitHub release notes explicit about npm still showing `0.1.1`.
- Nora: Lead release copy with the list/show/set loop.
- Samir: Record both GitHub and local npm auth outcomes if publish fails again.
- Lina: Agents now have a complete task-contract preflight.
- Tom: Version hygiene matters.
- Rachel: Teams evaluating the tool need predictable artifacts.

## Decision

Prepare `agentloopkit@0.6.0` for the task-show command, verify locally, create a GitHub release with attached tarball, and attempt npm publish only after package checks pass. Keep npm-pending notes if the registry rejects authorization.

## Non-decisions

- Do not add more product behavior in this release.
- Do not delete older GitHub releases.
- Do not claim npm `0.6.0` availability until the registry shows it.
- Do not create cloud, dashboard, team, or telemetry features.

## Resulting tasks

- Bump package metadata to `0.6.0`.
- Move the task-show changelog entry from `Unreleased` to `0.6.0`.
- Update README, launch checklist, npm publishing docs, final handoff, backlog, and dogfood log.
- Run local verification, pack, tarball smoke, and npm dry-run.
- Commit, push, verify CI, create `v0.6.0` GitHub release, and document npm publish outcome.

## Success criteria

- `agentloop version` reports `0.6.0`.
- `agentloop task show` works from the packed tarball.
- GitHub release `v0.6.0` points at the verified commit.
- npm status is documented honestly.
