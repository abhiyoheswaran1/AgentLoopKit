# Interview Cycle 30

Internal simulated feedback. Do not present this as real user research.

## Context

GitHub release `v0.7.0` is public with a tarball asset. The Publish workflow passed package checks and failed at npm authorization. A local `npm publish --access public` attempt passed package checks and stopped at `EOTP`.

## Personas interviewed

- Founder / Product Lead
- Open Source Maintainer
- Security Reviewer
- AI-Skeptical Senior Engineer

## Feedback summary

The strongest signal is trust. Release notes and launch docs should show the GitHub release, npm blocker, and current registry state without implying npm `0.7.0` availability.

## Raw simulated feedback

### Founder / Product Lead

- Liked: the GitHub release gives users a tarball even while npm is blocked.
- Confused: npm latest still shows `0.1.1`.
- Would need before using it: a clear status note in the release and docs.
- Would recommend/star it if: release history stays honest.
- Would abandon it if: README or notes imply `npx` has `0.7.0`.

### Open Source Maintainer

- Liked: CI and package checks passed before release.
- Confused: repeated npm failures can look like project neglect unless documented.
- Would need before using it: launch checklist entries that explain what remains.
- Would recommend/star it if: users can see the exact recovery path.
- Would abandon it if: publish failures disappear from public notes.

### Security Reviewer

- Liked: the project does not ask anyone to paste tokens or OTPs into chat.
- Confused: GitHub Actions needs npm-side trusted publishing configuration.
- Would need before using it: no hidden workarounds around npm auth.
- Would recommend/star it if: auth blockers stay explicit.
- Would abandon it if: the project stores credentials or weakens publish safety.

### AI-Skeptical Senior Engineer

- Liked: the local package checks passed before publish attempts.
- Confused: release artifacts and npm state differ.
- Would need before using it: direct wording about source versus npm.
- Would recommend/star it if: the project treats failure states as first-class status.
- Would abandon it if: launch docs gloss over registry reality.

## Product council debate

- Abhi: Ship the GitHub release, then document the npm gap.
- Maya: Do not change code for an external npm setting.
- Elias: The release body must mention the exact workflow and local outcomes.
- Nora: Use direct next steps, not vague "coming soon" language.
- Samir: Do not request OTPs, tokens, or credential sharing.
- Lina: Agents need one source of truth when resuming work.
- Tom: Registry proof beats intent.
- Rachel: Trust matters more than polish here.

## Decision

Update release notes, launch checklist, npm publishing docs, final handoff, backlog, and dogfood log with the actual `v0.7.0` status.

## Non-decisions

- Do not publish to npm without completing npm authentication.
- Do not weaken npm security settings.
- Do not claim npm `0.7.0` availability.

## Resulting tasks

- Update GitHub release `v0.7.0`.
- Record workflow `E404` and local `EOTP`.
- Verify registry latest before documenting status.
- Push docs update.

## Success criteria

- GitHub release notes mention the Publish workflow and local publish outcomes.
- Launch docs show GitHub `v0.7.0` as public and npm `0.7.0` as pending.
- npm latest remains documented from a fresh registry check.
