# Interview Cycle 38

Internal simulated feedback. Do not present this as real user research.

## Context

GitHub release `v0.9.0` is public with `agentloopkit-0.9.0.tgz`. CI passed for the release commit. The release-triggered Publish workflow passed package checks and failed at the final `npm publish` step with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`. npm registry proof still reports latest `0.1.1` and versions `0.1.0`, `0.1.1`.

## Personas interviewed

- Founder / Product Lead
- Open Source Maintainer
- Security Reviewer
- AI-Skeptical Senior Engineer

## Feedback summary

The strongest signal is status honesty. GitHub users can download the `0.9.0` tarball, but npm users still get `0.1.1` through `npx agentloopkit`. The docs and release notes must keep those surfaces separate.

## Raw simulated feedback

### Founder / Product Lead

- What they liked: `v0.9.0` is public and names the task-status feature.
- What confused them: npm still trails GitHub.
- What they would need before using it: One exact recovery path for npm publishing.
- What would make them recommend/star it: Honest launch notes that preserve trust.
- What would make them abandon it: A README that implies `npx` serves unreleased features.

### Open Source Maintainer

- What they liked: CI and Publish workflow checks passed before npm rejected publish.
- What confused them: The failure is still account-side configuration.
- What they would need before using it: Launch checklist with run IDs and registry proof.
- What would make them recommend/star it: Release notes mention tarball availability and npm blocker.
- What would make them abandon it: Hidden publish failure.

### Security Reviewer

- What they liked: npm token stayed masked in GitHub logs.
- What confused them: Repeated `E404` means trusted publishing still needs npm-side setup.
- What they would need before using it: No OTP or token collection in chat.
- What would make them recommend/star it: Authentication safety beats publish speed.
- What would make them abandon it: Any attempt to weaken npm auth.

### AI-Skeptical Senior Engineer

- What they liked: Registry state was checked directly.
- What confused them: GitHub release and npm package version differ.
- What they would need before using it: Exact wording that says npm latest is `0.1.1`.
- What would make them recommend/star it: Claims match observable evidence.
- What would make them abandon it: Marketing over verification.

## Product council debate

- Abhi: Keep the GitHub release public and record the npm blocker.
- Maya: No code change is needed for account-side npm setup.
- Elias: Update launch checklist, npm docs, and release notes.
- Nora: Make the next action concise: configure npm trusted publishing or complete local browser/OTP auth.
- Samir: Do not ask for credentials or OTPs.
- Lina: Agents resuming release work need the exact state.
- Tom: npm latest remains the only proof for `npx`.
- Rachel: This is still evaluable through GitHub tarballs.

## Decision

Update release notes, launch checklist, npm publishing docs, final handoff, backlog, and dogfood log with the actual `v0.9.0` release status.

## Non-decisions

- Do not claim npm `0.9.0` availability.
- Do not bypass npm authentication.
- Do not change product code to work around account settings.

## Resulting tasks

- Update GitHub release `v0.9.0`.
- Record Publish workflow `E404`.
- Record npm registry latest and versions.
- Push docs update.

## Success criteria

- Release notes show GitHub release and npm status clearly.
- Docs say npm latest remains `0.1.1`.
- Launch checklist shows `v0.9.0` GitHub release done and npm publish pending.
