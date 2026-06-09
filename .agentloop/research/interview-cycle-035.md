# Interview Cycle 35

Internal simulated feedback. Do not present this as real user research.

## Context

GitHub release `v0.8.0` is public with the verified tarball. The release-triggered Publish workflow passed package checks and failed at npm authorization. A local publish attempt passed package checks and stopped at npm one-time-password authentication.

## Personas interviewed

- Founder / Product Lead
- Open Source Maintainer
- Security Reviewer
- AI-Skeptical Senior Engineer

## Feedback summary

The strongest signal is status clarity. `v0.8.0` is available from GitHub, but npm still serves `0.1.1`, so docs must not imply `npx agentloopkit` installs `0.8.0`.

## Raw simulated feedback

### Founder / Product Lead

- Liked: `v0.8.0` packages launch-quality improvements.
- Confused: npm availability still lags.
- Would need before using it: release notes that say GitHub tarball is current.
- Would recommend/star it if: the project keeps publishing status honest.
- Would abandon it if: source and npm status are blurred.

### Open Source Maintainer

- Liked: CI and publish checks passed before npm auth failed.
- Confused: repeated npm auth failures need one clear recovery path.
- Would need before using it: launch checklist and npm docs updated.
- Would recommend/star it if: contributors can see the exact blocker.
- Would abandon it if: failure states are hidden.

### Security Reviewer

- Liked: no tokens or OTPs were pasted into repo docs.
- Confused: trusted publishing remains npm-side work.
- Would need before using it: explicit `E404` and `EOTP` records.
- Would recommend/star it if: auth safety beats release speed.
- Would abandon it if: npm security gets weakened.

### AI-Skeptical Senior Engineer

- Liked: package checks passed before both publish attempts.
- Confused: GitHub release availability differs from npm availability.
- Would need before using it: direct source-versus-registry wording.
- Would recommend/star it if: every claim has verification evidence.
- Would abandon it if: release notes become marketing copy.

## Product council debate

- Abhi: Ship GitHub release, document npm gap, keep momentum.
- Maya: No code change for an external npm setting.
- Elias: Release status belongs in launch docs and final handoff.
- Nora: Keep the next action short: configure trusted publishing or complete OTP.
- Samir: Do not request secrets in chat.
- Lina: Agents resuming work need this exact status.
- Tom: npm registry proof is the only publish proof.
- Rachel: This status still supports evaluation from GitHub tarballs.

## Decision

Update release notes, launch checklist, npm publishing docs, final handoff, backlog, and dogfood log with the actual `v0.8.0` publish result.

## Non-decisions

- Do not claim npm `0.8.0` availability.
- Do not bypass npm authentication.
- Do not change code to work around account settings.

## Resulting tasks

- Update GitHub release `v0.8.0`.
- Record Publish workflow `E404`.
- Record local npm `EOTP`.
- Verify npm registry latest.
- Push docs update.

## Success criteria

- Release notes show GitHub release and npm status clearly.
- Docs say npm latest remains `0.1.1`.
- Launch checklist shows `v0.8.0` GitHub release done and npm publish pending.
