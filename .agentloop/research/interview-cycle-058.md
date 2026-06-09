# Interview Cycle 58

## Context

GitHub release `v0.15.0` is public with `agentloopkit-0.15.0.tgz` attached. The release-triggered Publish workflow passed install, lint, typecheck, tests, build, npm upgrade, npm version check, and `prepublishOnly`, then npm rejected `npm publish` with `E404`. npm still serves `agentloopkit@0.1.1`.

## Personas interviewed

- Open Source Maintainer
- Security Reviewer
- Founder / Product Lead
- Skeptical Senior Developer

## Feedback summary

The strongest signal is trust. Document the GitHub release as available, keep npm status explicit, and do not retry npm publishing until the npm authorization state changes.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: The GitHub release has a tarball and release notes.
- What confused them: npm still does not have the current version.
- What they would need before using it: A direct note that CI recipes can pin the GitHub tarball.
- What would make them recommend/star it: Version status that matches the registry.
- What would make them abandon it: Docs that imply npm is current.

### Security Reviewer

- What they liked: Publish workflow logs prove package checks passed before npm rejected publish.
- What confused them: The `E404` message sounds like the package is missing, but the package exists at older versions.
- What they would need before using it: A clear next action: configure npm trusted publishing or complete local browser/OTP auth.
- What would make them recommend/star it: No tokens, OTPs, or secrets in docs.
- What would make them abandon it: Repeated publish retries without changed auth state.

### Founder / Product Lead

- What they liked: `v0.15.0` keeps GitHub release state aligned with `main`.
- What confused them: Whether the version jump damages trust.
- What they would need before using it: Clear language that skipped npm versions were GitHub-only release candidates during the blocker.
- What would make them recommend/star it: A current GitHub artifact users can install while npm is repaired.
- What would make them abandon it: Letting release docs drift.

### Skeptical Senior Developer

- What they liked: The release notes list concrete checks.
- What confused them: Why `npm publish` fails after package checks pass.
- What they would need before using it: Exact command output and registry proof.
- What would make them recommend/star it: Honest limitation notes.
- What would make them abandon it: Any claim that download counts or adoption exist.

## Product council debate

- Abhi: Keep shipping GitHub releases, but stop pretending npm is solved.
- Maya: The code path is verified. The blocker is npm authorization, not build quality.
- Elias: Update launch checklist and npm publishing docs before the next handoff.
- Nora: Tell CI users which tarball to pin.
- Samir: Do not retry `npm publish` without a changed auth setup.
- Lina: Agents can use the GitHub tarball until npm catches up.
- Tom: Call out the `E404` directly.
- Rachel: Teams need a current artifact and a clear risk note.

## Decision

Document `v0.15.0` as a public GitHub release with npm publish blocked at authorization. Keep the next action focused on npm trusted publishing or a successful local authenticated publish for `0.15.0`.

## Non-decisions

- Do not retry npm publish without auth changes.
- Do not claim npm `0.15.0` availability.
- Do not remove older release-status records.
- Do not add a separate distribution channel.

## Resulting tasks

- Update launch checklist for `v0.15.0` GitHub release and Publish workflow result.
- Update npm publishing docs with release URL, workflow run, failure, and registry proof.
- Update final handoff and dogfood log.
- Mark the release-status task done after verification.

## Success criteria

- Docs show GitHub release `v0.15.0` as public with the tarball asset.
- Docs show Publish workflow run `27237034367` failed at npm publish with `E404`.
- Docs show npm latest remains `0.1.1`.
- No public doc claims npm `0.15.0` availability.
