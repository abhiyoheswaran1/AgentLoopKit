# Interview Cycle 10

## Context

`main` CI passes, but GitHub warns that JavaScript actions still run on deprecated Node.js 20. The Publish workflow already opts action runtime into Node 24. CI should match that release-hardening posture.

This is simulated internal product-panel feedback. It is not real user research.

## Personas interviewed

- Open Source Maintainer
- Principal Engineer
- Security Reviewer
- Open Source Contributor

## Feedback summary

The strongest signal: remove avoidable CI warnings while the fix is small and does not affect package contents.

## Raw simulated feedback

### Open Source Maintainer

- Liked: CI is already green.
- Confused: warnings make launch pages look less tidy.
- Would need before using it: CI without known platform deprecation warnings.
- Would recommend/star it if: the repo feels maintained from day one.
- Would abandon it if: warnings pile up without owners.

### Principal Engineer

- Liked: workflows stay simple.
- Confused: Node version for the project and Node runtime for actions are separate concerns.
- Would need before using it: one explicit environment setting.
- Would recommend/star it if: maintenance fixes stay boring.
- Would abandon it if: CI becomes a large matrix too early.

### Security Reviewer

- Liked: no credentials or publish behavior changed.
- Confused: none; this is a platform-hardening tweak.
- Would need before using it: no change to package scripts or token handling.
- Would recommend/star it if: the project responds to supply-chain platform warnings.
- Would abandon it if: workflow fixes introduce secrets risk.

### Open Source Contributor

- Liked: clear CI signal.
- Confused: warnings can look like failures in screenshots.
- Would need before contributing: easy-to-read checks.
- Would recommend/star it if: CI is predictable.
- Would abandon it if: the first PR gets noisy warnings unrelated to the change.

## Product council debate

- Abhi: This is small polish that helps open-source trust.
- Maya: Keep the existing commands. One env var only.
- Elias: Green CI without deprecation warnings reads better for contributors.
- Nora: Less warning noise improves PR review.
- Samir: No token changes. Fine.
- Lina: Agents use CI output as evidence; warnings matter.
- Tom: This is maintenance, not hype.
- Rachel: Teams notice CI hygiene.

## Decision

Add `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` to the CI workflow.

## Non-decisions

- No CI matrix.
- No action major-version migration.
- No publish workflow change.
- No package version change.

## Resulting tasks

- Update `.github/workflows/ci.yml`.
- Record task contract, backlog, and dogfood notes.
- Run local checks and `projscan`.

## Success criteria

- CI workflow includes the Node 24 runtime opt-in.
- Local checks pass.
- Package contents and version remain unchanged.
