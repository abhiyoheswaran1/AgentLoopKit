# Interview Cycle 62

## Context

GitHub release `v0.15.1` is public with `agentloopkit-0.15.1.tgz` attached. GitHub CI passed on commit `e5d1f62`, and the release-triggered Publish workflow passed package checks but failed at npm publish with `E404`. npm still serves `agentloopkit@0.1.1`.

## Personas interviewed

- Founder / Product Lead
- Open Source Maintainer
- Security Reviewer
- Skeptical Senior Developer

## Feedback summary

The strongest signal is to stop version churn and document the exact state. The release exists on GitHub, but npm does not have `0.15.1`. The next useful action is npm authorization repair, not another source change or release bump.

## Raw simulated feedback

### Founder / Product Lead

- What they liked: The patch release keeps semver disciplined.
- What confused them: Whether the release means npm is fixed.
- What they would need before using it: A plain note that GitHub has the tarball and npm is still blocked.
- What would make them recommend/star it: Honest launch-state docs.
- What would make them abandon it: Cutting another version for the same npm blocker.

### Open Source Maintainer

- What they liked: GitHub release notes include verification and npm status.
- What confused them: The launch checklist still shows `v0.15.1` as pending.
- What they would need before using it: Current docs and final handoff.
- What would make them recommend/star it: A clear trusted-publishing next step.
- What would make them abandon it: Public docs claiming npm availability without registry proof.

### Security Reviewer

- What they liked: npm rejected publish after masked `NODE_AUTH_TOKEN`; no secret material was exposed.
- What confused them: Whether retrying the workflow helps without changing npm settings.
- What they would need before using it: Record the `E404` permission/resource error and stop retrying.
- What would make them recommend/star it: No manual token handling in docs or release notes.
- What would make them abandon it: Treating auth failures as package failures.

### Skeptical Senior Developer

- What they liked: CI and prepublish checks passed before the npm failure.
- What confused them: Why npm can jump from `0.1.1` to `0.15.1`.
- What they would need before using it: A short historical explanation.
- What would make them recommend/star it: Deterministic registry proof.
- What would make them abandon it: Marketing around an unavailable npm version.

## Product council debate

- Abhi: Document the state and stop bumping versions for auth.
- Maya: The package passed checks; do not conflate npm authorization with build quality.
- Elias: Launch docs must show GitHub release public, npm pending.
- Nora: Keep the next step copy short.
- Samir: Do not retry publish until npm trusted publishing or local auth is fixed.
- Lina: Agents can pin the GitHub tarball for now.
- Tom: Say the jump is a one-time catch-up.
- Rachel: Teams need the current GitHub artifact and a clear npm blocker.

## Decision

Document `v0.15.1` as the current public GitHub release with npm publishing still blocked at authorization. Keep npm latest as `0.1.1` until registry proof changes.

## Non-decisions

- Do not cut `0.15.2` for release-status documentation.
- Do not retry the Publish workflow without changed npm authorization settings.
- Do not claim npm `0.15.1` availability.

## Resulting tasks

- Update npm publishing docs with the `v0.15.1` URL, tarball SHA-256, Publish workflow run, npm `E404`, and registry proof.
- Update launch checklist and final handoff.
- Update dogfood log with the post-release result.
- Run link check and projscan.

## Success criteria

- Docs show `v0.15.1` GitHub release as public.
- Docs show Publish workflow `27239176000` failed only at npm publish with `E404`.
- Docs show npm latest remains `0.1.1`.
- No docs tell users that npm has `0.15.1`.
