# Interview Cycle 57

## Context

AgentLoopKit `main` now includes CI context in verification reports after the public `v0.14.0` GitHub release. npm still serves `agentloopkit@0.1.1`, and the publish workflow has failed until npm trusted publishing or local browser authentication is repaired.

## Personas interviewed

- Open Source Maintainer
- Security Reviewer
- Platform Engineer
- Small Team CTO
- Skeptical Senior Developer

## Feedback summary

The strongest signal is release coherence. The public GitHub release should match the source behavior now on `main`, but npm docs must keep saying that npm latest is behind until registry proof changes.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: CI context makes verification artifacts easier to trust.
- What confused them: README still points at the `v0.14.0` tarball while `main` contains newer behavior.
- What they would need before using it: A `v0.15.0` release with a tarball and clear notes.
- What would make them recommend/star it: Release notes that explain the feature and npm status in one pass.
- What would make them abandon it: Docs that imply npm has a version it does not have.

### Security Reviewer

- What they liked: The CI context feature uses an allowlist.
- What confused them: Whether a new release will retry npm publishing without authorization repaired.
- What they would need before using it: A release process that verifies package contents and records npm registry proof.
- What would make them recommend/star it: No hidden publish attempts and no secret output.
- What would make them abandon it: Publishing claims without `npm view` proof.

### Platform Engineer

- What they liked: GitHub Actions reports can now trace artifacts to a run.
- What confused them: Which tarball CI recipes should pin.
- What they would need before using it: CI recipes that point at the latest GitHub release while npm is behind.
- What would make them recommend/star it: Copy-pasteable release-pinned recipes.
- What would make them abandon it: Workflow installers that mutate repos automatically.

### Small Team CTO

- What they liked: Report provenance helps reviewers.
- What confused them: npm version drift.
- What they would need before using it: Honest notes that GitHub tarballs are current and npm is pending.
- What would make them recommend/star it: A stable, verified package artifact.
- What would make them abandon it: A version jump without explanation.

### Skeptical Senior Developer

- What they liked: The release contains a deterministic, inspectable feature.
- What confused them: Why another release is needed while npm is blocked.
- What they would need before using it: A short reason: `main` has behavior `v0.14.0` does not.
- What would make them recommend/star it: Boring semver and reproducible checks.
- What would make them abandon it: Marketing language about adoption.

## Product council debate

- Abhi: Cut `0.15.0`; the product should not leave `main` ahead of the latest GitHub release for long.
- Maya: Verify the packed artifact and avoid code changes in this release task.
- Elias: Update README, changelog, GitHub Actions recipes, launch checklist, and npm publishing docs.
- Nora: Keep the next steps clear for users: pin the tarball until npm catches up.
- Samir: Do not attempt npm publish unless auth is explicit. Record registry proof.
- Lina: Agents need the latest tarball in CI recipes so generated reports include CI context.
- Tom: Say why the version moves from `0.14.0` to `0.15.0`.
- Rachel: This improves team review flow without adding a SaaS layer.

## Decision

Prepare `0.15.0` as a GitHub release candidate for CI context in verification reports. Verify the package, attach the tarball to a GitHub release, and document that npm latest remains `0.1.1` unless registry proof changes.

## Non-decisions

- Do not add new CLI behavior in this release task.
- Do not publish to npm automatically from local code.
- Do not change the npm trusted-publishing workflow beyond status documentation.
- Do not create a dashboard, installer, or hosted service.

## Resulting tasks

- Bump package metadata to `0.15.0`.
- Add a `0.15.0` changelog entry.
- Update README and CI recipes from `v0.14.0` to `v0.15.0` where they pin the latest GitHub tarball.
- Update launch and npm publishing docs with `0.15.0` status.
- Verify, pack, smoke test, and create a GitHub release with tarball asset.
- Record npm registry proof and publish workflow result.

## Success criteria

- Source and built CLI report `0.15.0`.
- The packed tarball installs and runs.
- GitHub release `v0.15.0` exists with `agentloopkit-0.15.0.tgz`.
- npm registry proof is recorded before any npm availability claim.
- CI passes after the release commit.
