# Interview Cycle 86

## Context

GitHub release `v0.22.0` is public with attached tarball `agentloopkit-0.22.0.tgz`. The release-triggered Publish workflow passed package checks and failed at npm authorization with `E404`. npm still reports latest `0.1.1` and versions `0.1.0`, `0.1.1`.

This cycle is internal simulated feedback for product judgment. It is not real user research.

## Personas interviewed

- Founder / Product Lead
- Open Source Maintainer
- Security Reviewer
- Skeptical Senior Developer
- Power User / Agentic Engineer

## Feedback summary

The strongest signal was version honesty. Shipping old npm versions now would create more confusion than one clear catch-up publish to `0.22.0`.

## Raw simulated feedback

### Founder / Product Lead

- What they liked: GitHub now has a current public release with a tarball and notes.
- What confused them: npm still showing `0.1.1` makes the product look stalled.
- What they would need before using it: A direct explanation that npm lagged while GitHub releases continued.
- What would make them recommend/star it: A clean path: publish `0.22.0`, then use normal semver.
- What would make them abandon it: Releasing old versions to npm out of order from current source.

### Open Source Maintainer

- What they liked: The release artifact has a digest and the publish workflow result is inspectable.
- What confused them: The launch checklist still marked `v0.22.0` as unpublished.
- What they would need before using it: Docs that separate GitHub release state from npm package state.
- What would make them recommend/star it: Honest release notes and recovery docs.
- What would make them abandon it: Claims that `npx agentloopkit` gets current behavior while npm still serves `0.1.1`.

### Security Reviewer

- What they liked: The workflow failure was at npm authorization, not hidden package execution.
- What confused them: Whether another publish attempt would read or expose credentials.
- What they would need before using it: No npm retry unless npm auth is proven.
- What would make them recommend/star it: Exact `E404` wording and registry proof in docs.
- What would make them abandon it: Token requests in chat or unverified publish claims.

### Skeptical Senior Developer

- What they liked: A one-time npm jump has a defensible reason.
- What confused them: Repeated GitHub-only version bumps can look arbitrary without a compact explanation.
- What they would need before using it: A sentence that says why `0.13.0` should not be published from current `main`.
- What would make them recommend/star it: Normal semver after npm catches up.
- What would make them abandon it: Backfilling stale intermediate releases from the wrong commit.

### Power User / Agentic Engineer

- What they liked: GitHub tarballs keep current CLI behavior available while npm lags.
- What confused them: Which install path to use today.
- What they would need before using it: README and docs that say npm is behind.
- What would make them recommend/star it: Clear tarball fallback and current release evidence.
- What would make them abandon it: Installing from npm and finding missing commands without warning.

## Product council debate

- Abhi: "Publish the current line once npm allows it. Do not make the version history look busier than the product."
- Maya: "Do not mutate package code for a docs-only release-status update."
- Elias: "Mark GitHub `v0.22.0` as public everywhere and keep npm unchecked."
- Nora: "README needs one compact sentence. Details belong in publishing docs."
- Samir: "No npm retry from an unauthenticated environment."
- Lina: "Keep the GitHub tarball fallback visible until npm catches up."
- Tom: "Say why `0.13.0` is stale now. Do not over-explain."
- Rachel: "Teams will accept the catch-up jump if the audit trail is clear."

## Decision

Record `v0.22.0` as the current public GitHub release and npm as still blocked at `0.1.1`. Publish `0.22.0` to npm after authentication or trusted publishing works. Do not publish stale intermediate versions from current `main`.

## Non-decisions

- Do not publish to npm from this shell.
- Do not create another version bump.
- Do not change runtime CLI behavior.
- Do not claim real user interviews or adoption.

## Resulting tasks

- Update README install status.
- Update npm publishing docs with release URL, tarball digest, workflow result, and registry proof.
- Update launch checklist, roadmap, final handoff, backlog, and dogfood log.
- Update GitHub release notes with the publish workflow outcome.
- Run link checks, prepublish guard, projscan, and AgentLoop verification.

## Success criteria

- Public docs say GitHub `v0.22.0` is public.
- Public docs say npm latest remains `0.1.1`.
- Docs identify Publish workflow run `27251450540` and npm `E404` authorization failure.
- Docs tell maintainers to publish `0.22.0` next, then return to normal semver.
