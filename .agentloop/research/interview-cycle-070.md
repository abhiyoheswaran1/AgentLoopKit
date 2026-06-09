# Interview Cycle 70

## Context

AgentLoopKit `v0.17.0` is now a public GitHub release with an attached tarball. CI passed for commit `5990c61`. The release-triggered Publish workflow passed package checks but failed at npm authorization, and npm still reports latest `0.1.1`.

## Personas interviewed

- Founder / Product Lead
- Open Source Maintainer
- Security Reviewer
- AI-Skeptical Senior Engineer
- Platform Engineer

## Feedback summary

The strongest signal is that public docs must be exact about npm state. The GitHub release is real, the package artifact is available, and npm publish is still blocked. The project should not ask users to publish old versions from current `main`.

## Raw simulated feedback

### Founder / Product Lead

- What they liked: The GitHub release gives users a current tarball while npm auth is blocked.
- What confused them: Whether users should still publish `0.16.0`.
- What they would need before using it: Clear wording that `0.17.0` is the current package line.
- What would make them recommend/star it: Honest release notes.
- What would make them abandon it: Version history that looks careless.

### Open Source Maintainer

- What they liked: Release assets and CI links make the state reviewable.
- What confused them: The npm registry still shows `0.1.1`.
- What they would need before using it: Docs that separate GitHub release availability from npm availability.
- What would make them recommend/star it: Exact workflow run IDs and tarball digest.
- What would make them abandon it: Claiming `npx agentloopkit@0.17.0` works before npm proves it.

### Security Reviewer

- What they liked: The package stayed transparent and passed prepublish checks.
- What confused them: Whether the `E404` means the package is missing or permissions are wrong.
- What they would need before using it: A note that this is an authorization/trusted-publishing issue.
- What would make them recommend/star it: No token or OTP in docs.
- What would make them abandon it: Retrying publish with hidden credentials.

### AI-Skeptical Senior Engineer

- What they liked: The docs say what failed instead of hiding it.
- What confused them: Why npm jumps from `0.1.1` to `0.17.0`.
- What they would need before using it: A short explanation that public GitHub tags already occupy the intermediate versions.
- What would make them recommend/star it: Deterministic artifacts and no magic release claims.
- What would make them abandon it: Marketing copy around a failed publish.

### Platform Engineer

- What they liked: Tarball pins let CI use the current source until npm catches up.
- What confused them: Which version to pin in GitHub Actions examples.
- What they would need before using it: `v0.17.0` tarball URLs in examples.
- What would make them recommend/star it: Clear migration to npm install once publish succeeds.
- What would make them abandon it: Docs that point to a stale release asset.

## Product council debate

- Abhi: Record the exact release status and keep going; do not wait on npm auth.
- Maya: Do not change workflow code without a new root cause. The failure is external auth.
- Elias: README and publishing docs must not overclaim.
- Nora: Keep the next action simple: complete npm auth or trusted publishing.
- Samir: Do not print secrets or ask for tokens.
- Lina: Tarball pins should point at `v0.17.0`.
- Tom: Say `0.17.0` is not on npm. No spin.
- Rachel: This is useful for teams if the release state is easy to audit.

## Decision

Update release-status docs to record `v0.17.0`, the tarball digest, CI success, Publish workflow failure at npm authorization, and npm latest `0.1.1`. Keep npm publishing as an external-auth blocker.

## Non-decisions

- No npm publish retry from the agent.
- No workflow redesign.
- No old-version backfill.
- No cloud, telemetry, or dashboard work.

## Resulting tasks

- Update README publishing status.
- Update npm publishing docs.
- Update launch checklist.
- Update roadmap and final handoff.
- Update dogfood log with release evidence.

## Success criteria

- Public docs say `v0.17.0` is the current GitHub release.
- Public docs say npm latest remains `0.1.1`.
- Docs record Publish workflow run `27243165066` and the `E404` authorization failure.
- Docs do not claim npm availability for `0.17.0`.
