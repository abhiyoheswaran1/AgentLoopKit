# Interview Cycle 74

## Context

After `v0.18.0`, the repo gained policy customization guidance and generated template updates. That changed package contents while `package.json` still reported `0.18.0`. Publishing current `main` as `0.18.0` would no longer match the public `v0.18.0` GitHub release tarball.

## Personas interviewed

- Open Source Maintainer
- Principal Engineer
- Security Reviewer
- AI-Skeptical Senior Engineer
- Founder / Product Lead

## Feedback summary

The strongest signal is release traceability. Even documentation and template changes affect the npm tarball because generated templates ship in the package. The safest path is a patch release, `0.18.1`, that names the policy customization guidance and keeps `v0.18.0` immutable.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: The project records release status and verification evidence.
- What confused them: `main` changed after `v0.18.0` while the package version stayed the same.
- What they would need before using it: A patch release that matches current package contents.
- What would make them recommend/star it: Version history that maps cleanly to release artifacts.
- What would make them abandon it: Reusing `0.18.0` for a different tarball.

### Principal Engineer

- What they liked: The policy guidance change stayed docs/templates only.
- What confused them: Package metadata did not change after package contents changed.
- What they would need before using it: A patch bump and a verified tarball.
- What would make them recommend/star it: Boring semver and reproducible release assets.
- What would make them abandon it: Hidden drift between tags and npm contents.

### Security Reviewer

- What they liked: The npm blocker remains explicit.
- What confused them: Release docs could invite manual publishing of the wrong source if version metadata stays stale.
- What they would need before using it: Publish from a matching tarball or matching release commit.
- What would make them recommend/star it: No credential retry until npm auth is repaired.
- What would make them abandon it: An npm publish from unauthenticated or mismatched local state.

### AI-Skeptical Senior Engineer

- What they liked: Patch release for docs/templates is understandable.
- What confused them: Calling it `0.18.0` after the tag exists would look careless.
- What they would need before using it: Changelog entry that says exactly what changed.
- What would make them recommend/star it: The project treats docs and templates as package surface area.
- What would make them abandon it: Version games.

### Founder / Product Lead

- What they liked: Policy customization guidance improves trust without widening scope.
- What confused them: Another release can look noisy unless the reason is clear.
- What they would need before using it: Position this as a traceability patch, not a new product direction.
- What would make them recommend/star it: A clean GitHub release and npm catch-up path.
- What would make them abandon it: More feature work before npm auth is fixed.

## Product council debate

- Abhi: Patch release is the right move. Keep the launch story clean.
- Maya: Package contents changed, so metadata should change.
- Elias: Changelog should name this as policy customization guidance.
- Nora: README should say current source targets `0.18.1`; do not make users decode tag history.
- Samir: No local npm publish unless `npm whoami` works. Keep exact tarball publishing instructions.
- Lina: Agents need the updated generated guidance, so the tarball matters.
- Tom: This is boring release hygiene. Do it.
- Rachel: Traceability helps future team buyers trust audit artifacts.

## Decision

Prepare `agentloopkit@0.18.1` as a patch release candidate for policy customization guidance and generated harness updates. Verify, pack, smoke test, push, wait for CI, then publish a GitHub release with an attached tarball. npm remains blocked until account authentication or trusted publishing works.

## Non-decisions

- Do not add runtime CLI behavior.
- Do not publish from current local npm auth.
- Do not backfill old npm versions.
- Do not create cloud, dashboard, or policy enforcement features.

## Resulting tasks

- Bump package metadata to `0.18.1`.
- Update changelog, README, roadmap, npm publishing docs, launch checklist, GitHub Actions docs, examples, and final handoff.
- Run full verification, pack, dry-run, tarball smoke, and AgentLoop evidence generation.
- Commit, push, wait for CI, create GitHub release `v0.18.1`, and record the npm publish result.

## Success criteria

- `agentloop version` reports `0.18.1` from the built or packed CLI.
- GitHub release `v0.18.1` exists with a tarball asset matching current source.
- npm status remains honest until registry proof confirms a publish.
- No runtime behavior changes are included.
