# Interview Cycle 67

## Context

`agentloop badge` is implemented, pushed to `main`, and CI passed on commit `e3aeaf5`. npm currently serves `agentloopkit@0.1.1`, while GitHub already has public releases through `v0.15.1`. Public docs still describe a possible catch-up publish to `0.15.1`, but `main` now contains new badge behavior that is not in `v0.15.1`.

## Personas interviewed

- Open Source Maintainer
- Security Reviewer
- Power User / Agentic Engineer
- Skeptical Senior Developer
- Founder / Product Lead

## Feedback summary

The strongest signal is release truth. Reusing `0.2.0` or `0.15.1` would make npm source disagree with existing GitHub tags. The cleaner path is a new `0.16.0` release for badge behavior, with a clear one-time npm catch-up explanation. After npm catches up, stop cutting versions only to work around publishing authorization.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: A new feature release matches the public source history.
- What confused them: npm still being far behind GitHub tags.
- What they would need before using it: README text that explains the jump without sounding like churn.
- What would make them recommend/star it: `npx agentloopkit@0.16.0 init` works from npm.
- What would make them abandon it: Reusing an old tag for different source.

### Security Reviewer

- What they liked: The release plan avoids rewriting tags or hiding failed publish attempts.
- What confused them: Whether `0.15.1` should still be published after badge work landed.
- What they would need before using it: A rule that npm publishes only source matching the tag.
- What would make them recommend/star it: npm package contents match the GitHub release.
- What would make them abandon it: Backfilled npm versions with mismatched code.

### Power User / Agentic Engineer

- What they liked: `agentloop badge` is worth a minor release.
- What confused them: Whether `npx agentloopkit` will finally install current commands.
- What they would need before using it: A current npm version with task, verify, handoff, report, gates, and badge commands.
- What would make them recommend/star it: One command install and clear release notes.
- What would make them abandon it: Docs that still require GitHub tarball pins after npm catches up.

### Skeptical Senior Developer

- What they liked: The plan admits the version history problem.
- What confused them: Why not publish `0.2.0`.
- What they would need before using it: A plain explanation that `v0.2.0` already exists and cannot mean new source now.
- What would make them recommend/star it: Deterministic release notes and no marketing spin.
- What would make them abandon it: A package history that looks manipulated.

### Founder / Product Lead

- What they liked: `0.16.0` gets the product back to npm as the main distribution path.
- What confused them: The old README copy implied repeated future jumps.
- What they would need before using it: A launch-ready README that says npm is current after publish.
- What would make them recommend/star it: A working npm release and GitHub release with useful notes.
- What would make them abandon it: More GitHub-only release churn.

## Product council debate

- Abhi: Publish the current source as `0.16.0`; npm must become the main path again.
- Maya: Do not rewrite history. Tags are public contracts.
- Elias: Explain the jump once and remove tarball-pin defaults after npm catches up.
- Nora: README should show the normal npm path first.
- Samir: Block any release whose package source does not match the GitHub tag.
- Lina: The badge command belongs in the release notes.
- Tom: Say `v0.2.0` already exists. That ends the confusion.
- Rachel: The team story improves when npm and GitHub point at the same current version.

## Decision

Prepare `agentloopkit@0.16.0` for local evidence badges and npm catch-up. Publish only after local verification, packed-tarball smoke testing, CI, and package-content checks pass. Create GitHub release `v0.16.0` from the matching commit. If npm publish succeeds, update public docs away from tarball pins in the next status update.

## Non-decisions

- Do not reuse `0.2.0`, `0.15.1`, or any existing GitHub tag.
- Do not delete or rewrite public GitHub releases.
- Do not backfill skipped npm versions.
- Do not add hosted release infrastructure.

## Resulting tasks

- Bump package metadata to `0.16.0`.
- Move unreleased changelog items into `0.16.0`.
- Update README and publishing docs with a one-time npm catch-up explanation.
- Update README VHS source to use the `0.16.0` tarball.
- Verify, pack, smoke test, push, publish npm, and create GitHub release notes.

## Success criteria

- `agentloop version` reports `0.16.0` from source, build, and packed tarball.
- `npm pack --dry-run` and packed-tarball smoke tests pass.
- CI passes on the release commit.
- npm publish either succeeds and `npm view agentloopkit version` reports `0.16.0`, or the failure is documented without claiming availability.
- GitHub release `v0.16.0` points at the same source commit.
