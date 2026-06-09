# Interview Cycle 41

Internal simulated feedback. Do not present this as real user research.

## Context

GitHub release `v0.10.0` is public with `agentloopkit-0.10.0.tgz`. CI passed for the release commit. The release-triggered Publish workflow passed install, lint, typecheck, tests, build, npm upgrade, version check, and `prepublishOnly`, then npm rejected the final publish with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`. npm registry proof still reports latest `0.1.1` and versions `0.1.0`, `0.1.1`.

## Personas interviewed

- Founder / Product Lead
- Open Source Maintainer
- Security Reviewer
- AI-Skeptical Senior Developer

## Feedback summary

The strongest signal is status honesty. GitHub users can download the `0.10.0` tarball, but npm users still get `0.1.1` through `npx agentloopkit`. Public docs, internal handoff, and release notes must keep those surfaces separate.

## Raw simulated feedback

### Founder / Product Lead

- What they liked: `v0.10.0` is public and names shell completions.
- What confused them: npm still does not serve the latest release candidate.
- What they would need before using it: Release notes that say GitHub tarball is ready and npm is pending.
- What would make them recommend/star it: Transparent launch status.
- What would make them abandon it: Claiming npm availability that does not exist.

### Open Source Maintainer

- What they liked: The release has CI and tarball evidence.
- What confused them: The npm workflow failure can look like a missing package instead of a permission issue.
- What they would need before using it: Exact workflow run ID and npm error.
- What would make them recommend/star it: Docs that explain the retry path.
- What would make them abandon it: Hidden auth failures.

### Security Reviewer

- What they liked: npm tokens and OTPs were not pasted into docs or chat.
- What confused them: Whether the final npm publish step ran package checks first.
- What they would need before using it: Clear note that checks passed and publish failed at authorization.
- What would make them recommend/star it: Registry proof after failure.
- What would make them abandon it: Repeated publish attempts without a config fix.

### AI-Skeptical Senior Developer

- What they liked: The repo states what works and what does not.
- What confused them: How to test `0.10.0` while npm lags.
- What they would need before using it: GitHub tarball and SHA-256.
- What would make them recommend/star it: No marketing spin around the failure.
- What would make them abandon it: A README that hides the mismatch.

## Product council debate

- Abhi: Ship the GitHub release, but keep the npm status loud enough that users are not surprised.
- Maya: Record the run ID and exact failure so future maintainers can debug the publishing path.
- Elias: Update release notes, launch checklist, npm docs, final handoff, backlog, and dogfood log.
- Nora: Keep public copy short. Users need next action, not an incident report.
- Samir: Do not retry publish from automation until npm trusted publishing is fixed.
- Lina: The tarball path is useful for power users until npm catches up.
- Tom: Call it what it is: release available on GitHub, npm blocked.
- Rachel: Teams need to know which install surface is current.

## Decision

Update release notes, launch checklist, npm publishing docs, final handoff, backlog, and dogfood log with the actual `v0.10.0` release status.

## Non-decisions

- Do not claim npm `0.10.0` availability.
- Do not retry npm publish without changing npm trusted-publishing or completing local browser/OTP auth.
- Do not add a workaround that changes package identity.

## Resulting tasks

- Update GitHub release `v0.10.0`.
- Update `docs/launch-checklist.md`.
- Update `docs/npm-publishing.md`.
- Update `FINAL_HANDOFF.md`.
- Update `.agentloop/backlog.md`.
- Update `.agentloop/dogfood-log.md`.
- Verify docs and links.

## Success criteria

- Release notes state the `v0.10.0` GitHub release and tarball status.
- Publish workflow run `27226815977` is recorded as checks passed, final npm publish failed with `E404`.
- npm registry latest remains documented as `0.1.1`.
- Launch checklist shows `v0.10.0` GitHub release done and npm publish pending.
