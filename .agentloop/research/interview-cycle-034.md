# Interview Cycle 34

Internal simulated feedback. Do not present this as real user research.

## Context

Since `v0.7.0`, AgentLoopKit added generated monorepo verification guidance, an actionable Monorepo doctor warning, and a local Markdown link checker that runs in CI. These are launch-quality improvements that should ship as a coherent `0.8.0` GitHub release.

## Personas interviewed

- Founder / Product Lead
- Principal Engineer
- Open Source Maintainer
- Security Reviewer
- Developer Experience Designer

## Feedback summary

The strongest signal is release hygiene. The new docs and doctor improvements should not stay as an indefinite `Unreleased` section while GitHub release tarballs are the main path for newer source.

## Raw simulated feedback

### Founder / Product Lead

- Liked: the product feels more trustworthy for teams and maintainers.
- Confused: the README source note still says `0.7.0`.
- Would need before using it: a `0.8.0` release that packages the launch polish.
- Would recommend/star it if: release notes explain the new trust checks.
- Would abandon it if: source, README, and tarball versions drift.

### Principal Engineer

- Liked: the changes are low-dependency and tested.
- Confused: package metadata still points to `0.7.0`.
- Would need before using it: full checks, pack, dry-run publish, and tarball smoke.
- Would recommend/star it if: the release process stays reproducible.
- Would abandon it if: a release hides npm authorization status.

### Open Source Maintainer

- Liked: CI now catches local Markdown link drift.
- Confused: npm remains behind GitHub releases.
- Would need before using it: release notes and publishing docs that say npm is pending.
- Would recommend/star it if: GitHub users can download the verified tarball.
- Would abandon it if: `npx` availability is overstated.

### Security Reviewer

- Liked: link checking makes no network calls.
- Confused: npm trusted publishing still needs npm-side configuration.
- Would need before using it: no token sharing, no credential shortcuts.
- Would recommend/star it if: publish failures remain explicit.
- Would abandon it if: the workflow weakens npm auth to ship faster.

### Developer Experience Designer

- Liked: `doctor` now gives a next step for monorepos.
- Confused: the VHS demo should match the current package version.
- Would need before using it: README demo regenerated from `0.8.0`.
- Would recommend/star it if: first-run docs and visuals stay current.
- Would abandon it if: screenshots or demos lag behind the release.

## Product council debate

- Abhi: Cut `0.8.0`; this is a coherent launch-quality release.
- Maya: Release metadata only. Do not add more features inside the bump.
- Elias: Include link checking and monorepo guidance in release notes.
- Nora: Update the VHS tape so the demo uses the current tarball.
- Samir: Attempt npm only through transparent trusted or local auth paths.
- Lina: Agents benefit from the new doctor warning immediately.
- Tom: Mention no workspace orchestration.
- Rachel: This strengthens team adoption without SaaS scope.

## Decision

Prepare `agentloopkit@0.8.0`, verify locally, push, wait for CI, create a GitHub release with tarball, then record npm publish results honestly.

## Non-decisions

- Do not add new product behavior during the release bump.
- Do not claim npm `0.8.0` availability until the registry proves it.
- Do not bypass npm authentication.
- Do not add cloud, telemetry, or a workspace runner.

## Resulting tasks

- Bump package metadata to `0.8.0`.
- Move `Unreleased` changelog notes into `0.8.0`.
- Update README source note and VHS tape.
- Regenerate README VHS demo.
- Update launch, publishing, final handoff, backlog, and dogfood records.
- Run full verification, pack, dry-run publish, and tarball smoke.

## Success criteria

- Source and packed CLI report `0.8.0`.
- Changelog has a `0.8.0` section.
- README demo tape uses `agentloopkit-0.8.0.tgz`.
- CI passes on the release commit.
- GitHub release `v0.8.0` is public with a tarball.
- npm status is documented from fresh publish attempts.
