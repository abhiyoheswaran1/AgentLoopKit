# Interview Cycle 103

## Context

AgentLoopKit `main` now includes `agentloop npm-status` after the public `v0.23.0` GitHub release. The package metadata still says `0.23.0`, but publishing current `main` as `0.23.0` would add behavior that was not in the `v0.23.0` tag or tarball. This cycle is simulated internal product-panel feedback, not real user research.

## Personas interviewed

- Founder / Product Lead
- Principal Engineer
- Open Source Maintainer
- Security Reviewer
- AI-Skeptical Senior Engineer

## Feedback summary

The strongest signal is release coherence. The next package line should be `0.24.0` because `npm-status` is a new CLI command after `v0.23.0`. npm should still catch up to the current release line once, but the current line has moved.

## Raw simulated feedback

### Founder / Product Lead

- What they liked: `npm-status` turns the npm gap into a product trust feature.
- What confused them: Publishing `0.23.0` from current `main` would make the version story worse.
- What they would need before using it: A clear `0.24.0` release with the new command named.
- What would make them recommend/star it: Honest release notes and a current tarball users can run.
- What would make them abandon it: Another mismatched package/version story.

### Principal Engineer

- What they liked: The code is already verified and isolated.
- What confused them: Package metadata did not move after a new command landed.
- What they would need before using it: Metadata, changelog, docs, pack output, and smoke tests that all name the same version.
- What would make them recommend/star it: A boring semver minor release with no workflow churn.
- What would make them abandon it: Publishing old version numbers from changed source.

### Open Source Maintainer

- What they liked: The new release can explain the npm catch-up rule through the tool itself.
- What confused them: Current public docs still say `v0.23.0` is the current release.
- What they would need before using it: README, release-status docs, CI examples, and tarball install guidance updated after the release.
- What would make them recommend/star it: GitHub release notes with verification evidence and npm status.
- What would make them abandon it: Docs claiming npm availability without registry proof.

### Security Reviewer

- What they liked: npm auth is still checked with `npm whoami`, not assumed.
- What confused them: Whether a publish attempt might read secrets.
- What they would need before using it: No token reads, no env-file reads, no workflow mutation, and explicit publish result.
- What would make them recommend/star it: `npm-status --expect-current` proves whether npm caught up.
- What would make them abandon it: Hidden credential access or silent publish retries.

### AI-Skeptical Senior Engineer

- What they liked: The release tells the exact reason for the next version.
- What confused them: Why npm may jump from `0.1.1` to `0.24.0`.
- What they would need before using it: A short rule: npm should publish the current source line, not stale intermediate versions.
- What would make them recommend/star it: Tarball smoke output and registry proof.
- What would make them abandon it: A vague "latest release" claim without evidence.

## Product council debate

- Abhi: Ship `0.24.0`; do not let the npm gap dictate bad version hygiene.
- Maya: Update metadata and docs only. No new feature work in the release task.
- Elias: GitHub release notes must name npm-status and the npm auth state.
- Nora: Keep install guidance copy-pasteable.
- Samir: Run `npm whoami`, record `E401`, and do not claim npm publish.
- Lina: The tarball should smoke-test `npm-status` itself.
- Tom: Say plainly that npm currently serves `0.1.1`.
- Rachel: Teams can adopt from the GitHub tarball until npm catches up.

## Decision

Prepare and publish GitHub release `v0.24.0` for the npm-status command. Attempt npm publish only if npm authentication is available; otherwise document the blocker and registry proof.

## Non-decisions

- Do not publish `0.23.0` from current `main`.
- Do not backfill stale npm versions from current `main`.
- Do not edit GitHub Actions workflows.
- Do not add new product behavior in this release task.
- Do not read npm tokens or `.env` files.

## Resulting tasks

- Bump package metadata to `0.24.0`.
- Add a `0.24.0` changelog section for `npm-status`.
- Update current-release docs and temporary tarball guidance.
- Verify, pack, hash, and smoke-test the tarball.
- Generate release notes and a release handoff.
- Push the release commit, create GitHub release `v0.24.0`, attach the tarball, and verify CI.
- Check npm status and document any auth blocker.

## Success criteria

- `package.json`, changelog, docs, tarball, tag, and GitHub release agree on `0.24.0`.
- Tarball smoke tests prove `agentloop version` and `agentloop npm-status` work from the packed artifact.
- npm availability is claimed only if the registry proves it.
- The repo remains clean after release work is committed and pushed.
