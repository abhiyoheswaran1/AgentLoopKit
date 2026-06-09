# Interview Cycle 9

## Context

GitHub release `v0.2.0` is public. The Publish workflow passed install, lint, typecheck, tests, and build, then npm rejected `npm publish` with `E404 Not Found - PUT https://registry.npmjs.org/agentloopkit`. npm still reports `agentloopkit@0.1.1` as latest.

This is simulated internal product-panel feedback. It is not real user research.

## Personas interviewed

- Open Source Maintainer
- Security Reviewer
- Founder / Product Lead
- Developer Experience Designer

## Feedback summary

The strongest signal: keep the release page honest and make the retry path obvious. The product should not hide npm publish failures or ask anyone to share credentials.

## Raw simulated feedback

### Open Source Maintainer

- Liked: GitHub Actions proved install, lint, typecheck, tests, and build before publish.
- Confused: npm reports an authorization problem as a 404.
- Would need before using it: docs that explain trusted publishing setup and retry.
- Would recommend/star it if: release notes stay honest when npm lags.
- Would abandon it if: release docs claim npm support before npm publishes.

### Security Reviewer

- Liked: no token was committed and no OTP was requested in public text.
- Confused: the workflow had enough GitHub permissions but npm still denied publish.
- Would need before using it: npm-side trusted publisher configuration or local browser/OTP publish.
- Would recommend/star it if: the project treats credentials carefully.
- Would abandon it if: maintainers paste tokens into issues, PRs, or chat.

### Founder / Product Lead

- Liked: shipping the GitHub release moves the public launch forward.
- Confused: npm latest mismatch can confuse users.
- Would need before using it: release notes that state the mismatch and next action.
- Would recommend/star it if: the package stays boring and transparent.
- Would abandon it if: launch polish hides release-state problems.

### Developer Experience Designer

- Liked: one workflow owns checks and publish.
- Confused: no manual rerun button exists after fixing npm settings.
- Would need before using it: `workflow_dispatch` for a retry.
- Would recommend/star it if: the failure text gives the maintainer a concrete path.
- Would abandon it if: retry requires creating another release.

## Product council debate

- Abhi: Publish the GitHub release, but do not pretend npm is live.
- Maya: Do not churn package version or tags until npm is fixed.
- Elias: A manual workflow retry helps maintainers recover without another release.
- Nora: The docs should say the exact command and the exact failure.
- Samir: Do not add tokens. Do not ask for OTPs in chat.
- Lina: Agents should report release state from npm, not from intent.
- Tom: A failed publish is not a launch success.
- Rachel: This is the kind of evidence teams need before trusting automation.

## Decision

Harden the publish workflow with manual dispatch and explicit public publish access. Update release notes and publishing docs to state that npm `0.2.0` is pending until npm trusted publishing or local browser/OTP publish succeeds.

## Non-decisions

- No npm token in the repository.
- No package version bump.
- No tag deletion.
- No silent retry loop.

## Resulting tasks

- Add `workflow_dispatch` to `.github/workflows/publish.yml`.
- Use `npm publish --access public`.
- Document npm-side trusted publisher configuration and the observed `E404`.
- Update final handoff and dogfood logs.

## Success criteria

- GitHub release notes are honest about npm state.
- Publish workflow has a manual retry path.
- Docs explain safe local fallback.
- Verification and `projscan` pass.
