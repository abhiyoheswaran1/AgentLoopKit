# Interview Cycle 94

## Context

GitHub release `v0.23.0` is public, npm still serves `0.1.1`, and the README install section names `v0.23.0` while one sentence still referred to the older `v0.22.0` publish workflow. This cycle is simulated internal product-panel feedback, not real user research.

## Personas interviewed

- Open Source Maintainer
- AI-Skeptical Senior Engineer
- Developer Experience Designer
- Startup CTO

## Feedback summary

The strongest signal is release trust. A reader should understand the current install command, why npm lags, and why the next npm publish should jump to `0.23.0` once auth works.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: The release-status page gives one current source of truth.
- What confused them: README cited the `v0.22.0` workflow while saying `v0.23.0` is current.
- What they would need before using it: Consistent current-version language across public launch docs.
- What would make them recommend/star it: Honest npm status with a clear recovery rule.
- What would make them abandon it: A docs page that makes the package look abandoned or mismatched.

### AI-Skeptical Senior Engineer

- What they liked: The docs admit npm is behind.
- What confused them: The version jump can look like careless semver unless the reason is stated plainly.
- What they would need before using it: A sentence explaining why publishing older versions from current `main` would be wrong.
- What would make them recommend/star it: Maintainers show release discipline under a messy auth problem.
- What would make them abandon it: Claims that npm is current without registry proof.

### Developer Experience Designer

- What they liked: The tarball fallback gives a copy-paste path.
- What confused them: The install section explains too much history before the user knows what to run.
- What they would need before using it: Short current-state copy and a link for detail.
- What would make them recommend/star it: The first screen answers "what do I run today?"
- What would make them abandon it: Conflicting commands or version numbers.

### Startup CTO

- What they liked: npm remains the planned distribution path.
- What confused them: Whether teams should pin GitHub tarballs long term.
- What they would need before using it: Confidence that tarballs are temporary until npm catches up.
- What would make them recommend/star it: Transparent release evidence and no hidden package behavior.
- What would make them abandon it: A release process that looks improvised.

## Product council debate

- Abhi: Protect trust. Explain the one-time jump once and keep npm as the default future path.
- Maya: Docs only. Do not change package metadata or release tags.
- Elias: Fix the stale README sentence and reduce old release archaeology in the handoff.
- Nora: Keep the install command above the explanation.
- Samir: Do not imply npm is current. Keep `npm view` as proof.
- Lina: Agents need the same rule: current `main` maps to `0.23.0`, not old numbers.
- Tom: State the exact reason. Old version numbers from current source would be misleading.
- Rachel: Teams can tolerate a temporary tarball if the recovery path is explicit.

## Decision

Clarify current release-state wording in README, release-status guidance, launch checklist, and final handoff. Keep the change docs-only.

## Non-decisions

- Do not publish npm.
- Do not create a new GitHub release.
- Do not add CLI behavior.
- Do not remove the tarball fallback until npm reports `0.23.0` or newer.

## Resulting tasks

- Fix README wording from `v0.22.0` to `v0.23.0`.
- Add a short explanation of the one-time npm catch-up jump.
- Mark launch guidance as current-main-to-`0.23.0`.
- Simplify stale current publish-gap text in the final handoff.
- Verify links, tests, build, projscan, and AgentLoop verification.

## Success criteria

- README no longer references the older workflow in the current release paragraph.
- Public docs explain why stale intermediate versions should not be published from current `main`.
- npm remains marked as `0.1.1` until registry proof changes.
- No CLI behavior changes are introduced.
