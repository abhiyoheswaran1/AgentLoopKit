# Interview Cycle 85

## Context

GitHub release `v0.21.0` is public. Since then, `main` added failed-verification summaries, task-linked verification reports, guarded task-path handling for `.env`-style files, and refreshed README visuals. npm still serves `agentloopkit@0.1.1`, and local `npm whoami` returns `E401`.

This cycle is internal simulated feedback for product judgment. It is not real user research.

## Personas interviewed

- Founder / Product Lead
- Open Source Maintainer
- Security Reviewer
- Skeptical Senior Developer
- Power User / Agentic Engineer

## Feedback summary

The strongest signal was release honesty. Current source has enough user-facing value for `v0.22.0`, but npm status must remain separate until registry proof changes.

## Raw simulated feedback

### Founder / Product Lead

- What they liked: The README visuals and verification reports now explain the product better.
- What confused them: npm still shows `0.1.1` while GitHub keeps moving.
- What they would need before using it: A current GitHub release with clear npm status.
- What would make them recommend/star it: A release page that shows task-linked verification and the safety guard.
- What would make them abandon it: Hiding the npm auth problem.

### Open Source Maintainer

- What they liked: The changelog has real Unreleased entries instead of vague notes.
- What confused them: `package.json` still says `0.21.0` after post-release changes.
- What they would need before using it: Version metadata that matches source.
- What would make them recommend/star it: Release notes, tarball digest, and CI proof.
- What would make them abandon it: A package release whose docs and contents disagree.

### Security Reviewer

- What they liked: `verify --task` now avoids reading `.env`-style paths.
- What confused them: Whether release scripts will read tokens or credentials.
- What they would need before using it: No npm publish attempt from an unauthenticated shell.
- What would make them recommend/star it: Public notes that explain exactly what shipped and what did not.
- What would make them abandon it: Claiming npm availability without registry evidence.

### Skeptical Senior Developer

- What they liked: The product keeps deterministic evidence at the center.
- What confused them: Version jumps can look careless without context.
- What they would need before using it: A one-time catch-up explanation and normal semver after npm catches up.
- What would make them recommend/star it: A release that names the practical improvements directly.
- What would make them abandon it: Marketing language around "users" or "adoption" without proof.

### Power User / Agentic Engineer

- What they liked: Task context in verification reports helps long agent sessions recover.
- What confused them: Whether GitHub tarballs or npm should be used today.
- What they would need before using it: Current GitHub tarball fallback while npm lags.
- What would make them recommend/star it: A release containing the improved README demo and verification report behavior.
- What would make them abandon it: Installing `npx agentloopkit` and expecting newer commands that npm does not yet serve.

## Product council debate

- Abhi: "Cut `v0.22.0` from current source. Keep npm status blunt."
- Maya: "No feature work during release prep. Verify package contents."
- Elias: "Update README and publishing docs so visitors do not assume npm is current."
- Nora: "The release notes should lead with the reviewer value: task-linked verification and better failure summaries."
- Samir: "Skip npm publish unless auth is proven. Do not ask for tokens."
- Lina: "GitHub tarball fallback keeps power users unblocked."
- Tom: "Say npm latest is `0.1.1`. Do not over-explain."
- Rachel: "This release improves team reviewability without adding process weight."

## Decision

Prepare `v0.22.0` as the current GitHub/source release. Move Unreleased changelog entries into `0.22.0`, bump package metadata, verify the package, attach the tarball to a GitHub release, and document that npm remains `0.1.1` unless registry proof changes.

## Non-decisions

- Do not backfill skipped npm versions.
- Do not publish npm from an unauthenticated shell.
- Do not change CLI behavior during release prep.
- Do not claim real user feedback or adoption.

## Resulting tasks

- Update package metadata to `0.22.0`.
- Update changelog, README, publishing docs, release docs, launch checklist, roadmap, and final handoff.
- Run full release verification and packed tarball smoke testing.
- Generate release notes.
- Create a GitHub release with tarball and digest if verification passes.
- Record npm auth status honestly.

## Success criteria

- `package.json`, built CLI, release notes, tarball, and GitHub release agree on `0.22.0`.
- npm latest remains documented as `0.1.1` unless `npm view` proves otherwise.
- CI passes on the release commit.
