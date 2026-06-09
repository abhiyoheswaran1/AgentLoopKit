# Interview Cycle 44

Internal simulated feedback. Do not present this as real user research.

## Context

GitHub release `v0.11.0` is public with `agentloopkit-0.11.0.tgz`. CI passed for the release commit. The release-triggered Publish workflow passed install, lint, typecheck, tests, build, npm upgrade, version check, and `prepublishOnly`, then npm rejected `npm publish --access public` with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`. npm registry proof still reports latest `0.1.1` and versions `0.1.0`, `0.1.1`.

## Personas interviewed

- Open Source Maintainer
- Security Reviewer
- AI-Skeptical Senior Developer
- Founder / Product Lead

## Feedback summary

The strongest signal is status honesty. The GitHub release is useful and verifiable, but npm users still get `0.1.1`. Public docs and internal records must say that directly.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: The release has a tarball asset and checksum.
- What confused them: Whether `npx agentloopkit` installs `0.11.0`.
- What they would need before using it: Docs that keep GitHub tarball availability separate from npm availability.
- What would make them recommend/star it: Release notes that show the exact publish failure.
- What would make them abandon it: A README that implies npm has the newest command.

### Security Reviewer

- What they liked: The workflow failed closed instead of using tokens from chat.
- What confused them: Whether the publish failure changed package contents.
- What they would need before using it: Registry proof after the failed workflow.
- What would make them recommend/star it: Clear trusted-publishing instructions.
- What would make them abandon it: Any attempt to bypass npm authorization.

### AI-Skeptical Senior Developer

- What they liked: The project records failure instead of hiding it.
- What confused them: Why a GitHub release exists when npm publish failed.
- What they would need before using it: A plain explanation that GitHub tarballs are usable while npm remains behind.
- What would make them recommend/star it: No inflated launch claims.
- What would make them abandon it: Marketing copy that says the release is fully shipped.

### Founder / Product Lead

- What they liked: Shipping the GitHub release keeps momentum.
- What confused them: The release ladder has many npm-pending versions.
- What they would need before using it: A focused next action: fix npm trusted publishing or local auth.
- What would make them recommend/star it: Keep building local-first value while npm is repaired.
- What would make them abandon it: Stopping product progress because npm settings are blocked.

## Product council debate

- Abhi: Record it and keep moving; the release is useful from GitHub.
- Maya: Do not change code for an external publishing setting.
- Elias: Put the exact npm error and registry proof in docs.
- Nora: Keep README wording short and factual.
- Samir: Do not retry publish blindly. Trusted publishing needs npm-side configuration.
- Lina: Agents need the newest tarball path if npm is behind.
- Tom: Do not call `0.11.0` npm-available until `npm view` proves it.
- Rachel: This is acceptable for an open-source pre-1.0 project if the status is transparent.

## Decision

Update release-status docs and GitHub release notes with the public GitHub release, tarball digest, Publish workflow failure, and npm registry proof. Do not attempt another npm publish in this cycle.

## Non-decisions

- Do not change package code.
- Do not add npm tokens.
- Do not claim npm `0.11.0` availability.
- Do not delete older GitHub releases.

## Resulting tasks

- Update `docs/launch-checklist.md`.
- Update `docs/npm-publishing.md`.
- Update `FINAL_HANDOFF.md`.
- Update `.agentloop/dogfood-log.md`.
- Edit GitHub release notes for `v0.11.0`.
- Verify docs and record the handoff.

## Success criteria

- Docs show `v0.11.0` GitHub release as public.
- Docs show `agentloopkit@0.11.0` npm publish as pending.
- Docs include Publish workflow run ID and exact npm failure.
- Docs include npm registry proof after the failed workflow.
