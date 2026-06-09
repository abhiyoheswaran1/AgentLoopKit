# Interview Cycle 52

Internal simulated feedback. Do not present this as real user research.

## Context

`agentloop check-gates --strict` is implemented on `main`, tested, documented, and CI passed for commit `b50023d`. GitHub release `v0.13.0` does not contain strict mode. npm still serves `0.1.1` because publish requires browser/OTP authentication or trusted publishing.

## Personas interviewed

- Founder / Product Lead
- Open Source Maintainer
- Developer Experience Designer
- Security Reviewer
- Power User / Agentic Engineer

## Feedback summary

The strongest signal is release coherence. `main` now documents strict mode, so the next GitHub release should package it as `0.14.0` with refreshed README visuals and direct npm-pending notes.

## Raw simulated feedback

### Founder / Product Lead

- What they liked: Strict gates improve the CI story without adding a platform.
- What confused them: `v0.13.0` is already public and does not include the new flag.
- What they would need before using it: A clean `0.14.0` release candidate for strict mode.
- What would make them recommend/star it: The README demo shows the current command set.
- What would make them abandon it: Source and releases drifting.

### Open Source Maintainer

- What they liked: The feature has focused tests and no new dependencies.
- What confused them: README visuals still show 70 tests.
- What they would need before using it: Changelog, tag, tarball, CI, and npm status.
- What would make them recommend/star it: Honest release notes and current visual assets.
- What would make them abandon it: Reusing `0.13.0` for different source behavior.

### Developer Experience Designer

- What they liked: `--strict` is easy to explain.
- What confused them: The terminal demo still ends with non-strict `check-gates`.
- What they would need before using it: VHS demo showing `check-gates --strict`.
- What would make them recommend/star it: The screenshots show 71 tests.
- What would make them abandon it: A README that looks stale.

### Security Reviewer

- What they liked: Strict mode does not execute commands or read secrets.
- What confused them: Whether release work will retry npm without auth.
- What they would need before using it: Pack, dry-run, smoke test, digest, and npm registry proof.
- What would make them recommend/star it: No hidden network calls, no telemetry, no postinstall.
- What would make them abandon it: Any attempt to bypass npm authorization.

### Power User / Agentic Engineer

- What they liked: CI can now use one command instead of JSON parsing.
- What confused them: Whether `--strict` is available through a release tarball.
- What they would need before using it: A GitHub release asset they can install while npm lags.
- What would make them recommend/star it: The release notes explain strict mode and npm status.
- What would make them abandon it: A stale package version on `main`.

## Product council debate

- Abhi: Package it as `0.14.0`; this is a strong team-workflow improvement.
- Maya: Keep the release focused on metadata, docs, assets, and verification.
- Elias: Explain that npm still needs auth and that GitHub tarballs carry current source.
- Nora: Refresh the VHS demo and screenshots for 71 tests and `--strict`.
- Samir: Dry-run, pack, smoke test, and registry proof before any release claim.
- Lina: Agents need the newest tarball if npm remains behind.
- Tom: Do not overstate strict mode. It fails warnings, not code-quality issues.
- Rachel: This helps teams use AgentLoopKit in CI without a dashboard.

## Decision

Prepare `0.14.0` as a GitHub release candidate for `check-gates --strict`. Refresh README visuals, bump package metadata, update changelog and docs, verify the packed artifact, then create a GitHub release if checks pass.

## Non-decisions

- Do not add CI recipes in this cycle.
- Do not publish stale intermediate npm versions.
- Do not claim npm `0.14.0` availability until registry proof exists.
- Do not change strict-mode behavior.

## Resulting tasks

- Bump package metadata to `0.14.0`.
- Add a `0.14.0` changelog entry.
- Refresh README source note, screenshots, and VHS demo.
- Run full checks, pack, dry-run, and packed CLI smoke tests.
- Update dogfood log, final handoff, launch checklist, and npm publishing docs.
- Commit, push, watch CI, tag, and publish GitHub release notes if checks pass.

## Success criteria

- README visuals and text show the current source state.
- The packed CLI reports `0.14.0`.
- `check-gates --strict --json` works from the packed tarball.
- GitHub CI passes after push.
- GitHub release notes state the actual npm status.
