# Interview Cycle 53

## Context

GitHub release `v0.14.0` is public with `agentloopkit-0.14.0.tgz` attached. The release-triggered Publish workflow passed package checks and failed at final npm publish with `E404`. npm still serves `agentloopkit@0.1.1`.

## Personas interviewed

- Open Source Maintainer
- Security Reviewer
- Skeptical Senior Developer
- Founder / Product Lead

## Feedback summary

The strongest signal is trust. Public release notes and repo docs need to say exactly what shipped, what failed, and why npm still shows `0.1.1`.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: The release page has a tarball and verification details.
- What confused them: README says npm may jump, but launch docs still need the exact `v0.14.0` workflow outcome.
- What they would need before using it: A direct npm status note.
- What would make them recommend/star it: Honest release docs that do not hide failed publish attempts.
- What would make them abandon it: Claiming `npx agentloopkit` installs `0.14.0` while npm does not.

### Security Reviewer

- What they liked: The publish failure is an authorization issue, not hidden package behavior.
- What confused them: Whether trusted publishing is configured.
- What they would need before using it: Exact workflow failure and registry proof.
- What would make them recommend/star it: No token, OTP, or auth URL in docs.
- What would make them abandon it: Leaking authentication details.

### Skeptical Senior Developer

- What they liked: The release artifact exists and the CLI remains deterministic.
- What confused them: Why GitHub is ahead of npm.
- What they would need before using it: A plain version-gap explanation.
- What would make them recommend/star it: Normal semver after the npm catch-up publish.
- What would make them abandon it: A long release-history excuse instead of a short status note.

### Founder / Product Lead

- What they liked: `0.14.0` packages strict gates and README visuals.
- What confused them: Whether to backfill npm versions.
- What they would need before using it: Keep the recommendation: publish the catch-up version, then resume normal versioning.
- What would make them recommend/star it: Transparent release notes and no stale npm claims.
- What would make them abandon it: Burning time on stale intermediate publishes.

## Product council debate

- Abhi: Keep moving forward. Do not backfill stale npm versions.
- Maya: Document the workflow result and avoid another code change.
- Elias: Update launch checklist and npm docs so GitHub readers know the current source of truth.
- Nora: Keep the wording short enough for a first-time reader.
- Samir: No secrets, tokens, OTPs, or auth links in the docs.
- Lina: The tarball is still useful for agent testing even while npm lags.
- Tom: Say npm is behind. Do not make it sound like a feature.
- Rachel: Teams can wait for npm, but the release evidence matters.

## Decision

Document `v0.14.0` as a public GitHub release with npm publish blocked at authorization. Keep the next action focused on trusted publishing or a successful local authenticated publish for `0.14.0`.

## Non-decisions

- Do not retry npm publish in docs.
- Do not backfill npm versions `0.2.0` through `0.13.0`.
- Do not add release automation changes in this cycle.

## Resulting tasks

- Update npm publishing docs.
- Update launch checklist.
- Update final handoff.
- Update dogfood log.
- Update backlog.

## Success criteria

- Release URL and asset digest are recorded.
- Publish workflow failure is recorded without secrets.
- npm registry state is recorded.
- Docs still pass link checks.
