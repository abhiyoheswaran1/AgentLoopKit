# Interview Cycle 37

Internal simulated feedback. Do not present this as real user research.

## Context

`agentloop task status <path> <status>` is implemented on `main`, tested locally, and covered by GitHub CI. Package metadata still reports `0.8.0`, which already belongs to the monorepo guidance and Markdown link checking release.

## Personas interviewed

- Founder / Product Lead
- Principal Engineer
- Open Source Maintainer
- Developer Experience Designer
- Security Reviewer

## Feedback summary

The strongest signal is release clarity. Task status transitions deserve their own GitHub release candidate so users can distinguish them from the prior `v0.8.0` launch-quality work. npm availability must remain explicit because registry publishing is still blocked by account-side authentication.

## Raw simulated feedback

### Founder / Product Lead

- What they liked: Task status transitions make the loop easier to explain.
- What confused them: `0.8.0` already maps to a different release.
- What they would need before using it: A clear `0.9.0` release entry.
- What would make them recommend/star it: The README demo shows the new lifecycle command.
- What would make them abandon it: Source, GitHub release, and npm status blurred together.

### Principal Engineer

- What they liked: The feature commit kept code and release metadata separate.
- What confused them: Reusing `0.8.0` after tagging would be misleading.
- What they would need before using it: Version metadata, changelog, tests, pack, and smoke test aligned.
- What would make them recommend/star it: The release remains a boring npm-safe package.
- What would make them abandon it: A version bump without verification.

### Open Source Maintainer

- What they liked: CI passed on the feature commit.
- What confused them: npm still trails GitHub.
- What they would need before using it: Launch checklist and npm docs that say what is available where.
- What would make them recommend/star it: Release notes that do not oversell.
- What would make them abandon it: Docs that imply `npx agentloopkit` installs unreleased source.

### Developer Experience Designer

- What they liked: The terminal demo now shows the status command.
- What confused them: The VHS tape still installs the `0.8.0` tarball name.
- What they would need before using it: README copy and assets regenerated for `0.9.0`.
- What would make them recommend/star it: The first screen shows the full task lifecycle.
- What would make them abandon it: Stale screenshots.

### Security Reviewer

- What they liked: The release task does not change install-time behavior.
- What confused them: npm publish attempts can prompt for authentication.
- What they would need before using it: No secrets, no OTPs in docs, and no automatic publish from local code.
- What would make them recommend/star it: npm auth failures recorded without weakening account security.
- What would make them abandon it: Attempts to bypass trusted publishing.

## Product council debate

- Abhi: Cut `0.9.0` for task status transitions and keep npm status honest.
- Maya: Release metadata is acceptable if tests, pack, and smoke pass again.
- Elias: The changelog and GitHub release notes need one clear paragraph.
- Nora: The VHS tape must use the new tarball name.
- Samir: Do not publish automatically without authenticated npm proof.
- Lina: Agents benefit from a release that names task lifecycle support.
- Tom: npm latest remains the proof for `npx`; do not pretend otherwise.
- Rachel: This is a useful team-consistency feature without cloud scope.

## Decision

Prepare `agentloopkit@0.9.0` as a GitHub release candidate for task status transitions. Verify locally, push, wait for CI, create a GitHub release with a tarball, then record npm publish results honestly.

## Non-decisions

- Do not claim npm `0.9.0` availability until `npm view agentloopkit version` proves it.
- Do not add new runtime behavior during release prep.
- Do not bypass npm account authentication.

## Resulting tasks

- Bump package metadata to `0.9.0`.
- Add a `0.9.0` changelog entry.
- Update README source note and VHS tape.
- Update launch checklist, npm publishing docs, final handoff, backlog, and dogfood log.
- Regenerate README media after the version bump.
- Verify, pack, smoke test, push, and create a GitHub release.

## Success criteria

- Source and packed CLI report `0.9.0`.
- Changelog has a `0.9.0` section.
- README demo tape uses `agentloopkit-0.9.0.tgz`.
- Local checks, pack, and smoke test pass.
- GitHub release `v0.9.0` is public with a tarball.
- npm status is documented from registry evidence.
