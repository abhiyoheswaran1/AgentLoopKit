# Interview Cycle 49

Internal simulated feedback. Do not present this as real user research.

## Context

`agentloop check-gates` is implemented on `main`, covered by Vitest, and CI passed for commit `d96dd54`. README and generated guidance now mention the command, while the latest GitHub release is still `v0.12.0` for `create-task --json`. npm still serves `0.1.1`.

## Personas interviewed

- Power User / Agentic Engineer
- Open Source Maintainer
- Developer Experience Designer
- Security Reviewer

## Feedback summary

The strongest signal is release coherence. `check-gates` is visible in README and agent templates, so the source version and GitHub release should package it. npm status must remain explicit.

## Raw simulated feedback

### Power User / Agentic Engineer

- What they liked: `check-gates --json` gives agents a deterministic review-evidence check.
- What confused them: README now shows a command that is not in `v0.12.0`.
- What they would need before using it: A `v0.13.0` release note that names the command and its limits.
- What would make them recommend/star it: README demo shows the loop ending with evidence checks.
- What would make them abandon it: A release that implies npm has the command before registry proof.

### Open Source Maintainer

- What they liked: The command is small, local, and tested.
- What confused them: Whether `check-gates` replaces human review.
- What they would need before using it: Release notes that say it checks evidence, not code quality.
- What would make them recommend/star it: A verified tarball and honest npm status.
- What would make them abandon it: Gate language that sounds like a policy engine.

### Developer Experience Designer

- What they liked: The command gives users a clear next step after handoff.
- What confused them: The VHS demo does not show the new command yet.
- What they would need before using it: Refresh the terminal demo and screenshots for 70 tests.
- What would make them recommend/star it: The demo flow ends with `check-gates` before archive.
- What would make them abandon it: More prose without command-level proof.

### Security Reviewer

- What they liked: `check-gates` does not execute verification commands or touch credentials.
- What confused them: Whether release tooling will retry npm locally.
- What they would need before using it: Pack, dry-run, tarball smoke test, digest, and registry proof.
- What would make them recommend/star it: No hidden network calls, no telemetry, no postinstall.
- What would make them abandon it: Any attempt to bypass npm authorization.

## Product council debate

- Abhi: Ship `0.13.0`; this is a strong practical wedge.
- Maya: Keep release work to metadata, docs, assets, and verification.
- Elias: Release notes must separate GitHub tarball availability from npm availability.
- Nora: Add `check-gates` to the VHS flow and update screenshots to 70 tests.
- Samir: Do not publish locally. Verify tarball contents and registry state.
- Lina: Agents will use `check-gates --json` in autonomous loops.
- Tom: Say evidence checker, not quality checker.
- Rachel: This supports team consistency without adding a team product.

## Decision

Prepare a `0.13.0` GitHub release candidate for `check-gates`. Update package metadata, changelog, README source note, Playwright screenshots, VHS demo assets, release docs, dogfood log, and final handoff. Pack, dry-run, smoke test, push, tag, create a GitHub release, and record npm status.

## Non-decisions

- Do not change `check-gates` behavior in this release cycle.
- Do not add `--strict`.
- Do not add a dashboard, policy engine, cloud backend, or telemetry.
- Do not claim npm `0.13.0` availability until registry proof exists.

## Resulting tasks

- Bump package metadata to `0.13.0`.
- Add a `0.13.0` changelog entry.
- Refresh README screenshots and VHS demo.
- Run local verification, pack, dry-run, and packed CLI smoke tests.
- Update dogfood log, final handoff, launch checklist, and npm publishing docs.
- Commit, push, watch CI, tag, and create a GitHub release with notes and tarball.

## Success criteria

- README visuals and text show the current source state.
- The packed CLI reports `0.13.0`.
- `check-gates --json` works from the packed tarball.
- GitHub CI passes after push.
- GitHub release notes state the actual npm status.
