# Interview Cycle 80

## Context

`main` now contains unreleased `agentloop next` work while `package.json` still says `0.20.0`. The npm registry still serves `0.1.1`, and GitHub release `v0.20.0` already exists from an earlier commit. Publishing current `main` as `0.20.0` would ship contents that do not match the GitHub tag or release notes.

This cycle is internal simulated feedback for product judgment. It is not real user research.

## Personas interviewed

- Open Source Maintainer
- Security Reviewer
- Principal Engineer
- Skeptical Senior Developer
- Future Commercial Buyer

## Feedback summary

The strongest signal was release trust. The repo should make the safe path easy and the wrong path hard. A local prepublish guard can prevent accidental npm publication from a branch with unreleased changelog entries.

## Raw simulated feedback

### Open Source Maintainer

- Liked: the project documents the npm catch-up issue honestly.
- Confused by: whether `main` can be published directly now that it has unreleased changes.
- Needs before use: a mechanical guard that catches mismatched release metadata.
- Would recommend/star it if: the release process looks boring and trustworthy.
- Would abandon it if: npm and GitHub release contents drift.

### Security Reviewer

- Liked: publish workflows already avoid postinstall scripts and telemetry.
- Confused by: why `npm publish --dry-run` still passes with non-empty `Unreleased`.
- Needs before use: a local check before publishing, with no token reads or network calls.
- Would recommend/star it if: supply-chain mistakes fail closed.
- Would abandon it if: a stale version can publish new code.

### Principal Engineer

- Liked: the fix can be a small script and tests.
- Confused by: whether the guard should inspect git tags, npm, or GitHub.
- Needs before use: a simple local changelog check, not another release engine.
- Would recommend/star it if: the guard is easy to understand and cheap to maintain.
- Would abandon it if: release tooling becomes brittle or environment-dependent.

### Skeptical Senior Developer

- Liked: deterministic release discipline.
- Confused by: the long release history while npm is behind.
- Needs before use: hard proof that the package cannot accidentally ship mismatched contents.
- Would recommend/star it if: the project admits the weird version state and guards against mistakes.
- Would abandon it if: docs explain the risk but tooling still allows it.

### Future Commercial Buyer

- Liked: auditable local artifacts and release notes.
- Confused by: whether supply-chain controls are enforced or just documented.
- Needs before use: evidence that releases are controlled before team adoption.
- Would recommend/star it if: trust controls exist in the open-source core.
- Would abandon it if: package provenance looks casual.

## Product council debate

- Abhi: "This protects the wedge. AgentLoopKit should model the release discipline it teaches."
- Maya: "Keep it tiny. Check the changelog. Do not build a release manager."
- Elias: "This lowers contributor confusion around the npm catch-up."
- Nora: "The error message must tell maintainers exactly how to fix it."
- Samir: "Block publish locally before credentials or npm are involved."
- Lina: "Agents need this because they may run dry-run or publish scripts after release prep."
- Tom: "Good. This is practical, not methodology theater."
- Rachel: "Teams will trust a CLI more if the package process fails closed."

## Decision

Add a local prepublish guard that fails when the `## Unreleased` changelog section contains real entries. Prepared release commits should reset that section to `- No unreleased changes yet.` before publish.

## Non-decisions

- Do not change the GitHub publish workflow.
- Do not call npm or GitHub APIs.
- Do not create a new release.
- Do not add a release planner or changelog generator.

## Resulting tasks

- Add a tested prepublish check script.
- Add the script to `prepublishOnly` before typecheck/test/build.
- Document the guard in npm publishing docs.
- Dogfood the expected failure on current `main`.

## Success criteria

- The guard fails on current `main` because `CHANGELOG.md` has unreleased entries.
- The guard passes in a fixture where the Unreleased section says there are no unreleased changes.
- The guard has Vitest coverage and no network dependency.
- Docs explain that `v0.20.0` must be published from its matching tag or tarball, not current `main`.
