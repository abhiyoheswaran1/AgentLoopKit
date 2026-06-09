# Interview Cycle 50

Internal simulated feedback. Do not present this as real user research.

## Context

GitHub release `v0.13.0` is public with `agentloopkit-0.13.0.tgz` attached. The Publish workflow passed package checks and failed at final npm publish with npm authorization error `E404`. npm still serves `agentloopkit@0.1.1`.

## Personas interviewed

- Open Source Maintainer
- Security Reviewer
- Skeptical Senior Developer
- Founder / Product Lead

## Feedback summary

The strongest signal is trust. The release page and repo docs should explain the jump from npm `0.1.1` to the planned catch-up version `0.13.0` without hiding that npm publish is still blocked.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: The GitHub tarball gives users access to the latest source while npm is blocked.
- What confused them: npm showing `0.1.1` while GitHub shows `0.13.0`.
- What they would need before using it: A clear release-status note and no claim of npm availability.
- What would make them recommend/star it: Transparent package history and reproducible checks.
- What would make them abandon it: Pretending the failed npm publish succeeded.

### Security Reviewer

- What they liked: The workflow failed at authorization rather than bypassing npm controls.
- What confused them: Whether the token, trusted publisher, or package permission is the blocker.
- What they would need before using it: Exact error text, workflow run ID, and next remediation step.
- What would make them recommend/star it: Honest npm state and no credential workarounds.
- What would make them abandon it: Any pasted token, OTP, or secret in docs.

### Skeptical Senior Developer

- What they liked: `check-gates` is deterministic and local.
- What confused them: Whether `0.13.0` is a real release if npm does not have it.
- What they would need before using it: The docs should call it a GitHub release and npm-pending package.
- What would make them recommend/star it: A plain explanation of the version jump.
- What would make them abandon it: Marketing language around a broken publish.

### Founder / Product Lead

- What they liked: The catch-up release packages the current wedge.
- What confused them: The release sequence looks noisy without a short explanation.
- What they would need before using it: A direct next step for npm trusted publishing or local auth.
- What would make them recommend/star it: The project looks transparent under release pressure.
- What would make them abandon it: Trying to backfill every skipped npm version.

## Product council debate

- Abhi: Keep `0.13.0`; do not publish stale intermediate versions.
- Maya: Document the exact workflow result and do not touch source behavior.
- Elias: Put the npm jump explanation in launch docs and release notes.
- Nora: Keep the user-facing language short.
- Samir: Do not add secrets, tokens, OTPs, or local workaround logs.
- Lina: Agents need the newest GitHub tarball if npm is behind.
- Tom: Say npm-pending. Do not imply it works through npx yet.
- Rachel: A clear release audit is better than a perfect-looking but false launch.

## Decision

Document `v0.13.0` as a public GitHub release with npm publish blocked at authorization. Keep the recommended path: fix trusted publishing or complete a local authenticated publish for `0.13.0`. Do not backfill npm versions `0.2.0` through `0.12.0`.

## Non-decisions

- Do not change CLI behavior.
- Do not publish old versions to npm.
- Do not add npm tokens or OTP instructions beyond normal `npm login` and `npm publish`.
- Do not claim `npx agentloopkit` installs `0.13.0` until npm proves it.

## Resulting tasks

- Update release notes with the exact npm failure and catch-up explanation.
- Update launch checklist and npm publishing docs.
- Update final handoff, backlog, and dogfood log.
- Run documentation checks and commit the release-status record.

## Success criteria

- GitHub release URL and tarball digest are documented.
- Publish workflow run `27232852066` is documented.
- npm registry proof still says `0.1.1`.
- Docs explain why npm may jump from `0.1.1` to `0.13.0`.
