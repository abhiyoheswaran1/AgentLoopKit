# Interview Cycle 61

## Context

GitHub release `v0.15.0` is public, npm still serves `0.1.1`, and `main` now includes two verified trust fixes after that release: category-level `doctor` risk-file reporting and a real GitHub raw config schema URL. Package metadata still reports `0.15.0`.

## Personas interviewed

- Founder / Product Lead
- Open Source Maintainer
- Security Reviewer
- Skeptical Senior Developer
- Power User / Agentic Engineer

## Feedback summary

The strongest signal is release discipline. These changes should ship as `0.15.1`, not `0.16.0`, because they are trust polish and bug/docs work after `0.15.0`. Do not keep jumping minor versions while npm remains blocked.

## Raw simulated feedback

### Founder / Product Lead

- What they liked: `main` now has cleaner first-run trust signals.
- What confused them: Another minor jump would make the npm gap look worse.
- What they would need before using it: A patch release that explains the fixes.
- What would make them recommend/star it: Honest release notes and a current GitHub artifact.
- What would make them abandon it: Version churn that looks random.

### Open Source Maintainer

- What they liked: Both fixes improve launch trust.
- What confused them: npm still lags behind GitHub releases.
- What they would need before using it: A tarball with current source and exact npm-pending notes.
- What would make them recommend/star it: Release notes that say what changed and what did not.
- What would make them abandon it: Public docs claiming npm availability without registry proof.

### Security Reviewer

- What they liked: The schema fix avoids an unproven custom domain, and `doctor` still avoids secret reads.
- What confused them: Whether a patch release retries npm.
- What they would need before using it: No manual npm publish attempt without changed auth state.
- What would make them recommend/star it: Dry-run publish and packed smoke evidence.
- What would make them abandon it: Retrying a known-failing auth path and treating it as progress.

### Skeptical Senior Developer

- What they liked: The fixes are concrete and deterministic.
- What confused them: Why the release version should be a patch.
- What they would need before using it: Semver that matches the blast radius.
- What would make them recommend/star it: A short patch release with no new claims.
- What would make them abandon it: Release notes padded with vague methodology.

### Power User / Agentic Engineer

- What they liked: `doctor` now gives agents better task-contract risk context.
- What confused them: Existing GitHub Actions examples still pin `v0.15.0`.
- What they would need before using it: Updated tarball pins for the current artifact.
- What would make them recommend/star it: A verified packed CLI smoke test.
- What would make them abandon it: Stale README/demo references.

## Product council debate

- Abhi: Patch release. Keep the line disciplined.
- Maya: Verify the packed artifact, not just source tests.
- Elias: Changelog and npm docs need direct npm-pending language.
- Nora: Update install examples only where they pin GitHub tarballs.
- Samir: No manual npm publish attempt unless auth changes. Dry-run is enough.
- Lina: Agents benefit from the current tarball.
- Tom: Say why `0.15.1` exists.
- Rachel: Teams can pin a patch tarball while npm is repaired.

## Decision

Prepare `0.15.1` as a patch GitHub release candidate for doctor risk-file detail reporting and config schema URL trust. Verify source, build, pack, dry-run publish, packed CLI smoke, and npm registry state before creating the GitHub release.

## Non-decisions

- Do not publish to npm manually.
- Do not claim npm `0.15.1` availability.
- Do not cut `0.16.0` for patch-level work.
- Do not add new features during the release task.

## Resulting tasks

- Bump package metadata to `0.15.1`.
- Add a `0.15.1` changelog entry.
- Update README, GitHub Actions docs, launch checklist, npm publishing docs, final handoff, backlog, and dogfood log.
- Pack and smoke-test the tarball.
- Create a GitHub release with attached tarball after checks pass.

## Success criteria

- Source and built CLI report `0.15.1`.
- Packed tarball reports `0.15.1`.
- Release notes mention doctor risk details and real schema URL.
- npm docs continue to show npm latest `0.1.1` until registry proof changes.
- GitHub release `v0.15.1` exists with `agentloopkit-0.15.1.tgz`.
