# Interview Cycle 22

Internal simulated feedback. Do not present this as real user research.

## Context

Cycle 21 shipped `agentloop task set/current/clear` on `main` after GitHub release `v0.3.0`. Package metadata still reports `0.3.0`, while the code now contains unreleased CLI behavior. npm latest remains `0.1.1` because npm authorization/trusted publishing is not fixed.

## Personas interviewed

- Founder / Product Lead
- Principal Engineer
- Open Source Maintainer
- Security Reviewer
- Power User / Agentic Engineer

## Feedback summary

The strongest signal is release hygiene. Users and maintainers need source, package metadata, changelog, and GitHub release notes to agree. npm authorization remains external, but that should not leave `main` with unreleased behavior under the old package version.

## Raw simulated feedback

### Founder / Product Lead

- Liked: active task pinning makes the product easier to explain.
- Confused: `main` has new behavior but still says `0.3.0`.
- Needs before using it: a clean GitHub release candidate.
- Would recommend/star it if: releases are clear even when npm is blocked.
- Would abandon it if: versioning feels careless.

### Principal Engineer

- Liked: the active task command stayed small and local.
- Confused: release metadata has not caught up.
- Needs before using it: version, changelog, package tarball, and CI evidence match.
- Would recommend/star it if: package quality stays boring.
- Would abandon it if: release docs drift from code.

### Open Source Maintainer

- Liked: dogfood evidence is recorded.
- Confused: GitHub users can see the feature, npm users cannot.
- Needs before using it: release notes that say exactly what is available where.
- Would recommend/star it if: npm-pending state is honest.
- Would abandon it if: docs imply npm availability that is not real.

### Security Reviewer

- Liked: npm failures are documented without leaking secrets.
- Confused: another release can trigger another failed publish workflow.
- Needs before using it: clear npm-pending notes and no OTP/token handling.
- Would recommend/star it if: release behavior stays transparent.
- Would abandon it if: automation hides authorization failures.

### Power User / Agentic Engineer

- Liked: `agentloop task set` solves a real long-session problem.
- Confused: how to install it while npm latest is behind.
- Needs before using it: tarball or source checkout instructions.
- Would recommend/star it if: release notes show the exact command set.
- Would abandon it if: `npx agentloopkit` still installs old behavior without warning.

## Product council debate

- Abhi: Ship a GitHub release candidate for `0.4.0`, but keep npm wording honest.
- Maya: Do a metadata-only release prep. No product changes in this task.
- Elias: Changelog and final handoff must make npm status obvious.
- Nora: Release notes should show `agentloop task set/current/clear`.
- Samir: Do not handle OTPs in chat or docs. Keep trusted publishing as the preferred fix.
- Lina: Tarball release is useful until npm catches up.
- Tom: If npm latest is `0.1.1`, say that up front.
- Rachel: Version discipline builds team trust.

## Decision

Prepare `agentloopkit@0.4.0` as the active task command release candidate. Update package metadata, changelog, launch docs, final handoff, and dogfood records. Run the full local release gate and GitHub CI before creating a public GitHub release. Label npm state as pending until the registry proves `0.4.0` exists.

## Non-decisions

- Do not add new behavior in the release-prep task.
- Do not publish npm credentials or OTPs.
- Do not claim npm availability from a GitHub release.
- Do not create a hosted dashboard or release service.

## Resulting tasks

- Bump `package.json` to `0.4.0`.
- Move the active task lifecycle changelog entry from `Unreleased` to `0.4.0`.
- Update npm publishing docs, launch checklist, and final handoff.
- Run release verification, pack, tarball smoke, and dry-run publish.
- Commit, push, watch CI, and create GitHub release notes if checks pass.

## Success criteria

- `agentloop version` reports `0.4.0` from the packed tarball.
- GitHub CI passes on the release-prep commit.
- GitHub release notes state npm is pending unless npm registry proves otherwise.
- npm registry checks remain the source of truth for published package state.
