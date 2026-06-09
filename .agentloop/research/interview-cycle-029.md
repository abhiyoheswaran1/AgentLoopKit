# Interview Cycle 29

Internal simulated feedback. Do not present this as real user research.

## Context

Monorepo doctor awareness landed on `main` after `v0.6.0`. The code is verified and CI passed on commit `458e9bd`, but package metadata still says `0.6.0`, which already points at the task-show release.

## Personas interviewed

- Founder / Product Lead
- Principal Engineer
- Open Source Maintainer
- Security Reviewer
- Developer Experience Designer

## Feedback summary

The strongest signal is version hygiene. A new doctor behavior should ship as `0.7.0` so GitHub release artifacts, changelog, package metadata, and README stay aligned.

## Raw simulated feedback

### Founder / Product Lead

- Liked: monorepo awareness helps teams and platform users.
- Confused: source now contains behavior not represented by the latest tag.
- Would need before using it: a clear GitHub release candidate.
- Would recommend/star it if: releases tell a coherent story.
- Would abandon it if: tags and README drift.

### Principal Engineer

- Liked: the feature is tested and schema-stable.
- Confused: `package.json` still reports an already-released version.
- Would need before using it: version bump, changelog, tarball smoke.
- Would recommend/star it if: release artifacts are reproducible.
- Would abandon it if: npm and GitHub state are overstated.

### Open Source Maintainer

- Liked: release notes can explain the warning-only behavior.
- Confused: npm latest is still behind, so the release must be honest.
- Would need before using it: GitHub tarball plus npm-pending notes.
- Would recommend/star it if: users can see exactly what changed.
- Would abandon it if: the README implies npm `0.7.0` exists before it does.

### Security Reviewer

- Liked: detection does not run package-manager commands or inspect secrets.
- Confused: npm trusted publishing still is external.
- Would need before using it: publish failure recorded directly if it recurs.
- Would recommend/star it if: release notes preserve trust.
- Would abandon it if: auth failures are hidden.

### Developer Experience Designer

- Liked: `doctor` now gives a better workspace-root cue.
- Confused: command docs need the current version line updated.
- Would need before using it: README and launch checklist aligned.
- Would recommend/star it if: next steps remain clear after a warning.
- Would abandon it if: warnings look like hard failures.

## Product council debate

- Abhi: Cut `0.7.0`; this is a user-visible trust feature.
- Maya: Keep it release metadata only. Do not add more behavior.
- Elias: Attach the tarball and say npm is still pending.
- Nora: Lead release notes with "doctor now warns on workspace markers."
- Samir: Record GitHub and local npm publish outcomes if attempted.
- Lina: Agents at monorepo roots benefit immediately from this warning.
- Tom: Do not call this full monorepo support.
- Rachel: This is a team-adoption improvement without platform scope creep.

## Decision

Prepare `agentloopkit@0.7.0` for monorepo doctor awareness, verify locally, push, wait for CI, create a GitHub release with tarball, and attempt npm publishing only through the same transparent paths.

## Non-decisions

- Do not implement per-package verification in this release.
- Do not change config schema.
- Do not add a `monorepo` project type.
- Do not claim npm `0.7.0` availability until the registry proves it.

## Resulting tasks

- Bump package metadata to `0.7.0`.
- Move the monorepo doctor changelog entry into `0.7.0`.
- Update README, launch checklist, npm publishing docs, final handoff, backlog, and dogfood log.
- Verify, pack, smoke the tarball, push, watch CI, create GitHub release, and record npm outcome.

## Success criteria

- `agentloop version` reports `0.7.0`.
- Packed `agentloop doctor --json` reports monorepo markers.
- GitHub release `v0.7.0` points at the verified commit.
- npm status is documented honestly.
